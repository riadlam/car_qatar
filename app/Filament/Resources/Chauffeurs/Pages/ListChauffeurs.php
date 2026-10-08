<?php

namespace App\Filament\Resources\Chauffeurs\Pages;

use App\Filament\Pages\CreateChauffeurAccount;
use App\Filament\Resources\Chauffeurs\ChauffeurResource;
use App\Models\Chauffeur;
use Filament\Actions\Action;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Support\Icons\Heroicon;
use Illuminate\Database\Eloquent\Builder;

class ListChauffeurs extends ListRecords
{
    protected static string $resource = ChauffeurResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('createChauffeurAccount')
                ->label('Create Chauffeur')
                ->icon(Heroicon::OutlinedUserPlus)
                ->url(CreateChauffeurAccount::getUrl())
                ->visible(fn (): bool => auth()->user()?->canManageChauffeurs() ?? false),
        ];
    }

    public function getTabs(): array
    {
        return [
            'pending' => Tab::make('Pending')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'pending'))
                ->badge(Chauffeur::query()->where('status', 'pending')->count())
                ->badgeColor('warning'),
            'all' => Tab::make('All')
                ->badge(Chauffeur::query()->count()),
            'active' => Tab::make('Active')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'active'))
                ->badge(Chauffeur::query()->where('status', 'active')->count())
                ->badgeColor('success'),
            'declined' => Tab::make('Declined')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'declined'))
                ->badge(Chauffeur::query()->where('status', 'declined')->count())
                ->badgeColor('danger'),
        ];
    }
}
