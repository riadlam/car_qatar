<?php

namespace App\Filament\Resources\ContactChannels\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ContactChannelForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Contact us item')
                    ->description('Shown in the Contact us menu in the site header. Use full links (tel:, mailto:, https://wa.me/…, or a site path).')
                    ->columns(2)
                    ->schema([
                        TextInput::make('label')
                            ->required()
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (?string $state, callable $set, callable $get): void {
                                if (filled($get('key'))) {
                                    return;
                                }

                                $set('key', Str::slug((string) $state, '_'));
                            })
                            ->helperText('Menu label guests see (e.g. Call us).'),
                        TextInput::make('key')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->helperText('Stable id (e.g. call_us).'),
                        TextInput::make('href')
                            ->label('Link / destination')
                            ->required()
                            ->columnSpanFull()
                            ->helperText('Examples: tel:+97440000000 · mailto:concierge@almajd.com · https://wa.me/97440000000 · /help'),
                        Select::make('type')
                            ->options([
                                'phone' => 'Phone',
                                'whatsapp' => 'WhatsApp',
                                'email' => 'Email',
                                'form' => 'Leave a message / form',
                                'link' => 'Other link',
                            ])
                            ->required()
                            ->default('link')
                            ->native(false),
                        TextInput::make('sort_order')
                            ->numeric()
                            ->required()
                            ->default(0),
                        Select::make('status')
                            ->options([
                                'active' => 'Active — show on site',
                                'inactive' => 'Inactive — hide from site',
                            ])
                            ->required()
                            ->default('active')
                            ->native(false)
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
