<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Twilio\Rest\Client as TwilioClient;

class PatientAuthController extends Controller
{
    private function getTwilioClient(): TwilioClient
    {
        return new TwilioClient(
            config('services.twilio.sid'),
            config('services.twilio.token')
        );
    }

    public function sendOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
        ]);

        $phone = $request->phone;
        $otp = str_pad((string) rand(100000, 999999), 6, '0', STR_PAD_LEFT);
        $expiresAt = now()->addMinutes(10);

        $patient = Patient::firstOrCreate(
            ['phone' => $phone],
            ['name' => null]
        );

        $patient->update([
            'otp' => $otp,
            'otp_expires_at' => $expiresAt,
        ]);

        try {
            $twilio = $this->getTwilioClient();
            $message = $twilio->messages->create(
                $phone,
                [
                    'from' => config('services.twilio.phone'),
                    'body' => "Your MediGem OTP code is: {$otp}. Valid for 10 minutes.",
                ]
            );

            return response()->json([
                'message' => 'OTP sent successfully',
                'message_sid' => $message->sid,
            ]);
        } catch (\Exception $e) {
            Log::error('Twilio OTP Error: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'OTP sent (check logs in development)',
                'otp' => config('app.debug') ? $otp : null,
            ], 200);
        }
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'otp' => 'required|string|size:6',
        ]);

        $patient = Patient::where('phone', $request->phone)->first();

        if (!$patient) {
            return response()->json([
                'message' => 'Patient not found. Please request OTP first.',
            ], 404);
        }

        if ($patient->otp !== $request->otp) {
            return response()->json([
                'message' => 'Invalid OTP code.',
            ], 401);
        }

        if ($patient->otp_expires_at && $patient->otp_expires_at->isPast()) {
            return response()->json([
                'message' => 'OTP has expired. Please request a new one.',
            ], 401);
        }

        $patient->update([
            'otp' => null,
            'otp_expires_at' => null,
        ]);

        $token = $patient->createToken('patient-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'patient' => $patient,
        ]);
    }
}

