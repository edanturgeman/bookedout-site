'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const input = { width:'100%', padding:'12px', marginBottom:'12px', background:'#181716', border:'1px solid #272523', borderRadius:'6px', color:'#F0EDE8', fontSize:'14px', fontFamily:'inherit' }
const rules = [
  { id:'length',  label:'At least 8 characters',      test: v => v.length >= 8 },
  { id:'upper',   label:'1 uppercase letter',          test: v => /[A-Z]/.test(v) },
  { id:'number',  label:'1 number',                    test: v => /[0-9]/.test(v) },
  { id:'special', label:'1 special character',         test: v => /[^A-Za-z0-9]/.test(v) },
  { id:'spaces',  label:'No spaces',                   test: v => !/\s/.test(v) && v.length > 0 },
]

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({ firstName:'', lastName:'', businessName:'', specialty:'', email:'', password:'', plan:'solo' })
  const [tosChecked, setTosChecked] = useState(true)
  const [showPwRules, setShowPwRules] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const emailValid = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
  const pwValid = v => rules.every(r => r.test(v))

  async function handleSignup() {
    setError('')
    if (!form.firstName.trim()) { setError('First name is required.'); return }
    if (!form.lastName.trim())  { setError('Last name is required.'); return }
    if (!form.businessName.trim()) { setError('Business name is required.'); return }
    if (!form.specialty)        { setError('Please select your specialty.'); return }
    if (!emailValid(form.email)) { setError('Please enter a valid email address.'); return }
    if (!pwValid(form.password)) { setError('Password doesn\'t meet all requirements.'); setShowPwRules(true); return }
    if (!tosChecked)            { setError('You must agree to the Terms of Service.'); return }

    setLoading(true)
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
          business_name: form.businessName,
          specialty: form.specialty,
          plan: form.plan,
        }
      }
    })
    setLoading(false)

    if (signUpError) { setError(signUpError.message); return }
    router.push('/dashboard')
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'48px 24px 64px', minHeight:'100vh', background:'#0A0908', fontFamily:'DM Sans, sans-serif' }}>
      <h1 style={{ color:'#F0EDE8', marginBottom:'8px' }}>Create your account</h1>
      <p style={{ color:'#9B9690', marginBottom:'24px' }}>30 days free — no credit card required</p>

      {error && <p style={{ color:'#B85555', marginBottom:'16px', fontSize:'13px', maxWidth:'400px', textAlign:'center' }}>{error}</p>}

      <div style={{ width:'100%', maxWidth:'400px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'0' }}>
          <input placeholder="First name *" value={form.firstName} onChange={e => set('firstName', e.target.value)} style={input}/>
          <input placeholder="Last name *"  value={form.lastName}  onChange={e => set('lastName',  e.target.value)} style={input}/>
        </div>
        <input placeholder="Business / shop name *" value={form.businessName} onChange={e => set('businessName', e.target.value)} style={input}/>
        <select value={form.specialty} onChange={e => set('specialty', e.target.value)}
          style={{ ...input, cursor:'pointer', color: form.specialty ? '#F0EDE8' : '#5C5955' }}>
          <option value="" disabled>Select your specialty *</option>
          <option value="barber">Barber</option>
          <option value="hair-stylist">Hair Stylist</option>
          <option value="nail-tech">Nail Technician</option>
          <option value="esthetician">Esthetician</option>
          <option value="lash-brow">Lash / Brow Artist</option>
          <option value="spa">Spa / Massage</option>
          <option value="makeup">Makeup Artist</option>
          <option value="shop-owner">Shop / Salon Owner</option>
          <option value="other">Other</option>
        </select>
        <input type="email" placeholder="Email address *" value={form.email} onChange={e => set('email', e.target.value)} style={input}/>
        <input type="password" placeholder="Password *" value={form.password}
          onChange={e => set('password', e.target.value)}
          onFocus={() => setShowPwRules(true)}
          style={input}/>

        {/* Password rules */}
        {showPwRules && (
          <div style={{ background:'#1F1E1C', border:'1px solid #272523', borderRadius:'6px', padding:'12px 14px', marginBottom:'12px' }}>
            {rules.map(r => {
              const passed = r.test(form.password)
              const active = form.password.length > 0
              return (
                <div key={r.id} style={{ display:'flex', gap:'8px', alignItems:'center', fontSize:'12px', marginBottom:'4px',
                  color: passed ? '#4E9B6F' : active ? '#B85555' : '#5C5955' }}>
                  <span>{passed ? '✓' : active ? '✕' : '○'}</span>
                  <span>{r.label}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* Plan selector */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'12px' }}>
          {[{val:'solo',label:'Solo',price:'$14.99/mo'},{val:'shop',label:'Shop Owner',price:'$99.99/mo'}].map(p => (
            <div key={p.val} onClick={() => set('plan', p.val)}
              style={{ padding:'14px', borderRadius:'10px', cursor:'pointer', border:`1px solid ${form.plan === p.val ? 'rgba(201,168,76,0.5)' : '#272523'}`, background: form.plan === p.val ? 'rgba(201,168,76,0.08)' : '#181716' }}>
              <div style={{ fontSize:'13px', fontWeight:'600', color:'#F0EDE8' }}>{p.label}</div>
              <div style={{ fontSize:'12px', color:'#C9A84C' }}>{p.price}</div>
            </div>
          ))}
        </div>

        {/* ToS */}
        <div onClick={() => setTosChecked(t => !t)}
          style={{ display:'flex', gap:'12px', padding:'14px', border:`1px solid ${tosChecked ? 'rgba(201,168,76,0.3)' : '#272523'}`, borderRadius:'6px', marginBottom:'16px', cursor:'pointer', background: tosChecked ? 'rgba(201,168,76,0.05)' : '#181716' }}>
          <div style={{ width:'18px', height:'18px', borderRadius:'4px', border:'1px solid #312F2D', background: tosChecked ? '#C9A84C' : '#1F1E1C', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', color:'#0A0908', flexShrink:0, marginTop:'1px' }}>
            {tosChecked ? '✓' : ''}
          </div>
          <p style={{ fontSize:'12px', color:'#5C5955', lineHeight:'1.55' }}>
            I agree to the BookedOut <a href="/terms" onClick={e => e.stopPropagation()} style={{ color:'#C9A84C' }}>Terms of Service</a> and <a href="/privacy" onClick={e => e.stopPropagation()} style={{ color:'#C9A84C' }}>Privacy Policy</a>.
          </p>
        </div>

        <button onClick={handleSignup} disabled={loading}
          style={{ width:'100%', height:'48px', background:'#C9A84C', color:'#0A0908', border:'none', borderRadius:'6px', fontSize:'14px', fontWeight:'600', cursor:'pointer' }}>
          {loading ? 'Creating account…' : 'Start Free Trial →'}
        </button>

        <p style={{ marginTop:'20px', fontSize:'13px', color:'#5C5955', textAlign:'center' }}>
          Already have an account? <a href="/login" style={{ color:'#C9A84C' }}>Log in →</a>
        </p>
      </div>
    </div>
  )
}