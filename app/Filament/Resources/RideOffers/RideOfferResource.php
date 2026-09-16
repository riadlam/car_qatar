<?php

namespace App\Filament\Resources\RideOffers;

use App\Filament\Resources\RideOffers\Pages\CreateRideOffer;
use App\Filament\Resources\RideOffers\Pages\EditRideOffer;
use App\Filament\Resources\RideOffers\Pages\ListRideOffers;
use App\Filament\Resources\RideOffers\Pages\ViewRideOffer;
use App\Filament\Resources\RideOffers\Schemas\RideOfferForm;
use App\Filament\Resources\RideOffers\Schemas\RideOfferInfolist;
use App\Filament\Resources\RideOffers\Tables\RideOffersTable;
use App\Models\RideOffer;
use BackedEnum;
use UnitEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class RideOfferResource extends Resource
{
    protected static ?string $model = RideOffer::class;

    protected static string|UnitEnum|null $navigationGroup = 'Operations';

    protected static ?int $navigationSort = 3;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedPaperAirplane;

    protected static ?string $navigationLabel = 'Ride Offers';

    protected static bool $shouldRegisterNavigation = false;

    public static function shouldRegisterNavigation(): bool
    {
        return false;
    }

    protected static ?string $modelLabel = 'Ride Offer';

    protected static ?string $pluralModelLabel = 'Ride Offers';

    public static function form(Schema $schema): Schema
    {
        return RideOfferForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return RideOfferInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return RideOffersTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListRideOffers::route('/'),
            'create' => CreateRideOffer::route('/create'),
            'view' => ViewRideOffer::route('/{record}'),
            'edit' => EditRideOffer::route('/{record}/edit'),
        ];
    }
}
