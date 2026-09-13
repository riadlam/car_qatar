<?php

namespace App\Filament\Resources\Users\Schemas;

use App\Enums\UserRole;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Account')
                    ->columns(2)
                    ->schema([
                        TextInput::make('name')
                            ->required(),
                        TextInput::make('email')
                            ->label('Email address')
                            ->email()
                            ->required(),
                        TextInput::make('password')
                            ->password()
                            ->revealable()
                            ->required(fn (string $operation): bool => $operation === 'create')
                            ->dehydrated(fn (?string $state): bool => filled($state))
                            ->helperText('Leave blank on edit to keep the current password. Hashed via the User model cast.'),
                        Select::make('role')
                            ->options(collect(UserRole::cases())->mapWithKeys(
                                fn (UserRole $role): array => [$role->value => $role->label()]
                            )->all())
                            ->default(UserRole::Customer->value)
                            ->required()
                            ->disabled(fn (): bool => auth()->user()?->role !== UserRole::SuperAdmin)
                            ->dehydrated(fn (): bool => auth()->user()?->role === UserRole::SuperAdmin)
                            ->helperText('Only a super admin can change roles.'),
                        TextInput::make('status')
                            ->required()
                            ->default('active'),
                        DateTimePicker::make('email_verified_at'),
                    ]),
                Section::make('Profile')
                    ->columns(2)
                    ->schema([
                        TextInput::make('account_type')
                            ->required()
                            ->default('individual'),
                        TextInput::make('title')
                            ->default(null),
                        TextInput::make('first_name')
                            ->default(null),
                        TextInput::make('last_name')
                            ->default(null),
                        TextInput::make('company_name')
                            ->default(null),
                        TextInput::make('phone')
                            ->tel()
                            ->default(null),
                        TextInput::make('preferred_language')
                            ->default(null),
                        TextInput::make('language')
                            ->required()
                            ->default('en'),
                        TextInput::make('street_address')
                            ->default(null)
                            ->columnSpanFull(),
                        Toggle::make('marketing_emails')
                            ->required(),
                        TextInput::make('booking_notifications')
                            ->required()
                            ->default('email_sms'),
                        TextInput::make('avatar_path')
                            ->default(null),
                        DateTimePicker::make('phone_verified_at'),
                        DateTimePicker::make('last_login_at'),
                    ]),
            ]);
    }
}
