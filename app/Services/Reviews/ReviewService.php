<?php

namespace App\Services\Reviews;

use App\Enums\BookingStatus;
use App\Models\Booking;
use App\Models\Chauffeur;
use App\Models\Review;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ReviewService
{
    /**
     * @param  array{rating: int, comment?: string|null}  $data
     */
    public function submit(User $user, Booking $booking, array $data): Review
    {
        $status = $booking->status?->value ?? $booking->status;
        if ($status !== BookingStatus::Completed->value && $status !== 'completed') {
            throw ValidationException::withMessages([
                'booking' => [__('api.review.not_completed')],
            ]);
        }

        if ($booking->review()->exists()) {
            throw ValidationException::withMessages([
                'booking' => [__('api.review.already_submitted')],
            ]);
        }

        $chauffeurId = $booking->rideAssignment?->chauffeur_id;
        if (! $chauffeurId) {
            $booking->loadMissing('rideAssignment');
            $chauffeurId = $booking->rideAssignment?->chauffeur_id;
        }

        if (! $chauffeurId) {
            throw ValidationException::withMessages([
                'booking' => [__('api.review.no_chauffeur')],
            ]);
        }

        $comment = isset($data['comment']) ? trim((string) $data['comment']) : '';
        $comment = $comment !== '' ? $comment : null;

        return DB::transaction(function () use ($user, $booking, $data, $chauffeurId, $comment) {
            $review = Review::query()->create([
                'booking_id' => $booking->id,
                'user_id' => $user->id,
                'chauffeur_id' => $chauffeurId,
                'rating' => (int) $data['rating'],
                'comment' => $comment,
                'status' => 'published',
            ]);

            $this->recalculateChauffeurRating((int) $chauffeurId);

            return $review;
        });
    }

    public function recalculateChauffeurRating(int $chauffeurId): void
    {
        $stats = Review::query()
            ->where('chauffeur_id', $chauffeurId)
            ->where('status', 'published')
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as ratings_count')
            ->first();

        $count = (int) ($stats->ratings_count ?? 0);
        $avg = $count > 0 ? round((float) $stats->avg_rating, 2) : 0;

        Chauffeur::query()->whereKey($chauffeurId)->update([
            'rating' => $avg,
            'ratings_count' => $count,
        ]);
    }
}
