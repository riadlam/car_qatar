import api from '../bootstrap';

export async function fetchServiceTypes() {
    const { data } = await api.get('/service-types');
    return data.data || data.service_types || data;
}

export async function fetchVehicleClasses() {
    const { data } = await api.get('/vehicle-classes');
    return data.data || data.vehicle_classes || data;
}

export async function fetchSeatAddons() {
    const { data } = await api.get('/seat-addons');
    return data.data || data.seat_addons || data;
}

export async function fetchGulfDestinations() {
    const { data } = await api.get('/gulf-destinations');
    return data.data || data.gulf_destinations || data;
}

export async function fetchContactChannels() {
    const { data } = await api.get('/contact-channels');
    return data.data || data.contact_channels || data;
}

export async function fetchExplorePlaces(category) {
    const { data } = await api.get('/explore-places', {
        params: category ? { category } : undefined,
    });
    return data.data || data.explore_places || data;
}
