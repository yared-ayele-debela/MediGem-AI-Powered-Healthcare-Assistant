# MediGem Setup Guide

## Quick Start

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+
- Twilio Account (for OTP & WhatsApp)
- Google Cloud Project (for Gemini AI & Calendar API)

### Backend Setup

1. **Install Dependencies**
```bash
cd backend
composer install
```

2. **Environment Configuration**
```bash
cp .env.example .env
php artisan key:generate
```

3. **Configure .env**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=medigem
DB_USERNAME=root
DB_PASSWORD=your_password

TWILIO_SID=your_twilio_account_sid
TWILIO_TOKEN=your_twilio_auth_token
TWILIO_PHONE=+1234567890
TWILIO_WHATSAPP=whatsapp:+14155238886

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/google/callback

SANCTUM_STATEFUL_DOMAINS=localhost:3000
```

4. **Run Migrations & Seeders**
```bash
php artisan migrate
php artisan db:seed
```

This creates 3 test doctors:
- Dr. Sarah Ahmed (sarah@medigem.com / password)
- Dr. John Smith (john@medigem.com / password)
- Dr. Emily Johnson (emily@medigem.com / password)

5. **Start Server**
```bash
php artisan serve
```

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env
```

3. **Configure .env**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
GEMINI_API_KEY=your_gemini_api_key
```

4. **Start Development Server**
```bash
npm run dev
```

## Testing the Application

### Doctor Portal
1. Go to http://localhost:3000/doctor/login
2. Login with: sarah@medigem.com / password
3. View dashboard with appointments

### Patient Portal
1. Go to http://localhost:3000/patient/login
2. Enter phone number (e.g., +1234567890)
3. Enter OTP (check Twilio or console logs in dev mode)
4. Access dashboard and AI chat

### AI Chat Booking
1. Login as patient
2. Go to AI Assistant
3. Try: "I want to book an appointment with Dr. Sarah Ahmed next Tuesday at 10am"
4. AI will process and create appointment

## API Testing

Use the following endpoints:

**Doctor Login:**
```bash
curl -X POST http://localhost:8000/api/doctor/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sarah@medigem.com","password":"password"}'
```

**Patient OTP:**
```bash
curl -X POST http://localhost:8000/api/patient/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"+1234567890"}'
```

**Verify OTP:**
```bash
curl -X POST http://localhost:8000/api/patient/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"+1234567890","otp":"123456"}'
```

## Troubleshooting

### CORS Issues
- Ensure `SANCTUM_STATEFUL_DOMAINS` includes `localhost:3000`
- Check `config/cors.php` settings

### Twilio Not Working
- Verify credentials in `.env`
- Check Twilio console for logs
- In development, OTP may be logged to console

### Google Calendar Not Working
- Complete OAuth2 setup in Google Cloud Console
- Add redirect URI to Google OAuth credentials
- Doctor must authorize calendar access first

### Gemini AI Errors
- Verify API key is set in frontend `.env`
- Check Google Cloud Console for quota/limits
- Ensure model name is correct (gemini-1.5-pro)

## Production Deployment

1. Set `APP_ENV=production` and `APP_DEBUG=false`
2. Use proper database credentials
3. Configure HTTPS for both frontend and backend
4. Update CORS and Sanctum domains
5. Set up proper session storage
6. Configure queue workers for background jobs
7. Set up proper logging and monitoring

