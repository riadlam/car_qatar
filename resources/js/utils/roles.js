export function isCustomer(user) {
    return user?.role === 'customer';
}

export function isActiveChauffeur(user) {
    return user?.role === 'chauffeur' && user?.chauffeur_status === 'active';
}

export function isPendingChauffeur(user) {
    return user?.role === 'chauffeur' && (user?.chauffeur_status === 'pending' || user?.chauffeur_status === 'declined');
}
