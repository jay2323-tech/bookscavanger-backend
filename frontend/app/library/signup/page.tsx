'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import RoleSelector from '@/app/components/RoleSelector'

export default function SignupPage() {
  const router = useRouter()
  const [role, setRole] = useState<'librarian' | 'customer'>('librarian')

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    lat: '',
    lng: '',
  })

  const handleSignup = async () => {
    // Librarian signup → backend
    if (role === 'librarian') {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/auth/signup`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      )

      if (res.ok) router.push('/library/login')
    }

    // Customer signup → placeholder
    if (role === 'customer') {
      router.push('/search')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-8">
        <h1 className="text-2xl font-bold text-[#D4AF37] mb-2">
          Create an Account
        </h1>

        <p className="text-gray-400 text-sm mb-4">
          Select your role to continue
        </p>

        <RoleSelector role={role} setRole={setRole} />

        <input
          placeholder={role === 'librarian' ? 'Library Name' : 'Full Name'}
          className="w-full mb-4 px-4 py-3 rounded bg-gray-800 border border-gray-700"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 rounded bg-gray-800 border border-gray-700"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-3 rounded bg-gray-800 border border-gray-700"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {role === 'librarian' && (
          <>
            <input
              placeholder="Latitude"
              className="w-full mb-4 px-4 py-3 rounded bg-gray-800 border border-gray-700"
              value={form.lat}
              onChange={(e) => setForm({ ...form, lat: e.target.value })}
            />
            <input
              placeholder="Longitude"
              className="w-full mb-6 px-4 py-3 rounded bg-gray-800 border border-gray-700"
              value={form.lng}
              onChange={(e) => setForm({ ...form, lng: e.target.value })}
            />
          </>
        )}

        <button
          onClick={handleSignup}
          className="w-full bg-[#D4AF37] text-black py-3 rounded-lg font-semibold"
        >
          Sign Up
        </button>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link href="/library/login" className="text-[#D4AF37]">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
