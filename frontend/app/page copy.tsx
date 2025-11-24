'use client'
import Link from 'next/link'
import { 
  Stethoscope, 
  Heart, 
  Shield, 
  Clock, 
  MessageSquare, 
  FileText, 
  Calendar, 
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Zap,
  Lock,
  Star,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

export default function Home() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const features = [
    { icon: Calendar, title: "Smart Appointment Scheduling", desc: "AI-powered booking with automatic reminders and calendar sync" },
    { icon: MessageSquare, title: "Secure In-App Messaging", desc: "End-to-end encrypted chat and video consultations" },
    { icon: FileText, title: "Digital Health Records", desc: "Centralized, searchable, and shareable medical history" },
    { icon: Smartphone, title: "Mobile-First Experience", desc: "Native apps for iOS & Android with offline support" },
    { icon: Clock, title: "24/7 Virtual Care", desc: "On-demand consultations and prescription refills" },
    { icon: Shield, title: "HIPAA & GDPR Compliant", desc: "Bank-level encryption and full regulatory compliance" }
  ]

  const testimonials = [
    { name: "Dr. Sarah Chen", role: "Cardiologist, NYC", text: "MediGem reduced my no-show rate by 68% and saved me 12 hours per week on admin.", rating: 5 },
    { name: "James Rodriguez", role: "Patient with Diabetes", text: "Finally an app that makes managing my health simple. I can message my doctor anytime.", rating: 5 },
    { name: "Dr. Michael Okonkwo", role: "Clinic Owner, Lagos", text: "Best decision we made. Went from paper records to fully digital in 2 weeks.", rating: 5 }
  ]

  return (
    <>
    <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <nav className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-teal-600 flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">MediGem</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-10">
              <a href="#features" className="text-gray-700 hover:text-indigo-600 font-medium transition">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-indigo-600 font-medium transition">How It Works</a>
              <a href="#testimonials" className="text-gray-700 hover:text-indigo-600 font-medium transition">Testimonials</a>
              <a href="#pricing" className="text-gray-700 hover:text-indigo-600 font-medium transition">Pricing</a>
              <Link
                href="/doctor/login"
                className="text-indigo-600 font-semibold hover:text-indigo-700"
              >
                Doctor Login
              </Link>
              <Link
                href="/patient/login"
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium"
              >
                Patient Login
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2"
            >
              {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-6 py-6 space-y-5">
              <a href="#features" className="block text-lg font-medium text-gray-900">Features</a>
              <a href="#how-it-works" className="block text-lg font-medium text-gray-900">How It Works</a>
              <a href="#testimonials" className="block text-lg font-medium text-gray-900">Testimonials</a>
              <a href="#pricing" className="block text-lg font-medium text-gray-900">Pricing</a>
              <div className="pt-4 space-y-3">
                <Link href="/doctor/login" className="block w-full text-center py-3 border border-indigo-600 text-indigo-600 rounded-xl font-semibold">
                  Doctor Login
                </Link>
                <Link href="/patient/login" className="block w-full text-center py-3 bg-indigo-600 text-white rounded-xl font-semibold">
                  Patient Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
        {/* ===== HERO SECTION ===== */}
        <section className="relative isolate px-6 pt-14 lg:px-8">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-400 to-teal-400 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
          </div>

          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-48">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 mb-8 animate-fade-in">
                <Sparkles className="h-4 w-4" /> The Future of Healthcare is Here
              </div>

              <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl">
                Care Connected.<br />
                <span className="bg-gradient-to-r from-indigo-600 to-teal-600 bg-clip-text text-transparent">
                  Beautifully Simple.
                </span>
              </h1>

              <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-gray-600">
                MediGem is the all-in-one healthcare platform trusted by 50,000+ doctors and 2M+ patients worldwide.
              </p>

              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link
                  href="/doctor/login"
                  className="group relative inline-flex items-center overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-10 py-5 text-lg font-semibold text-white shadow-2xl transition-all hover:scale-105 hover:shadow-indigo-500/25"
                >
                  <Stethoscope className="mr-3 h-6 w-6" />
                  Doctor Login
                  <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform group-hover:translate-x-full" />
                </Link>

                <Link
                  href="/patient/login"
                  className="group relative inline-flex items-center overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 px-10 py-5 text-lg font-semibold text-white shadow-2xl transition-all hover:scale-105 hover:shadow-teal-500/25"
                >
                  <Heart className="mr-3 h-6 w-6" />
                  Patient Login
                  <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform group-hover:translate-x-full" />
                </Link>
              </div>

              <div className="mt-16 flex flex-wrap justify-center gap-10 text-gray-600">
                <div className="flex items-center gap-2"><Shield className="h-6 w-6 text-teal-600" /> HIPAA Compliant</div>
                <div className="flex items-center gap-2"><Users className="h-6 w-6 text-indigo-600" /> 50K+ Providers</div>
                <div className="flex items-center gap-2"><Star className="h-6 w-6 text-yellow-500" /> 4.9/5 Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FEATURES SECTION ===== */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900">Everything You Need in One Platform</h2>
              <p className="mt-4 text-xl text-gray-600">Powerful tools designed for modern healthcare</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <div key={i} className="group relative p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <feature.icon className="h-12 w-12 text-indigo-600 mb-6" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="py-24 bg-gradient-to-b from-indigo-50 to-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900">Get Started in Minutes</h2>
              <p className="mt-4 text-xl text-gray-600">Simple onboarding for doctors and patients</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white text-2xl font-bold mb-6">1</div>
                <h3 className="text-2xl font-semibold mb-4">Sign Up Free</h3>
                <p className="text-gray-600">Create your doctor or patient account in under 60 seconds</p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-600 text-white text-2xl font-bold mb-6">2</div>
                <h3 className="text-2xl font-semibold mb-4">Connect & Verify</h3>
                <p className="text-gray-600">Securely link your practice or upload ID for instant access</p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white text-2xl font-bold mb-6">3</div>
                <h3 className="text-2xl font-semibold mb-4">Start Caring</h3>
                <p className="text-gray-600">Book appointments, message, and manage health — all in one place</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section className="py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900">Loved by Doctors & Patients</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                  <div className="flex mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-6">"{t.text}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="py-32 bg-gradient-to-r from-indigo-600 to-teal-600">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8">
              Ready to Transform Healthcare Delivery?
            </h2>
            <p className="text-xl text-indigo-100 mb-12 max-w-3xl mx-auto">
              Join thousands of practices already saving time and improving patient outcomes with MediGem.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/doctor/login"
                className="inline-flex items-center px-10 py-5 bg-white text-indigo-700 font-bold text-lg rounded-2xl hover:bg-gray-100 transition shadow-xl"
              >
                Start Free as Doctor <ChevronRight className="ml-2 h-6 w-6" />
              </Link>
              <Link
                href="/patient/login"
                className="inline-flex items-center px-10 py-5 bg-transparent border-3 border-white text-white font-bold text-lg rounded-2xl hover:bg-white/10 transition backdrop-blur"
              >
                Join as Patient <ChevronRight className="ml-2 h-6 w-6" />
              </Link>
            </div>

            <p className="mt-8 text-indigo-200">No credit card required • Free forever for patients</p>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="bg-gray-900 text-gray-400 py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              <div className="col-span-2 md:col-span-1">
                <h3 className="text-2xl font-bold text-white mb-4">MediGem</h3>
                <p className="text-sm">Healthcare, reimagined.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white">Features</a></li>
                  <li><a href="#" className="hover:text-white">Pricing</a></li>
                  <li><a href="#" className="hover:text-white">Security</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white">About</a></li>
                  <li><a href="#" className="hover:text-white">Blog</a></li>
                  <li><a href="#" className="hover:text-white">Careers</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Support</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white">Help Center</a></li>
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                  <li><a href="#" className="hover:text-white">Status</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white">Privacy</a></li>
                  <li><a href="#" className="hover:text-white">Terms</a></li>
                  <li><a href="#" className="hover:text-white">HIPAA</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
              © 2025 MediGem Health Inc. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}