// app/api/gemini/route.ts — FINAL PRODUCTION VERSION
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Helper: Safely parse and fix dates from Gemini
function parseGeminiDate(dateStr: string): string {
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  const lower = dateStr.toLowerCase().trim()

  if (lower.includes('today')) return today
  if (lower.includes('tomorrow')) return tomorrowStr

  // Match YYYY-MM-DD
  const isoMatch = dateStr.match(/\d{4}-\d{2}-\d{2}/)
  if (isoMatch) return isoMatch[0]

  // Fallback: use today
  return today
}

// Helper: Safely parse time (10am, 2:30pm, 14:00 → 14:00)
function parseGeminiTime(timeStr: string): string {
  const match = timeStr.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i)
  if (!match) return '10:00' // safe default

  let hours = parseInt(match[1])
  const minutes = match[2] || '00'
  const period = match[3]?.toLowerCase()

  if (period === 'pm' && hours !== 12) hours += 12
  if (period === 'am' && hours === 12) hours = 0

  return `${hours.toString().padStart(2, '0')}:${minutes}`
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash-lite', // Faster & cheaper than pro
      generationConfig: { temperature: 0.7, maxOutputTokens: 300 }
    })

    const now = new Date()
    const currentDate = now.toISOString().split('T')[0]
    const currentDayName = now.toLocaleDateString('en-US', { weekday: 'long' })

    const prompt = `You are MediGem AI, a friendly healthcare assistant.

Current date: ${currentDate} (${currentDayName})

Available doctors:
- Dr. Sarah Ahmed (Cardiologist, ID: 1)
- Dr. John Smith (General Practitioner, ID: 2)
- Dr. Emily Johnson (Pediatrician, ID: 3)

User message: "${message}"

If the patient wants to book an appointment:
→ Respond normally AND end your message with this exact line:
BOOK_APPOINTMENT:Dr. Sarah Ahmed:1:2025-12-10:10:30:General checkup

Use real future dates in YYYY-MM-DD and time in 24-hour HH:MM format.
NEVER use words like "today", "tomorrow", "next Tuesday" in the BOOK_APPOINTMENT line.

Otherwise, just respond helpfully.`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Extract booking intent
    const bookingMatch = text.match(/BOOK_APPOINTMENT:([^:]+):(\d+):([^:]+):([^:]+):(.+)/)
    
    if (bookingMatch) {
      const [, rawDoctorName, doctorId, rawDate, rawTime, reason] = bookingMatch

      const doctorName = rawDoctorName.trim()
      const date = parseGeminiDate(rawDate.trim())
      const time = parseGeminiTime(rawTime.trim())

      // Build safe ISO string
      const dateTime = `${date}T${time}:00.000Z`

      // Clean response (remove the BOOK_APPOINTMENT line)
      const cleanResponse = text.split('BOOK_APPOINTMENT:')[0].trim()

      return NextResponse.json({
        response: cleanResponse || `I've booked your appointment with ${doctorName} on ${date} at ${time}!`,
        bookingIntent: true,
        bookingData: {
          doctorId: parseInt(doctorId),
          doctorName,
          date,
          time,
          dateTime,
          reason: reason.trim(),
        },
      })
    }

    return NextResponse.json({
      response: text,
      bookingIntent: false,
    })

  } catch (error: any) {
    console.error('Gemini API Error:', error.message)
    return NextResponse.json(
      { 
        response: "I'm having a small issue right now. Please try saying: 'Book Dr. Sarah tomorrow at 10 AM'", 
        bookingIntent: false 
      },
      { status: 200 } // Don't return 500 — keep chat alive
    )
  }
}