/**
 * Map API booking resource → JourneyCard / JourneyRide shape used by the UI.
 */
export function bookingToJourney(booking) {
    const pickupAt = booking.pickup_at ? new Date(booking.pickup_at) : null;
    const status = mapStatus(booking.status);
    const vc = booking.vehicle_class || {};
    const pickup =
        booking.pickup_location?.formatted_address ||
        booking.pickup_location?.label ||
        booking.pickup_location?.name ||
        '—';
    const dropoff =
        booking.dropoff_location?.formatted_address ||
        booking.dropoff_location?.label ||
        booking.dropoff_location?.name ||
        '';
    const guest = booking.guest;
    const passengerName = guest
        ? [guest.title, guest.first_name, guest.last_name].filter(Boolean).join(' ')
        : booking.booker_name || 'For myself';

    const assignmentStatus = booking.ride_assignment?.status;
    const phase = booking.phase || phaseFromAssignment(assignmentStatus, booking.status);

    const chauffeur = booking.chauffeur
        ? {
              id: booking.chauffeur.id,
              name: booking.chauffeur.name,
              rating: booking.chauffeur.rating,
              trips: booking.chauffeur.trips,
              vehicle_plate: booking.chauffeur.vehicle_plate,
              phone: booking.chauffeur.phone,
              avatar_url: booking.chauffeur.avatar_url || null,
              latitude: booking.chauffeur.latitude ?? null,
              longitude: booking.chauffeur.longitude ?? null,
              last_location_at: booking.chauffeur.last_location_at || null,
          }
        : null;

    const canTrack =
        Boolean(chauffeur) &&
        status === 'upcoming' &&
        ['assigned', 'en_route', 'arrived', 'in_progress', 'chauffeur_assigned'].includes(
            assignmentStatus || booking.status,
        );

    const actions =
        status === 'cancelled'
            ? ['details']
            : status === 'past'
              ? ['details', 'receipt', 'rebook']
              : canTrack
                ? ['details', 'contact', 'cancel']
                : chauffeur
                  ? ['details', 'contact', 'cancel']
                  : ['details', 'cancel'];

    return {
        id: String(booking.id),
        api: true,
        booking_number: booking.booking_number,
        customer_reference: booking.customer_reference || '',
        status,
        phase,
        trip_step: booking.trip_step || 'waiting',
        status_label: labelForStatus(booking.status, assignmentStatus),
        cancel_reason: booking.cancellation?.reason || '',
        cancelled_by: booking.cancellation?.cancelled_by || '',
        cancel_date_label: booking.cancelled_at
            ? new Date(booking.cancelled_at).toLocaleString(undefined, {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
              })
            : '',
        mode: booking.service_type?.mode || 'transfer',
        mode_label: booking.service_type?.name || 'Journey',
        pickup,
        dropoff,
        date: pickupAt ? pickupAt.toISOString().slice(0, 10) : '',
        date_label: pickupAt
            ? pickupAt.toLocaleDateString(undefined, {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
              })
            : '',
        time: pickupAt
            ? pickupAt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
            : '',
        time_label: pickupAt
            ? pickupAt.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
            : '',
        arrive_label: '',
        duration_label: '',
        flight: null,
        passenger_name: passengerName,
        for_guest: Boolean(guest),
        vehicle_id: vc.slug,
        vehicle: vc.name,
        vehicle_similar: vc.similar_label,
        vehicle_image: vc.image_lg || vc.image_sm,
        vehicle_passengers: vc.passengers,
        vehicle_luggage: vc.luggage,
        price: Number(booking.total_amount || 0),
        currency: booking.currency === 'USD' ? 'US$' : booking.currency,
        payment_label: booking.payment?.label || 'Not charged',
        chauffeur,
        chauffeur_eta: booking.chauffeur?.eta_label || (chauffeur ? 'Chauffeur assigned' : undefined),
        eta_minutes: booking.ride_assignment?.eta_minutes ?? null,
        assignment_status: assignmentStatus || null,
        notes: booking.customer_notes || '',
        preferred_language: booking.preferred_language || '',
        seat: booking.seat_addon?.slug || 'none',
        actions,
        lat: booking.pickup_location?.latitude != null ? Number(booking.pickup_location.latitude) : null,
        lng: booking.pickup_location?.longitude != null ? Number(booking.pickup_location.longitude) : null,
        drop_lat:
            booking.dropoff_location?.latitude != null
                ? Number(booking.dropoff_location.latitude)
                : null,
        drop_lng:
            booking.dropoff_location?.longitude != null
                ? Number(booking.dropoff_location.longitude)
                : null,
        ride_events: booking.ride_events || [],
        created_at: booking.created_at,
    };
}

