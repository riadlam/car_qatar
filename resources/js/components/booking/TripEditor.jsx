import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BookingForm, TabPills } from '../landing/BookingWidget';
import { fetchGulfDestinations, fetchServiceTypes } from '../../api/catalog';
import {
    fallbackGulfDestinations,
    fallbackServiceTabs,
    mapGulfDestination,
    mapServiceType,
} from '../../utils/catalogMappers';
import { parseTripLegs, tripSelectionToSearchParams } from '../../utils/bookingMappers';
import { MAX_STOPS, SCHOOL_TERMS } from '../../data/bookingServices';

function finite(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
}

export function initialTripFromParams(params) {
    const service = params.get('service') || 'one_way';
    const lat = finite(params.get('lat'));
    const lng = finite(params.get('lng'));
    const dropLat = finite(params.get('drop_lat'));
    const dropLng = finite(params.get('drop_lng'));
    const legs = parseTripLegs(params).map((leg) => ({
        pickup: leg.pickup.label,
        dropoff: leg.dropoff.label,
        pickupCoords: { lat: leg.pickup.lat, lng: leg.pickup.lng },
        dropoffCoords: { lat: leg.dropoff.lat, lng: leg.dropoff.lng },
    }));

    return {
        pickup: params.get('pickup') || '',
        dropoff: service === 'school_chauffeured' ? '' : params.get('dropoff') || '',
        schoolLocation: service === 'school_chauffeured' ? params.get('dropoff') || '' : '',
        pickupCoords: lat != null && lng != null ? { lat, lng } : null,
        dropoffCoords: dropLat != null && dropLng != null ? { lat: dropLat, lng: dropLng } : null,
        schoolCoords:
            service === 'school_chauffeured' && dropLat != null && dropLng != null
                ? { lat: dropLat, lng: dropLng }
                : null,
        legs,
        duration: params.get('duration') || '',
        passengers: params.get('passengers') || '',
        students: params.get('students') || '',
        term: params.get('term') || SCHOOL_TERMS[0].value,
        destination: params.get('gulf') || '',
        date: params.get('date') || '',
        time: params.get('time') || '17:15',
    };
}

/**
 * Light booking form used from the /booking header chips.
 * Same fields and validation as the hero picker.
 */
export default function TripEditor({ params, stacked = false, variant = 'sheet', onApply }) {
    const initialService = params.get('service') || 'one_way';
    const [tab, setTab] = useState(initialService);
    const [serviceTabs, setServiceTabs] = useState(() => fallbackServiceTabs());
    const [gulfDestinations, setGulfDestinations] = useState(() => fallbackGulfDestinations());
    const initial = useMemo(() => initialTripFromParams(params), [params]);

    useEffect(() => {
        let cancelled = false;
        Promise.all([fetchServiceTypes(), fetchGulfDestinations()])
            .then(([types, destinations]) => {
                if (cancelled) return;
                const mappedTabs = (Array.isArray(types) ? types : []).map(mapServiceType);
                if (mappedTabs.length) setServiceTabs(mappedTabs);
                const mappedGulf = (Array.isArray(destinations) ? destinations : []).map(mapGulfDestination);
                if (mappedGulf.length) setGulfDestinations(mappedGulf);
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, []);

    const activeService = serviceTabs.find((item) => item.id === tab) || null;
    const maxStops = serviceTabs.find((item) => item.id === 'multi_stops')?.max_stops || MAX_STOPS;

    const apply = (selection) => {
        const mode = serviceTabs.find((item) => item.id === selection.tab)?.mode || 'transfer';
        onApply(tripSelectionToSearchParams(selection, mode));
    };

    const form = (
        <BookingForm
            tab={tab}
            stacked={stacked}
            tone="light"
            layout={variant === 'bar' ? 'bar' : 'default'}
            serviceOptions={
                variant === 'bar'
                    ? serviceTabs.map((item) => ({ value: item.id, label: item.label }))
                    : null
            }
            onServiceChange={setTab}
            initial={{ ...initial, destination: initial.destination || gulfDestinations[0]?.value || '' }}
            onSearch={apply}
            gulfDestinations={gulfDestinations}
            maxStops={maxStops}
            durationOptions={activeService?.duration_options}
            passengerOptions={activeService?.passenger_options}
            studentOptions={activeService?.student_options}
            termOptions={activeService?.term_options}
            submitLabel={variant === 'bar' ? 'Update' : 'Update trip'}
        />
    );

    if (variant === 'bar') {
        return (
            <div className="flex w-full min-w-0 items-end justify-center">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={tab}
                        initial={{ opacity: 0, y: 8, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -6, filter: 'blur(6px)' }}
                        transition={{ type: 'spring', bounce: 0.22, duration: 0.45 }}
                        className="flex w-full min-w-0"
                    >
                        {form}
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col gap-4">
            <TabPills tab={tab} setTab={setTab} tabs={serviceTabs} tone="light" />
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                >
                    {form}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
