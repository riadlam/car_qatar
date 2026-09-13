<?php

namespace App\Filament\Resources\ServiceTypes\RelationManagers;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class CountOptionsRelationManager extends RelationManager
{
    protected static string $relationship = 'countOptions';

    protected static ?string $title = 'Passenger / student counts';

    protected static ?string $recordTitleAttribute = 'label';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('kind')
                    ->options([
                        'passenger' => 'Passengers',
                        'student' => 'Students',
                    ])
                    ->required()
                    ->native(false),
                TextInput::make('value')
                    ->required()
                    ->helperText('Stored value (e.g. 5).'),
                TextInput::make('label')
                    ->required()
                    ->helperText('Shown in the hero dropdown (usually same as value).'),
                TextInput::make('sort_order')
                    ->numeric()
                    ->required()
                    ->default(0),
                Select::make('status')
                    ->options([
                        'active' => 'Active',
                        'inactive' => 'Inactive',
                    ])
                    ->required()
                    ->default('active')
                    ->native(false),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->defaultSort('sort_order')
            ->reorderable('sort_order')
            ->columns([
                TextColumn::make('sort_order')->label('#')->sortable(),
                TextColumn::make('kind')
                    ->badge()
                    ->formatStateUsing(fn (?string $state): string => match ($state) {
                        'passenger' => 'Passengers',
                        'student' => 'Students',
                        default => (string) $state,
                    }),
                TextColumn::make('label')->searchable(),
                TextColumn::make('value')->badge(),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (?string $state): string => $state === 'active' ? 'success' : 'danger'),
            ])
            ->headerActions([
                CreateAction::make(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
