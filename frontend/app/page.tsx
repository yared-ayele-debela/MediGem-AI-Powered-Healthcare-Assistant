'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  Heart, 
  Users, 
  Shield, 
  Clock, 
  Activity, 
  Calendar,
  CheckCircle,
  ChevronRight,
  Star,
  Menu,
  X,
  Stethoscope,
  UserCheck,
  FileText,
  Video,
  Smartphone,
  Lock,
  TrendingUp,
  Award,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from 'lucide-react'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeTab, setActiveTab] = useState('doctors')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: <Video className="h-6 w-6" />,
      title: "Virtual Consultations",
      description: "Connect with healthcare providers from the comfort of your home through secure video calls."
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Easy Appointment Booking",
      description: "Schedule appointments with just a few clicks. Receive reminders and manage your calendar."
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Digital Health Records",
      description: "Access your medical history, test results, and prescriptions anytime, anywhere."
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Mobile Health Tracking",
      description: "Monitor your health metrics and receive personalized insights through our mobile app."
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Secure & HIPAA Compliant",
      description: "Your health data is protected with enterprise-grade security and encryption."
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Health Analytics",
      description: "Track your health progress with detailed analytics and personalized recommendations."
    }
  ]

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Cardiologist",
      content: "MediGem has transformed how I manage my practice. The platform is intuitive and saves me hours of administrative work.",
      rating: 5,
      avatar: "/doctor-avatar-1.jpg"
    },
    {
      name: "Michael Chen",
      role: "Patient",
      content: "I love being able to consult with my doctor without taking time off work. The app is user-friendly and reliable.",
      rating: 5,
      avatar: "/patient-avatar-1.jpg"
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Pediatrician",
      content: "The patient portal has improved communication with my patients' families. It's secure and easy to use.",
      rating: 5,
      avatar: "/doctor-avatar-2.jpg"
    }
  ]

  const faqs = [
    {
      question: "Is MediGem HIPAA compliant?",
      answer: "Yes, MediGem is fully HIPAA compliant. We use industry-standard encryption and security protocols to protect all patient data."
    },
    {
      question: "Can I use MediGem on my mobile device?",
      answer: "Absolutely! MediGem is fully responsive and works on all devices. We also offer dedicated iOS and Android apps for an optimized mobile experience."
    },
    {
      question: "How do virtual consultations work?",
      answer: "Virtual consultations are conducted through our secure video platform. Simply book an appointment, and at the scheduled time, click the link in your confirmation email to join the video call."
    },
    {
      question: "Can multiple doctors access a patient's records?",
      answer: "With patient consent, multiple healthcare providers can access relevant medical records. This ensures coordinated care while maintaining patient privacy."
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Heart className="h-8 w-8 text-indigo-600 mr-2" />
                <span className="text-2xl font-bold text-indigo-900">MediGem</span>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#features" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition">Features</a>
                <a href="#how-it-works" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition">How It Works</a>
                <a href="#testimonials" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition">Testimonials</a>
                <a href="#pricing" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition">Pricing</a>
                <a href="#faq" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition">FAQ</a>
              </div>
            </div>
            
            <div className="hidden md:block">
              <Link
                href="/doctor/login"
                className="mr-3 px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition"
              >
                Doctor Login
              </Link>
              <Link
                href="/patient/login"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Patient Login
              </Link>
            </div>
            
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-indigo-600 p-2"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#features" className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">How It Works</a>
              <a href="#testimonials" className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">Testimonials</a>
              <a href="#pricing" className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">Pricing</a>
              <a href="#faq" className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">FAQ</a>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <Link
                  href="/doctor/login"
                  className="block px-3 py-2 text-indigo-600 border border-indigo-600 rounded-lg text-center mb-2"
                >
                  Doctor Login
                </Link>
                <Link
                  href="/patient/login"
                  className="block px-3 py-2 bg-indigo-600 text-white rounded-lg text-center"
                >
                  Patient Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-200 rounded-full blur-3xl opacity-70"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-70"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto p-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-indigo-900 mb-6">
              Modern Healthcare Management
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-10">
              MediGem is a comprehensive healthcare SaaS platform that connects patients with healthcare providers, 
              streamlining appointments, records, and consultations for better health outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/doctor/login"
                className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center"
              >
                <Stethoscope className="mr-2 h-5 w-5" />
                Doctor Portal
              </Link>
              <Link
                href="/patient/login"
                className="px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center justify-center"
              >
                <UserCheck className="mr-2 h-5 w-5" />
                Patient Portal
              </Link>
            </div>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-md">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">10,000+</h3>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div className="text-center">
              <div className="bg-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-md">
                <Shield className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% HIPAA</h3>
              <p className="text-gray-600">Compliant</p>
            </div>
            <div className="text-center">
              <div className="bg-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-md">
                <Clock className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7</h3>
              <p className="text-gray-600">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage healthcare efficiently in one platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="bg-indigo-100 p-3 rounded-lg w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started with MediGem in just a few simple steps
            </p>
          </div>
          
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setActiveTab('doctors')}
                className={`px-4 py-2 rounded-md ${activeTab === 'doctors' ? 'bg-indigo-600 text-white' : 'text-gray-700'}`}
              >
                For Doctors
              </button>
              <button
                onClick={() => setActiveTab('patients')}
                className={`px-4 py-2 rounded-md ${activeTab === 'patients' ? 'bg-indigo-600 text-white' : 'text-gray-700'}`}
              >
                For Patients
              </button>
            </div>
          </div>
          
          {activeTab === 'doctors' ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-indigo-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Create Account</h3>
                <p className="text-gray-600">Sign up and verify your credentials</p>
              </div>
              <div className="text-center">
                <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-indigo-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Set Up Profile</h3>
                <p className="text-gray-600">Add your specialization and availability</p>
              </div>
              <div className="text-center">
                <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-indigo-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Accept Appointments</h3>
                <p className="text-gray-600">Review and confirm patient requests</p>
              </div>
              <div className="text-center">
                <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-indigo-600">4</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Consult & Treat</h3>
                <p className="text-gray-600">Conduct virtual or in-person consultations</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-teal-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-teal-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
                <p className="text-gray-600">Create your account with basic details</p>
              </div>
              <div className="text-center">
                <div className="bg-teal-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-teal-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Find Doctors</h3>
                <p className="text-gray-600">Search by specialty, location, or availability</p>
              </div>
              <div className="text-center">
                <div className="bg-teal-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-teal-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Book Appointment</h3>
                <p className="text-gray-600">Select a time slot and confirm your booking</p>
              </div>
              <div className="text-center">
                <div className="bg-teal-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-teal-600">4</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Consultation</h3>
                <p className="text-gray-600">Connect with your doctor virtually or in-person</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from doctors and patients who use MediGem
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="bg-gray-200 rounded-full w-12 h-12 mr-4 flex items-center justify-center">
                    {testimonial.role.includes('Doctor') ? 
                      <Stethoscope className="h-6 w-6 text-gray-600" /> : 
                      <UserCheck className="h-6 w-6 text-gray-600" />
                    }
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that works best for you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold mb-4">Basic</h3>
              <p className="text-3xl font-bold mb-6">Free</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Up to 5 appointments per month</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Basic profile features</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Email support</span>
                </li>
              </ul>
              <Link
                href="/patient/login"
                className="block w-full text-center px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
              >
                Get Started
              </Link>
            </div>
            
            <div className="bg-indigo-600 text-white rounded-xl p-8 transform md:scale-105 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Professional</h3>
                <span className="bg-white text-indigo-600 text-xs font-bold px-2 py-1 rounded">POPULAR</span>
              </div>
              <p className="text-3xl font-bold mb-6">$29<span className="text-lg font-normal">/month</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <span>Unlimited appointments</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <span>Advanced profile features</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-white mr-2 flex-shrink-0 mt-0.5" />
                  <span>Analytics dashboard</span>
                </li>
              </ul>
              <Link
                href="/doctor/login"
                className="block w-full text-center px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition"
              >
                Get Started
              </Link>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold mb-4">Enterprise</h3>
              <p className="text-3xl font-bold mb-6">Custom</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Everything in Professional</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>SLA guarantee</span>
                </li>
              </ul>
              <Link
                href="/contact"
                className="block w-full text-center px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Got questions? We've got answers.
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Contact Support
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-xl text-white mb-8">
            Join thousands of doctors and patients who trust MediGem for their healthcare needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/doctor/login"
              className="px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition flex items-center justify-center"
            >
              <Stethoscope className="mr-2 h-5 w-5" />
              Doctor Portal
            </Link>
            <Link
              href="/patient/login"
              className="px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center justify-center"
            >
              <UserCheck className="mr-2 h-5 w-5" />
              Patient Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Heart className="h-8 w-8 text-indigo-400 mr-2" />
                <span className="text-2xl font-bold text-white">MediGem</span>
              </div>
              <p className="text-gray-400">
                Modern healthcare management platform connecting patients with providers.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">HIPAA Compliance</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} MediGem. All rights reserved.
            </p>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}