<?php

namespace App\Filament\Resources\VisitorPassResource\Pages;

use App\Filament\Resources\VisitorPassResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListVisitorPasses extends ListRecords
{
    protected static string $resource = VisitorPassResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
