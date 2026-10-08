<?php

namespace App\Filament\Pages;

use App\Enums\UserRole;
use App\Filament\Resources\Partners\PartnerResource;
use App\Models\Partner;
use App\Models\User;
use BackedEnum;
use Filament\Actions\Action;
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
class CreatePartnerAccount extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBuildingOffice2;

    protected static string|UnitEnum|null $navigationGroup = 'Partners';

    protected static ?int $navigationSort = 11;

    protected static ?string $navigationLabel = 'Create Partner';

    protected static ?string $title = 'Create Partner';

    protected static ?string $slug = 'create-partner';

    protected Width|string|null $maxContentWidth = Width::ThreeExtraLarge;

    /**
     * @var array<string, mixed>|null
     */
    public ?array $data = [];

    /**
     * Shown once after create so ops can hand credentials to the partner admin.
     *
     * @var array{name: string, email: string, password: string, partner_id?: int|null, company?: string}|null
     */
    public ?array $handedCredentials = null;

    public static function canAccess(): bool
    {
        return auth()->user()?->canManagePartners() ?? false;
    }

    public function getHeading(): string|Htmlable
    {
        return 'Create Partner';
    }

    public function getSubheading(): string|Htmlable|null
    {
        return 'Create a partner organization and a login-ready portal admin. Hand them the email + password.';
    }

    public function getHeader(): ?View
    {
        if (! is_array($this->handedCredentials)) {
            return null;
        }

        $partnerId = $this->handedCredentials['partner_id'] ?? null;

        return view('filament.create-partner-credentials', [
            'credentials' => $this->handedCredentials,
            'listUrl' => PartnerResource::getUrl('index'),
            'editUrl' => $partnerId
                ? PartnerResource::getUrl('edit', ['record' => $partnerId])
                : null,
        ]);
    }

    public function mount(): void
    {
        $this->form->fill([]);
    }

    public function defaultForm(Schema $schema): Schema
    {
        return $schema->statePath('data');
    }

    public function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Partner')
                ->description('Organization shown in the partner portal. Fee settings can be edited later by finance.')
                ->schema([
                    TextInput::make('company_name')
                        ->label('Company name')
                        ->required()
                        ->maxLength(160)
                        ->helperText('Used as both legal and display name.')
                        ->autocomplete(false),
                ]),
            Section::make('Portal admin login')
                ->description('Only what they need to sign in. Account is created as active.')
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
                        ->helperText('Used on the website login page and partner portal.')
                        ->columnSpanFull(),
                    TextInput::make('phone')
                        ->label('Phone')
                        ->tel()
                        ->required()
                        ->maxLength(40)
                        ->columnSpanFull(),
                    TextInput::make('password')
                        ->label('Temporary password')
                        ->password()
                        ->revealable()
                        ->required()
                        ->rule(Password::defaults())
                        ->helperText('Share this with the partner. Click the refresh icon to generate one.')
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
                        ->label('Create partner account')
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
        $this->form->fill([]);
    }

    public function create(): void
    {
        $data = $this->form->getState();

        $companyName = trim((string) $data['company_name']);
        $firstName = trim((string) $data['first_name']);
        $lastName = trim((string) $data['last_name']);
        $email = Str::lower(trim((string) $data['email']));
        $phone = trim((string) $data['phone']);
        $password = (string) $data['password'];
        $fullName = trim($firstName.' '.$lastName);
        $admin = auth()->user();

        [$user, $partner] = DB::transaction(function () use (
            $companyName,
            $firstName,
            $lastName,
            $email,
            $phone,
            $password,
            $fullName,
            $admin,
        ): array {
            $user = User::query()->create([
                'name' => $fullName,
                'email' => $email,
                'password' => $password,
                'role' => UserRole::PartnerAdmin,
                'account_type' => 'company',
                'title' => 'Mr.',
                'first_name' => $firstName,
                'last_name' => $lastName,
                'company_name' => $companyName,
                'phone' => $phone,
                'preferred_language' => 'en',
                'language' => 'en',
                'status' => 'active',
                'email_verified_at' => now(),
            ]);

            $partner = Partner::query()->create([
                'legal_name' => $companyName,
                'display_name' => $companyName,
                'email' => $email,
                'phone' => $phone,
                'commission_type' => 'percent',
                'commission_value' => 0,
                'status' => 'active',
                'approved_at' => now(),
                'approved_by' => $admin?->id,
            ]);

            $partner->users()->attach($user->id, [
                'role' => 'admin',
                'status' => 'active',
            ]);

            return [$user, $partner];
        });

        $this->handedCredentials = [
            'name' => $user->name,
            'email' => $user->email,
            'password' => $password,
            'partner_id' => $partner->id,
            'company' => $partner->display_name,
        ];

        $this->form->fill([]);

        Notification::make()
            ->title('Partner account created')
            ->body('Share the login email and temporary password below with '.$fullName.'.')
            ->success()
            ->send();
    }
}
