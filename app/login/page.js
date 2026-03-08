'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleLogin() {
    setError('')
    if (!email || !email.includes('@')) { setError('Please enter a valid email address.'); return }
    if (!password) { setError('Password is required.'); return }
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setError(error.message); return }
    setSuccess(true)
    setTimeout(() => router.push('/dashboard'), 1800)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; background: #0A0908; }
        body { font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        .page { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; padding:24px; background:#0A0908; position:relative; overflow:hidden; }
        .page::before { content:''; position:fixed; inset:0; pointer-events:none; background: radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 80%, rgba(201,168,76,0.04) 0%, transparent 60%); }
        .card { position:relative; z-index:1; width:100%; max-width:400px; animation:fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .logo-wrap { text-align:center; margin-bottom:36px; }
        .logo { font-family:'Cormorant Garamond',serif; font-size:28px; color:#F0EDE8; text-decoration:none; letter-spacing:0.01em; }
        .logo em { color:#C9A84C; font-style:italic; }
        .logo-tagline { font-size:12px; color:#5C5955; letter-spacing:0.12em; text-transform:uppercase; margin-top:4px; }
        .form-box { background:#111010; border:1px solid #272523; border-radius:16px; padding:36px; }
        .form-title { font-family:'Cormorant Garamond',serif; font-size:26px; color:#F0EDE8; margin-bottom:6px; text-align:center; }
        .form-sub { font-size:13px; color:#5C5955; text-align:center; margin-bottom:28px; }
        .btn-google { display:flex; align-items:center; justify-content:center; gap:10px; width:100%; height:44px; background:#181716; border:1px solid #312F2D; border-radius:6px; font-size:13px; font-weight:500; color:#9B9690; cursor:pointer; transition:all 0.15s; font-family:'DM Sans',sans-serif; text-decoration:none; }
        .btn-google:hover { background:#1F1E1C; color:#F0EDE8; }
        .divider { display:flex; align-items:center; gap:12px; margin:20px 0; }
        .divider-line { flex:1; height:1px; background:#272523; }
        .divider-text { font-size:11px; color:#5C5955; letter-spacing:0.06em; white-space:nowrap; }
        .field { margin-bottom:16px; }
        .field-label { display:block; font-size:12px; font-weight:500; color:#9B9690; margin-bottom:7px; }
        .field-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:7px; }
        .field-input { width:100%; height:44px; padding:0 14px; background:#181716; border:1px solid #272523; border-radius:6px; font-size:14px; color:#F0EDE8; font-family:'DM Sans',sans-serif; outline:none; transition:border-color 0.15s, box-shadow 0.15s, background 0.15s; }
        .field-input::placeholder { color:#5C5955; }
        .field-input:focus { border-color:#C9A84C; background:#1F1E1C; box-shadow:0 0 0 3px rgba(201,168,76,0.1); }
        .field-input.error { border-color:#B85555; }
        .pw-wrap { position:relative; }
        .pw-wrap .field-input { padding-right:44px; }
        .pw-toggle { position:absolute; right:0; top:0; height:44px; width:44px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#5C5955; background:none; border:none; font-size:13px; transition:color 0.12s; }
        .pw-toggle:hover { color:#9B9690; }
        .forgot { font-size:12px; color:#5C5955; text-decoration:none; transition:color 0.12s; }
        .forgot:hover { color:#C9A84C; }
        .error-msg { font-size:12px; color:#B85555; margin-bottom:14px; text-align:center; padding:10px 14px; background:rgba(184,85,85,0.08); border:1px solid rgba(184,85,85,0.2); border-radius:6px; }
        .btn-submit { width:100%; height:46px; margin-top:8px; background:#C9A84C; color:#0A0908; border:none; border-radius:6px; font-size:14px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all 0.15s; display:flex; align-items:center; justify-content:center; gap:8px; }
        .btn-submit:hover:not(:disabled) { background:#D4B558; box-shadow:0 6px 24px rgba(201,168,76,0.3); transform:translateY(-1px); }
        .btn-submit:disabled { opacity:0.5; cursor:not-allowed; }
        .spinner { width:14px; height:14px; border-radius:50%; border:2px solid rgba(10,9,8,0.3); border-top-color:#0A0908; animation:spin 0.7s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .form-footer { text-align:center; margin-top:20px; font-size:13px; color:#5C5955; }
        .form-footer a { color:#C9A84C; text-decoration:none; font-weight:500; }
        .form-footer a:hover { text-decoration:underline; }
        .back-link { position:fixed; top:24px; left:28px; z-index:10; display:flex; align-items:center; gap:6px; font-size:13px; color:#5C5955; text-decoration:none; transition:color 0.12s; }
        .back-link:hover { color:#F0EDE8; }
        .success-wrap { text-align:center; padding:24px 0; }
        .success-icon { width:52px; height:52px; border-radius:50%; background:rgba(78,155,111,0.10); border:1px solid rgba(78,155,111,0.3); display:flex; align-items:center; justify-content:center; font-size:22px; margin:0 auto 16px; }
        .success-title { font-family:'Cormorant Garamond',serif; font-size:24px; color:#F0EDE8; margin-bottom:8px; }
        .success-body { font-size:13px; color:#5C5955; }
      `}</style>

      <a className="back-link" href="/">← Back to home</a>

      <div className="page">
        <div className="card">
          <div className="logo-wrap">
            <a className="logo" href="/">Booked<em>Out</em></a>
            <div className="logo-tagline">personal care, elevated</div>
          </div>

          <div className="form-box">
            {success ? (
              <div className="success-wrap">
                <div className="success-icon">✓</div>
                <div className="success-title">You're in.</div>
                <div className="success-body">Redirecting to your dashboard…</div>
              </div>
            ) : (
              <>
                <h1 className="form-title">Welcome back</h1>
                <p className="form-sub">Log in to your BookedOut account</p>

                <a className="btn-google" href="#">
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </a>

                <div className="divider">
                  <div className="divider-line"/><div className="divider-text">or continue with email</div><div className="divider-line"/>
                </div>

                {error && <div className="error-msg">{error}</div>}

                <div className="field">
                  <label className="field-label">Email address</label>
                  <input className="field-input" type="email" placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}/>
                </div>

                <div className="field">
                  <div className="field-row">
                    <label className="field-label" style={{marginBottom:0}}>Password</label>
                    <a className="forgot" href="/forgot-password">Forgot password?</a>
                  </div>
                  <div className="pw-wrap">
                    <input className="field-input" type={showPw ? 'text' : 'password'} placeholder="••••••••"
                      value={password} onChange={e => setPassword(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()}/>
                    <button className="pw-toggle" type="button" onClick={() => setShowPw(p => !p)}>
                      {showPw ? '🙈' : '👁'}
                    </button>
                  </div>
                </div>

                <button className="btn-submit" onClick={handleLogin} disabled={loading}>
                  {loading ? <div className="spinner"/> : 'Log In →'}
                </button>
              </>
            )}
          </div>

          <div className="form-footer">
            Don't have an account? <a href="/signup">Start your free trial →</a>
          </div>
        </div>
      </div>
    </>
  )
}