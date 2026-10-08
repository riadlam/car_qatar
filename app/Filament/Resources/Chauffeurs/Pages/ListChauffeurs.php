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
            'all' => Tab::make('All')
                ->badge(Chauffeur::query()->count()),
            'active' => Tab::make('Active')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'active'))
                ->badge(Chauffeur::query()->where('status', 'active')->count())
                ->badgeColor('success'),
            'paused' => Tab::make('Paused')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'paused'))
                ->badge(Chauffeur::query()->where('status', 'paused')->count())
                ->badgeColor('warning'),
        ];
    }
}
