# MediGem - Healthcare SaaS Platform

A complete healthcare management platform built with Laravel 11 (API) and Next.js 14, featuring AI-powered appointment booking, OTP authentication, Google Calendar integration, and WhatsApp notifications.

## Tech Stack

- **Backend**: Laravel 11 (API only) with Sanctum authentication
- **Frontend**: Next.js 14 App Router + Tailwind CSS + shadcn/ui
- **Database**: MySQL
- **AI**: Google Gemini 1.5 Pro
- **OTP & WhatsApp**: Twilio
- **Calendar**: Google Calendar API (OAuth2)

## Project Structure

```
medigem/
├── backend/                  ← Laravel 11 API
│   ├── app/Models/
│   ├── app/Http/Controllers/Api/
│   ├── routes/api.php
│   └── database/migrations/
│
├── frontend/                 ← Next.js 14 App Router
│   ├── app/
│   ├── components/ui/
│   └── lib/
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
composer install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Generate application key:
```bash
php artisan key:generate
```

5. Configure your `.env` file with:
   - Database credentials
   - Twilio credentials (TWILIO_SID, TWILIO_TOKEN, TWILIO_PHONE, TWILIO_WHATSAPP)
   - Google Calendar credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI)

6. Run migrations:
```bash
php artisan migrate
```

7. Create a test doctor (optional):
```bash
php artisan tinker
```
Then run:
```php
\App\Models\Doctor::create([
    'name' => 'Dr. Sarah Ahmed',
    'email' => 'sarah@medigem.com',
    'password' => bcrypt('password'),
    'specialization' => 'Cardiologist'
]);
```

8. Start the server:
```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Configure your `.env` file with:
   - `NEXT_PUBLIC_API_URL=http://localhost:8000/api`
   - `GEMINI_API_KEY=your_gemini_api_key`

5. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Features

### Doctor Portal
- Login with email/password
- Dashboard showing today's appointments and pending approvals
- Approve appointments (creates Google Calendar event + sends WhatsApp reminder)
- Reject appointments

### Patient Portal
- Login with phone number + OTP (Twilio SMS/WhatsApp)
- Auto-create patient account if not exists
- Dashboard showing upcoming appointments
- Cancel appointment functionality
- Voice + text chat with Gemini AI
- AI can book appointments naturally ("I want to see Dr Sarah next Tuesday at 10am")

### AI Booking Flow
- Patient chats with AI assistant
- AI detects booking intent
- AI extracts doctor name, date, and time
- Automatically creates appointment via API
- Returns confirmation to patient

## API Endpoints

### Public
- `POST /api/doctor/login` - Doctor login
- `POST /api/patient/send-otp` - Send OTP to patient
- `POST /api/patient/verify-otp` - Verify OTP and get token

### Protected (requires Sanctum token)
- `GET /api/doctor/me` - Get current doctor
- `GET /api/patient/me` - Get current patient
- `GET /api/patient/appointments` - Get patient appointments
- `GET /api/appointments` - Get all appointments (doctor/patient)
- `POST /api/appointments` - Create new appointment
- `POST /api/appointments/{id}/approve` - Approve appointment
- `POST /api/appointments/{id}/reject` - Reject appointment
- `POST /api/appointments/{id}/cancel` - Cancel appointment

## Environment Variables

### Backend (.env)
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=medigem
DB_USERNAME=root
DB_PASSWORD=

TWILIO_SID=your_twilio_account_sid
TWILIO_TOKEN=your_twilio_auth_token
TWILIO_PHONE=your_twilio_phone_number
TWILIO_WHATSAPP=whatsapp:+14155238886

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/google/callback

SANCTUM_STATEFUL_DOMAINS=localhost:3000
```

### Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
GEMINI_API_KEY=your_gemini_api_key_here
```

## Design Themes

- **Patient Portal**: WhatsApp-like green/teal theme
- **Doctor Portal**: Indigo/blue theme
- **Mobile-first**: Responsive design with Tailwind CSS
- **Modern UI**: shadcn/ui components

## Notes

- The application uses Laravel Sanctum for API authentication
- OTP codes are sent via Twilio (SMS/WhatsApp)
- Google Calendar integration requires OAuth2 setup
- Voice recognition uses Web Speech API (Chrome/Edge)
- Text-to-speech uses Web Speech Synthesis API

## License

MIT

