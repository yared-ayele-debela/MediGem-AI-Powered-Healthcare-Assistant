'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Toast } from '@/components/ui/toast'

interface Appointment {
  id: number
  appointment_date: string
  status: string
  reason: string | null
  doctor: {
    id: number
    name: string
    specialization: string | null
  }
  clinic: {
    id: number
    name: string
  } | null
}

export default function PatientDashboard() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      const token = api.getToken()
      console.log('Loading appointments with token:', token ? token.substring(0, 20) + '...' : 'No token')
      
      const data = await api.get<Appointment[]>('/patient/appointments')
      setAppointments(data)
    } catch (err: any) {
      console.error('Error loading appointments:', err)
      if (err.message.includes('Unauthenticated') || err.message.includes('401')) {
        api.setToken(null)
        router.push('/patient/login')
        return
      }
      setToast({ message: 'Failed to load appointments', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return
    }

    try {
      await api.post(`/appointments/${id}/cancel`)
      setToast({ message: 'Appointment cancelled successfully', type: 'success' })
      loadAppointments()
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to cancel appointment', type: 'error' })
    }
  }

  const handleLogout = () => {
    api.setToken(null)
    router.push('/patient/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-teal-50">
        <div className="text-teal-900">Loading...</div>
      </div>
    )
  }

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.appointment_date) > new Date() && apt.status !== 'cancelled'
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-teal-900">My Appointments</h1>
          <div className="flex gap-2">
            <Link href="/patient/chat">
              <Button className="bg-teal-600 hover:bg-teal-700">AI Assistant</Button>
            </Link>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-teal-900">Upcoming Appointments</CardTitle>
            <CardDescription>{upcomingAppointments.length} appointments scheduled</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-500">No upcoming appointments</p>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 bg-teal-50 rounded-lg border border-teal-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-lg">Dr. {apt.doctor.name}</p>
                        {apt.doctor.specialization && (
                          <p className="text-sm text-gray-600">{apt.doctor.specialization}</p>
                        )}
                        <p className="text-sm text-gray-600 mt-2">
                          {new Date(apt.appointment_date).toLocaleString()}
                        </p>
                        {apt.clinic && (
                          <p className="text-sm text-gray-600">📍 {apt.clinic.name}</p>
                        )}
                        {apt.reason && (
                          <p className="text-sm mt-2 text-gray-700">{apt.reason}</p>
                        )}
                        <span
                          className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                            apt.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : apt.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>
                      {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancel(apt.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-teal-900">All Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3 bg-white rounded-lg border border-gray-200"
                >
                  <p className="font-semibold">Dr. {apt.doctor.name}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(apt.appointment_date).toLocaleString()}
                  </p>
                  <span
                    className={`inline-block mt-1 px-2 py-1 text-xs rounded ${
                      apt.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : apt.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : apt.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

