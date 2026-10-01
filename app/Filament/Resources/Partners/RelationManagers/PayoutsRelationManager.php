<?php

namespace App\Filament\Resources\Partners\RelationManagers;

use Filament\Actions\CreateAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PayoutsRelationManager extends RelationManager
{
    protected static string $relationship = 'payouts';

    protected static ?string $title = 'Settlements';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('amount')
                    ->required()
                    ->numeric()
                    ->minValue(0.01),
                TextInput::make('currency')
                    ->required()
                    ->default('QAR')
                    ->maxLength(3),
                Select::make('status')
                    ->options([
                        'draft' => 'Draft',
                        'paid' => 'Paid',
                    ])
                    ->required()
                    ->default('paid')
                    ->native(false),
                DateTimePicker::make('paid_at')
                    ->default(now()),
                Textarea::make('note')
                    ->rows(3)
                    ->columnSpanFull(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('amount')
            ->defaultSort('paid_at', 'desc')
            ->columns([
                TextColumn::make('amount')
                    ->money(fn ($record) => $record->currency ?: 'QAR'),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (?string $state): string => $state === 'paid' ? 'success' : 'gray'),
                TextColumn::make('paid_at')
                    ->dateTime()
                    ->placeholder('—'),
                TextColumn::make('note')
                    ->limit(40)
                    ->placeholder('—'),
                TextColumn::make('createdBy.name')
                    ->label('By')
                    ->placeholder('—'),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->headerActions([
                CreateAction::make()
                    ->mutateFormDataUsing(function (array $data): array {
                        $data['created_by'] = auth()->id();
                        if (($data['status'] ?? '') === 'paid' && empty($data['paid_at'])) {
                            $data['paid_at'] = now();
                        }

                        return $data;
                    }),
            ])
            ->emptyStateHeading('No settlements')
            ->emptyStateDescription('Record payouts when you settle a partner’s unpaid balance.');
    }
}
