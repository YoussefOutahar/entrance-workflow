<?php

namespace App\Filament\Resources;

use App\Filament\Resources\VisitorPassResource\Pages;
use App\Models\VisitorPass;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class VisitorPassResource extends Resource
{
    protected static ?string $model = VisitorPass::class;
    protected static ?string $navigationIcon = 'heroicon-o-ticket';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\DatePicker::make('visit_date')
                    ->required(),
                Forms\Components\TextInput::make('visited_person')
                    ->required(),
                Forms\Components\TextInput::make('unit')
                    ->required(),
                Forms\Components\TextInput::make('module')
                    ->required(),
                Forms\Components\Textarea::make('visit_purpose')
                    ->required(),
                Forms\Components\Select::make('duration_type')
                    ->options([
                        'full_day' => 'Full Day',
                        'custom' => 'Custom Duration',
                    ])
                    ->required(),
                Forms\Components\TextInput::make('duration_days')
                    ->numeric()
                    ->visible(fn (Forms\Get $get) => $get('duration_type') === 'custom'),
                Forms\Components\TextInput::make('visitor_name')
                    ->required(),
                Forms\Components\TextInput::make('id_number')
                    ->required(),
                Forms\Components\TextInput::make('organization'),
                Forms\Components\Select::make('category')
                    ->options([
                        'S-T' => 'S-T',
                        'Ch' => 'Ch',
                        'E' => 'E',
                    ])
                    ->required(),
                Forms\Components\Select::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'approved' => 'Approved',
                        'rejected' => 'Rejected',
                    ])
                    ->default('pending')
                    ->required(),
                Forms\Components\Toggle::make('hierarchy_approval'),
                Forms\Components\Toggle::make('spp_approval'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('visit_date')
                    ->date()
                    ->sortable(),
                Tables\Columns\TextColumn::make('visitor_name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('visited_person')
                    ->searchable(),
                Tables\Columns\TextColumn::make('unit'),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'approved' => 'success',
                        'rejected' => 'danger',
                        default => 'warning',
                    }),
                Tables\Columns\IconColumn::make('hierarchy_approval')
                    ->boolean(),
                Tables\Columns\IconColumn::make('spp_approval')
                    ->boolean(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'approved' => 'Approved',
                        'rejected' => 'Rejected',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListVisitorPasses::route('/'),
            'create' => Pages\CreateVisitorPass::route('/create'),
            'edit' => Pages\EditVisitorPass::route('/{record}/edit'),
        ];
    }
}
