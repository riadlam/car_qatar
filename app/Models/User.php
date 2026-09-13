<?php

namespace App\Models;

use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'account_type',
        'title',
        'first_name',
        'last_name',
        'company_name',
        'phone',
        'preferred_language',
        'street_address',
        'language',
        'marketing_emails',
        'booking_notifications',
        'status',
        'avatar_path',
        'phone_verified_at',
        'last_login_at',
    ];

    /**
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'marketing_emails' => 'boolean',
        ];
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->role?->canAccessAdmin() ?? false;
    }

    public function isStaff(): bool
    {
        return $this->role?->isStaff() ?? false;
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function savedGuests(): HasMany
    {
        return $this->hasMany(SavedGuest::class);
    }

    public function quotes(): HasMany
    {
        return $this->hasMany(Quote::class);
    }

    public function chauffeur(): HasOne
    {
        return $this->hasOne(Chauffeur::class);
    }

    /**
     * Build a display name from profile fields.
     */
    public static function deriveDisplayName(
        string $accountType,
        ?string $firstName = null,
        ?string $lastName = null,
        ?string $companyName = null,
        ?string $email = null,
    ): string {
        if ($accountType === 'company') {
            return trim((string) $companyName) ?: (string) $email;
        }

        $name = trim(collect([$firstName, $lastName])->filter()->implode(' '));

        return $name !== '' ? $name : (string) $email;
    }
}
