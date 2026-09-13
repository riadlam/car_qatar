<?php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\ValidationException;

class CancellationReason extends Model
{
    protected $fillable = [
        'audience',
        'label',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public static function audienceFor(User $user): ?string
    {
        return match ($user->role) {
            UserRole::Customer => 'customer',
            UserRole::Chauffeur => 'chauffeur',
            default => null,
        };
    }

    /**
     * Snapshot the chosen label or Other note. Rejects the other audience's reasons.
     */
    public static function snapshotFor(User $user, mixed $reasonId, mixed $note): string
    {
        $audience = self::audienceFor($user);
        $id = is_numeric($reasonId) ? (int) $reasonId : null;
        $text = trim((string) $note);
        $hasId = $id !== null && $id > 0;
        $hasNote = $text !== '';

        if ($hasId === $hasNote) {
            throw ValidationException::withMessages([
                'reason' => ['Choose a reason or write your own, not both.'],
            ]);
        }

        if (! $audience) {
            throw ValidationException::withMessages([
                'reason' => ['That reason is not available.'],
            ]);
        }

        if ($hasNote) {
            if (mb_strlen($text) < 3 || mb_strlen($text) > 500) {
                throw ValidationException::withMessages([
                    'note' => ['Write at least 3 characters.'],
                ]);
            }

            return $text;
        }

        $reason = self::query()
            ->whereKey($id)
            ->where('audience', $audience)
            ->where('is_active', true)
            ->first();

        if (! $reason) {
            throw ValidationException::withMessages([
                'reason_id' => ['That reason is not available.'],
            ]);
        }

        return $reason->label;
    }
}
