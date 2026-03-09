'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useParams } from 'next/navigation'

const supabase = createClient()

// ── Mock provider data (replace with Supabase fetch) ──────────
const MOCK_PROVIDER = {
  name: 'Jordan Smith',
  specialty: 'Barber',
  bio: 'Precision cuts and clean fades. 8 years experience. Walk-ins welcome, appointments preferred.',
  tagline: 'Precision fades & clean cuts. Walk-ins welcome.',
  coverStyle: 'gradient-gold',
  avatar: null,
  businessPhone: '(305) 555-0192',
  businessEmail: 'jordan@smithsbarber.com',
  address: '123 Main St, Miami, FL 33101',
  instagram: 'instagram.com/jordansmithcuts',
  tiktok: '',
  facebook: '',
  services: [
    { id:1, name:'Fade',              duration:45, price:45, category:'hair' },
    { id:2, name:'Fade + Line-up',    duration:60, price:55, category:'hair' },
    { id:3, name:'Beard Trim',        duration:20, price:25, category:'hair' },
    { id:4, name:'Fade + Beard Trim', duration:75, price:65, category:'hair' },
    { id:5, name:'Kids Cut',          duration:30, price:30, category:'hair' },
  ],
}

// ── Generate mock time slots ───────────────────────────────────
function generateSlots(date) {
  if (!date) return []
  const day = new Date(date).getDay()
  if (day === 0) return [] // closed Sunday
  const slots = []
  const start = 9 * 60  // 9:00 AM
  const end   = day === 6 ? 15 * 60 : 18 * 60 // Sat ends 3pm, others 6pm
  for (let m = start; m < end; m += 30) {
    const h    = Math.floor(m / 60)
    const min  = m % 60
    const ampm = h < 12 ? 'AM' : 'PM'
    const h12  = h === 0 ? 12 : h > 12 ? h - 12 : h
    const label = `${h12}:${String(min).padStart(2,'0')} ${ampm}`
    // Randomly mark some slots as taken for demo
    const taken = [9*60+30, 10*60, 11*60+30, 14*60, 15*60+30].includes(m)
    slots.push({ time: label, value: m, taken })
  }
  return slots
}

// ── Calendar helper ───────────────────────────────────────────
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS_SHORT = ['Su','Mo','Tu','We','Th','Fr','Sa']

