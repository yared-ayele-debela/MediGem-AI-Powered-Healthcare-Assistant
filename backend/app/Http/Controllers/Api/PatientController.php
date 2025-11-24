<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function appointments(Request $request)
    {
        $patient = $request->user();
        
        if (!$patient) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        
        $appointments = $patient->appointments()
            ->with(['doctor', 'clinic'])
            ->orderBy('appointment_date', 'desc')
            ->get();

        return response()->json($appointments);
    }
}

