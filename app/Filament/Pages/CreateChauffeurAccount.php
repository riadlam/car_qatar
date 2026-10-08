<?php

namespace App\Filament\Pages;

use App\Enums\UserRole;
use App\Filament\Resources\Chauffeurs\ChauffeurResource;
use App\Models\Chauffeur;
use App\Models\User;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\Component;
use Filament\Schemas\Components\EmbeddedSchema;
use Filament\Schemas\Components\Form;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\View as SchemaView;
use Filament\Schemas\Schema;
use Filament\Support\Enums\Alignment;
use Filament\Support\Enums\Width;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use UnitEnum;

/**
 * @property-read Schema $form
 */
class CreateChauffeurAccount extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUserPlus;

    protected static string|UnitEnum|null $navigationGroup = 'Fleet';

    protected static ?int $navigationSort = 20;

    protected static ?string $navigationLabel = 'Create Chauffeur';

    protected static ?string $title = 'Create Chauffeur';

    protected static ?string $slug = 'create-chauffeur';

    protected Width|string|null $maxContentWidth = Width::ThreeExtraLarge;

    /**
     * @var array<string, mixed>|null
     */
    public ?array $data = [];

    /**
     * Shown once after create so ops can hand credentials to the chauffeur.
     *
     * @var array{name: string, email: string, password: string}|null
     */
    public ?array $handedCredentials = null;

    public function mount(): void
    {
        $this->form->fill([
            'gender' => 'male',
        ]);
    }

    public function defaultForm(Schema $schema): Schema
    {
        return $schema
            ->statePath('data');
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('What the chauffeur needs to log in')
                    ->description('Only these fields. The account is created as an active chauffeur so they can sign in on the website right away.')
                    ->columns(2)
                    ->schema([
                        TextInput::make('first_name')
                            ->label('First name')
                            ->required()
                            ->maxLength(80)
                            ->autocomplete(false),
                        TextInput::make('last_name')
                            ->label('Last name')
                            ->required()
                            ->maxLength(80)
                            ->autocomplete(false),
                        TextInput::make('email')
                            ->label('Login email')
                            ->email()
                            ->required()
                            ->unique(User::class, 'email')
                            ->maxLength(255)
                            ->helperText('They will use this email on the login page.')
                            ->columnSpanFull(),
                        TextInput::make('phone')
                            ->label('Phone')
                            ->tel()
                            ->required()
                            ->maxLength(40)
                            ->helperText('Ops contact number for this chauffeur.'),
                        Select::make('gender')
                            ->label('Gender')
                            ->options([
                                'male' => 'Male',
                                'female' => 'Female',
                            ])
                            ->required()
                            ->native(false),
                        TextInput::make('password')
                            ->label('Temporary password')
                            ->password()
                            ->revealable()
                            ->required()
                            ->rule(Password::defaults())
                            ->helperText('Give this password to the chauffeur. They can change it later from Account.')
                            ->suffixAction(
                                Action::make('generatePassword')
                                    ->icon(Heroicon::OutlinedArrowPath)
                                    ->tooltip('Generate a strong password')
                                    ->action(function (): void {
                                        $this->data['password'] = Str::password(12);
                                    })
                            )
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public function content(Schema $schema): Schema
    {
        return $schema
            ->components([
                $this->getCredentialsBannerComponent(),
                $this->getFormContentComponent(),
            ]);
    }

    protected function getCredentialsBannerComponent(): Component
    {
        return Section::make('Hand these credentials to the chauffeur')
            ->description('Copy email and password now — the password is only shown once here.')
            ->icon(Heroicon::OutlinedKey)
            ->visible(fn (): bool => filled($this->handedCredentials))
            ->schema([
                SchemaView::make('filament.create-chauffeur-credentials')
                    ->viewData(fn (): array => [
                        'credentials' => $this->handedCredentials,
                    ]),
                Actions::make([
                    Action::make('viewChauffeur')
                        ->label('Open chauffeur list')
                        ->url(ChauffeurResource::getUrl('index'))
                        ->color('gray'),
                    Action::make('createAnother')
                        ->label('Create another')
                        ->action(function (): void {
                            $this->handedCredentials = null;
                            $this->form->fill(['gender' => 'male']);
                        }),
                ])->alignment(Alignment::Start),
            ]);
    }

    public function getFormContentComponent(): Component
    {
        return Form::make([EmbeddedSchema::make('form')])
            ->id('form')
            ->livewireSubmitHandler('create')
            ->footer([
                Actions::make([
                    Action::make('create')
                        ->label('Create chauffeur account')
                        ->submit('create')
                        ->color('primary'),
                ])
                    ->alignment(Alignment::Start)
                    ->key('form-actions'),
            ]);
    }

    public function create(): void
    {
        $data = $this->form->getState();

        $firstName = trim((string) $data['first_name']);
        $lastName = trim((string) $data['last_name']);
        $email = Str::lower(trim((string) $data['email']));
        $phone = trim((string) $data['phone']);
        $gender = (string) $data['gender'];
        $password = (string) $data['password'];
        $fullName = trim($firstName.' '.$lastName);

        $user = DB::transaction(function () use ($firstName, $lastName, $email, $phone, $gender, $password, $fullName): User {
            $user = User::query()->create([
                'name' => $fullName,
                'email' => $email,
                'password' => $password,
                'role' => UserRole::Chauffeur,
                'account_type' => 'individual',
                'title' => $gender === 'female' ? 'Ms.' : 'Mr.',
                'first_name' => $firstName,
                'last_name' => $lastName,
                'phone' => $phone,
                'preferred_language' => 'en',
                'language' => 'en',
                'status' => 'active',
                'email_verified_at' => now(),
            ]);

            Chauffeur::query()->create([
                'user_id' => $user->id,
                'status' => 'active',
                'gender' => $gender,
            ]);

            return $user;
        });

        $this->handedCredentials = [
            'name' => $user->name,
            'email' => $user->email,
            'password' => $password,
        ];

        $this->form->fill(['gender' => 'male']);

        Notification::make()
            ->title('Chauffeur account created')
            ->body('Share the login email and temporary password below with '.$fullName.'.')
            ->success()
            ->send();
    }
}
