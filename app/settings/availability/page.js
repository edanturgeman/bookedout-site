'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const supabase = createClient()

const Icon = ({ name, size = 16, color = 'currentColor' }) => {
  const icons = {
    grid:        <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    calendar:    <><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></>,
    users:       <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    bell:        <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    settings:    <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    chevronLeft: <polyline points="15 18 9 12 15 6"/>,
    chevronRight:<polyline points="9 18 15 12 9 6"/>,
    check:       <polyline points="20 6 9 17 4 12"/>,
    plus:        <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    x:           <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    clock:       <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    save:        <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>,
    trash:       <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>,
    info:        <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    logout:      <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  )
}

const DAYS = [
  { key:'sun', label:'Sunday',    short:'Sun' },
  { key:'mon', label:'Monday',    short:'Mon' },
  { key:'tue', label:'Tuesday',   short:'Tue' },
  { key:'wed', label:'Wednesday', short:'Wed' },
  { key:'thu', label:'Thursday',  short:'Thu' },
  { key:'fri', label:'Friday',    short:'Fri' },
  { key:'sat', label:'Saturday',  short:'Sat' },
]

const TIMES = Array.from({ length: 29 }, (_, i) => {
  const totalMins = 7 * 60 + i * 30
  const h = Math.floor(totalMins / 60)
  const m = totalMins % 60
  const ampm = h < 12 ? 'AM' : 'PM'
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  const label = `${h12}:${String(m).padStart(2,'0')} ${ampm}`
  const value = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`
  return { label, value }
})

const BUFFERS = [
  { label:'No buffer', value:'0' },
  { label:'5 minutes', value:'5' },
  { label:'10 minutes', value:'10' },
  { label:'15 minutes', value:'15' },
  { label:'30 minutes', value:'30' },
]

const DEFAULT_SCHEDULE = {
  sun: { active: false, start: '09:00', end: '17:00' },
  mon: { active: true,  start: '09:00', end: '18:00' },
  tue: { active: true,  start: '09:00', end: '18:00' },
  wed: { active: true,  start: '09:00', end: '18:00' },
  thu: { active: true,  start: '09:00', end: '18:00' },
  fri: { active: true,  start: '09:00', end: '18:00' },
  sat: { active: true,  start: '09:00', end: '15:00' },
}

const navItems = [
  { label:'Dashboard', icon:'grid',     href:'/dashboard', active:false },
  { label:'Calendar',  icon:'calendar', href:'/calendar',  active:false },
  { label:'Clients',   icon:'users',    href:'/clients',   active:false },
  { label:'Reminders', icon:'bell',     href:'/reminders', active:false },
  { label:'Settings',  icon:'settings', href:'/settings',  active:true  },
]

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  :root {
    --bg:#0A0908; --surface:#111010; --surface-2:#181716; --surface-3:#1F1E1C;
    --border:#272523; --border-2:#312F2D; --text:#F0EDE8; --text-2:#9B9690;
    --text-3:#5C5955; --gold:#C9A84C; --gold-bg:rgba(201,168,76,0.08);
    --green:#4E9B6F; --green-bg:rgba(78,155,111,0.10); --red:#B85555;
    --sidebar-w:220px; --sidebar-collapsed:56px;
    --font-display:'Cormorant Garamond',serif; --font-body:'DM Sans',sans-serif;
  }
  html,body { height:100%; background:var(--bg); overflow:hidden; }
  body { font-family:var(--font-body); -webkit-font-smoothing:antialiased; color:var(--text); }
  .layout { display:flex; height:100vh; overflow:hidden; }

  /* SIDEBAR */
  .sidebar { width:var(--sidebar-w); flex-shrink:0; background:var(--surface); border-right:1px solid var(--border); display:flex; flex-direction:column; transition:width 0.28s cubic-bezier(0.4,0,0.2,1); overflow:hidden; position:relative; z-index:10; }
  .sidebar.collapsed { width:var(--sidebar-collapsed); }
  .sidebar-header { display:flex; align-items:center; justify-content:space-between; padding:0 16px; height:56px; border-bottom:1px solid var(--border); flex-shrink:0; }
  .sidebar-logo { font-family:var(--font-display); font-size:18px; color:var(--text); text-decoration:none; white-space:nowrap; overflow:hidden; opacity:1; transition:opacity 0.2s; }
  .sidebar-logo em { color:var(--gold); font-style:italic; }
  .sidebar.collapsed .sidebar-logo { opacity:0; width:0; }
  .sidebar-toggle { width:28px; height:28px; border-radius:6px; background:var(--surface-2); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text-3); transition:all 0.15s; flex-shrink:0; }
  .sidebar-toggle:hover { background:var(--surface-3); color:var(--text-2); }
  .sidebar-nav { flex:1; padding:12px 0; overflow:hidden; }
  .nav-item { display:flex; align-items:center; gap:10px; padding:0 12px; height:40px; margin:2px 8px; border-radius:8px; text-decoration:none; color:var(--text-3); font-size:13px; font-weight:500; transition:all 0.15s; white-space:nowrap; cursor:pointer; position:relative; }
  .nav-item:hover { background:var(--surface-2); color:var(--text-2); }
  .nav-item.active { background:var(--gold-bg); color:var(--gold); }
  .nav-icon { flex-shrink:0; }
  .nav-label { transition:opacity 0.15s; overflow:hidden; }
  .sidebar.collapsed .nav-label { opacity:0; width:0; }
  .nav-tooltip { position:absolute; left:calc(100% + 10px); top:50%; transform:translateY(-50%); background:var(--surface-3); border:1px solid var(--border-2); color:var(--text-2); font-size:11px; padding:4px 10px; border-radius:6px; white-space:nowrap; opacity:0; pointer-events:none; transition:opacity 0.15s; z-index:100; }
  .sidebar.collapsed .nav-item:hover .nav-tooltip { opacity:1; }
  .sidebar-footer { padding:12px 8px; border-top:1px solid var(--border); flex-shrink:0; }
  .sidebar-user { display:flex; align-items:center; gap:10px; padding:8px; border-radius:8px; overflow:hidden; }
  .user-avatar { width:32px; height:32px; border-radius:50%; background:var(--gold-bg); border:1px solid rgba(201,168,76,0.3); display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:14px; color:var(--gold); flex-shrink:0; }
  .user-info { overflow:hidden; }
  .user-name { font-size:12px; font-weight:600; color:var(--text); white-space:nowrap; }
  .user-plan { font-size:10px; color:var(--text-3); white-space:nowrap; margin-top:1px; }
  .sidebar.collapsed .user-info { display:none; }

  /* MAIN */
  .main { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }

  /* TOPBAR */
  .topbar { height:56px; flex-shrink:0; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; padding:0 28px; background:var(--surface); }
  .topbar-title { font-family:var(--font-display); font-size:20px; color:var(--text); }
  .topbar-title em { color:var(--gold); font-style:italic; }
  .topbar-right { display:flex; align-items:center; gap:10px; }
  .save-btn { display:flex; align-items:center; gap:7px; padding:0 20px; height:36px; background:var(--gold); color:#0A0908; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.15s; font-family:var(--font-body); }
  .save-btn:hover { background:#D4B558; box-shadow:0 4px 16px rgba(201,168,76,0.3); transform:translateY(-1px); }
  .save-btn.saved { background:var(--green); }
  .logout-btn { display:flex; align-items:center; gap:6px; padding:0 14px; height:36px; background:transparent; border:1px solid var(--border); border-radius:8px; font-size:12px; font-weight:500; color:var(--text-3); cursor:pointer; transition:all 0.15s; font-family:var(--font-body); }
  .logout-btn:hover { border-color:#B85555; color:#B85555; }

  /* SETTINGS TABS */
  .settings-tabs { display:flex; gap:0; border-bottom:1px solid var(--border); background:var(--surface); padding:0 28px; flex-shrink:0; }
  .settings-tab { padding:14px 18px; font-size:13px; font-weight:500; color:var(--text-3); cursor:pointer; border-bottom:2px solid transparent; transition:all 0.15s; margin-bottom:-1px; }
  .settings-tab:hover { color:var(--text-2); }
  .settings-tab.active { color:var(--gold); border-bottom-color:var(--gold); }

  /* CONTENT */
  .content { flex:1; overflow-y:auto; padding:32px 28px; }
  .content::-webkit-scrollbar { width:5px; }
  .content::-webkit-scrollbar-thumb { background:var(--border-2); border-radius:99px; }

  /* SECTION */
  .section { margin-bottom:32px; }
  .section-header { margin-bottom:20px; }
  .section-title { font-family:var(--font-display); font-size:20px; color:var(--text); margin-bottom:4px; }
  .section-sub { font-size:13px; color:var(--text-3); line-height:1.6; }

  /* PANEL */
  .panel { background:var(--surface); border:1px solid var(--border); border-radius:12px; overflow:hidden; margin-bottom:16px; }
  .panel-header { padding:16px 20px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
  .panel-title { font-size:13px; font-weight:600; color:var(--text); }
  .panel-sub { font-size:11px; color:var(--text-3); margin-top:2px; }

  /* DAY ROWS */
  .day-row { display:flex; align-items:center; gap:16px; padding:14px 20px; border-bottom:1px solid var(--border); transition:background 0.12s; }
  .day-row:last-child { border-bottom:none; }
  .day-row:hover { background:var(--surface-2); }
  .day-row.inactive { opacity:0.45; }

  /* TOGGLE SWITCH */
  .toggle-wrap { display:flex; align-items:center; gap:10px; width:120px; flex-shrink:0; cursor:pointer; }
  .toggle { width:38px; height:22px; border-radius:99px; position:relative; flex-shrink:0; transition:background 0.2s; cursor:pointer; border:none; }
  .toggle.on  { background:var(--gold); }
  .toggle.off { background:var(--surface-3); border:1px solid var(--border-2); }
  .toggle-knob { position:absolute; top:3px; width:16px; height:16px; border-radius:50%; background:#fff; transition:left 0.2s cubic-bezier(0.4,0,0.2,1); }
  .toggle.on  .toggle-knob { left:19px; }
  .toggle.off .toggle-knob { left:3px; background:var(--text-3); }
  .toggle-label { font-size:13px; font-weight:500; color:var(--text); white-space:nowrap; }

  /* TIME SELECTS */
  .time-row { display:flex; align-items:center; gap:10px; flex:1; }
  .time-label { font-size:11px; color:var(--text-3); white-space:nowrap; }
  .time-select { height:36px; padding:0 10px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; font-size:13px; color:var(--text); font-family:var(--font-body); outline:none; cursor:pointer; transition:border-color 0.15s; min-width:110px; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%235C5955' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 10px center; padding-right:28px; -webkit-appearance:none; }
  .time-select:focus { border-color:var(--gold); }
  .time-select option { background:var(--surface-2); }
  .time-select:disabled { opacity:0.3; cursor:not-allowed; }
  .time-separator { font-size:12px; color:var(--text-3); }
  .hours-badge { font-size:10px; color:var(--text-3); background:var(--surface-3); border:1px solid var(--border); padding:2px 8px; border-radius:99px; white-space:nowrap; margin-left:auto; }

  /* COPY ALL */
  .copy-btn { font-size:11px; color:var(--gold); background:none; border:none; cursor:pointer; font-family:var(--font-body); transition:opacity 0.15s; padding:0; }
  .copy-btn:hover { opacity:0.7; }

  /* BUFFER + LIMITS */
  .option-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:20px; }
  .option-field { display:flex; flex-direction:column; gap:6px; }
  .option-label { font-size:11px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:var(--text-3); }
  .option-select { height:42px; padding:0 12px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; font-size:13px; color:var(--text); font-family:var(--font-body); outline:none; cursor:pointer; transition:border-color 0.15s; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%235C5955' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; padding-right:32px; -webkit-appearance:none; }
  .option-select:focus { border-color:var(--gold); }
  .option-select option { background:var(--surface-2); }
  .option-input { height:42px; padding:0 12px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; font-size:13px; color:var(--text); font-family:var(--font-body); outline:none; transition:border-color 0.15s; }
  .option-input:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(201,168,76,0.1); }
  .option-hint { font-size:11px; color:var(--text-3); margin-top:2px; line-height:1.5; }

  /* BLOCKED DATES */
  .blocked-list { padding:12px 20px; display:flex; flex-direction:column; gap:8px; }
  .blocked-item { display:flex; align-items:center; gap:12px; padding:10px 14px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; }
  .blocked-date { font-size:13px; font-weight:600; color:var(--text); flex:1; }
  .blocked-reason { font-size:12px; color:var(--text-3); }
  .blocked-remove { width:26px; height:26px; border-radius:6px; background:none; border:1px solid transparent; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text-3); transition:all 0.12s; }
  .blocked-remove:hover { background:rgba(184,85,85,0.1); border-color:rgba(184,85,85,0.3); color:#B85555; }
  .add-blocked { display:flex; align-items:center; gap:10px; padding:14px 20px; border-top:1px solid var(--border); }
  .add-blocked-input { height:36px; padding:0 10px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; font-size:13px; color:var(--text); font-family:var(--font-body); outline:none; flex:1; transition:border-color 0.15s; }
  .add-blocked-input:focus { border-color:var(--gold); }
  .add-blocked-btn { display:flex; align-items:center; gap:6px; padding:0 14px; height:36px; background:var(--surface-3); border:1px solid var(--border-2); border-radius:8px; font-size:12px; color:var(--text-2); cursor:pointer; transition:all 0.15s; font-family:var(--font-body); white-space:nowrap; }
  .add-blocked-btn:hover { background:var(--gold-bg); border-color:rgba(201,168,76,0.3); color:var(--gold); }

  /* INFO BANNER */
  .info-banner { display:flex; align-items:flex-start; gap:10px; padding:12px 16px; background:var(--gold-bg); border:1px solid rgba(201,168,76,0.2); border-radius:8px; margin-bottom:24px; }
  .info-banner-text { font-size:12px; color:var(--text-2); line-height:1.6; }
  .info-banner-text strong { color:var(--gold); }

  /* TOAST */
  .toast { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); z-index:300; display:flex; align-items:center; gap:10px; padding:12px 20px; background:var(--surface-3); border:1px solid var(--border-2); border-radius:10px; font-size:13px; color:var(--text); box-shadow:0 8px 32px rgba(0,0,0,0.5); animation:toastIn 0.25s cubic-bezier(0.16,1,0.3,1); }
  .toast.success { border-color:rgba(78,155,111,0.4); }
  @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }

  /* EMPTY BLOCKED */
  .empty-blocked { padding:24px; text-align:center; color:var(--text-3); font-size:13px; }

  /* LOADING */
  .loading-screen { min-height:100vh; background:var(--bg); display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:22px; color:var(--gold); }
  .loading-dot { animation:pulse 1.2s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
`

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

export default function AvailabilityPage() {
  const [user, setUser]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const [saved, setSaved]         = useState(false)
  const [toast, setToast]         = useState(null)
  const [activeTab, setActiveTab] = useState('availability')
  const router = useRouter()

  // Schedule state
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE)
  const [buffer, setBuffer]     = useState('0')
  const [maxAppts, setMaxAppts] = useState('')
  const [timezone, setTimezone] = useState('America/New_York')

  // Blocked dates
  const [blockedDates, setBlockedDates] = useState([
    { id:1, date:'2026-03-15', reason:'Personal day' },
    { id:2, date:'2026-03-28', reason:'Holiday' },
  ])
  const [newDate, setNewDate]     = useState('')
  const [newReason, setNewReason] = useState('')

  useEffect(() => {
    async function getUser() {
      const { data:{ user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      setLoading(false)
      // TODO: load availability from Supabase
      // const { data } = await supabase.from('availability').select('*').eq('user_id', user.id).single()
      // if (data) { setSchedule(data.schedule); setBuffer(data.buffer); etc. }
    }
    getUser()
  }, [])

  const toggleDay = (key) => {
    setSchedule(s => ({ ...s, [key]: { ...s[key], active: !s[key].active } }))
  }

  const updateTime = (key, field, value) => {
    setSchedule(s => ({ ...s, [key]: { ...s[key], [field]: value } }))
  }

  // Copy Monday hours to all active days
  const copyMonToAll = () => {
    const { start, end } = schedule.mon
    setSchedule(s => {
      const updated = { ...s }
      DAYS.forEach(d => {
        if (updated[d.key].active) {
          updated[d.key] = { ...updated[d.key], start, end }
        }
      })
      return updated
    })
    showToast('✓ Hours copied to all active days')
  }

  const addBlockedDate = () => {
    if (!newDate) return
    const formatted = new Date(newDate + 'T12:00:00').toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' })
    setBlockedDates(b => [...b, { id: Date.now(), date: newDate, displayDate: formatted, reason: newReason || 'Day off' }])
    setNewDate('')
    setNewReason('')
  }

  const removeBlockedDate = (id) => {
    setBlockedDates(b => b.filter(d => d.id !== id))
  }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = async () => {
    // TODO: save to Supabase
    // await supabase.from('availability').upsert({
    //   user_id: user.id,
    //   schedule,
    //   buffer: parseInt(buffer),
    //   max_appointments: maxAppts ? parseInt(maxAppts) : null,
    //   timezone,
    //   blocked_dates: blockedDates,
    //   updated_at: new Date().toISOString(),
    // })
    setSaved(true)
    showToast('✓ Availability saved successfully')
    setTimeout(() => setSaved(false), 2500)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || ''
  const initials  = user?.email ? user.email[0].toUpperCase() : '?'

  if (loading) return (
    <>
      <style>{css}</style>
      <div className="loading-screen">
        Booked<em style={{color:'#C9A84C',fontStyle:'italic'}}>Out</em>
        <span className="loading-dot" style={{marginLeft:4}}>…</span>
      </div>
    </>
  )

  return (
    <>
      <style>{css}</style>
      <div className="layout">

        {/* SIDEBAR */}
        <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
          <div className="sidebar-header">
            <a className="sidebar-logo" href="/dashboard">Booked<em>Out</em></a>
            <button className="sidebar-toggle" onClick={() => setCollapsed(c => !c)}>
              <Icon name={collapsed ? 'chevronRight' : 'chevronLeft'} size={13}/>
            </button>
          </div>
          <nav className="sidebar-nav">
            {navItems.map(item => (
              <a key={item.label} className={`nav-item${item.active ? ' active' : ''}`} href={item.href}>
                <span className="nav-icon"><Icon name={item.icon} size={16} color={item.active ? '#C9A84C' : 'currentColor'}/></span>
                <span className="nav-label">{item.label}</span>
                <span className="nav-tooltip">{item.label}</span>
              </a>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="sidebar-user">
              <div className="user-avatar">{initials}</div>
              <div className="user-info">
                <div className="user-name">{firstName}</div>
                <div className="user-plan">Solo Plan · Free Trial</div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">

          {/* Topbar */}
          <header className="topbar">
            <div className="topbar-title">Set<em>tings</em></div>
            <div className="topbar-right">
              <button className={`save-btn${saved ? ' saved' : ''}`} onClick={handleSave}>
                <Icon name={saved ? 'check' : 'save'} size={14} color="#0A0908"/>
                {saved ? 'Saved!' : 'Save Changes'}
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                <Icon name="logout" size={13}/>
                Log out
              </button>
            </div>
          </header>

          {/* Settings tabs */}
          <div className="settings-tabs">
            {[
              ['availability', 'My Availability'],
              ['profile',      'Profile'],
              ['services',     'Services'],
              ['notifications','Notifications'],
              ['billing',      'Billing'],
            ].map(([key, label]) => (
              <div key={key}
                className={`settings-tab${activeTab === key ? ' active' : ''}`}
                onClick={() => setActiveTab(key)}>
                {label}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="content">

            {activeTab === 'availability' && (
              <>
                {/* Info banner */}
                <div className="info-banner">
                  <Icon name="info" size={15} color="#C9A84C"/>
                  <div className="info-banner-text">
                    Set your working hours for each day. These hours will be reflected on your calendar
                    and your <strong>public booking page</strong> so clients can only book during your available times.
                    Changes take effect immediately after saving.
                  </div>
                </div>

                {/* Weekly Schedule */}
                <div className="section">
                  <div className="section-header">
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                      <div>
                        <div className="section-title">Weekly Schedule</div>
                        <div className="section-sub">Toggle days on or off and set your start and end time for each day.</div>
                      </div>
                      <button className="copy-btn" onClick={copyMonToAll}>
                        Copy Monday hours to all active days
                      </button>
                    </div>
                  </div>

                  <div className="panel">
                    {DAYS.map(day => {
                      const d = schedule[day.key]
                      const hrs = calcHours(d.start, d.end)
                      return (
                        <div key={day.key} className={`day-row${!d.active ? ' inactive' : ''}`}>
                          {/* Toggle */}
                          <div className="toggle-wrap" onClick={() => toggleDay(day.key)}>
                            <button className={`toggle${d.active ? ' on' : ' off'}`}>
                              <div className="toggle-knob"/>
                            </button>
                            <span className="toggle-label">{day.label}</span>
                          </div>

                          {/* Time selectors */}
                          <div className="time-row">
                            {d.active ? (
                              <>
                                <span className="time-label">From</span>
                                <select className="time-select" value={d.start}
                                  onChange={e => updateTime(day.key, 'start', e.target.value)}>
                                  {TIMES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                                <span className="time-separator">→</span>
                                <span className="time-label">To</span>
                                <select className="time-select" value={d.end}
                                  onChange={e => updateTime(day.key, 'end', e.target.value)}>
                                  {TIMES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                                {hrs && <div className="hours-badge">{hrs}</div>}
                              </>
                            ) : (
                              <span style={{fontSize:'13px', color:'var(--text-3)'}}>Day off</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Booking Preferences */}
                <div className="section">
                  <div className="section-header">
                    <div className="section-title">Booking Preferences</div>
                    <div className="section-sub">Control buffer time between appointments and daily limits.</div>
                  </div>
                  <div className="panel">
                    <div className="option-grid">
                      <div className="option-field">
                        <label className="option-label">Buffer Between Appointments</label>
                        <select className="option-select" value={buffer} onChange={e => setBuffer(e.target.value)}>
                          {BUFFERS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                        </select>
                        <div className="option-hint">A gap added automatically after each appointment so you can clean up, take a break, or prepare.</div>
                      </div>
                      <div className="option-field">
                        <label className="option-label">Max Appointments Per Day</label>
                        <input className="option-input" type="number" min="1" max="30"
                          placeholder="No limit"
                          value={maxAppts} onChange={e => setMaxAppts(e.target.value)}/>
                        <div className="option-hint">Leave blank for no daily limit. Once reached, your booking page will show no availability for that day.</div>
                      </div>
                      <div className="option-field">
                        <label className="option-label">Your Timezone</label>
                        <select className="option-select" value={timezone} onChange={e => setTimezone(e.target.value)}>
                          <option value="America/New_York">Eastern Time (ET)</option>
                          <option value="America/Chicago">Central Time (CT)</option>
                          <option value="America/Denver">Mountain Time (MT)</option>
                          <option value="America/Los_Angeles">Pacific Time (PT)</option>
                          <option value="America/Anchorage">Alaska Time (AKT)</option>
                          <option value="Pacific/Honolulu">Hawaii Time (HT)</option>
                        </select>
                        <div className="option-hint">All appointment times will be displayed in this timezone.</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blocked Dates */}
                <div className="section">
                  <div className="section-header">
                    <div className="section-title">Blocked Dates</div>
                    <div className="section-sub">Block out specific dates for vacations, personal days, or holidays. Clients won't be able to book on these days.</div>
                  </div>
                  <div className="panel">
                    <div className="panel-header">
                      <div>
                        <div className="panel-title">Upcoming Blocked Dates</div>
                        <div className="panel-sub">{blockedDates.length} date{blockedDates.length !== 1 ? 's' : ''} blocked</div>
                      </div>
                    </div>

                    {blockedDates.length === 0 ? (
                      <div className="empty-blocked">No blocked dates. Add one below.</div>
                    ) : (
                      <div className="blocked-list">
                        {blockedDates.map(b => {
                          const display = b.displayDate || new Date(b.date + 'T12:00:00').toLocaleDateString('en-US', { weekday:'short', month:'long', day:'numeric', year:'numeric' })
                          return (
                            <div className="blocked-item" key={b.id}>
                              <div style={{width:6, height:6, borderRadius:'50%', background:'var(--rose)', flexShrink:0}}/>
                              <div className="blocked-date">{display}</div>
                              <div className="blocked-reason">{b.reason}</div>
                              <button className="blocked-remove" onClick={() => removeBlockedDate(b.id)}>
                                <Icon name="x" size={12}/>
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Add new blocked date */}
                    <div className="add-blocked">
                      <input className="add-blocked-input" type="date" value={newDate}
                        onChange={e => setNewDate(e.target.value)}/>
                      <input className="add-blocked-input" type="text"
                        placeholder="Reason (optional)"
                        value={newReason} onChange={e => setNewReason(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addBlockedDate()}
                        style={{maxWidth:'180px'}}/>
                      <button className="add-blocked-btn" onClick={addBlockedDate}>
                        <Icon name="plus" size={13}/>
                        Block Date
                      </button>
                    </div>
                  </div>
                </div>

                {/* Save reminder */}
                <div style={{display:'flex', justifyContent:'flex-end', paddingBottom:'20px'}}>
                  <button className={`save-btn${saved ? ' saved' : ''}`} onClick={handleSave} style={{fontSize:'14px', height:'42px', padding:'0 28px'}}>
                    <Icon name={saved ? 'check' : 'save'} size={15} color="#0A0908"/>
                    {saved ? 'Saved!' : 'Save Availability'}
                  </button>
                </div>
              </>
            )}

            {activeTab !== 'availability' && (
              <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'300px', color:'var(--text-3)', gap:'12px'}}>
                <div style={{fontSize:'32px', opacity:0.3}}>⚙</div>
                <div style={{fontSize:'14px'}}>This section is coming soon.</div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div className={`toast${toast.type === 'success' ? ' success' : ''}`}>
          <Icon name="check" size={14} color="#4E9B6F"/>
          {toast.msg}
        </div>
      )}
    </>
  )
}