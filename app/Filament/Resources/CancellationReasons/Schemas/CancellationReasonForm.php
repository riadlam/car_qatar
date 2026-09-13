<?php

namespace App\Filament\Resources\CancellationReasons\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CancellationReasonForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Cancel reason')
                    ->description('Customer and chauffeur lists are separate. Turning a reason off hides it from new cancellations.')
                    ->columns(2)
                    ->schema([
                        Select::make('audience')
                            ->options([
                                'customer' => 'Customer',
                                'chauffeur' => 'Chauffeur',
                            ])
                            ->required()
                            ->native(false),
                        TextInput::make('label')
                            ->required()
                            ->maxLength(120),
                        TextInput::make('sort_order')
                            ->numeric()
                            ->required()
                            ->default(0),
                        Toggle::make('is_active')
                            ->label('Active')
                            ->default(true),
                    ]),
            ]);
    }
}
