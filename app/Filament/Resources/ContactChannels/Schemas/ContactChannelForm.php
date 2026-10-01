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
                    ->description('Shown in the Contact us menu. Choose type “Leave a message / form” to open the on-site form (messages appear under Leave messages). Otherwise use a full link.')
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
                            ->live()
                            ->native(false)
                            ->helperText('Form type opens a modal on the website; submissions show in Leave messages.'),
                        TextInput::make('href')
                            ->label('Link / destination')
                            ->required(fn (callable $get): bool => $get('type') !== 'form')
                            ->dehydrated()
                            ->dehydrateStateUsing(function (?string $state, callable $get): string {
                                if ($get('type') === 'form') {
                                    return filled($state) ? (string) $state : '#leave-message';
                                }

                                return (string) $state;
                            })
                            ->default('#leave-message')
                            ->columnSpanFull()
                            ->helperText(fn (callable $get): string => $get('type') === 'form'
                                ? 'Optional for form type (site opens the leave-message modal). Can leave as #leave-message.'
                                : 'Examples: tel:+97440000000 · mailto:concierge@almajd.com · https://wa.me/97440000000 · /help'),
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
