'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Toast } from '@/components/ui/toast'
import { Phone, Globe, Loader2, UserCircle, AlertCircle, CheckCircle2, Shield } from 'lucide-react'
import Link from 'next/link'

export default function PatientLogin() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+251')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [phoneError, setPhoneError] = useState('')
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const countryCodes = [
    { code: '+251', country: 'Ethiopia', flag: '🇪🇹' },
    { code: '+1', country: 'US/Canada', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
  ]

  useEffect(() => {
    setIsPageLoaded(true)
  }, [])

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '')
    
    // Format based on length
    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
    if (cleaned.length <= 10) return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    
    // If longer than 10 digits, return as is
    return cleaned
  }

  const validatePhone = (phone: string) => {
    const cleanedPhone = phone.replace(/\D/g, '')
    
    if (!phone) {
      setPhoneError('Phone number is required')
      return false
    }
    
    if (cleanedPhone.length < 10) {
      setPhoneError('Please enter a valid phone number (at least 10 digits)')
      return false
    }
    
    setPhoneError('')
    return true
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
    
    if (phoneError) {
      validatePhone(formatted)
    }
  }

  const handlePhoneBlur = () => {
    validatePhone(phone)
    setIsFocused(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePhone(phone)) {
      return
    }
    
    setLoading(true)
    setPhoneError('')

    try {
      const fullPhoneNumber = countryCode + phone.replace(/\D/g, '')
      await api.post('/patient/send-otp', { phone: fullPhoneNumber })
      
      setToast({ 
        message: `OTP sent to ${countryCode} ${formatPhoneNumber(phone)}`, 
        type: 'success' 
      })
      
      setTimeout(() => {
        router.push(`/patient/verify?phone=${encodeURIComponent(fullPhoneNumber)}`)
      }, 1500)
    } catch (err: any) {
      setToast({ 
        message: err.message || 'Failed to send OTP. Please try again.', 
        type: 'error' 
      })
    } finally {
      setLoading(false)
    }
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
              <UserCircle className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Patient Portal</CardTitle>
            <CardDescription className="text-gray-600">Enter your phone number to receive a verification code</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="flex space-x-2">
                  {/* Country Code Selector */}
                  <div className="relative">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full pl-3 pr-8 py-2.5 transition-all duration-200 hover:bg-gray-100"
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <Globe className="h-4 w-4" />
                    </div>
                  </div>
                  
                  {/* Phone Number Input */}
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      onBlur={handlePhoneBlur}
                      onFocus={() => setIsFocused(true)}
                      required
                      placeholder="123-456-7890"
                      className={`pl-10 transition-all duration-200 ${phoneError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-teal-500'} ${isFocused ? 'ring-2 ring-teal-200' : ''}`}
                    />
                  </div>
                </div>
                {phoneError && (
                  <div className="flex items-center mt-1 text-red-500 text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {phoneError}
                  </div>
                )}
              </div>

              {/* Security Notice */}
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 flex items-start space-x-2">
                <Shield className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-teal-700">
                  <p className="font-medium mb-1">Secure Verification</p>
                  <p>We'll send you a one-time password (OTP) to verify your identity. Standard message rates may apply.</p>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white font-medium py-2.5 px-4 rounded-md shadow-md transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Send Verification Code
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-600">
              <p>By continuing, you agree to our</p>
              <div className="flex justify-center space-x-2 mt-1">
                <a href="#" className="font-medium text-teal-600 hover:text-teal-500 transition-colors">
                  Terms of Service
                </a>
                <span className="text-gray-400">and</span>
                <a href="#" className="font-medium text-teal-600 hover:text-teal-500 transition-colors">
                  Privacy Policy
                </a>
              </div>
              <div className="mt-6 text-center text-sm text-gray-600">
                <Link href="/" className="font-medium text-teal-600 hover:text-teal-500 transition-colors">back to home</Link>
              </div>
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