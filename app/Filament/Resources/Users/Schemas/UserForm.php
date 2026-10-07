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
        $canManageStaffRoles = auth()->user()?->canManageStaffRoles() ?? false;

        $roleOptions = collect(UserRole::cases())
            ->reject(fn (UserRole $role): bool => ! $canManageStaffRoles && in_array($role, UserRole::staffRoles(), true))
            ->mapWithKeys(fn (UserRole $role): array => [$role->value => $role->label()])
            ->all();

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
                            ->helperText('Leave blank on edit to keep the current password.'),
                        Select::make('role')
                            ->options($roleOptions)
                            ->default(UserRole::Customer->value)
                            ->required()
                            ->disabled(fn (): bool => ! (auth()->user()?->canManageStaffRoles() ?? false))
                            ->dehydrated(fn (): bool => auth()->user()?->canManageStaffRoles() ?? false)
                            ->helperText('Only a Super Admin can change roles.'),
                        Select::make('status')
                            ->options([
                                'active' => 'Active',
                                'inactive' => 'Inactive',
                                'suspended' => 'Suspended',
                            ])
                            ->required()
                            ->default('active')
                            ->native(false),
                        DateTimePicker::make('email_verified_at')
                            ->disabled()
                            ->dehydrated(false),
                    ]),
                Section::make('Profile')
                    ->columns(2)
                    ->schema([
                        Select::make('account_type')
                            ->options([
                                'individual' => 'Individual',
                                'company' => 'Company (customer)',
                            ])
                            ->required()
                            ->default('individual')
                            ->native(false)
                            ->helperText('Company customers book normally. Partners are separate orgs under Partners — not this field.'),
                        TextInput::make('title')
                            ->default(null),
                        TextInput::make('first_name')
                            ->default(null),
                        TextInput::make('last_name')
                            ->default(null),
                        TextInput::make('company_name')
                            ->label('Company name')
                            ->default(null)
                            ->helperText('Used when account type is Company (customer).'),
                        TextInput::make('phone')
                            ->tel()
                            ->default(null),
                        Select::make('preferred_language')
                            ->label('Preferred chauffeur language')
                            ->options([
                                'en' => 'English',
                                'ar' => 'Arabic',
                            ])
                            ->native(false)
                            ->nullable(),
                        Select::make('language')
                            ->label('App language')
                            ->options([
                                'en' => 'English',
                                'ar' => 'Arabic',
                            ])
                            ->required()
                            ->default('en')
                            ->native(false),
                        TextInput::make('street_address')
                            ->default(null)
                            ->columnSpanFull(),
                        Toggle::make('marketing_emails')
                            ->required(),
                        DateTimePicker::make('last_login_at')
                            ->disabled()
                            ->dehydrated(false),
                    ]),
            ]);
    }
}