/** Move the live van from a websocket position without reloading the booking. */
export function applyPositionToJourney(journey, position) {
    if (!journey || !position || position.lat == null || position.lng == null) return journey;

    return {
        ...journey,
        trip_step: position.trip_step || journey.trip_step,
        assignment_status: position.assignment_status || journey.assignment_status,
        track_progress: position.progress ?? journey.track_progress ?? null,
        chauffeur: {
            ...(journey.chauffeur || {}),
            latitude: Number(position.lat),
            longitude: Number(position.lng),
            heading: position.heading ?? journey.chauffeur?.heading ?? null,
        },
    };
}

/** Merge a track payload into an existing journey object. */
export function applyTrackToJourney(journey, track) {
    if (!journey || !track) return journey;

    const chauffeur = track.chauffeur
        ? {
              ...(journey.chauffeur || {}),
              id: track.chauffeur.id ?? journey.chauffeur?.id,
              name: track.chauffeur.name || journey.chauffeur?.name,
              phone: track.chauffeur.phone || journey.chauffeur?.phone,
              vehicle_plate: track.chauffeur.vehicle_plate || journey.chauffeur?.vehicle_plate,
              latitude: track.chauffeur.latitude ?? journey.chauffeur?.latitude ?? null,
              longitude: track.chauffeur.longitude ?? journey.chauffeur?.longitude ?? null,
              last_location_at: track.chauffeur.last_location_at || journey.chauffeur?.last_location_at,
          }
        : journey.chauffeur;

    return {
        ...journey,
        phase: track.phase || journey.phase,
        status_label: labelForStatus(track.status || journey.status, track.assignment_status),
        chauffeur,
        chauffeur_eta: track.chauffeur_eta || journey.chauffeur_eta,
        eta_minutes: track.eta_minutes ?? journey.eta_minutes,
        assignment_status: track.assignment_status || journey.assignment_status,
        track_progress: track.progress ?? journey.track_progress ?? null,
        ride_events: track.events || journey.ride_events,
        drop_lat: track.dropoff?.latitude ?? journey.drop_lat,
        drop_lng: track.dropoff?.longitude ?? journey.drop_lng,
        lat: track.pickup?.latitude ?? journey.lat,
        lng: track.pickup?.longitude ?? journey.lng,
    };
}

function phaseFromAssignment(assignmentStatus, bookingStatus) {
    if (bookingStatus === 'cancelled') return 'cancelled';
    if (bookingStatus === 'completed' || assignmentStatus === 'completed') return 'completed';
    if (['en_route', 'arrived', 'in_progress'].includes(assignmentStatus)) return 'upcoming_soon';
    if (assignmentStatus === 'assigned' || bookingStatus === 'chauffeur_assigned') {
        return 'chauffeur_assigned';
    }
    return 'confirmed';
}

function mapStatus(status) {
    if (status === 'cancelled') return 'cancelled';
    if (status === 'completed') return 'past';
    return 'upcoming';
}

function labelForStatus(status, assignmentStatus) {
    if (assignmentStatus === 'en_route') return 'On the way';
    if (assignmentStatus === 'arrived') return 'Chauffeur arrived';
    if (assignmentStatus === 'in_progress') return 'In progress';
    const map = {
        confirmed: 'Confirmed',
        pending_payment: 'Pending payment',
        chauffeur_assigned: 'Chauffeur assigned',
        in_progress: 'In progress',
        completed: 'Completed',
        cancelled: 'Canceled',
        draft: 'Draft',
    };
    return map[status] || status;
}

