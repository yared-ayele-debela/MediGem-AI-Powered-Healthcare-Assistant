<?php

use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PatientAuthController;
use App\Http\Controllers\Api\PatientController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/doctor/login', [AuthController::class, 'login']);
Route::post('/patient/send-otp', [PatientAuthController::class, 'sendOtp']);
Route::post('/patient/verify-otp', [PatientAuthController::class, 'verifyOtp']);


Route::middleware('auth:patient')->group(function () {
    Route::get('patient/me', [PatientController::class, 'me']);
    Route::get('/patient/appointments', [PatientController::class, 'appointments']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Doctor routes
    Route::get('doctor/me', [AuthController::class, 'me']);
    Route::post('/doctor/logout', [AuthController::class, 'logout']);
    

    // Appointment routes
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::post('/appointments/{id}/approve', [AppointmentController::class, 'approve']);
    Route::post('/appointments/{id}/reject', [AppointmentController::class, 'reject']);
    Route::post('/appointments/{id}/cancel', [AppointmentController::class, 'cancel']);
});