export default function BookingPage() {
  const params  = useParams()
  const username = params?.username || 'demo'

  const [provider, setProvider] = useState(MOCK_PROVIDER)
  const [step, setStep]         = useState(1) // 1-5
  const [direction, setDirection] = useState('forward')

  // Booking state
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate]       = useState('')
  const [selectedSlot, setSelectedSlot]       = useState(null)
  const [clientInfo, setClientInfo]           = useState({ firstName:'', lastName:'', phone:'', email:'', notes:'' })
  const setCI = (k, v) => setClientInfo(c => ({ ...c, [k]: v }))

  // Calendar state
  const today = new Date()
  const [calYear, setCalYear]   = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())

  const slots = generateSlots(selectedDate)

  function goNext() {
    setDirection('forward')
    setStep(s => Math.min(s + 1, 5))
  }
  function goBack() {
    setDirection('back')
    setStep(s => Math.max(s - 1, 1))
  }

  function selectDate(dateStr) {
    setSelectedDate(dateStr)
    setSelectedSlot(null)
  }

  function formatDate(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })
  }

  const canNext = () => {
    if (step === 1) return !!selectedService
    if (step === 2) return !!selectedDate
    if (step === 3) return !!selectedSlot
    if (step === 4) return clientInfo.firstName && clientInfo.lastName && clientInfo.phone && clientInfo.email
    return true
  }

  // Build calendar grid
  const daysInMonth  = getDaysInMonth(calYear, calMonth)
  const firstDay     = getFirstDayOfMonth(calYear, calMonth)
  const calendarDays = []
  for (let i = 0; i < firstDay; i++) calendarDays.push(null)
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d)

  function isDateDisabled(day) {
    if (!day) return true
    const date = new Date(calYear, calMonth, day)
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    if (date < todayMidnight) return true
    if (date.getDay() === 0) return true // closed Sunday
    return false
  }

  function makeDateStr(day) {
    return `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
  }

  const STEP_LABELS = ['Service', 'Date', 'Time', 'Your Info', 'Confirm']

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        :root {
          --bg:#F7F5F2;
          --surface:#FFFFFF;
          --surface-2:#F2EFE9;
          --border:#E5E0D8;
          --border-2:#D4CEBF;
          --text:#1A1714;
          --text-2:#5C564E;
          --text-3:#9B9690;
          --gold:#B8922A;
          --gold-light:#C9A84C;
          --gold-bg:rgba(184,146,42,0.08);
          --gold-border:rgba(184,146,42,0.25);
          --green:#2E7D52;
          --green-bg:rgba(46,125,82,0.08);
          --green-border:rgba(46,125,82,0.25);
          --red:#C0392B;
          --font-display:'Playfair Display',serif;
          --font-body:'DM Sans',sans-serif;
          --shadow:0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06);
          --shadow-lg:0 8px 32px rgba(0,0,0,0.10);
        }
        html, body { background:var(--bg); min-height:100vh; }
        body { font-family:var(--font-body); -webkit-font-smoothing:antialiased; color:var(--text); }

        /* ── PAGE ── */
        .bk-page { min-height:100vh; background:var(--bg); }

        /* ── HEADER ── */
        .bk-header { background:var(--surface); border-bottom:1px solid var(--border); padding:16px 24px; display:flex; align-items:center; justify-content:space-between; }
        .bk-logo { font-family:var(--font-display); font-size:18px; color:var(--text); text-decoration:none; }
        .bk-logo em { color:var(--gold); font-style:italic; }
        .bk-powered { font-size:11px; color:var(--text-3); }
        .bk-powered span { color:var(--gold); font-weight:500; }

        /* ── COVER ── */
        .bk-cover { height:80px; width:100%; }
        .bk-cover.gradient-gold  { background:linear-gradient(135deg,#C9A84C,#8B6914); }
        .bk-cover.gradient-rose  { background:linear-gradient(135deg,#C47B6A,#8B3A28); }
        .bk-cover.gradient-green { background:linear-gradient(135deg,#4E9B6F,#2A6B44); }
        .bk-cover.solid-dark     { background:linear-gradient(135deg,#3A3530,#1A1714); }

        /* ── PROVIDER CARD ── */
        .bk-provider { background:var(--surface); border-bottom:1px solid var(--border); padding:24px; display:flex; align-items:center; gap:16px; }
        .bk-avatar { width:56px; height:56px; border-radius:50%; background:var(--gold-bg); border:2px solid var(--gold-border); display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:22px; color:var(--gold); flex-shrink:0; overflow:hidden; }
        .bk-avatar img { width:100%; height:100%; object-fit:cover; }
        .bk-provider-name { font-family:var(--font-display); font-size:20px; color:var(--text); margin-bottom:2px; }
        .bk-provider-specialty { font-size:12px; color:var(--gold); font-weight:600; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:4px; }
        .bk-provider-bio { font-size:13px; color:var(--text-2); line-height:1.55; }
        .bk-contact { display:flex; flex-wrap:wrap; gap:12px; margin-top:12px; padding-top:12px; border-top:1px solid var(--border); }
        .bk-contact-item { display:flex; align-items:center; gap:6px; font-size:12px; color:var(--text-2); text-decoration:none; transition:color 0.12s; }
        .bk-contact-item:hover { color:var(--gold); }
        .bk-contact-icon { font-size:13px; }

        /* ── PROGRESS ── */
        .bk-progress { background:var(--surface); border-bottom:1px solid var(--border); padding:0 24px; display:flex; overflow-x:auto; }
        .bk-step { display:flex; align-items:center; gap:8px; padding:14px 12px; border-bottom:2px solid transparent; font-size:12px; font-weight:500; color:var(--text-3); white-space:nowrap; transition:all 0.2s; cursor:default; }
        .bk-step.active { color:var(--gold); border-bottom-color:var(--gold); }
        .bk-step.done { color:var(--green); }
        .bk-step-dot { width:20px; height:20px; border-radius:50%; border:1.5px solid currentColor; display:flex; align-items:center; justify-content:center; font-size:9px; flex-shrink:0; }
        .bk-step.active .bk-step-dot { background:var(--gold-bg); }
        .bk-step.done .bk-step-dot { background:var(--green-bg); }
        .bk-step-connector { width:24px; height:1px; background:var(--border-2); flex-shrink:0; }

        /* ── CONTENT ── */
        .bk-content { max-width:640px; margin:0 auto; padding:28px 20px 60px; }
        .bk-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; overflow:hidden; box-shadow:var(--shadow); animation:fadeSlide 0.3s cubic-bezier(0.16,1,0.3,1); }
        @keyframes fadeSlide { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .bk-card-header { padding:20px 24px 16px; border-bottom:1px solid var(--border); }
        .bk-card-title { font-family:var(--font-display); font-size:22px; color:var(--text); margin-bottom:4px; }
        .bk-card-title em { color:var(--gold); font-style:italic; }
        .bk-card-sub { font-size:13px; color:var(--text-3); }
        .bk-card-body { padding:20px 24px; }

        /* ── SERVICES ── */
        .bk-svc-list { display:flex; flex-direction:column; gap:8px; }
        .bk-svc { display:flex; align-items:center; justify-content:space-between; padding:14px 16px; border:1.5px solid var(--border); border-radius:10px; cursor:pointer; transition:all 0.15s; background:var(--surface); }
        .bk-svc:hover { border-color:var(--gold-border); background:var(--gold-bg); }
        .bk-svc.selected { border-color:var(--gold); background:var(--gold-bg); }
        .bk-svc-name { font-size:14px; font-weight:600; color:var(--text); margin-bottom:3px; }
        .bk-svc-meta { font-size:12px; color:var(--text-3); }
        .bk-svc-right { text-align:right; flex-shrink:0; margin-left:12px; }
        .bk-svc-price { font-size:16px; font-weight:600; color:var(--gold); }
        .bk-svc-check { width:20px; height:20px; border-radius:50%; border:1.5px solid var(--border-2); display:flex; align-items:center; justify-content:center; font-size:10px; margin-top:4px; margin-left:auto; transition:all 0.15s; }
        .bk-svc.selected .bk-svc-check { background:var(--gold); border-color:var(--gold); color:#fff; }

        /* ── CALENDAR ── */
        .bk-cal { user-select:none; }
        .bk-cal-nav { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
        .bk-cal-month { font-family:var(--font-display); font-size:18px; color:var(--text); }
        .bk-cal-arrow { width:32px; height:32px; border-radius:8px; border:1px solid var(--border); background:var(--surface); display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:14px; color:var(--text-2); transition:all 0.12s; }
        .bk-cal-arrow:hover { background:var(--surface-2); border-color:var(--border-2); }
        .bk-cal-grid { display:grid; grid-template-columns:repeat(7, 1fr); gap:4px; }
        .bk-cal-dow { text-align:center; font-size:11px; font-weight:600; color:var(--text-3); padding:6px 0; letter-spacing:0.06em; }
        .bk-cal-day { aspect-ratio:1; display:flex; align-items:center; justify-content:center; border-radius:8px; font-size:13px; font-weight:500; cursor:pointer; transition:all 0.12s; color:var(--text); border:1.5px solid transparent; }
        .bk-cal-day:hover:not(.disabled):not(.selected) { background:var(--gold-bg); border-color:var(--gold-border); }
        .bk-cal-day.today { font-weight:700; color:var(--gold); }
        .bk-cal-day.selected { background:var(--gold); color:#fff; border-color:var(--gold); }
        .bk-cal-day.disabled { color:var(--border-2); cursor:not-allowed; }
        .bk-cal-day.empty { cursor:default; }

        /* ── TIME SLOTS ── */
        .bk-slots-title { font-size:12px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:var(--text-3); margin:20px 0 12px; }
        .bk-slots-grid { display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; }
        .bk-slot { height:40px; border-radius:8px; border:1.5px solid var(--border); background:var(--surface); font-size:12px; font-weight:500; color:var(--text-2); cursor:pointer; transition:all 0.12s; display:flex; align-items:center; justify-content:center; }
        .bk-slot:hover:not(.taken):not(.selected) { border-color:var(--gold-border); background:var(--gold-bg); color:var(--gold); }
        .bk-slot.selected { background:var(--gold); border-color:var(--gold); color:#fff; }
        .bk-slot.taken { background:var(--surface-2); color:var(--border-2); cursor:not-allowed; text-decoration:line-through; }
        .bk-no-slots { text-align:center; padding:32px; font-size:13px; color:var(--text-3); }
        .bk-date-prompt { text-align:center; padding:24px; font-size:13px; color:var(--text-3); background:var(--surface-2); border-radius:10px; }

        /* ── CLIENT FORM ── */
        .bk-field { margin-bottom:14px; }
        .bk-field:last-of-type { margin-bottom:0; }
        .bk-field-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px; }
        .bk-label { display:block; font-size:12px; font-weight:500; color:var(--text-2); margin-bottom:7px; }
        .bk-input { width:100%; height:46px; padding:0 14px; background:var(--surface); border:1.5px solid var(--border); border-radius:8px; font-size:14px; color:var(--text); font-family:var(--font-body); outline:none; transition:border-color 0.15s, box-shadow 0.15s; }
        .bk-input::placeholder { color:var(--text-3); }
        .bk-input:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(184,146,42,0.1); }
        .bk-input.error { border-color:var(--red); }
        .bk-textarea { height:80px; padding:12px 14px; resize:none; }
        .bk-error { font-size:11px; color:var(--red); margin-top:5px; }

        /* ── SUMMARY ── */
        .bk-summary { display:flex; flex-direction:column; gap:12px; margin-bottom:20px; }
        .bk-summary-row { display:flex; align-items:center; gap:12px; padding:14px 16px; background:var(--surface-2); border-radius:10px; border:1px solid var(--border); }
        .bk-summary-icon { font-size:18px; flex-shrink:0; }
        .bk-summary-label { font-size:11px; color:var(--text-3); font-weight:600; letter-spacing:0.06em; text-transform:uppercase; margin-bottom:2px; }
        .bk-summary-value { font-size:14px; font-weight:600; color:var(--text); }
        .bk-summary-sub { font-size:12px; color:var(--text-2); }
        .bk-total-row { display:flex; align-items:center; justify-content:space-between; padding:16px; background:var(--gold-bg); border:1.5px solid var(--gold-border); border-radius:10px; }
        .bk-total-label { font-size:13px; font-weight:600; color:var(--text); }
        .bk-total-price { font-family:var(--font-display); font-size:24px; color:var(--gold); font-weight:600; }
        .bk-policy { font-size:11px; color:var(--text-3); line-height:1.6; padding:12px 14px; background:var(--surface-2); border-radius:8px; border:1px solid var(--border); margin-top:12px; }

        /* ── CONFIRMATION ── */
        .bk-confirm { text-align:center; padding:16px 0 8px; }
        .bk-confirm-ring { width:72px; height:72px; border-radius:50%; background:var(--green-bg); border:2px solid var(--green-border); display:flex; align-items:center; justify-content:center; margin:0 auto 20px; font-size:32px; animation:popIn 0.5s cubic-bezier(0.16,1,0.3,1); }
        @keyframes popIn { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
        .bk-confirm-title { font-family:var(--font-display); font-size:28px; color:var(--text); margin-bottom:8px; }
        .bk-confirm-title em { color:var(--green); font-style:italic; }
        .bk-confirm-sub { font-size:13px; color:var(--text-2); line-height:1.7; margin-bottom:24px; }
        .bk-confirm-details { display:flex; flex-direction:column; gap:8px; text-align:left; margin-bottom:24px; }
        .bk-confirm-item { display:flex; align-items:center; gap:10px; padding:12px 14px; background:var(--surface-2); border-radius:8px; border:1px solid var(--border); }
        .bk-confirm-item-icon { font-size:16px; flex-shrink:0; }
        .bk-confirm-item-text { font-size:13px; color:var(--text-2); }
        .bk-confirm-item-text strong { color:var(--text); font-weight:600; }
        .bk-book-another { width:100%; height:44px; background:transparent; border:1.5px solid var(--border-2); border-radius:8px; font-size:13px; font-weight:500; color:var(--text-2); font-family:var(--font-body); cursor:pointer; transition:all 0.15s; }
        .bk-book-another:hover { border-color:var(--gold-border); color:var(--gold); background:var(--gold-bg); }

        /* ── FOOTER BUTTONS ── */
        .bk-footer { display:flex; align-items:center; justify-content:space-between; padding:16px 24px; border-top:1px solid var(--border); background:var(--surface); }
        .bk-btn-back { height:44px; padding:0 20px; background:transparent; color:var(--text-2); border:1.5px solid var(--border); border-radius:8px; font-size:13px; font-weight:500; font-family:var(--font-body); cursor:pointer; transition:all 0.15s; }
        .bk-btn-back:hover { background:var(--surface-2); border-color:var(--border-2); color:var(--text); }
        .bk-btn-next { height:44px; padding:0 28px; background:var(--gold); color:#fff; border:none; border-radius:8px; font-size:13px; font-weight:600; font-family:var(--font-body); cursor:pointer; transition:all 0.15s; display:flex; align-items:center; gap:8px; box-shadow:0 2px 8px rgba(184,146,42,0.25); }
        .bk-btn-next:hover:not(:disabled) { background:#a07e24; box-shadow:0 4px 16px rgba(184,146,42,0.35); transform:translateY(-1px); }
        .bk-btn-next:disabled { opacity:0.4; cursor:not-allowed; transform:none; box-shadow:none; }
        .bk-btn-confirm { background:var(--green); box-shadow:0 2px 8px rgba(46,125,82,0.25); }
        .bk-btn-confirm:hover:not(:disabled) { background:#256b44; box-shadow:0 4px 16px rgba(46,125,82,0.35); }

        /* ── BOTTOM BRAND ── */
        .bk-brand-footer { text-align:center; padding:24px; font-size:11px; color:var(--text-3); }
        .bk-brand-footer a { color:var(--gold); text-decoration:none; font-weight:500; }

        /* ── LOADING ── */
        .bk-loading { min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--bg); font-family:var(--font-display); font-size:20px; color:var(--text-3); }

        @media (max-width: 480px) {
          .bk-slots-grid { grid-template-columns:repeat(3,1fr); }
          .bk-field-grid { grid-template-columns:1fr; }
        }
      `}</style>

      <div className="bk-page">

        {/* Header */}
        <header className="bk-header">
          <a className="bk-logo" href="/">Booked<em>Out</em></a>
          <div className="bk-powered">Powered by <span>BookedOut</span></div>
        </header>

        {/* Cover banner */}
        <div className={`bk-cover ${provider.coverStyle || 'gradient-gold'}`}/>

        {/* Provider info */}
        <div className="bk-provider">
          <div className="bk-avatar">
            {provider.avatar
              ? <img src={provider.avatar} alt={provider.name}/>
              : provider.name.charAt(0)
            }
          </div>
          <div style={{flex:1}}>
            <div className="bk-provider-name">{provider.name}</div>
            <div className="bk-provider-specialty">{provider.specialty}</div>
            {provider.tagline
              ? <div className="bk-provider-bio">{provider.tagline}</div>
              : <div className="bk-provider-bio">{provider.bio}</div>
            }
            {/* Contact info */}
            {(provider.businessPhone || provider.businessEmail || provider.address || provider.instagram) && (
              <div className="bk-contact">
                {provider.businessPhone && (
                  <a className="bk-contact-item" href={`tel:${provider.businessPhone}`}>
                    <span className="bk-contact-icon">📞</span>
                    {provider.businessPhone}
                  </a>
                )}
                {provider.businessEmail && (
                  <a className="bk-contact-item" href={`mailto:${provider.businessEmail}`}>
                    <span className="bk-contact-icon">✉</span>
                    {provider.businessEmail}
                  </a>
                )}
                {provider.address && (
                  <a className="bk-contact-item" href={`https://maps.google.com/?q=${encodeURIComponent(provider.address)}`} target="_blank" rel="noopener noreferrer">
                    <span className="bk-contact-icon">📍</span>
                    {provider.address}
                  </a>
                )}
                {provider.instagram && (
                  <a className="bk-contact-item" href={`https://${provider.instagram}`} target="_blank" rel="noopener noreferrer">
                    <span className="bk-contact-icon">📸</span>
                    Instagram
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Progress steps — hide on confirmation */}
        {step < 5 && (
          <div className="bk-progress">
            {STEP_LABELS.map((label, i) => {
              const num  = i + 1
              const done = step > num
              const active = step === num
              return (
                <div key={label} style={{display:'flex', alignItems:'center'}}>
                  {i > 0 && <div className="bk-step-connector"/>}
                  <div className={`bk-step${active ? ' active' : done ? ' done' : ''}`}>
                    <div className="bk-step-dot">{done ? '✓' : num}</div>
                    {label}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Main content */}
        <div className="bk-content">
          <div className="bk-card">

            {/* ── STEP 1: SERVICE ── */}
            {step === 1 && (
              <>
                <div className="bk-card-header">
                  <div className="bk-card-title">Choose a <em>service</em></div>
                  <div className="bk-card-sub">Select the service you'd like to book</div>
                </div>
                <div className="bk-card-body">
                  <div className="bk-svc-list">
                    {provider.services.map(svc => (
                      <div
                        key={svc.id}
                        className={`bk-svc${selectedService?.id === svc.id ? ' selected' : ''}`}
                        onClick={() => setSelectedService(svc)}
                      >
                        <div>
                          <div className="bk-svc-name">{svc.name}</div>
                          <div className="bk-svc-meta">{svc.duration} min</div>
                        </div>
                        <div className="bk-svc-right">
                          <div className="bk-svc-price">${svc.price}</div>
                          <div className="bk-svc-check">
                            {selectedService?.id === svc.id ? '✓' : ''}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bk-footer">
                  <div/>
                  <button className="bk-btn-next" onClick={goNext} disabled={!canNext()}>
                    Continue →
                  </button>
                </div>
              </>
            )}

            {/* ── STEP 2: DATE ── */}
            {step === 2 && (
              <>
                <div className="bk-card-header">
                  <div className="bk-card-title">Pick a <em>date</em></div>
                  <div className="bk-card-sub">Select an available day</div>
                </div>
                <div className="bk-card-body">
                  <div className="bk-cal">
                    <div className="bk-cal-nav">
                      <button className="bk-cal-arrow" onClick={() => {
                        if (calMonth === 0) { setCalMonth(11); setCalYear(y => y-1) }
                        else setCalMonth(m => m-1)
                      }}>‹</button>
                      <div className="bk-cal-month">{MONTHS[calMonth]} {calYear}</div>
                      <button className="bk-cal-arrow" onClick={() => {
                        if (calMonth === 11) { setCalMonth(0); setCalYear(y => y+1) }
                        else setCalMonth(m => m+1)
                      }}>›</button>
                    </div>
                    <div className="bk-cal-grid">
                      {DAYS_SHORT.map(d => <div key={d} className="bk-cal-dow">{d}</div>)}
                      {calendarDays.map((day, i) => {
                        if (!day) return <div key={`empty-${i}`} className="bk-cal-day empty"/>
                        const dateStr  = makeDateStr(day)
                        const disabled = isDateDisabled(day)
                        const isToday  = day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear()
                        const selected = selectedDate === dateStr
                        return (
                          <div
                            key={day}
                            className={`bk-cal-day${disabled ? ' disabled' : ''}${isToday && !selected ? ' today' : ''}${selected ? ' selected' : ''}`}
                            onClick={() => !disabled && selectDate(dateStr)}
                          >
                            {day}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <div className="bk-footer">
                  <button className="bk-btn-back" onClick={goBack}>← Back</button>
                  <button className="bk-btn-next" onClick={goNext} disabled={!canNext()}>
                    Continue →
                  </button>
                </div>
              </>
            )}

            {/* ── STEP 3: TIME ── */}
            {step === 3 && (
              <>
                <div className="bk-card-header">
                  <div className="bk-card-title">Pick a <em>time</em></div>
                  <div className="bk-card-sub">{selectedDate ? formatDate(selectedDate) : 'Select a time slot'}</div>
                </div>
                <div className="bk-card-body">
                  {!selectedDate ? (
                    <div className="bk-date-prompt">Go back and select a date first</div>
                  ) : slots.length === 0 ? (
                    <div className="bk-no-slots">No availability on this day. Please choose a different date.</div>
                  ) : (
                    <>
                      <div className="bk-slots-title">Available times</div>
                      <div className="bk-slots-grid">
                        {slots.map(slot => (
                          <div
                            key={slot.value}
                            className={`bk-slot${slot.taken ? ' taken' : ''}${selectedSlot?.value === slot.value ? ' selected' : ''}`}
                            onClick={() => !slot.taken && setSelectedSlot(slot)}
                          >
                            {slot.time}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="bk-footer">
                  <button className="bk-btn-back" onClick={goBack}>← Back</button>
                  <button className="bk-btn-next" onClick={goNext} disabled={!canNext()}>
                    Continue →
                  </button>
                </div>
              </>
            )}

            {/* ── STEP 4: CLIENT INFO ── */}
            {step === 4 && (
              <>
                <div className="bk-card-header">
                  <div className="bk-card-title">Your <em>details</em></div>
                  <div className="bk-card-sub">We'll send a confirmation to your email</div>
                </div>
                <div className="bk-card-body">
                  <div className="bk-field-grid">
                    <div className="bk-field" style={{marginBottom:0}}>
                      <label className="bk-label">First name *</label>
                      <input className="bk-input" type="text" placeholder="Jordan"
                        value={clientInfo.firstName} onChange={e => setCI('firstName', e.target.value)}/>
                    </div>
                    <div className="bk-field" style={{marginBottom:0}}>
                      <label className="bk-label">Last name *</label>
                      <input className="bk-input" type="text" placeholder="Smith"
                        value={clientInfo.lastName} onChange={e => setCI('lastName', e.target.value)}/>
                    </div>
                  </div>
                  <div className="bk-field" style={{marginTop:'14px'}}>
                    <label className="bk-label">Phone number *</label>
                    <input className="bk-input" type="tel" placeholder="+1 (555) 000-0000"
                      value={clientInfo.phone} onChange={e => setCI('phone', e.target.value)}/>
                  </div>
                  <div className="bk-field">
                    <label className="bk-label">Email address *</label>
                    <input className="bk-input" type="email" placeholder="you@example.com"
                      value={clientInfo.email} onChange={e => setCI('email', e.target.value)}/>
                  </div>
                  <div className="bk-field">
                    <label className="bk-label">Notes <span style={{color:'var(--text-3)', fontWeight:400}}>(optional)</span></label>
                    <textarea className="bk-input bk-textarea" placeholder="Anything your barber should know..."
                      value={clientInfo.notes} onChange={e => setCI('notes', e.target.value)}/>
                  </div>
                </div>
                <div className="bk-footer">
                  <button className="bk-btn-back" onClick={goBack}>← Back</button>
                  <button className="bk-btn-next" onClick={goNext} disabled={!canNext()}>
                    Review Booking →
                  </button>
                </div>
              </>
            )}

            {/* ── STEP 5: CONFIRM ── */}
            {step === 5 && (
              <>
                <div className="bk-card-header">
                  <div className="bk-card-title">Review & <em>confirm</em></div>
                  <div className="bk-card-sub">Double-check your booking details below</div>
                </div>
                <div className="bk-card-body">
                  <div className="bk-summary">
                    <div className="bk-summary-row">
                      <div className="bk-summary-icon">✂</div>
                      <div>
                        <div className="bk-summary-label">Service</div>
                        <div className="bk-summary-value">{selectedService?.name}</div>
                        <div className="bk-summary-sub">{selectedService?.duration} min</div>
                      </div>
                    </div>
                    <div className="bk-summary-row">
                      <div className="bk-summary-icon">📅</div>
                      <div>
                        <div className="bk-summary-label">Date & Time</div>
                        <div className="bk-summary-value">{formatDate(selectedDate)}</div>
                        <div className="bk-summary-sub">{selectedSlot?.time}</div>
                      </div>
                    </div>
                    <div className="bk-summary-row">
                      <div className="bk-summary-icon">👤</div>
                      <div>
                        <div className="bk-summary-label">Client</div>
                        <div className="bk-summary-value">{clientInfo.firstName} {clientInfo.lastName}</div>
                        <div className="bk-summary-sub">{clientInfo.phone} · {clientInfo.email}</div>
                      </div>
                    </div>
                    <div className="bk-summary-row">
                      <div className="bk-summary-icon">✦</div>
                      <div>
                        <div className="bk-summary-label">With</div>
                        <div className="bk-summary-value">{provider.name}</div>
                        <div className="bk-summary-sub">{provider.specialty}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bk-total-row">
                    <div className="bk-total-label">Total</div>
                    <div className="bk-total-price">${selectedService?.price}</div>
                  </div>

                  <div className="bk-policy">
                    By confirming, you agree to the cancellation policy. Please cancel at least 24 hours in advance to avoid a cancellation fee. A confirmation will be sent to {clientInfo.email}.
                  </div>
                </div>
                <div className="bk-footer">
                  <button className="bk-btn-back" onClick={goBack}>← Back</button>
                  <button className="bk-btn-next bk-btn-confirm" onClick={() => setStep(6)}>
                    Confirm Booking ✓
                  </button>
                </div>
              </>
            )}

            {/* ── STEP 6: DONE ── */}
            {step === 6 && (
              <div className="bk-card-body">
                <div className="bk-confirm">
                  <div className="bk-confirm-ring">✓</div>
                  <div className="bk-confirm-title">You're <em>booked!</em></div>
                  <div className="bk-confirm-sub">
                    Your appointment has been confirmed. A confirmation email is on its way to <strong>{clientInfo.email}</strong>.
                  </div>
                  <div className="bk-confirm-details">
                    <div className="bk-confirm-item">
                      <div className="bk-confirm-item-icon">✂</div>
                      <div className="bk-confirm-item-text"><strong>{selectedService?.name}</strong> with {provider.name}</div>
                    </div>
                    <div className="bk-confirm-item">
                      <div className="bk-confirm-item-icon">📅</div>
                      <div className="bk-confirm-item-text"><strong>{formatDate(selectedDate)}</strong> at {selectedSlot?.time}</div>
                    </div>
                    <div className="bk-confirm-item">
                      <div className="bk-confirm-item-icon">💰</div>
                      <div className="bk-confirm-item-text">Total: <strong>${selectedService?.price}</strong></div>
                    </div>
                  </div>
                  <button className="bk-book-another" onClick={() => {
                    setStep(1)
                    setSelectedService(null)
                    setSelectedDate('')
                    setSelectedSlot(null)
                    setClientInfo({ firstName:'', lastName:'', phone:'', email:'', notes:'' })
                  }}>
                    Book another appointment
                  </button>
                </div>
              </div>
            )}

          </div>

          <div className="bk-brand-footer">
            Powered by <a href="https://imbookedout.com">BookedOut</a> — scheduling for personal care professionals
          </div>
        </div>
      </div>
    </>
  )
}