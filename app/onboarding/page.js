'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const supabase = createClient()

// ── Step definitions ──────────────────────────────────────────
const STEPS = ['welcome', 'profile', 'availability', 'services', 'username', 'done']

const DAYS = [
  { key:'sun', label:'Sunday'    },
  { key:'mon', label:'Monday'    },
  { key:'tue', label:'Tuesday'   },
  { key:'wed', label:'Wednesday' },
  { key:'thu', label:'Thursday'  },
  { key:'fri', label:'Friday'    },
  { key:'sat', label:'Saturday'  },
]

const TIMES = Array.from({ length: 29 }, (_, i) => {
  const totalMins = 7 * 60 + i * 30
  const h = Math.floor(totalMins / 60)
  const m = totalMins % 60
  const ampm = h < 12 ? 'AM' : 'PM'
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return {
    label: `${h12}:${String(m).padStart(2,'0')} ${ampm}`,
    value: `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`,
  }
})

const DEFAULT_SCHEDULE = {
  sun: { active:false, start:'09:00', end:'17:00' },
  mon: { active:true,  start:'09:00', end:'18:00' },
  tue: { active:true,  start:'09:00', end:'18:00' },
  wed: { active:true,  start:'09:00', end:'18:00' },
  thu: { active:true,  start:'09:00', end:'18:00' },
  fri: { active:true,  start:'09:00', end:'18:00' },
  sat: { active:true,  start:'09:00', end:'15:00' },
}

const SERVICE_CATEGORIES = { hair:'Hair', nails:'Nails', skin:'Skin', lash:'Lash/Brow', other:'Other' }

const SPECIALTIES = [
  { value:'barber',      label:'Barber'           },
  { value:'hair-stylist',label:'Hair Stylist'      },
  { value:'nail-tech',   label:'Nail Technician'  },
  { value:'esthetician', label:'Esthetician'      },
  { value:'lash-brow',   label:'Lash / Brow Artist'},
  { value:'spa',         label:'Spa / Massage'    },
  { value:'makeup',      label:'Makeup Artist'    },
  { value:'shop-owner',  label:'Shop / Salon Owner'},
  { value:'other',       label:'Other'            },
]

function calcHours(start, end) {
  if (!start || !end) return ''
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  const diff = (eh * 60 + em) - (sh * 60 + sm)
  if (diff <= 0) return ''
  const h = Math.floor(diff / 60)
  const m = diff % 60
  return h > 0 && m > 0 ? `${h}h ${m}m` : h > 0 ? `${h}h` : `${m}m`
}

// ── Confetti ──────────────────────────────────────────────────
function Confetti() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    const pieces = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: ['#C9A84C','#F0EDE8','#4E9B6F','#B87460','#D4B558'][Math.floor(Math.random()*5)],
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 4,
      speed: Math.random() * 3 + 2,
      drift: (Math.random() - 0.5) * 1.5,
    }))
    let frame
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pieces.forEach(p => {
        ctx.save()
        ctx.translate(p.x + p.w/2, p.y + p.h/2)
        ctx.rotate(p.rot * Math.PI / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h)
        ctx.restore()
        p.y += p.speed
        p.x += p.drift
        p.rot += p.rotSpeed
        if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width }
      })
      frame = requestAnimationFrame(draw)
    }
    draw()
    const stop = setTimeout(() => cancelAnimationFrame(frame), 4000)
    return () => { cancelAnimationFrame(frame); clearTimeout(stop) }
  }, [])
  return <canvas ref={canvasRef} style={{position:'fixed',top:0,left:0,pointerEvents:'none',zIndex:200}}/>
}

