<?php

namespace App\Filament\Resources\PartnerPayouts\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PartnerPayoutForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Settlement')
                    ->description('Record a payout against a partner’s earned balance. Partners cannot claim — this is admin-only.')
                    ->columns(2)
                    ->schema([
                        Select::make('partner_id')
                            ->relationship('partner', 'display_name')
                            ->searchable()
                            ->required()
                            ->native(false),
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
                    ]),
            ]);
    }
}
