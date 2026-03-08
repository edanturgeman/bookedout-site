'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const rules = [
  { id:'length',  label:'At least 8 characters',     test: v => v.length >= 8 },
  { id:'upper',   label:'1 uppercase letter',         test: v => /[A-Z]/.test(v) },
  { id:'number',  label:'1 number',                   test: v => /[0-9]/.test(v) },
  { id:'special', label:'1 special character',        test: v => /[^A-Za-z0-9]/.test(v) },
  { id:'spaces',  label:'No spaces',                  test: v => !/\s/.test(v) && v.length > 0 },
]

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ firstName:'', lastName:'', businessName:'', specialty:'', email:'', password:'', plan:'solo' })
  const [tosChecked, setTosChecked] = useState(true)
  const [showPwRules, setShowPwRules] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const emailValid = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
  const pwValid = v => rules.every(r => r.test(v))

  async function handleSignup() {
    setError('')
    if (!form.firstName.trim())    { setError('First name is required.'); return }
    if (!form.lastName.trim())     { setError('Last name is required.'); return }
    if (!form.businessName.trim()) { setError('Business name is required.'); return }
    if (!form.specialty)           { setError('Please select your specialty.'); return }
    if (!emailValid(form.email))   { setError('Please enter a valid email address.'); return }
    if (!pwValid(form.password))   { setError("Password doesn't meet all requirements."); setShowPwRules(true); return }
    if (!tosChecked)               { setError('You must agree to the Terms of Service.'); return }

    setLoading(true)
    const { error: signUpError } = await supabase.auth.signUp({
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
    setSuccess(true)
    setTimeout(() => router.push('/dashboard'), 2200)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html, body { background:#0A0908; }
        body { font-family:'DM Sans',sans-serif; -webkit-font-smoothing:antialiased; }
        .page { display:flex; flex-direction:column; align-items:center; padding:48px 24px 64px; min-height:100vh; background:#0A0908; position:relative; overflow-x:hidden; }
        .page::before { content:''; position:fixed; inset:0; pointer-events:none; background:radial-gradient(ellipse 60% 50% at 50% -10%, rgba(201,168,76,0.08) 0%, transparent 65%), radial-gradient(ellipse 40% 40% at 10% 90%, rgba(201,168,76,0.04) 0%, transparent 60%); }
        .card { position:relative; z-index:1; width:100%; max-width:480px; animation:fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .logo-wrap { text-align:center; margin-bottom:28px; }
        .logo { font-family:'Cormorant Garamond',serif; font-size:28px; color:#F0EDE8; text-decoration:none; letter-spacing:0.01em; }
        .logo em { color:#C9A84C; font-style:italic; }
        .logo-tagline { font-size:12px; color:#5C5955; letter-spacing:0.12em; text-transform:uppercase; margin-top:4px; }
        .trial-badge { display:flex; align-items:center; justify-content:center; gap:8px; padding:10px 20px; background:rgba(201,168,76,0.08); border:1px solid rgba(201,168,76,0.2); border-radius:10px; margin-bottom:20px; }
        .trial-badge-text { font-size:12px; color:#C9A84C; font-weight:500; }
        .form-box { background:#111010; border:1px solid #272523; border-radius:16px; padding:36px; }
        .form-title { font-family:'Cormorant Garamond',serif; font-size:26px; color:#F0EDE8; margin-bottom:6px; text-align:center; }
        .form-sub { font-size:13px; color:#5C5955; text-align:center; margin-bottom:28px; }
        .btn-google { display:flex; align-items:center; justify-content:center; gap:10px; width:100%; height:44px; background:#181716; border:1px solid #312F2D; border-radius:6px; font-size:13px; font-weight:500; color:#9B9690; cursor:pointer; transition:all 0.15s; font-family:'DM Sans',sans-serif; text-decoration:none; }
        .btn-google:hover { background:#1F1E1C; color:#F0EDE8; }
        .divider { display:flex; align-items:center; gap:12px; margin:20px 0; }
        .divider-line { flex:1; height:1px; background:#272523; }
        .divider-text { font-size:11px; color:#5C5955; letter-spacing:0.06em; white-space:nowrap; }
        .section-label { font-size:10px; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:#5C5955; margin:24px 0 14px; display:flex; align-items:center; gap:10px; }
        .section-label::after { content:''; flex:1; height:1px; background:#272523; }
        .field { margin-bottom:14px; }
        .field-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px; }
        .field-label { display:block; font-size:12px; font-weight:500; color:#9B9690; margin-bottom:7px; }
        .req { color:#C9A84C; margin-left:2px; font-size:11px; }
        .field-input { width:100%; height:44px; padding:0 14px; background:#181716; border:1px solid #272523; border-radius:6px; font-size:14px; color:#F0EDE8; font-family:'DM Sans',sans-serif; outline:none; transition:border-color 0.15s, box-shadow 0.15s; }
        .field-input::placeholder { color:#5C5955; }
        .field-input:focus { border-color:#C9A84C; background:#1F1E1C; box-shadow:0 0 0 3px rgba(201,168,76,0.1); }
        .field-input.error { border-color:#B85555; }
        select.field-input { cursor:pointer; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235C5955' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 14px center; padding-right:36px; }
        select.field-input option { background:#181716; color:#F0EDE8; }
        .pw-wrap { position:relative; }
        .pw-wrap .field-input { padding-right:44px; }
        .pw-toggle { position:absolute; right:0; top:0; height:44px; width:44px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#5C5955; background:none; border:none; font-size:13px; transition:color 0.12s; }
        .pw-toggle:hover { color:#9B9690; }
        .pw-rules { display:flex; flex-direction:column; gap:5px; margin-top:10px; padding:12px 14px; background:#1F1E1C; border:1px solid #272523; border-radius:6px; }
        .pw-rule { display:flex; align-items:center; gap:8px; font-size:12px; color:#5C5955; transition:color 0.15s; }
        .pw-rule.pass { color:#4E9B6F; }
        .pw-rule.fail { color:#B85555; }
        .plan-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px; }
        .plan-card { padding:14px 16px; border-radius:10px; cursor:pointer; border:1px solid #272523; background:#181716; transition:all 0.15s; }
        .plan-card.selected { border-color:rgba(201,168,76,0.5); background:rgba(201,168,76,0.08); }
        .plan-name { font-size:13px; font-weight:600; color:#F0EDE8; margin-bottom:2px; }
        .plan-price { font-size:12px; color:#C9A84C; }
        .tos-row { display:flex; gap:12px; padding:14px; border:1px solid #272523; border-radius:6px; margin-bottom:16px; cursor:pointer; background:#181716; transition:all 0.15s; }
        .tos-row.checked { border-color:rgba(201,168,76,0.3); background:rgba(201,168,76,0.05); }
        .tos-check { width:18px; height:18px; border-radius:4px; border:1px solid #312F2D; background:#1F1E1C; display:flex; align-items:center; justify-content:center; font-size:10px; color:#0A0908; flex-shrink:0; margin-top:1px; transition:all 0.15s; }
        .tos-check.checked { background:#C9A84C; border-color:#C9A84C; }
        .tos-text { font-size:12px; color:#5C5955; line-height:1.55; }
        .tos-text a { color:#C9A84C; text-decoration:none; }
        .tos-text a:hover { text-decoration:underline; }
        .error-msg { font-size:12px; color:#B85555; margin-bottom:14px; text-align:center; padding:10px 14px; background:rgba(184,85,85,0.08); border:1px solid rgba(184,85,85,0.2); border-radius:6px; }
        .btn-submit { width:100%; height:48px; background:#C9A84C; color:#0A0908; border:none; border-radius:6px; font-size:14px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all 0.15s; display:flex; align-items:center; justify-content:center; gap:8px; }
        .btn-submit:hover:not(:disabled) { background:#D4B558; box-shadow:0 6px 24px rgba(201,168,76,0.3); transform:translateY(-1px); }
        .btn-submit:disabled { opacity:0.45; cursor:not-allowed; }
        .spinner { width:14px; height:14px; border-radius:50%; border:2px solid rgba(10,9,8,0.3); border-top-color:#0A0908; animation:spin 0.7s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .form-footer { text-align:center; margin-top:20px; font-size:13px; color:#5C5955; }
        .form-footer a { color:#C9A84C; text-decoration:none; font-weight:500; }
        .form-footer a:hover { text-decoration:underline; }
        .back-link { position:fixed; top:24px; left:28px; z-index:10; display:flex; align-items:center; gap:6px; font-size:13px; color:#5C5955; text-decoration:none; transition:color 0.12s; }
        .back-link:hover { color:#F0EDE8; }
        .success-wrap { text-align:center; padding:32px 0; }
        .success-icon { width:60px; height:60px; border-radius:50%; background:rgba(78,155,111,0.10); border:1px solid rgba(78,155,111,0.3); display:flex; align-items:center; justify-content:center; font-size:24px; margin:0 auto 20px; }
        .success-title { font-family:'Cormorant Garamond',serif; font-size:26px; color:#F0EDE8; margin-bottom:8px; }
        .success-body { font-size:13px; color:#5C5955; line-height:1.7; }
        .success-body strong { color:#C9A84C; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-thumb { background:#272523; border-radius:99px; }
      `}</style>

      <a className="back-link" href="/">← Back to home</a>

      <div className="page">
        <div className="card">

          <div className="logo-wrap">
            <a className="logo" href="/">Booked<em>Out</em></a>
            <div className="logo-tagline">personal care, elevated</div>
          </div>

          <div className="trial-badge">
            <span style={{fontSize:'14px'}}>✦</span>
            <span className="trial-badge-text"><strong>30 days free</strong> — no credit card required</span>
          </div>

          <div className="form-box">
            {success ? (
              <div className="success-wrap">
                <div className="success-icon">✓</div>
                <div className="success-title">You're all set.</div>
                <div className="success-body">Welcome to BookedOut — your 30-day free trial has started.<br/><br/>Redirecting you to your <strong>dashboard</strong>…</div>
              </div>
            ) : (
              <>
                <h1 className="form-title">Create your account</h1>
                <p className="form-sub">Join BookedOut and start your free trial today</p>

                <a className="btn-google" href="#">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign up with Google
                </a>

                <div className="divider">
                  <div className="divider-line"/><div className="divider-text">or sign up with email</div><div className="divider-line"/>
                </div>

                {error && <div className="error-msg">{error}</div>}

                <div className="section-label">Personal Info</div>
                <div className="field-grid">
                  <div className="field" style={{marginBottom:0}}>
                    <label className="field-label">First name<span className="req">*</span></label>
                    <input className="field-input" type="text" placeholder="Jordan"
                      value={form.firstName} onChange={e => set('firstName', e.target.value)}/>
                  </div>
                  <div className="field" style={{marginBottom:0}}>
                    <label className="field-label">Last name<span className="req">*</span></label>
                    <input className="field-input" type="text" placeholder="Smith"
                      value={form.lastName} onChange={e => set('lastName', e.target.value)}/>
                  </div>
                </div>

                <div className="section-label">Business Info</div>
                <div className="field">
                  <label className="field-label">Business / shop name<span className="req">*</span></label>
                  <input className="field-input" type="text" placeholder="e.g. Smith's Barbershop"
                    value={form.businessName} onChange={e => set('businessName', e.target.value)}/>
                </div>
                <div className="field">
                  <label className="field-label">Your specialty<span className="req">*</span></label>
                  <select className="field-input" value={form.specialty} onChange={e => set('specialty', e.target.value)}>
                    <option value="" disabled>Select your specialty…</option>
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
                </div>

                <div className="section-label">Account Info</div>
                <div className="field">
                  <label className="field-label">Email address<span className="req">*</span></label>
                  <input className="field-input" type="email" placeholder="you@example.com"
                    value={form.email} onChange={e => set('email', e.target.value)}/>
                </div>
                <div className="field">
                  <label className="field-label">Password<span className="req">*</span></label>
                  <div className="pw-wrap">
                    <input className="field-input" type="password" placeholder="Create a strong password"
                      value={form.password}
                      onChange={e => set('password', e.target.value)}
                      onFocus={() => setShowPwRules(true)}/>
                    <button className="pw-toggle" type="button" onClick={() => {
                      const inp = document.querySelector('.pw-wrap .field-input')
                      inp.type = inp.type === 'password' ? 'text' : 'password'
                    }}>👁</button>
                  </div>
                  {showPwRules && (
                    <div className="pw-rules">
                      {rules.map(r => {
                        const passed = r.test(form.password)
                        const active = form.password.length > 0
                        return (
                          <div key={r.id} className={`pw-rule${passed ? ' pass' : active ? ' fail' : ''}`}>
                            <span>{passed ? '✓' : active ? '✕' : '○'}</span>
                            <span>{r.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="section-label">Choose Your Plan</div>
                <div className="plan-grid">
                  {[{val:'solo',label:'Solo',price:'$14.99 / mo'},{val:'shop',label:'Shop Owner',price:'$99.99 / mo'}].map(p => (
                    <div key={p.val} className={`plan-card${form.plan === p.val ? ' selected' : ''}`}
                      onClick={() => set('plan', p.val)}>
                      <div className="plan-name">{p.label}</div>
                      <div className="plan-price">{p.price}</div>
                    </div>
                  ))}
                </div>
                <p style={{fontSize:'11px',color:'#5C5955',marginBottom:'20px',lineHeight:'1.55'}}>
                  Both plans include a <span style={{color:'#C9A84C'}}>30-day free trial</span>. You won't be charged until your trial ends.
                </p>

                <div className={`tos-row${tosChecked ? ' checked' : ''}`} onClick={() => setTosChecked(t => !t)}>
                  <div className={`tos-check${tosChecked ? ' checked' : ''}`}>{tosChecked ? '✓' : ''}</div>
                  <p className="tos-text">
                    I agree to the BookedOut <a href="/terms" onClick={e => e.stopPropagation()}>Terms of Service</a> and <a href="/privacy" onClick={e => e.stopPropagation()}>Privacy Policy</a>.
                  </p>
                </div>

                <button className="btn-submit" onClick={handleSignup} disabled={loading}>
                  {loading ? <div className="spinner"/> : 'Start Free Trial →'}
                </button>
              </>
            )}
          </div>

          <div className="form-footer">
            Already have an account? <a href="/login">Log in →</a>
          </div>

        </div>
      </div>
    </>
  )
}