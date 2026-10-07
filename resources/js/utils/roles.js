export function isCustomer(user) {
    return user?.role === 'customer';
}

/** Company signup profile — still a booking customer, not a Partner portal user. */
export function isCompanyCustomer(user) {
    return user?.role === 'customer' && user?.account_type === 'company';
}

export function isPartnerAdmin(user) {
    return user?.role === 'partner_admin';
}

export function isActiveChauffeur(user) {
    return user?.role === 'chauffeur' && user?.chauffeur_status === 'active';
}

export function isPendingChauffeur(user) {
    return user?.role === 'chauffeur' && (user?.chauffeur_status === 'pending' || user?.chauffeur_status === 'declined');
}

export function chauffeurStatusLabel(user) {
    if (user?.role !== 'chauffeur') return null;
    if (user.chauffeur_status === 'pending') return 'Waiting confirmation';
    if (user.chauffeur_status === 'declined') return 'Application declined';
    if (user.chauffeur_status === 'active') return 'Active';
    return null;
}
