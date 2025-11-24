'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Toast } from '@/components/ui/toast'

interface Appointment {
  id: number
  appointment_date: string
  status: string
  reason: string | null
  patient: {
    id: number
    name: string | null
    phone: string
  }
  clinic: {
    id: number
    name: string
  } | null
}

export default function DoctorDashboard() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      const data = await api.get<Appointment[]>('/appointments')
      setAppointments(data)
    } catch (err: any) {
      if (err.message.includes('Unauthenticated')) {
        router.push('/doctor/login')
      }
      setToast({ message: 'Failed to load appointments', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: number) => {
    try {
      const token = api.getToken()
      await fetch('/api/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, token }),
      })
      setToast({ message: 'Appointment approved successfully!', type: 'success' })
      loadAppointments()
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to approve appointment', type: 'error' })
    }
  }

  const handleReject = async (id: number) => {
    try {
      const token = api.getToken()
      await fetch('/api/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, token }),
      })
      setToast({ message: 'Appointment rejected', type: 'success' })
      loadAppointments()
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to reject appointment', type: 'error' })
    }
  }

  const handleLogout = () => {
    api.setToken(null)
    router.push('/doctor/login')
  }

  const today = new Date().toISOString().split('T')[0]
  const todayAppointments = appointments.filter(
    (apt) => apt.appointment_date.startsWith(today) && apt.status === 'approved'
  )
  const pendingAppointments = appointments.filter((apt) => apt.status === 'pending')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-50">
        <div className="text-indigo-900">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900">Doctor Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-indigo-900">Today&apos;s Appointments</CardTitle>
              <CardDescription>{todayAppointments.length} appointments scheduled</CardDescription>
            </CardHeader>
            <CardContent>
              {todayAppointments.length === 0 ? (
                <p className="text-gray-500">No appointments scheduled for today</p>
              ) : (
                <div className="space-y-3">
                  {todayAppointments.map((apt) => (
                    <div key={apt.id} className="p-3 bg-indigo-50 rounded-lg">
                      <p className="font-semibold">{apt.patient.name || apt.patient.phone}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(apt.appointment_date).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-indigo-900">Pending Approvals</CardTitle>
              <CardDescription>{pendingAppointments.length} requests waiting</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingAppointments.length === 0 ? (
                <p className="text-gray-500">No pending appointments</p>
              ) : (
                <div className="space-y-3">
                  {pendingAppointments.map((apt) => (
                    <div key={apt.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="font-semibold">{apt.patient.name || apt.patient.phone}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(apt.appointment_date).toLocaleString()}
                      </p>
                      {apt.reason && <p className="text-sm mt-1">{apt.reason}</p>}
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(apt.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(apt.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-indigo-900">All Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 bg-white rounded-lg border border-gray-200 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{apt.patient.name || apt.patient.phone}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(apt.appointment_date).toLocaleString()}
                    </p>
                    <span
                      className={`inline-block mt-1 px-2 py-1 text-xs rounded ${
                        apt.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : apt.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
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