function finiteCoord(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
}

export function parseTripLegs(params) {
    const raw = params.get('legs');
    if (!raw || !raw.trim().startsWith('[')) return [];
    try {
        const legs = JSON.parse(raw);
        if (!Array.isArray(legs)) return [];
        return legs
            .map((leg) => ({
                pickup: {
                    label: leg?.pickup?.label || '',
                    lat: finiteCoord(leg?.pickup?.lat),
                    lng: finiteCoord(leg?.pickup?.lng),
                },
                dropoff: {
                    label: leg?.dropoff?.label || '',
                    lat: finiteCoord(leg?.dropoff?.lat),
                    lng: finiteCoord(leg?.dropoff?.lng),
                },
            }))
            .filter((leg) => leg.pickup.lat != null && leg.dropoff.lat != null);
    } catch {
        return [];
    }
}

/** Ordered map points for the selected trip. No invented coordinates. */
export function tripRoutePoints(params) {
    const legs = parseTripLegs(params);
    if (legs.length) {
        const points = [];
        legs.forEach((leg) => {
            points.push({ lat: leg.pickup.lat, lng: leg.pickup.lng, label: leg.pickup.label || 'Pickup' });
            points.push({ lat: leg.dropoff.lat, lng: leg.dropoff.lng, label: leg.dropoff.label || 'Drop-off' });
        });
        return points;
    }

    const lat = finiteCoord(params.get('lat'));
    const lng = finiteCoord(params.get('lng'));
    const dropLat = finiteCoord(params.get('drop_lat'));
    const dropLng = finiteCoord(params.get('drop_lng'));
    const points = [];
    if (lat != null && lng != null) {
        points.push({ lat, lng, label: params.get('pickup') || 'Pickup' });
    }
    if (dropLat != null && dropLng != null) {
        points.push({ lat: dropLat, lng: dropLng, label: params.get('dropoff') || 'Drop-off' });
    }
    return points;
}

/**
 * True when the query has every field the selected service needs to quote and map.
 */
export function tripSearchIsComplete(params) {
    const service = params.get('service') || '';
    const lat = finiteCoord(params.get('lat'));
    const lng = finiteCoord(params.get('lng'));
    const pickup = (params.get('pickup') || '').trim();
    if (!service || !pickup || lat == null || lng == null) return false;

    if (service === 'by_hour' || service === 'city_tour') {
        if (!params.get('duration') || !params.get('date') || !params.get('time')) return false;
        if (service === 'city_tour' && !params.get('passengers')) return false;
        return true;
    }

    if (service === 'school_chauffeured') {
        return Boolean(
            params.get('dropoff') &&
                finiteCoord(params.get('drop_lat')) != null &&
                finiteCoord(params.get('drop_lng')) != null &&
                params.get('students') &&
                params.get('term'),
        );
    }

    if (service === 'multi_stops') {
        const legs = parseTripLegs(params);
        return legs.length > 0 && Boolean(params.get('date') && params.get('time'));
    }

    if (service === 'arab_gulf_trips') {
        return Boolean(
            params.get('gulf') &&
                params.get('dropoff') &&
                finiteCoord(params.get('drop_lat')) != null &&
                finiteCoord(params.get('drop_lng')) != null &&
                params.get('passengers') &&
                params.get('date') &&
                params.get('time'),
        );
    }

    return Boolean(
        params.get('dropoff') &&
            finiteCoord(params.get('drop_lat')) != null &&
            finiteCoord(params.get('drop_lng')) != null &&
            params.get('date') &&
            params.get('time'),
    );
}

function hasTripCoords(coords) {
    return coords != null && Number.isFinite(Number(coords.lat)) && Number.isFinite(Number(coords.lng));
}

