<?php

namespace App\Filament\Resources\RideAssignments\Schemas;

use App\Models\RideAssignment;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class RideAssignmentInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Assignment')
                    ->columns(2)
                    ->schema([
                        TextEntry::make('booking.booking_number')
                            ->label('Booking')
                            ->placeholder('—'),
                        TextEntry::make('status')
                            ->badge()
                            ->formatStateUsing(fn (?string $state): string => ucfirst(str_replace('_', ' ', (string) $state))),
                        TextEntry::make('chauffeur.user.name')
                            ->label('Chauffeur')
                            ->placeholder('—'),
                        TextEntry::make('vehicle.license_plate')
                            ->label('Vehicle')
                            ->placeholder('—'),
                        TextEntry::make('rideOffer.id')
                            ->label('Ride offer')
                            ->placeholder('—'),
                    ]),
                Section::make('Timeline')
                    ->description('Chauffeur app button clicks with exact times.')
                    ->columns(2)
                    ->schema([
                        TextEntry::make('assigned_at')
                            ->label('Offer accepted')
                            ->dateTime('M j, Y H:i:s')
                            ->placeholder('—'),
                        TextEntry::make('tap_en_route')
                            ->label('En route (tap)')
                            ->placeholder('—')
                            ->state(fn (RideAssignment $record): ?string => self::eventTime($record, 'en_route')),
                        TextEntry::make('tap_arrived')
                            ->label('Arrived at pickup (tap)')
                            ->placeholder('—')
                            ->state(fn (RideAssignment $record): ?string => self::eventTime($record, 'arrived')),
                        TextEntry::make('tap_in_progress')
                            ->label('Trip started (tap)')
                            ->placeholder('—')
                            ->state(fn (RideAssignment $record): ?string => self::eventTime($record, 'in_progress')),
                        TextEntry::make('tap_completed')
                            ->label('Completed (tap)')
                            ->placeholder('—')
                            ->state(fn (RideAssignment $record): ?string => self::eventTime($record, 'completed')),
                        TextEntry::make('started_at')
                            ->label('started_at')
                            ->dateTime('M j, Y H:i:s')
                            ->placeholder('—'),
                        TextEntry::make('completed_at')
                            ->label('completed_at')
                            ->dateTime('M j, Y H:i:s')
                            ->placeholder('—'),
                        TextEntry::make('tap_gaps')
                            ->label('Gaps between taps')
                            ->placeholder('—')
                            ->columnSpanFull()
                            ->state(fn (RideAssignment $record): ?string => self::eventGaps($record)),
                    ]),
            ]);
    }

    private static function eventTime(RideAssignment $record, string $type): ?string
    {
        $at = self::eventMoment($record, $type);

        return $at?->timezone(config('app.timezone'))->format('M j, Y H:i:s');
    }

    private static function eventMoment(RideAssignment $record, string $type): ?\Carbon\CarbonInterface
    {
        $events = $record->relationLoaded('events')
            ? $record->events
            : $record->events()->orderBy('recorded_at')->get();

        $row = $events->firstWhere('event_type', $type);
        if ($row?->recorded_at) {
            return $row->recorded_at;
        }

        return match ($type) {
            'en_route' => $record->started_at ?? $record->assigned_at,
            'completed' => $record->completed_at,
            default => null,
        };
    }

    private static function eventGaps(RideAssignment $record): ?string
    {
        $steps = [
            'en_route' => 'En route',
            'arrived' => 'Arrived',
            'in_progress' => 'Trip started',
            'completed' => 'Completed',
        ];

        $times = [];
        foreach ($steps as $type => $label) {
            $at = self::eventMoment($record, $type);
            if ($at) {
                $times[] = [$label, $at];
            }
        }

        if (count($times) < 2) {
            return null;
        }

        $bits = [];
        for ($i = 1; $i < count($times); $i++) {
            [$fromLabel, $from] = $times[$i - 1];
            [$toLabel, $to] = $times[$i];
            $seconds = max(0, (int) $from->diffInSeconds($to));
            if ($seconds < 60) {
                $human = $seconds.'s';
            } elseif ($seconds < 3600) {
                $m = intdiv($seconds, 60);
                $s = $seconds % 60;
                $human = $s > 0 ? "{$m}m {$s}s" : "{$m}m";
            } else {
                $h = intdiv($seconds, 3600);
                $m = intdiv($seconds % 3600, 60);
                $human = $m > 0 ? "{$h}h {$m}m" : "{$h}h";
            }
            $bits[] = "{$fromLabel} → {$toLabel}: {$human}";
        }

        return implode(' · ', $bits);
    }
}
