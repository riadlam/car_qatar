import { useEffect, useState, useCallback } from 'react';
import { fetchExplorePlaces } from '../api/catalog';
import { mapExplorePlaces, placeToDestinationOption } from '../utils/explorePlaces';

/**
 * Load Explore Qatar places for a category; fall back to static cards/destinations.
 */
export function useExploreCategory(category, fallbackCards = [], fallbackDestinations = []) {
    const [cards, setCards] = useState(fallbackCards);
    const [destinations, setDestinations] = useState(fallbackDestinations);
    const [selectedDestination, setSelectedDestination] = useState(null);

    useEffect(() => {
        let cancelled = false;
        fetchExplorePlaces(category)
            .then((places) => {
                if (cancelled || !Array.isArray(places) || !places.length) return;
                const mapped = mapExplorePlaces(places);
                if (mapped.carousel.length) setCards(mapped.carousel);
                if (mapped.destinations.length) setDestinations(mapped.destinations);
            })
            .catch(() => {
                /* keep static fallbacks */
            });
        return () => {
            cancelled = true;
        };
    }, [category]);

    const onCardClick = useCallback((card) => {
        setSelectedDestination(placeToDestinationOption(card));
        window.requestAnimationFrame(() => {
            document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }, []);

    return {
        cards,
        destinations,
        selectedDestination,
        setSelectedDestination,
        onCardClick,
    };
}
