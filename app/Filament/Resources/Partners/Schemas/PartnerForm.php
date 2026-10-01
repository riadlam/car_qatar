<?php

namespace App\Filament\Resources\Partners\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PartnerForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Identity')
                    ->columns(2)
                    ->schema([
                        TextInput::make('legal_name')
                            ->required(),
                        TextInput::make('display_name')
                            ->required()
                            ->helperText('Shown in the partner portal.'),
                        TextInput::make('tax_number')
                            ->default(null),
                        TextInput::make('registration_number')
                            ->default(null),
                        Select::make('status')
                            ->options([
                                'pending' => 'Pending',
                                'active' => 'Active',
                                'inactive' => 'Inactive',
                                'suspended' => 'Suspended',
                            ])
                            ->required()
                            ->default('pending')
                            ->native(false),
                    ]),
                Section::make('Contact')
                    ->columns(2)
                    ->schema([
                        TextInput::make('email')
                            ->label('Email address')
                            ->email()
                            ->default(null),
                        TextInput::make('phone')
                            ->tel()
                            ->default(null),
                        Select::make('country_id')
                            ->relationship('country', 'name')
                            ->searchable()
                            ->default(null),
                        Select::make('city_id')
                            ->relationship('city', 'name')
                            ->searchable()
                            ->default(null),
                        TextInput::make('address')
                            ->default(null)
                            ->columnSpanFull(),
                    ]),
                Section::make('Commercial — partner fee on guest bookings')
                    ->description('Fee is merged into the guest total (no separate line on their receipt). Partners see it in their portal; only completed rides earn it.')
                    ->columns(2)
                    ->schema([
                        Select::make('commission_type')
                            ->label('Fee type')
                            ->options([
                                'percent' => 'Percentage of fare (subtotal)',
                                'flat' => 'Fixed flat fee per ride',
                            ])
                            ->required()
                            ->default('percent')
                            ->live()
                            ->native(false),
                        TextInput::make('commission_value')
                            ->label(fn (callable $get): string => $get('commission_type') === 'flat'
                                ? 'Flat fee amount'
                                : 'Percent value')
                            ->required()
                            ->numeric()
                            ->minValue(0)
                            ->default(0.0)
                            ->helperText(fn (callable $get): string => $get('commission_type') === 'flat'
                                ? 'Added to booking fees in the booking currency.'
                                : 'e.g. 10 = 10% of trip subtotal (before tax).'),
                    ]),
                Section::make('Approval')
                    ->columns(2)
                    ->collapsed()
                    ->schema([
                        DateTimePicker::make('approved_at'),
                        Select::make('approved_by')
                            ->relationship('approvedBy', 'name')
                            ->searchable()
                            ->default(null),
                    ]),
            ]);
    }
}
