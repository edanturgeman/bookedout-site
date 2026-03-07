'use client'
import { useState } from 'react'
import { createClient } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <main className="min-h-screen bg-[#0F0D0B] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#FAF7F2]">Booked<span className="text-[#C9A84C]">Out</span></h1>
          <p className="text-[#7A746D] mt-1 text-sm">Welcome back</p>
        </div>

        <div className="bg-[#1C1916] border border-[#2E2925] rounded-2xl p-8">
          <h2 className="text-[#FAF7F2] text-xl font-semibold mb-6">Log in to your account</h2>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-xl p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[#7A746D] text-xs uppercase tracking-wide mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#0F0D0B] border border-[#2E2925] rounded-xl px-4 py-3 text-[#FAF7F2] text-sm focus:outline-none focus:border-[#C4856F]"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="text-[#7A746D] text-xs uppercase tracking-wide mb-2 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#0F0D0B] border border-[#2E2925] rounded-xl px-4 py-3 text-[#FAF7F2] text-sm focus:outline-none focus:border-[#C4856F]"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C4856F] hover:bg-[#b3745e] text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="text-center text-[#7A746D] text-sm mt-6">
            Don't have an account?{' '}
            <Link href="/signup" className="text-[#C9A84C] hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
    </main>
  )
}