<?php

namespace App\Filament\Resources\ContactChannels;

use App\Filament\Resources\ContactChannels\Pages\CreateContactChannel;
use App\Filament\Resources\ContactChannels\Pages\EditContactChannel;
use App\Filament\Resources\ContactChannels\Pages\ListContactChannels;
use App\Filament\Resources\ContactChannels\Schemas\ContactChannelForm;
use App\Filament\Resources\ContactChannels\Tables\ContactChannelsTable;
use App\Models\ContactChannel;
use BackedEnum;
use UnitEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ContactChannelResource extends Resource
{
    protected static ?string $model = ContactChannel::class;

    protected static string|UnitEnum|null $navigationGroup = 'Content';

    protected static ?int $navigationSort = 1;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedPhone;

    protected static ?string $navigationLabel = 'Contact us';

    protected static ?string $modelLabel = 'Contact channel';

    protected static ?string $pluralModelLabel = 'Contact us';

    protected static ?string $recordTitleAttribute = 'label';

    public static function form(Schema $schema): Schema
    {
        return ContactChannelForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ContactChannelsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListContactChannels::route('/'),
            'create' => CreateContactChannel::route('/create'),
            'edit' => EditContactChannel::route('/{record}/edit'),
        ];
    }
}
