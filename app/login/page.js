'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setError('')
    if (!email || !email.includes('@')) { setError('Please enter a valid email address.'); return }
    if (!password) { setError('Password is required.'); return }

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (error) { setError(error.message); return }
    router.push('/dashboard')
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', padding:'24px', background:'#0A0908', fontFamily:'DM Sans, sans-serif' }}>
      <h1 style={{ color:'#F0EDE8', marginBottom:'8px' }}>Welcome back</h1>
      <p style={{ color:'#9B9690', marginBottom:'24px' }}>Log in to your BookedOut account</p>
      {error && <p style={{ color:'#B85555', marginBottom:'16px', fontSize:'13px' }}>{error}</p>}
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
        style={{ width:'100%', maxWidth:'360px', padding:'12px', marginBottom:'12px', background:'#181716', border:'1px solid #272523', borderRadius:'6px', color:'#F0EDE8', fontSize:'14px' }}/>
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
        style={{ width:'100%', maxWidth:'360px', padding:'12px', marginBottom:'20px', background:'#181716', border:'1px solid #272523', borderRadius:'6px', color:'#F0EDE8', fontSize:'14px' }}/>
      <button onClick={handleLogin} disabled={loading}
        style={{ width:'100%', maxWidth:'360px', height:'46px', background:'#C9A84C', color:'#0A0908', border:'none', borderRadius:'6px', fontSize:'14px', fontWeight:'600', cursor:'pointer' }}>
        {loading ? 'Logging in…' : 'Log In →'}
      </button>
      <p style={{ marginTop:'20px', fontSize:'13px', color:'#5C5955' }}>
        Don't have an account? <a href="/signup" style={{ color:'#C9A84C' }}>Start your free trial →</a>
      </p>
    </div>
  )
}