// ── CSS ───────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  :root {
    --bg:#0A0908; --surface:#111010; --surface-2:#181716; --surface-3:#1F1E1C;
    --border:#272523; --border-2:#312F2D; --text:#F0EDE8; --text-2:#9B9690;
    --text-3:#5C5955; --gold:#C9A84C; --gold-bg:rgba(201,168,76,0.08);
    --green:#4E9B6F; --green-bg:rgba(78,155,111,0.10);
    --font-display:'Cormorant Garamond',serif; --font-body:'DM Sans',sans-serif;
  }
  html,body { height:100%; background:var(--bg); }
  body { font-family:var(--font-body); -webkit-font-smoothing:antialiased; color:var(--text); }

  /* ── SHELL ── */
  .ob-shell { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:32px 16px; }
  .ob-logo { font-family:var(--font-display); font-size:22px; color:var(--text); margin-bottom:40px; letter-spacing:0.01em; }
  .ob-logo em { color:var(--gold); font-style:italic; }

  /* ── PROGRESS BREADCRUMB ── */
  .ob-breadcrumb { display:flex; align-items:center; gap:0; margin-bottom:40px; }
  .ob-crumb { display:flex; align-items:center; gap:8px; }
  .ob-crumb-dot { width:28px; height:28px; border-radius:50%; border:1.5px solid var(--border-2); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:600; color:var(--text-3); transition:all 0.3s; flex-shrink:0; background:var(--surface); }
  .ob-crumb-dot.active { border-color:var(--gold); color:var(--gold); background:var(--gold-bg); }
  .ob-crumb-dot.done { border-color:var(--green); background:var(--green-bg); color:var(--green); }
  .ob-crumb-label { font-size:11px; color:var(--text-3); white-space:nowrap; transition:color 0.3s; }
  .ob-crumb-label.active { color:var(--gold); }
  .ob-crumb-label.done { color:var(--green); }
  .ob-crumb-line { width:32px; height:1px; background:var(--border); margin:0 4px; flex-shrink:0; transition:background 0.3s; }
  .ob-crumb-line.done { background:var(--green); }

  /* ── CARD ── */
  .ob-card { width:100%; max-width:580px; background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:40px; animation:slideUp 0.35s cubic-bezier(0.16,1,0.3,1); }
  @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .ob-card-icon { font-size:36px; margin-bottom:16px; }
  .ob-card-title { font-family:var(--font-display); font-size:28px; color:var(--text); margin-bottom:8px; line-height:1.2; }
  .ob-card-title em { color:var(--gold); font-style:italic; }
  .ob-card-sub { font-size:14px; color:var(--text-3); line-height:1.7; margin-bottom:28px; }

  /* ── FIELDS ── */
  .ob-field { margin-bottom:16px; }
  .ob-field:last-of-type { margin-bottom:0; }
  .ob-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .ob-label { display:block; font-size:12px; font-weight:500; color:var(--text-2); margin-bottom:7px; }
  .ob-label-opt { color:var(--text-3); font-weight:400; }
  .ob-input { width:100%; height:46px; padding:0 14px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; font-size:14px; color:var(--text); font-family:var(--font-body); outline:none; transition:border-color 0.15s, box-shadow 0.15s; }
  .ob-input::placeholder { color:var(--text-3); }
  .ob-input:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(201,168,76,0.1); }
  .ob-input.error { border-color:#B85555; }
  .ob-select { cursor:pointer; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%235C5955' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 14px center; padding-right:36px; -webkit-appearance:none; }
  .ob-select option { background:var(--surface-2); color:var(--text); }
  .ob-textarea { height:90px; padding:12px 14px; resize:none; }
  .ob-hint { font-size:11px; color:var(--text-3); margin-top:6px; line-height:1.5; }
  .ob-error { font-size:11px; color:#B85555; margin-top:6px; }
  .ob-slug-wrap { position:relative; display:flex; align-items:center; }
  .ob-slug-prefix { position:absolute; left:14px; font-size:13px; color:var(--text-3); pointer-events:none; white-space:nowrap; }
  .ob-slug-input { padding-left:172px; }
  .ob-slug-check { position:absolute; right:14px; font-size:11px; font-weight:600; }
  .ob-slug-check.ok  { color:var(--green); }
  .ob-slug-check.bad { color:#B85555; }

  /* ── AVAILABILITY ── */
  .ob-day-list { display:flex; flex-direction:column; gap:8px; margin-bottom:0; }
  .ob-day-row { display:flex; align-items:center; gap:12px; padding:12px 16px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; transition:opacity 0.15s; }
  .ob-day-row.off { opacity:0.45; }
  .ob-toggle-wrap { display:flex; align-items:center; gap:10px; width:130px; flex-shrink:0; cursor:pointer; }
  .ob-toggle { width:36px; height:20px; border-radius:99px; position:relative; cursor:pointer; border:none; padding:0; transition:background 0.2s; flex-shrink:0; }
  .ob-toggle.on  { background:var(--gold); }
  .ob-toggle.off { background:var(--surface-3); border:1px solid var(--border-2); }
  .ob-toggle-knob { position:absolute; top:2px; width:16px; height:16px; border-radius:50%; background:#fff; transition:left 0.2s; }
  .ob-toggle.on  .ob-toggle-knob { left:18px; }
  .ob-toggle.off .ob-toggle-knob { left:2px; background:var(--text-3); }
  .ob-day-label { font-size:13px; font-weight:500; color:var(--text); }
  .ob-time-row { display:flex; align-items:center; gap:8px; flex:1; }
  .ob-time-select { height:34px; padding:0 8px; background:var(--surface-3); border:1px solid var(--border); border-radius:6px; font-size:12px; color:var(--text); font-family:var(--font-body); outline:none; cursor:pointer; min-width:100px; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5' viewBox='0 0 8 5'%3E%3Cpath d='M1 1l3 3 3-3' stroke='%235C5955' stroke-width='1.2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 8px center; padding-right:22px; -webkit-appearance:none; transition:border-color 0.15s; }
  .ob-time-select:focus { border-color:var(--gold); }
  .ob-time-select option { background:var(--surface-2); }
  .ob-time-sep { font-size:11px; color:var(--text-3); }
  .ob-time-badge { font-size:10px; color:var(--text-3); background:var(--surface-3); border:1px solid var(--border); padding:2px 7px; border-radius:99px; margin-left:auto; white-space:nowrap; }
  .ob-day-closed { font-size:12px; color:var(--text-3); }

  /* ── SERVICES ── */
  .ob-svc-list { display:flex; flex-direction:column; gap:8px; margin-bottom:12px; }
  .ob-svc-row { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; }
  .ob-svc-name { font-size:13px; font-weight:600; color:var(--text); margin-bottom:2px; }
  .ob-svc-meta { font-size:11px; color:var(--text-3); }
  .ob-svc-price { font-size:14px; font-weight:600; color:var(--gold); margin-right:12px; }
  .ob-svc-remove { width:26px; height:26px; background:transparent; border:1px solid var(--border); border-radius:50%; color:var(--text-3); cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:12px; transition:all 0.15s; }
  .ob-svc-remove:hover { border-color:#B85555; color:#B85555; }
  .ob-add-svc-form { background:var(--surface-2); border:1px solid var(--border); border-radius:10px; padding:16px; }
  .ob-grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; }
  .ob-add-svc-btn { width:100%; height:42px; background:transparent; border:1px dashed var(--border-2); border-radius:8px; color:var(--text-3); font-size:13px; font-family:var(--font-body); cursor:pointer; transition:all 0.15s; }
  .ob-add-svc-btn:hover { border-color:var(--gold); color:var(--gold); background:var(--gold-bg); }
  .ob-skip { font-size:12px; color:var(--text-3); background:none; border:none; cursor:pointer; font-family:var(--font-body); padding:0; transition:color 0.15s; }
  .ob-skip:hover { color:var(--text-2); }

  /* ── DONE SCREEN ── */
  .ob-done { text-align:center; padding:8px 0; }
  .ob-done-ring { width:80px; height:80px; border-radius:50%; background:var(--green-bg); border:2px solid rgba(78,155,111,0.3); display:flex; align-items:center; justify-content:center; margin:0 auto 24px; font-size:36px; animation:popIn 0.5s cubic-bezier(0.16,1,0.3,1); }
  @keyframes popIn { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
  .ob-done-title { font-family:var(--font-display); font-size:34px; color:var(--text); margin-bottom:12px; }
  .ob-done-title em { color:var(--gold); font-style:italic; }
  .ob-done-sub { font-size:14px; color:var(--text-3); line-height:1.7; margin-bottom:32px; max-width:400px; margin-left:auto; margin-right:auto; }
  .ob-done-list { display:flex; flex-direction:column; gap:10px; margin-bottom:32px; text-align:left; }
  .ob-done-item { display:flex; align-items:center; gap:10px; font-size:13px; color:var(--text-2); }
  .ob-done-check { width:20px; height:20px; border-radius:50%; background:var(--green-bg); border:1px solid rgba(78,155,111,0.3); display:flex; align-items:center; justify-content:center; font-size:10px; flex-shrink:0; }

  /* ── FOOTER BUTTONS ── */
  .ob-footer { display:flex; align-items:center; justify-content:space-between; margin-top:28px; padding-top:24px; border-top:1px solid var(--border); }
  .ob-btn-back { height:42px; padding:0 20px; background:transparent; color:var(--text-3); border:1px solid var(--border); border-radius:8px; font-size:13px; font-weight:500; font-family:var(--font-body); cursor:pointer; transition:all 0.15s; }
  .ob-btn-back:hover { background:var(--surface-2); color:var(--text-2); }
  .ob-btn-next { height:42px; padding:0 28px; background:var(--gold); color:#0A0908; border:none; border-radius:8px; font-size:13px; font-weight:600; font-family:var(--font-body); cursor:pointer; transition:all 0.15s; display:flex; align-items:center; gap:8px; }
  .ob-btn-next:hover { background:#D4B558; box-shadow:0 4px 16px rgba(201,168,76,0.3); transform:translateY(-1px); }
  .ob-btn-next:disabled { opacity:0.4; cursor:not-allowed; transform:none; box-shadow:none; }
  .ob-btn-finish { background:var(--green); }
  .ob-btn-finish:hover { background:#5aad7e; box-shadow:0 4px 16px rgba(78,155,111,0.3); }

  /* ── LOADING ── */
  .ob-loading { min-height:100vh; display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:22px; color:var(--gold); }
  .loading-dot { animation:pulse 1.2s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
`

export default function OnboardingPage() {
  const [user, setUser]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep]     = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const router = useRouter()

  // ── Profile state ──
  const [profile, setProfile] = useState({ firstName:'', lastName:'', specialty:'', bio:'' })
  const setP = (k, v) => setProfile(p => ({ ...p, [k]: v }))

  // ── Availability state ──
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE)
  const toggleDay   = (key)             => setSchedule(s => ({ ...s, [key]: { ...s[key], active: !s[key].active } }))
  const updateTime  = (key, field, val) => setSchedule(s => ({ ...s, [key]: { ...s[key], [field]: val } }))

  // ── Services state ──
  const [services, setServices]     = useState([])
  const [showAddSvc, setShowAddSvc] = useState(false)
  const [newSvc, setNewSvc]         = useState({ name:'', duration:'', price:'', category:'hair' })
  const setSvc = (k, v) => setNewSvc(s => ({ ...s, [k]: v }))

  // ── Username state ──
  const [username, setUsername]       = useState('')
  const [usernameStatus, setUsernameStatus] = useState(null) // 'ok' | 'bad' | null
  const [usernameError, setUsernameError]   = useState('')

  // ── Errors ──
  const [errors, setErrors] = useState({})

  useEffect(() => {
    supabase.auth.getUser().then(({ data:{ user } }) => {
      if (!user) { router.push('/login'); return }
      setUser(user)
      const meta = user.user_metadata || {}
      setProfile({
        firstName: meta.first_name || '',
        lastName:  meta.last_name  || '',
        specialty: meta.specialty  || '',
        bio:       meta.bio        || '',
      })
      setLoading(false)
    })
  }, [])

  // ── Username validation ──
  useEffect(() => {
    if (!username) { setUsernameStatus(null); setUsernameError(''); return }
    const valid = /^[a-z0-9_]{3,30}$/.test(username)
    if (!valid) {
      setUsernameStatus('bad')
      setUsernameError('3–30 characters, lowercase letters, numbers, and underscores only')
      return
    }
    // TODO: check Supabase for uniqueness
    // const { data } = await supabase.from('profiles').select('id').eq('username', username).single()
    // if (data) { setUsernameStatus('bad'); setUsernameError('That username is taken'); return }
    setUsernameStatus('ok')
    setUsernameError('')
  }, [username])

  // ── Validation per step ──
  function validateStep() {
    const e = {}
    if (step === 1) {
      if (!profile.firstName.trim()) e.firstName = 'Required'
      if (!profile.lastName.trim())  e.lastName  = 'Required'
      if (!profile.specialty)        e.specialty = 'Required'
    }
    if (step === 4) {
      if (!username) e.username = 'Required'
      if (usernameStatus === 'bad') e.username = usernameError
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function addService() {
    if (!newSvc.name || !newSvc.price) return
    setServices(s => [...s, {
      id: Date.now(),
      ...newSvc,
      price:    parseFloat(newSvc.price),
      duration: parseInt(newSvc.duration) || 30,
    }])
    setNewSvc({ name:'', duration:'', price:'', category:'hair' })
    setShowAddSvc(false)
  }

  function handleNext() {
    if (!validateStep()) return
    if (step < STEPS.length - 1) setStep(s => s + 1)
    if (step === STEPS.length - 2) {
      // Entering done screen
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 4500)
    }
  }

  function handleBack() {
    if (step > 0) setStep(s => s - 1)
  }

  function handleFinish() {
    // TODO: save all data to Supabase before redirecting
    router.push('/dashboard')
  }

  const stepLabels = ['Welcome', 'Profile', 'Availability', 'Services', 'Booking Page', 'Done']
  const progressSteps = stepLabels.slice(1, -1) // skip welcome & done from breadcrumb dots

  if (loading) return (
    <>
      <style>{css}</style>
      <div className="ob-loading">
        Booked<em style={{color:'#C9A84C',fontStyle:'italic'}}>Out</em>
        <span className="loading-dot" style={{marginLeft:4}}>…</span>
      </div>
    </>
  )

  const firstName = user?.user_metadata?.first_name || profile.firstName || 'there'

  return (
    <>
      <style>{css}</style>
      {showConfetti && <Confetti/>}

      <div className="ob-shell">
        <div className="ob-logo">Booked<em>Out</em></div>

        {/* Breadcrumb — hidden on welcome & done */}
        {step > 0 && step < STEPS.length - 1 && (
          <div className="ob-breadcrumb">
            {progressSteps.map((label, i) => {
              const stepIdx = i + 1
              const isDone   = step > stepIdx
              const isActive = step === stepIdx
              return (
                <div key={label} className="ob-crumb" style={{display:'flex',alignItems:'center'}}>
                  {i > 0 && <div className={`ob-crumb-line${isDone ? ' done' : ''}`}/>}
                  <div className={`ob-crumb-dot${isActive ? ' active' : isDone ? ' done' : ''}`}>
                    {isDone ? '✓' : stepIdx}
                  </div>
                  <span style={{marginLeft:6}} className={`ob-crumb-label${isActive ? ' active' : isDone ? ' done' : ''}`}>{label}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* ── STEP 0: WELCOME ── */}
        {step === 0 && (
          <div className="ob-card">
            <div className="ob-card-icon">✦</div>
            <div className="ob-card-title">Welcome to <em>BookedOut</em></div>
            <div className="ob-card-sub">
              Let's get your account set up in just a few steps. You'll be ready to take bookings in under 3 minutes — we promise it's quick.
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:'10px', marginBottom:'28px'}}>
              {[
                ['◉', 'Your profile & specialty'],
                ['◷', 'Your working hours'],
                ['✦', 'Your services & pricing'],
                ['⊕', 'Your public booking link'],
              ].map(([icon, label]) => (
                <div key={label} style={{display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', background:'var(--surface-2)', borderRadius:'8px', border:'1px solid var(--border)'}}>
                  <span style={{fontSize:'16px', color:'var(--gold)', width:'20px', textAlign:'center'}}>{icon}</span>
                  <span style={{fontSize:'13px', color:'var(--text-2)'}}>{label}</span>
                </div>
              ))}
            </div>
            <div className="ob-footer" style={{borderTop:'none', paddingTop:0, justifyContent:'flex-end'}}>
              <button className="ob-btn-next" onClick={handleNext}>Let's go →</button>
            </div>
          </div>
        )}

        {/* ── STEP 1: PROFILE ── */}
        {step === 1 && (
          <div className="ob-card">
            <div className="ob-card-icon">◉</div>
            <div className="ob-card-title">Tell us about <em>yourself</em></div>
            <div className="ob-card-sub">This info will appear on your public booking page so clients know who they're booking with.</div>

            <div className="ob-grid-2">
              <div className="ob-field">
                <label className="ob-label">First name</label>
                <input className={`ob-input${errors.firstName ? ' error' : ''}`} type="text" placeholder="Jordan"
                  value={profile.firstName} onChange={e => setP('firstName', e.target.value)}/>
                {errors.firstName && <div className="ob-error">{errors.firstName}</div>}
              </div>
              <div className="ob-field">
                <label className="ob-label">Last name</label>
                <input className={`ob-input${errors.lastName ? ' error' : ''}`} type="text" placeholder="Smith"
                  value={profile.lastName} onChange={e => setP('lastName', e.target.value)}/>
                {errors.lastName && <div className="ob-error">{errors.lastName}</div>}
              </div>
            </div>

            <div className="ob-field">
              <label className="ob-label">What's your specialty?</label>
              <select className={`ob-input ob-select${errors.specialty ? ' error' : ''}`}
                value={profile.specialty} onChange={e => setP('specialty', e.target.value)}>
                <option value="" disabled>Select your specialty…</option>
                {SPECIALTIES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              {errors.specialty && <div className="ob-error">{errors.specialty}</div>}
            </div>

            <div className="ob-field">
              <label className="ob-label">Bio <span className="ob-label-opt">(optional)</span></label>
              <textarea className="ob-input ob-textarea" placeholder="Tell clients a little about yourself and your work…"
                value={profile.bio} onChange={e => setP('bio', e.target.value)}/>
            </div>

            <div className="ob-footer">
              <button className="ob-btn-back" onClick={handleBack}>← Back</button>
              <button className="ob-btn-next" onClick={handleNext}>Continue →</button>
            </div>
          </div>
        )}

        {/* ── STEP 2: AVAILABILITY ── */}
        {step === 2 && (
          <div className="ob-card" style={{maxWidth:'640px'}}>
            <div className="ob-card-icon">◷</div>
            <div className="ob-card-title">Set your <em>hours</em></div>
            <div className="ob-card-sub">Toggle the days you work and set your start and end time. You can always change this in Settings.</div>

            <div className="ob-day-list">
              {DAYS.map(day => {
                const d   = schedule[day.key]
                const hrs = calcHours(d.start, d.end)
                return (
                  <div key={day.key} className={`ob-day-row${!d.active ? ' off' : ''}`}>
                    <div className="ob-toggle-wrap" onClick={() => toggleDay(day.key)}>
                      <button className={`ob-toggle${d.active ? ' on' : ' off'}`}><div className="ob-toggle-knob"/></button>
                      <span className="ob-day-label">{day.label}</span>
                    </div>
                    <div className="ob-time-row">
                      {d.active ? (
                        <>
                          <select className="ob-time-select" value={d.start} onChange={e => updateTime(day.key, 'start', e.target.value)}>
                            {TIMES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                          </select>
                          <span className="ob-time-sep">→</span>
                          <select className="ob-time-select" value={d.end} onChange={e => updateTime(day.key, 'end', e.target.value)}>
                            {TIMES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                          </select>
                          {hrs && <div className="ob-time-badge">{hrs}</div>}
                        </>
                      ) : (
                        <span className="ob-day-closed">Closed</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="ob-footer">
              <button className="ob-btn-back" onClick={handleBack}>← Back</button>
              <button className="ob-btn-next" onClick={handleNext}>Continue →</button>
            </div>
          </div>
        )}

        {/* ── STEP 3: SERVICES ── */}
        {step === 3 && (
          <div className="ob-card">
            <div className="ob-card-icon">✦</div>
            <div className="ob-card-title">Add your <em>services</em></div>
            <div className="ob-card-sub">Add at least one service so clients know what to book. You can add more later in Settings.</div>

            {services.length > 0 && (
              <div className="ob-svc-list">
                {services.map(svc => (
                  <div key={svc.id} className="ob-svc-row">
                    <div>
                      <div className="ob-svc-name">{svc.name}</div>
                      <div className="ob-svc-meta">{svc.duration} min · {SERVICE_CATEGORIES[svc.category] || svc.category}</div>
                    </div>
                    <div style={{display:'flex',alignItems:'center'}}>
                      <span className="ob-svc-price">${svc.price}</span>
                      <button className="ob-svc-remove" onClick={() => setServices(s => s.filter(x => x.id !== svc.id))}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showAddSvc ? (
              <div className="ob-add-svc-form">
                <div className="ob-field">
                  <label className="ob-label">Service name</label>
                  <input className="ob-input" type="text" placeholder="e.g. Fade + Beard Trim"
                    value={newSvc.name} onChange={e => setSvc('name', e.target.value)}/>
                </div>
                <div className="ob-grid-3">
                  <div className="ob-field">
                    <label className="ob-label">Price ($)</label>
                    <input className="ob-input" type="number" placeholder="45"
                      value={newSvc.price} onChange={e => setSvc('price', e.target.value)}/>
                  </div>
                  <div className="ob-field">
                    <label className="ob-label">Duration (min)</label>
                    <input className="ob-input" type="number" placeholder="45"
                      value={newSvc.duration} onChange={e => setSvc('duration', e.target.value)}/>
                  </div>
                  <div className="ob-field">
                    <label className="ob-label">Category</label>
                    <select className="ob-input ob-select" value={newSvc.category} onChange={e => setSvc('category', e.target.value)}>
                      {Object.entries(SERVICE_CATEGORIES).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{display:'flex', gap:'10px', marginTop:'12px'}}>
                  <button className="ob-btn-next" style={{height:'38px', padding:'0 20px', fontSize:'13px'}} onClick={addService}>
                    Add Service
                  </button>
                  <button className="ob-btn-back" style={{height:'38px'}} onClick={() => setShowAddSvc(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <button className="ob-add-svc-btn" onClick={() => setShowAddSvc(true)}>+ Add Service</button>
            )}

            <div className="ob-footer">
              <button className="ob-btn-back" onClick={handleBack}>← Back</button>
              <div style={{display:'flex', alignItems:'center', gap:'16px'}}>
                {services.length === 0 && (
                  <button className="ob-skip" onClick={handleNext}>Skip for now</button>
                )}
                <button className="ob-btn-next" onClick={handleNext}
                  disabled={services.length === 0 && showAddSvc}>
                  Continue →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: USERNAME ── */}
        {step === 4 && (
          <div className="ob-card">
            <div className="ob-card-icon">⊕</div>
            <div className="ob-card-title">Claim your <em>booking link</em></div>
            <div className="ob-card-sub">
              This is the link you'll share with clients so they can book directly with you. Choose something simple and memorable.
            </div>

            <div className="ob-field">
              <label className="ob-label">Your booking URL</label>
              <div className="ob-slug-wrap">
                <span className="ob-slug-prefix">imbookedout.com/book/</span>
                <input
                  className={`ob-input ob-slug-input${errors.username ? ' error' : ''}`}
                  type="text"
                  placeholder="yourname"
                  value={username}
                  onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                />
                {usernameStatus && (
                  <span className={`ob-slug-check${usernameStatus === 'ok' ? ' ok' : ' bad'}`}>
                    {usernameStatus === 'ok' ? '✓ Available' : '✕ Taken'}
                  </span>
                )}
              </div>
              {errors.username
                ? <div className="ob-error">{errors.username}</div>
                : <div className="ob-hint">Lowercase letters, numbers, and underscores only. 3–30 characters.</div>
              }
            </div>

            {username && usernameStatus === 'ok' && (
              <div style={{padding:'14px 16px', background:'var(--surface-2)', borderRadius:'8px', border:'1px solid var(--border)', marginTop:'8px'}}>
                <div style={{fontSize:'11px', color:'var(--text-3)', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:600}}>Your booking page will be</div>
                <div style={{fontSize:'14px', color:'var(--gold)', fontWeight:500}}>imbookedout.com/book/{username}</div>
              </div>
            )}

            <div className="ob-footer">
              <button className="ob-btn-back" onClick={handleBack}>← Back</button>
              <button className="ob-btn-next"
                onClick={handleNext}
                disabled={!username || usernameStatus !== 'ok'}>
                Finish Setup →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5: DONE ── */}
        {step === 5 && (
          <div className="ob-card">
            <div className="ob-done">
              <div className="ob-done-ring">✓</div>
              <div className="ob-done-title">You're all <em>set!</em></div>
              <div className="ob-done-sub">
                Your BookedOut profile is ready. Here's a summary of what you just set up:
              </div>
              <div className="ob-done-list">
                <div className="ob-done-item">
                  <div className="ob-done-check">✓</div>
                  <span>Profile created for <strong style={{color:'var(--text)'}}>{profile.firstName} {profile.lastName}</strong></span>
                </div>
                <div className="ob-done-item">
                  <div className="ob-done-check">✓</div>
                  <span>Working hours set for <strong style={{color:'var(--text)'}}>{Object.values(schedule).filter(d => d.active).length} days</strong> a week</span>
                </div>
                <div className="ob-done-item">
                  <div className="ob-done-check">✓</div>
                  <span><strong style={{color:'var(--text)'}}>{services.length || 'No'}</strong> service{services.length !== 1 ? 's' : ''} added</span>
                </div>
                <div className="ob-done-item">
                  <div className="ob-done-check">✓</div>
                  <span>Booking page: <strong style={{color:'var(--gold)'}}>imbookedout.com/book/{username}</strong></span>
                </div>
              </div>
              <button className="ob-btn-next ob-btn-finish" style={{width:'100%', height:'48px', fontSize:'14px', justifyContent:'center'}} onClick={handleFinish}>
                Go to my Dashboard →
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  )
}