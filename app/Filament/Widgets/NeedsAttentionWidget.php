<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\Bookings\BookingResource;
use App\Filament\Resources\Chauffeurs\ChauffeurResource;
use App\Models\Chauffeur;
use App\Models\RideOffer;
use Filament\Actions\Action;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

class NeedsAttentionWidget extends TableWidget
{
    protected static ?int $sort = 5;

    protected int | string | array $columnSpan = 1;

    protected static ?string $heading = 'Needs attention';

    public function table(Table $table): Table
    {
        $offers = RideOffer::query()
            ->whereIn('status', ['pending', 'offered'])
            ->count();

        return $table
            ->query(
                fn (): Builder => Chauffeur::query()
                    ->with('user')
                    ->where('status', 'pending')
                    ->latest()
                    ->limit(8)
            )
            ->description(
                $offers > 0
                    ? "{$offers} open offer".($offers === 1 ? '' : 's').' waiting · pending chauffeur applications below'
                    : 'Pending chauffeur applications · no open offers'
            )
            ->striped()
            ->paginated(false)
            ->emptyStateHeading('All clear')
            ->emptyStateDescription('No pending chauffeur applications.')
            ->columns([
                TextColumn::make('user.name')
                    ->label('Applicant')
                    ->weight('medium')
                    ->placeholder('—'),
                TextColumn::make('user.email')
                    ->label('Email')
                    ->placeholder('—')
                    ->toggleable(),
                TextColumn::make('user.phone')
                    ->label('Phone')
                    ->placeholder('—')
                    ->toggleable(),
                TextColumn::make('created_at')
                    ->label('Applied')
                    ->dateTime('M j, H:i')
                    ->sortable(),
                TextColumn::make('status')
                    ->badge()
                    ->color('warning')
                    ->formatStateUsing(fn (): string => 'Pending'),
            ])
            ->recordActions([
                Action::make('review')
                    ->label('Review')
                    ->url(fn (Chauffeur $record): string => ChauffeurResource::getUrl('edit', ['record' => $record])),
            ])
            ->headerActions([
                Action::make('openOffers')
                    ->label('View bookings')
                    ->url(BookingResource::getUrl('index'))
                    ->visible($offers > 0),
            ]);
    }
}
