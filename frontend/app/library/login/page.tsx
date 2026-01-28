'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import RoleSelector from '@/app/components/RoleSelector'

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState<'librarian' | 'customer'>('librarian')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)

    // Librarian → backend auth
    if (role === 'librarian') {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      )

      if (res.ok) router.push('/library/dashboard')
    }

    // Customer → placeholder (future)
    if (role === 'customer') {
      router.push('/search')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-8">
        <h1 className="text-2xl font-bold text-[#D4AF37] mb-2">
          Login to BookScavenger
        </h1>

        <p className="text-gray-400 text-sm mb-4">
          Choose how you want to continue
        </p>

        <RoleSelector role={role} setRole={setRole} />

        <input
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 rounded bg-gray-800 border border-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-3 rounded bg-gray-800 border border-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#D4AF37] text-black py-3 rounded-lg font-semibold"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don’t have an account?{' '}
          <Link href="/library/signup" className="text-[#D4AF37]">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
