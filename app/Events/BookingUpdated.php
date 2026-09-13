<?php

namespace App\Events;

use App\Http\Resources\BookingResource;
use App\Http\Resources\BookingTrackResource;
use App\Models\Booking;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BookingUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $bookingId,
        public string $reason,
    ) {}

    /**
     * @return array<int, PrivateChannel>
     */
    public function broadcastOn(): array
    {
        return [new PrivateChannel('booking.'.$this->bookingId)];
    }

    public function broadcastAs(): string
    {
        return 'BookingUpdated';
    }

    /**
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        $booking = Booking::query()
            ->with([
                'guest',
                'vehicleClass',
                'pickupLocation',
                'dropoffLocation',
                'serviceType',
                'seatAddon',
                'hourlyBooking',
                'rideAssignment.chauffeur.user',
                'rideAssignment.vehicle',
                'user',
            ])
            ->find($this->bookingId);

        return [
            'reason' => $this->reason,
            'booking' => $booking ? (new BookingResource($booking))->resolve() : null,
            'track' => $booking ? (new BookingTrackResource($booking))->resolve() : null,
        ];
    }
}
