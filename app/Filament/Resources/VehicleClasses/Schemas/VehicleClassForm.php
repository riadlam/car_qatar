<?php

namespace App\Filament\Resources\VehicleClasses\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class VehicleClassForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Identity')
                    ->columns(2)
                    ->schema([
                        TextInput::make('name')
                            ->required(),
                        TextInput::make('slug')
                            ->required(),
                        TextInput::make('similar_label')
                            ->default(null),
                        TextInput::make('sort_order')
                            ->required()
                            ->numeric()
                            ->default(0),
                        TextInput::make('status')
                            ->required()
                            ->default('active'),
                        Textarea::make('description')
                            ->default(null)
                            ->columnSpanFull(),
                    ]),
                Section::make('Capacity')
                    ->columns(2)
                    ->schema([
                        TextInput::make('passengers')
                            ->required()
                            ->numeric()
                            ->default(1),
                        TextInput::make('luggage')
                            ->required()
                            ->numeric()
                            ->default(0),
                    ]),
                Section::make('Media')
                    ->columns(2)
                    ->schema([
                        FileUpload::make('image_lg')
                            ->image(),
                        FileUpload::make('image_sm')
                            ->image(),
                    ]),
            ]);
    }
}
