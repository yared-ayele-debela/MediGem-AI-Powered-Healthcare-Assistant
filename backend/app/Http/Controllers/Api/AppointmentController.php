<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Google\Client as GoogleClient;
use Google\Service\Calendar as GoogleCalendar;
use Twilio\Rest\Client as TwilioClient;

class AppointmentController extends Controller
{
    private function getTwilioClient(): TwilioClient
    {
        return new TwilioClient(
            config('services.twilio.sid'),
            config('services.twilio.token')
        );
    }

    private function getGoogleCalendarClient(Doctor $doctor)
    {
        $client = new GoogleClient();
        $client->setClientId(config('services.google.client_id'));
        $client->setClientSecret(config('services.google.client_secret'));
        $client->setRedirectUri(config('services.google.redirect_uri'));
        $client->addScope(GoogleCalendar::CALENDAR);
        $client->setAccessType('offline');
        $client->setApprovalPrompt('force');

        if ($doctor->google_calendar_token) {
            $client->setAccessToken($doctor->google_calendar_token);
        }

        if ($doctor->google_calendar_refresh_token) {
            $client->refreshToken($doctor->google_calendar_refresh_token);
        }

        return $client;
    }

    public function index(Request $request)
    {
        $user = $request->user();
        
        if ($user instanceof \App\Models\Doctor) {
            $appointments = Appointment::where('doctor_id', $user->id)
                ->with(['patient', 'clinic'])
                ->orderBy('appointment_date', 'asc')
                ->get();
        } else {
            $appointments = Appointment::where('patient_id', $user->id)
                ->with(['doctor', 'clinic'])
                ->orderBy('appointment_date', 'desc')
                ->get();
        }

        return response()->json($appointments);
    }

    public function store(Request $request)
    {
        $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'appointment_date' => 'required|date',
            'reason' => 'nullable|string',
            'clinic_id' => 'nullable|exists:clinics,id',
        ]);

        $patient = $request->user();

        $appointment = Appointment::create([
            'patient_id' => $patient->id,
            'doctor_id' => $request->doctor_id,
            'clinic_id' => $request->clinic_id,
            'appointment_date' => $request->appointment_date,
            'reason' => $request->reason,
            'status' => 'pending',
        ]);

        $appointment->load(['doctor', 'clinic']);

        return response()->json($appointment, 201);
    }

    public function approve(Request $request, $id)
    {
        $doctor = $request->user();
        
        if (!($doctor instanceof \App\Models\Doctor)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $appointment = Appointment::where('id', $id)
            ->where('doctor_id', $doctor->id)
            ->with(['patient', 'doctor', 'clinic'])
            ->firstOrFail();

        if ($appointment->status !== 'pending') {
            return response()->json([
                'message' => 'Appointment cannot be approved. Current status: ' . $appointment->status,
            ], 400);
        }

        $appointment->status = 'approved';
        $appointment->save();

        // Create Google Calendar event
        try {
            if ($doctor->google_calendar_token || $doctor->google_calendar_refresh_token) {
                $client = $this->getGoogleCalendarClient($doctor);
                $calendar = new GoogleCalendar($client);

                $startDateTime = $appointment->appointment_date;
                $endDateTime = (clone $startDateTime)->addHour();

                $patientName = $appointment->patient->name ?? 'Patient';
                $event = new \Google\Service\Calendar\Event([
                    'summary' => "Appointment with {$patientName}",
                    'description' => $appointment->reason ?? 'Medical appointment',
                    'start' => [
                        'dateTime' => $startDateTime->format('Y-m-d\TH:i:s'),
                        'timeZone' => 'UTC',
                    ],
                    'end' => [
                        'dateTime' => $endDateTime->format('Y-m-d\TH:i:s'),
                        'timeZone' => 'UTC',
                    ],
                ]);

                $createdEvent = $calendar->events->insert('primary', $event);
                $appointment->google_calendar_event_id = $createdEvent->getId();
                $appointment->save();
            }
        } catch (\Exception $e) {
            Log::error('Google Calendar Error: ' . $e->getMessage());
        }

        // Send WhatsApp reminder
        try {
            $twilio = $this->getTwilioClient();
            $patientPhone = $appointment->patient->phone;
            $doctorName = $appointment->doctor->name;
            $appointmentDate = $appointment->appointment_date->format('F j, Y \a\t g:i A');
            
            $message = "✅ Your appointment with Dr. {$doctorName} has been approved!\n\n";
            $message .= "📅 Date & Time: {$appointmentDate}\n";
            if ($appointment->clinic) {
                $message .= "📍 Location: {$appointment->clinic->name}\n";
            }
            $message .= "\nWe look forward to seeing you!";

            $twilio->messages->create(
                "whatsapp:{$patientPhone}",
                [
                    'from' => config('services.twilio.whatsapp'),
                    'body' => $message,
                ]
            );
        } catch (\Exception $e) {
            Log::error('Twilio WhatsApp Error: ' . $e->getMessage());
        }

        $appointment->load(['patient', 'doctor', 'clinic']);

        return response()->json([
            'message' => 'Appointment approved successfully',
            'appointment' => $appointment,
        ]);
    }

    public function reject(Request $request, $id)
    {
        $doctor = $request->user();
        
        if (!($doctor instanceof \App\Models\Doctor)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $appointment = Appointment::where('id', $id)
            ->where('doctor_id', $doctor->id)
            ->with(['patient'])
            ->firstOrFail();

        if ($appointment->status !== 'pending') {
            return response()->json([
                'message' => 'Appointment cannot be rejected. Current status: ' . $appointment->status,
            ], 400);
        }

        $appointment->status = 'rejected';
        $appointment->save();

        // Send notification to patient
        try {
            $twilio = $this->getTwilioClient();
            $patientPhone = $appointment->patient->phone;
            $doctorName = $appointment->doctor->name;
            
            $message = "❌ Your appointment request with Dr. {$doctorName} has been rejected.\n\n";
            $message .= "Please contact us to reschedule or choose another time slot.";

            $twilio->messages->create(
                "whatsapp:{$patientPhone}",
                [
                    'from' => config('services.twilio.whatsapp'),
                    'body' => $message,
                ]
            );
        } catch (\Exception $e) {
            Log::error('Twilio WhatsApp Error: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Appointment rejected',
            'appointment' => $appointment,
        ]);
    }

    public function cancel(Request $request, $id)
    {
        $patient = $request->user();
        
        if (!($patient instanceof \App\Models\Patient)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $appointment = Appointment::where('id', $id)
            ->where('patient_id', $patient->id)
            ->firstOrFail();

        if (in_array($appointment->status, ['cancelled', 'completed', 'rejected'])) {
            return response()->json([
                'message' => 'Appointment cannot be cancelled. Current status: ' . $appointment->status,
            ], 400);
        }

        $appointment->status = 'cancelled';
        $appointment->save();

        return response()->json([
            'message' => 'Appointment cancelled successfully',
            'appointment' => $appointment,
        ]);
    }
}

