import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import api from './bootstrap';

let echo;
let loading;

function loadEcho() {
    if (echo) return Promise.resolve(echo);
    if (loading) return loading;

    loading = api
        .get('/realtime-config')
        .then(({ data }) => {
            if (!data?.key) return null;

            window.Pusher = Pusher;
            echo = new Echo({
                broadcaster: 'reverb',
                key: data.key,
                wsHost: data.host || window.location.hostname,
                wsPort: Number(data.port || 8080),
                wssPort: Number(data.port || 8080),
                forceTLS: data.scheme === 'https',
                enabledTransports: ['ws', 'wss'],
                authorizer: (channel) => ({
                    authorize: (socketId, callback) => {
                        api.post('/broadcasting/auth', {
                            socket_id: socketId,
                            channel_name: channel.name,
                        })
                            .then((response) => callback(null, response.data))
                            .catch((error) => callback(error));
                    },
                }),
            });

            return echo;
        })
        .catch(() => null);

    return loading;
}

export function subscribePrivate(channelName, bindings, onReconnect) {
    let stopped = false;
    let teardown = () => {};

    loadEcho().then((client) => {
        if (!client || stopped) return;

        const channel = client.private(channelName);
        Object.entries(bindings).forEach(([event, handler]) => {
            channel.listen(`.${event}`, handler);
        });

        // After auth, refresh once so offers/rides are not stuck until a manual reload.
        channel.subscribed(() => {
            if (!stopped) onReconnect?.();
        });

        const connection = client.connector?.pusher?.connection;
        let dropped = false;
        const onState = (states) => {
            if (['disconnected', 'unavailable', 'failed'].includes(states.current)) {
                dropped = true;
            }
            if (states.current === 'connected' && dropped) {
                dropped = false;
                onReconnect?.();
            }
        };
        connection?.bind('state_change', onState);

        // If the socket was already up, still sync once after bind.
        if (connection?.state === 'connected') {
            window.setTimeout(() => {
                if (!stopped) onReconnect?.();
            }, 0);
        }

        teardown = () => {
            connection?.unbind('state_change', onState);
            client.leave(channelName);
        };
    });

    return () => {
        stopped = true;
        teardown();
    };
}

export function realtimeAvailable() {
    return loadEcho().then((client) => Boolean(client));
}

/** Drop the websocket so logout does not leave an open chauffeur/customer channel. */
export function disconnectEcho() {
    if (!echo) {
        loading = null;
        return;
    }
    try {
        echo.disconnect();
    } catch {
        // ignore
    }
    echo = null;
    loading = null;
}
