<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Patient extends Model
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'date_of_birth',
        'medical_history',
        'otp',
        'otp_expires_at',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'otp_expires_at' => 'datetime',
    ];

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}

