<?php

namespace Database\Seeders;

use App\Models\Group;
use Illuminate\Database\Seeder;

class GroupSeeder extends Seeder
{
    public function run(): void
    {
        $groups = [
            // Main workflow groups
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
            ],

            // Department groups
            [
                'name' => 'Administration',
                'slug' => 'administration',
                'description' => 'Administrative staff and management'
            ],
            [
                'name' => 'Finances',
                'slug' => 'finances',
                'description' => 'Finance and accounting department'
            ],
            [
                'name' => 'Logistique',
                'slug' => 'logistique',
                'description' => 'Logistics and supply chain management'
            ],
            [
                'name' => 'Ressources Humaines',
                'slug' => 'rh',
                'description' => 'Human Resources department'
            ],
            [
                'name' => 'Informatique',
                'slug' => 'informatique',
                'description' => 'IT department and technical support'
            ],
            [
                'name' => 'Operations',
                'slug' => 'operations',
                'description' => 'Operations and field activities'
            ],
            [
                'name' => 'Laboratoire',
                'slug' => 'laboratoire',
                'description' => 'Laboratory and research teams'
            ],
            [
                'name' => 'Sécurité',
                'slug' => 'securite',
                'description' => 'Security personnel and safety officers'
            ],
            [
                'name' => 'Maintenance',
                'slug' => 'maintenance',
                'description' => 'Maintenance and facilities management'
            ],
            [
                'name' => 'Formation',
                'slug' => 'formation',
                'description' => 'Training and education department'
            ],
            [
                'name' => 'Communication',
                'slug' => 'communication',
                'description' => 'Communications and public relations'
            ],
            [
                'name' => 'Juridique',
                'slug' => 'juridique',
                'description' => 'Legal department and compliance'
            ],
            [
                'name' => 'Qualité',
                'slug' => 'qualite',
                'description' => 'Quality assurance and control'
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