/** URL params for a validated picker selection. Does not invent coordinates. */
export function tripSelectionToSearchParams(selection, mode = 'transfer') {
    const q = new URLSearchParams();
    q.set('mode', mode);
    q.set('service', selection.tab);
    if (selection.pickup) q.set('pickup', selection.pickup);
    if (selection.dropoff) q.set('dropoff', selection.dropoff);
    if (selection.time) q.set('time', selection.time);
    if (selection.date) q.set('date', selection.date);
    if (selection.duration) q.set('duration', selection.duration);
    if (selection.passengers) q.set('passengers', selection.passengers);
    if (selection.students) q.set('students', selection.students);
    if (selection.term) q.set('term', selection.term);
    if (selection.gulf) q.set('gulf', selection.gulf);
    if (hasTripCoords(selection.pickupCoords)) {
        q.set('lat', String(selection.pickupCoords.lat));
        q.set('lng', String(selection.pickupCoords.lng));
    }
    if (hasTripCoords(selection.dropoffCoords)) {
        q.set('drop_lat', String(selection.dropoffCoords.lat));
        q.set('drop_lng', String(selection.dropoffCoords.lng));
    }
    if (selection.legs?.length) {
        q.set(
            'legs',
            JSON.stringify(
                selection.legs.map((leg) => ({
                    pickup: { label: leg.pickup, lat: leg.pickupCoords.lat, lng: leg.pickupCoords.lng },
                    dropoff: { label: leg.dropoff, lat: leg.dropoffCoords.lat, lng: leg.dropoffCoords.lng },
                })),
            ),
        );
    }
    return q;
}

/**
 * Build quote payload from booking URL search params.
 * Coordinates are only included when the picker actually supplied them.
 */
export function tripParamsToQuotePayload(params, extras = {}) {
    const service = params.get('service') || (params.get('mode') === 'hourly' ? 'by_hour' : 'one_way');
    const pickupLabel = params.get('pickup') || '';
    const dropoffLabel = params.get('dropoff') || '';
    const lat = finiteCoord(params.get('lat'));
    const lng = finiteCoord(params.get('lng'));
    const date = params.get('date') || '';
    const time = params.get('time') || '';
    const pickupAt = date && time ? `${date}T${time.length === 5 ? `${time}:00` : time}` : undefined;

    const payload = {
        service_type: service,
        pickup: {
            label: pickupLabel,
            ...(lat != null && lng != null ? { lat, lng } : {}),
        },
        pickup_at: pickupAt,
        duration: params.get('duration') || undefined,
        passengers: params.get('passengers') ? Number(params.get('passengers')) : undefined,
        students: params.get('students') ? Number(params.get('students')) : undefined,
        school_term: params.get('term') || undefined,
        gulf_destination: params.get('gulf') || undefined,
        seat_addon: extras.seat_addon || extras.seat || params.get('seat') || undefined,
        vehicle_class: extras.vehicle_class,
        vehicle_class_id: extras.vehicle_class_id,
    };

    const dropLat = finiteCoord(params.get('drop_lat'));
    const dropLng = finiteCoord(params.get('drop_lng'));
    if (dropoffLabel && dropLat != null && dropLng != null) {
        payload.dropoff = {
            label: dropoffLabel,
            lat: dropLat,
            lng: dropLng,
        };
    } else if (dropoffLabel && service === 'arab_gulf_trips') {
        payload.dropoff = { label: dropoffLabel };
    }

    const legs = parseTripLegs(params);
    if (legs.length) {
        payload.legs = legs.map((leg) => ({
            pickup: { label: leg.pickup.label, lat: leg.pickup.lat, lng: leg.pickup.lng },
            dropoff: { label: leg.dropoff.label, lat: leg.dropoff.lat, lng: leg.dropoff.lng },
        }));
        if (!payload.dropoff) {
            const last = legs[legs.length - 1].dropoff;
            payload.dropoff = { label: last.label, lat: last.lat, lng: last.lng };
        }
    }

    return payload;
}
