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
                ->url(CreateChauffeurAccount::getUrl()),
        ];
    }

    public function getTabs(): array
    {
        return [
            'pending' => Tab::make('Pending')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'pending'))
                ->badge(Chauffeur::query()->where('status', 'pending')->count()),
            'all' => Tab::make('All'),
            'active' => Tab::make('Active')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'active')),
            'declined' => Tab::make('Declined')
                ->modifyQueryUsing(fn (Builder $query) => $query->where('status', 'declined')),
        ];
    }
}
