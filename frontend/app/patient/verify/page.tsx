'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Toast } from '@/components/ui/toast'
import { ArrowLeft, Shield, Loader2, CheckCircle2, AlertCircle, RefreshCw, UserCircle, Lock } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function PatientVerify() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') || ''
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    setIsPageLoaded(true)
    if (!phone) {
      router.push('/patient/login')
    }
  }, [phone, router])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const handleOtpChange = (value: string, index: number) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(0, 1)
    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    
    // Handle paste
    if (e.key === 'v' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 6)
        const newOtp = digits.split('').concat(Array(6 - digits.length).fill(''))
        setOtp(newOtp)
        const nextEmptyIndex = newOtp.findIndex(d => d === '') || 5
        inputRefs.current[Math.min(nextEmptyIndex, 5)]?.focus()
      })
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text')
    const digits = text.replace(/\D/g, '').slice(0, 6)
    const newOtp = digits.split('').concat(Array(6 - digits.length).fill(''))
    setOtp(newOtp)
    const nextEmptyIndex = newOtp.findIndex(d => d === '') || 5
    inputRefs.current[Math.min(nextEmptyIndex, 5)]?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpString = otp.join('')
    
    if (otpString.length !== 6) {
      setToast({ message: 'Please enter all 6 digits', type: 'error' })
      return
    }
    
    setLoading(true)

    try {
      const response = await api.post<{ token: string; patient: any }>('/patient/verify-otp', {
        phone,
        otp: otpString,
      })

      if (response && response.token) {
        api.setToken(response.token)
        setToast({ message: 'Verification successful! Redirecting...', type: 'success' })
        await new Promise(resolve => setTimeout(resolve, 1500))
        router.push('/patient/dashboard')
      } else {
        setToast({ message: 'Verification failed. Please try again.', type: 'error' })
      }
    } catch (err: any) {
      setToast({ message: err.message || 'Invalid OTP. Please check and try again.', type: 'error' })
      // Clear OTP on error
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setResendLoading(true)
    
    try {
      await api.post('/patient/send-otp', { phone })
      setToast({ message: 'OTP resent successfully!', type: 'success' })
      setTimeLeft(60)
      setCanResend(false)
      // Clear OTP inputs
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to resend OTP', type: 'error' })
    } finally {
      setResendLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-green-50 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-100 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-100 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-50 rounded-full blur-3xl opacity-30"></div>
      </div>

      {/* Main content */}
      <div className={`relative z-10 w-full max-w-md transition-all duration-700 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-teal-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Verify Your Identity</CardTitle>
            <CardDescription className="text-gray-600">
              Enter the 6-digit code sent to
              <div className="font-semibold text-teal-600 mt-1">{phone}</div>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input Fields */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 text-center">
                  Verification Code
                </label>
                <div className="flex justify-center space-x-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el: HTMLInputElement | null) => { inputRefs.current[index] = el }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className={`w-12 h-12 text-center text-xl font-bold border-2 transition-all duration-200 ${
                        digit 
                          ? 'border-teal-500 bg-teal-50 text-teal-700' 
                          : 'border-gray-300 hover:border-gray-400'
                      } focus:border-teal-500 focus:ring-2 focus:ring-teal-200`}
                      required
                    />
                  ))}
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 flex items-start space-x-2">
                <Shield className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-teal-700">
                  <p className="font-medium">Security Notice</p>
                  <p>This code expires in 10 minutes for your security.</p>
                </div>
              </div>
              
              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white font-medium py-3 px-4 rounded-md shadow-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500" 
                disabled={loading || otp.join('').length !== 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Verify & Continue
                  </>
                )}
              </Button>

              {/* Resend OTP */}
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?
                </p>
                {canResend ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResendOtp}
                    disabled={resendLoading}
                    className="text-teal-600 hover:text-teal-700 font-medium"
                  >
                    {resendLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Resend Code
                      </>
                    )}
                  </Button>
                ) : (
                  <p className="text-sm text-gray-500">
                    Resend available in <span className="font-semibold text-teal-600">{formatTime(timeLeft)}</span>
                  </p>
                )}
              </div>

              {/* Back Button */}
              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push('/patient/login')}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Button>
              </div>
            </form>
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