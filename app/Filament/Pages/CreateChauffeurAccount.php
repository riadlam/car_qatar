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
use Filament\Schemas\Schema;
use Filament\Support\Enums\Alignment;
use Filament\Support\Enums\Width;
use Filament\Support\Icons\Heroicon;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Contracts\View\View;
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

    protected static string|UnitEnum|null $navigationGroup = 'People';

    protected static ?int $navigationSort = 11;

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

    public function getHeading(): string|Htmlable
    {
        return 'Create Chauffeur';
    }

    public function getSubheading(): string|Htmlable|null
    {
        return 'Create a login-ready chauffeur account and hand them the email + password.';
    }

    public function getHeader(): ?View
    {
        if (! is_array($this->handedCredentials)) {
            return null;
        }

        return view('filament.create-chauffeur-credentials', [
            'credentials' => $this->handedCredentials,
            'listUrl' => ChauffeurResource::getUrl('index'),
        ]);
    }

    public function mount(): void
    {
        $this->form->fill([
            'gender' => 'male',
        ]);
    }

    public function defaultForm(Schema $schema): Schema
    {
        return $schema->statePath('data');
    }

    public function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Login details')
                ->description('Only what the chauffeur needs to sign in. Account is created as active.')
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
                        ->helperText('Used on the website login page.')
                        ->columnSpanFull(),
                    TextInput::make('phone')
                        ->label('Phone')
                        ->tel()
                        ->required()
                        ->maxLength(40),
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
                        ->helperText('Share this with the chauffeur. Click the refresh icon to generate one.')
                        ->suffixAction(
                            Action::make('generatePassword')
                                ->icon(Heroicon::OutlinedArrowPath)
                                ->tooltip('Generate password')
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
        return $schema->components([
            $this->getFormContentComponent(),
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

    public function clearHandedCredentials(): void
    {
        $this->handedCredentials = null;
        $this->form->fill(['gender' => 'male']);
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
