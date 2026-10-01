<?php

namespace App\Filament\Resources\ContactMessages\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ContactMessageInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('From')
                    ->columns(2)
                    ->schema([
                        TextEntry::make('name'),
                        TextEntry::make('email')
                            ->copyable(),
                        TextEntry::make('phone')
                            ->placeholder('—'),
                        TextEntry::make('subject')
                            ->placeholder('—'),
                        TextEntry::make('created_at')
                            ->dateTime()
                            ->label('Received'),
                        TextEntry::make('status')
                            ->badge(),
                    ]),
                Section::make('Message')
                    ->schema([
                        TextEntry::make('message')
                            ->columnSpanFull()
                            ->prose(),
                    ]),
            ]);
    }
}
