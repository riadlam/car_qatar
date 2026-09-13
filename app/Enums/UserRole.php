<?php

namespace App\Enums;

enum UserRole: string
{
    case Customer = 'customer';
    case Chauffeur = 'chauffeur';
    case PartnerAdmin = 'partner_admin';
    case Support = 'support';
    case Admin = 'admin';
    case SuperAdmin = 'super_admin';

    public function isStaff(): bool
    {
        return in_array($this, [
            self::Support,
            self::Admin,
            self::SuperAdmin,
        ], true);
    }

    public function canAccessAdmin(): bool
    {
        return in_array($this, [
            self::Admin,
            self::SuperAdmin,
            self::Support,
        ], true);
    }

    public function label(): string
    {
        return match ($this) {
            self::Customer => 'Customer',
            self::Chauffeur => 'Chauffeur',
            self::PartnerAdmin => 'Partner Admin',
            self::Support => 'Support',
            self::Admin => 'Admin',
            self::SuperAdmin => 'Super Admin',
        };
    }
}
