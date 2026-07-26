import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    // LAN IP used when opening the app via http://192.168.1.5:8000
    const hmrHost = env.VITE_DEV_HOST || '192.168.1.5';

    return {
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/main.jsx'],
                refresh: true,
            }),
            react(),
            tailwindcss(),
        ],
        server: {
            // Listen on all interfaces so the LAN IP can reach Vite
            host: '0.0.0.0',
            port: 5173,
            strictPort: false,
            cors: true,
            hmr: {
                host: hmrHost,
            },
            watch: {
                ignored: [
                    '**/storage/framework/views/**',
                    '**/saveweb2zip-com-www-blacklane-com/**',
                ],
            },
        },
    };
});
