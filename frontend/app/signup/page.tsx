'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LibrarySignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    lat: '',
    lng: '',
  })

  const handleSignup = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/auth/signup`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      }
    )

    if (res.ok) {
      router.push('/library/login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-8">
        <h1 className="text-2xl font-bold text-[#D4AF37] mb-2">
          Register Your Library
        </h1>
        <p className="text-gray-400 mb-6 text-sm">
          Join BookScavenger as a library partner
        </p>

        {['name', 'email', 'password', 'lat', 'lng'].map((field) => (
          <input
            key={field}
            type={field === 'password' ? 'password' : 'text'}
            placeholder={field.toUpperCase()}
            className="w-full mb-4 px-4 py-3 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-[#D4AF37] outline-none"
            value={(form as any)[field]}
            onChange={(e) =>
              setForm({ ...form, [field]: e.target.value })
            }
          />
        ))}

        <button
          onClick={handleSignup}
          className="w-full bg-[#D4AF37] text-black py-3 rounded-lg font-semibold hover:opacity-90"
        >
          Create Account
        </button>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already registered?{' '}
          <Link href="/library/login" className="text-[#D4AF37]">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
