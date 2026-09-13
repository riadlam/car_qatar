<?php

namespace App\Http\Resources;

use App\Enums\UserRole;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\User
 */
class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role?->value,
            'account_type' => $this->account_type,
            'title' => $this->title,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'company' => $this->company_name,
            'company_name' => $this->company_name,
            'phone' => $this->phone,
            'preferred_language' => $this->preferred_language,
            'street_address' => $this->street_address,
            'language' => $this->language,
            'marketing_emails' => (bool) $this->marketing_emails,
            'booking_notifications' => $this->booking_notifications,
            'has_password' => filled($this->password),
            'status' => $this->status,
            'chauffeur_status' => $this->role === UserRole::Chauffeur
                ? $this->chauffeur?->status
                : null,
            'chauffeur_id' => $this->role === UserRole::Chauffeur
                ? $this->chauffeur?->id
                : null,
            'email_verified_at' => $this->email_verified_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
