<?php

namespace App\Filament\Resources\Partners\RelationManagers;

use App\Enums\UserRole;
use App\Models\User;
use Filament\Actions\AttachAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DetachAction;
use Filament\Actions\DetachBulkAction;
use Filament\Forms\Components\Select;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class UsersRelationManager extends RelationManager
{
    protected static string $relationship = 'users';

    protected static ?string $title = 'Portal users';

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('email')
            ->columns([
                TextColumn::make('name')
                    ->searchable(),
                TextColumn::make('email')
                    ->searchable(),
                TextColumn::make('role')
                    ->badge()
                    ->formatStateUsing(fn ($state) => $state instanceof UserRole
                        ? $state->label()
                        : (string) $state),
                TextColumn::make('pivot.role')
                    ->label('Partner role'),
                TextColumn::make('pivot.status')
                    ->label('Link status')
                    ->badge(),
            ])
            ->headerActions([
                AttachAction::make()
                    ->preloadRecordSelect()
                    ->recordSelectSearchColumns(['name', 'email'])
                    ->form(fn (AttachAction $action): array => [
                        $action->getRecordSelect(),
                        Select::make('status')
                            ->options([
                                'active' => 'Active',
                                'inactive' => 'Inactive',
                            ])
                            ->default('active')
                            ->required()
                            ->native(false),
                    ])
                    ->mutateFormDataUsing(fn (array $data): array => [
                        ...$data,
                        'role' => 'admin',
                    ])
                    ->after(function (User $record): void {
                        if ($record->role !== UserRole::PartnerAdmin) {
                            $record->forceFill(['role' => UserRole::PartnerAdmin])->save();
                        }
                    }),
            ])
            ->recordActions([
                DetachAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DetachBulkAction::make(),
                ]),
            ])
            ->emptyStateHeading('No portal users')
            ->emptyStateDescription('Attach a user account so they can book for guests and view earnings.');
    }
}
