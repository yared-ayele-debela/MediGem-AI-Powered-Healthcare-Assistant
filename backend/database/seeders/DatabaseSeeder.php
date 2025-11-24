<?php

namespace Database\Seeders;

use App\Models\Doctor;
use App\Models\Clinic;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create clinics
        $clinic1 = Clinic::create([
            'name' => 'MediGem Main Clinic',
            'address' => '123 Healthcare Street, Dubai, UAE',
            'phone' => '+971501234567',
            'email' => 'info@medigem.com',
        ]);

        // Create doctors
        Doctor::create([
            'name' => 'Dr. Sarah Ahmed',
            'email' => 'sarah@medigem.com',
            'password' => Hash::make('password'),
            'phone' => '+971501111111',
            'specialization' => 'Cardiologist',
            'bio' => 'Experienced cardiologist with 15+ years of practice.',
        ]);

        Doctor::create([
            'name' => 'Dr. John Smith',
            'email' => 'john@medigem.com',
            'password' => Hash::make('password'),
            'phone' => '+971502222222',
            'specialization' => 'General Practitioner',
            'bio' => 'General practitioner specializing in family medicine.',
        ]);

        Doctor::create([
            'name' => 'Dr. Emily Johnson',
            'email' => 'emily@medigem.com',
            'password' => Hash::make('password'),
            'phone' => '+971503333333',
            'specialization' => 'Pediatrician',
            'bio' => 'Pediatrician with expertise in child healthcare.',
        ]);
    }
}

