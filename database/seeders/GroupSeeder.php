<?php

namespace Database\Seeders;

use App\Models\Group;
use Illuminate\Database\Seeder;

class GroupSeeder extends Seeder
{
    public function run(): void
    {
        $groups = [
            [
                'name' => 'Service des Permis',
                'slug' => 'service-permis',
                'description' => 'Service responsible for reviewing and approving pass permit requests'
            ],
            [
                'name' => 'Barrière',
                'slug' => 'barriere',
                'description' => 'Checkpoint personnel responsible for verifying approved permits'
            ],
            [
                'name' => 'Gendarmerie',
                'slug' => 'gendarmerie',
                'description' => 'Final security verification and oversight of pass permits'
            ]
        ];

        foreach ($groups as $group) {
            Group::firstOrCreate(
                ['slug' => $group['slug']],
                $group
            );
        }
    }
}
