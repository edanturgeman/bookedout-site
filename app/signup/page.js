'use client'
import { useState } from 'react'
import { createClient } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '', businessName: '', businessType: '',
    plan: 'solo', email: '', password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSignup(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          business_name: formData.businessName,
          business_type: formData.businessType,
          plan: formData.plan
        }
      }
    })

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
          <p className="text-[#7A746D] mt-1 text-sm">Start your 30-day free trial</p>
        </div>

        <div className="bg-[#1C1916] border border-[#2E2925] rounded-2xl p-8">
          <h2 className="text-[#FAF7F2] text-xl font-semibold mb-6">Create your account</h2>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-xl p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-[#7A746D] text-xs uppercase tracking-wide mb-2 block">Your Name</label>
              <input name="fullName" type="text" value={formData.fullName} onChange={handleChange}
                className="w-full bg-[#0F0D0B] border border-[#2E2925] rounded-xl px-4 py-3 text-[#FAF7F2] text-sm focus:outline-none focus:border-[#C4856F]"
                placeholder="Jane Smith" required />
            </div>

            <div>
              <label className="text-[#7A746D] text-xs uppercase tracking-wide mb-2 block">Business Name</label>
              <input name="businessName" type="text" value={formData.businessName} onChange={handleChange}
                className="w-full bg-[#0F0D0B] border border-[#2E2925] rounded-xl px-4 py-3 text-[#FAF7F2] text-sm focus:outline-none focus:border-[#C4856F]"
                placeholder="Glam Studio" required />
            </div>

            <div>
              <label className="text-[#7A746D] text-xs uppercase tracking-wide mb-2 block">Business Type</label>
              <select name="businessType" value={formData.businessType} onChange={handleChange}
                className="w-full bg-[#0F0D0B] border border-[#2E2925] rounded-xl px-4 py-3 text-[#FAF7F2] text-sm focus:outline-none focus:border-[#C4856F]"
                required>
                <option value="">Select your type...</option>
                <option value="barbershop">Barbershop</option>
                <option value="hair_salon">Hair Salon</option>
                <option value="nail_salon">Nail Salon</option>
                <option value="spa">Spa</option>
                <option value="lash_brow">Lash & Brow Studio</option>
                <option value="esthetician">Esthetician</option>
                <option value="independent">Independent / Booth Renter</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-[#7A746D] text-xs uppercase tracking-wide mb-2 block">Plan</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setFormData({...formData, plan: 'solo'})}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${formData.plan === 'solo' ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]' : 'border-[#2E2925] text-[#7A746D]'}`}>
                  Solo / Independent<br/>
                  <span className="text-xs font-normal">$14.99/mo</span>
                </button>
                <button type="button" onClick={() => setFormData({...formData, plan: 'shop'})}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${formData.plan === 'shop' ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-[#C9A84C]' : 'border-[#2E2925] text-[#7A746D]'}`}>
                  Shop Owner<br/>
                  <span className="text-xs font-normal">$99.99/mo</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-[#7A746D] text-xs uppercase tracking-wide mb-2 block">Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange}
                className="w-full bg-[#0F0D0B] border border-[#2E2925] rounded-xl px-4 py-3 text-[#FAF7F2] text-sm focus:outline-none focus:border-[#C4856F]"
                placeholder="you@example.com" required />
            </div>

            <div>
              <label className="text-[#7A746D] text-xs uppercase tracking-wide mb-2 block">Password</label>
              <input name="password" type="password" value={formData.password} onChange={handleChange}
                className="w-full bg-[#0F0D0B] border border-[#2E2925] rounded-xl px-4 py-3 text-[#FAF7F2] text-sm focus:outline-none focus:border-[#C4856F]"
                placeholder="Min. 6 characters" required />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#C4856F] hover:bg-[#b3745e] text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 mt-2">
              {loading ? 'Creating account...' : 'Start Free Trial →'}
            </button>
          </form>

          <p className="text-center text-[#7A746D] text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#C9A84C] hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </main>
  )
}