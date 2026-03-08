'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

const supabase = createClient()

// ── ICONS ──
const Icon = ({ name, size = 16, color = 'currentColor' }) => {
  const icons = {
    grid:        <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    calendar:    <><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></>,
    users:       <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    bell:        <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    settings:    <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    logout:      <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    chevronLeft: <polyline points="15 18 9 12 15 6"/>,
    chevronRight:<polyline points="9 18 15 12 9 6"/>,
    plus:        <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    x:           <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    clock:       <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    user:        <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    scissors:    <><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></>,
    dollar:      <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    check:       <polyline points="20 6 9 17 4 12"/>,
    trash:       <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>,
    today:       <><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/><path d="M8 13h8M8 17h5"/></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  )
}

// ── SERVICE COLOR MAP ──
const serviceColors = {
  'Fade':           '#C9A84C',
  'Fade + Line-up': '#C9A84C',
  'Beard Trim':     '#C9A84C',
  'Line-up':        '#C9A84C',
  'Color':          '#4E9B6F',
  'Color Treatment':'#4E9B6F',
  'Highlights':     '#4E9B6F',
  'Blowout':        '#4E9B6F',
  'Full Set':       '#B87460',
  'Fill':           '#B87460',
  'Pedicure':       '#B87460',
  'Facial':         '#9B7EC8',
  'Wax':            '#9B7EC8',
  'Lash Set':       '#7EB8C9',
  'default':        '#C9A84C',
}

const getColor = (service = '') => {
  for (const key of Object.keys(serviceColors)) {
    if (service.toLowerCase().includes(key.toLowerCase())) return serviceColors[key]
  }
  return serviceColors.default
}

// ── SAMPLE EVENTS ──
const today = new Date()
const y = today.getFullYear(), m = String(today.getMonth()+1).padStart(2,'0'), d = String(today.getDate()).padStart(2,'0')
const td = `${y}-${m}-${d}`

const sampleEvents = [
  { id:'1', title:'Jordan Smith',    extendedProps:{ service:'Fade + Line-up', duration:'45 min', clientId:'1' }, start:`${td}T09:00:00`, end:`${td}T09:45:00` },
  { id:'2', title:'Aaliyah Laurent', extendedProps:{ service:'Color Treatment', duration:'90 min', clientId:'2' }, start:`${td}T10:30:00`, end:`${td}T12:00:00` },
  { id:'3', title:'Nina Clarke',     extendedProps:{ service:'Full Set',        duration:'60 min', clientId:'3' }, start:`${td}T12:00:00`, end:`${td}T13:00:00` },
  { id:'4', title:'Marcus Webb',     extendedProps:{ service:'Beard Trim',      duration:'30 min', clientId:'4' }, start:`${td}T13:30:00`, end:`${td}T14:00:00` },
  { id:'5', title:'Simone Davis',    extendedProps:{ service:'Highlights',      duration:'2 hr',   clientId:'5' }, start:`${td}T14:30:00`, end:`${td}T16:30:00` },
]

const navItems = [
  { label:'Dashboard', icon:'grid',     href:'/dashboard', active:false },
  { label:'Calendar',  icon:'calendar', href:'/calendar',  active:true  },
  { label:'Clients',   icon:'users',    href:'/clients',   active:false },
  { label:'Reminders', icon:'bell',     href:'/reminders', active:false },
  { label:'Settings',  icon:'settings', href:'/settings',  active:false },
]

const SPECIALTIES = ['Barber','Hair Stylist','Nail Technician','Esthetician','Lash / Brow Artist','Spa / Massage','Makeup Artist','Other']
const SERVICES    = ['Fade','Fade + Line-up','Beard Trim','Line-up','Color Treatment','Highlights','Blowout','Full Set','Fill','Pedicure','Facial','Wax','Lash Set','Other']

// ── STYLES ──
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#0A0908; --surface:#111010; --surface-2:#181716; --surface-3:#1F1E1C;
    --border:#272523; --border-2:#312F2D; --text:#F0EDE8; --text-2:#9B9690;
    --text-3:#5C5955; --gold:#C9A84C; --gold-bg:rgba(201,168,76,0.08);
    --green:#4E9B6F; --rose:#B87460;
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
  .nav-label { transition:opacity 0.15s, width 0.15s; overflow:hidden; }
  .sidebar.collapsed .nav-label { opacity:0; width:0; }
  .nav-tooltip { position:absolute; left:calc(100% + 10px); top:50%; transform:translateY(-50%); background:var(--surface-3); border:1px solid var(--border-2); color:var(--text-2); font-size:11px; font-weight:500; padding:4px 10px; border-radius:6px; white-space:nowrap; opacity:0; pointer-events:none; transition:opacity 0.15s; z-index:100; }
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
  .topbar-left { display:flex; align-items:center; gap:16px; }
  .topbar-title { font-family:var(--font-display); font-size:20px; color:var(--text); }
  .topbar-title em { color:var(--gold); font-style:italic; }
  .view-tabs { display:flex; gap:2px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; padding:3px; }
  .view-tab { padding:5px 14px; border-radius:6px; font-size:12px; font-weight:500; color:var(--text-3); cursor:pointer; transition:all 0.15s; border:none; background:none; font-family:var(--font-body); }
  .view-tab.active { background:var(--surface-3); color:var(--text); border:1px solid var(--border-2); }
  .topbar-right { display:flex; align-items:center; gap:10px; }
  .nav-btn { width:34px; height:34px; border-radius:8px; background:var(--surface-2); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text-3); transition:all 0.15s; }
  .nav-btn:hover { background:var(--surface-3); color:var(--text-2); }
  .today-btn { display:flex; align-items:center; gap:6px; padding:0 14px; height:34px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; font-size:12px; font-weight:500; color:var(--text-2); cursor:pointer; transition:all 0.15s; font-family:var(--font-body); }
  .today-btn:hover { background:var(--surface-3); color:var(--text); }
  .week-label { font-size:13px; font-weight:500; color:var(--text-2); min-width:160px; text-align:center; }
  .new-appt-btn { display:flex; align-items:center; gap:7px; padding:0 18px; height:34px; background:var(--gold); color:#0A0908; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.15s; font-family:var(--font-body); }
  .new-appt-btn:hover { background:#D4B558; box-shadow:0 4px 16px rgba(201,168,76,0.3); transform:translateY(-1px); }

  /* CALENDAR CONTAINER */
  .cal-wrap { flex:1; overflow:hidden; padding:0; position:relative; }

  /* FULLCALENDAR OVERRIDES */
  .fc { height:100% !important; font-family:var(--font-body) !important; }
  .fc-theme-standard td, .fc-theme-standard th { border-color: var(--border) !important; }
  .fc-theme-standard .fc-scrollgrid { border-color: var(--border) !important; }
  .fc-col-header { background: var(--surface) !important; }
  .fc-col-header-cell { padding: 10px 0 !important; }
  .fc-col-header-cell-cushion { font-size: 11px !important; font-weight: 600 !important; letter-spacing: 0.06em !important; text-transform: uppercase !important; color: var(--text-3) !important; text-decoration: none !important; }
  .fc-col-header-cell.fc-day-today .fc-col-header-cell-cushion { color: var(--gold) !important; }
  .fc-timegrid-slot { height: 48px !important; background: var(--bg) !important; }
  .fc-timegrid-slot-label { font-size: 10px !important; color: var(--text-3) !important; font-weight: 500 !important; padding-right: 10px !important; }
  .fc-timegrid-slot-lane { border-color: var(--border) !important; }
  .fc-timegrid-slot-minor { border-color: rgba(39,37,35,0.4) !important; }
  .fc-day-today { background: rgba(201,168,76,0.03) !important; }
  .fc-timegrid-now-indicator-line { border-color: var(--gold) !important; border-width: 1.5px !important; }
  .fc-timegrid-now-indicator-arrow { border-top-color: var(--gold) !important; border-bottom-color: var(--gold) !important; }
  .fc-event { border: none !important; border-radius: 6px !important; cursor: pointer !important; }
  .fc-event:hover { filter: brightness(1.1) !important; }
  .fc-event-main { padding: 5px 8px !important; }
  .fc-daygrid-event { border-radius: 4px !important; }
  .fc-scrollgrid-sync-inner { background: var(--surface) !important; }
  .fc-timegrid-axis { background: var(--surface) !important; }
  .fc-scroller { background: var(--bg) !important; }
  .fc-scroller::-webkit-scrollbar { width: 5px; }
  .fc-scroller::-webkit-scrollbar-thumb { background: var(--border-2); border-radius: 99px; }
  .fc-highlight { background: rgba(201,168,76,0.08) !important; }
  .fc-non-business { background: rgba(0,0,0,0.15) !important; }

  /* MODAL OVERLAY */
  .modal-overlay {
    position:fixed; inset:0; z-index:200;
    background:rgba(0,0,0,0.7); backdrop-filter:blur(4px);
    display:flex; align-items:center; justify-content:center;
    padding:24px;
    animation:fadeIn 0.15s ease;
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .modal {
    background:var(--surface); border:1px solid var(--border-2);
    border-radius:16px; width:100%; max-width:480px;
    box-shadow:0 32px 80px rgba(0,0,0,0.7);
    animation:slideUp 0.2s cubic-bezier(0.16,1,0.3,1);
    overflow:hidden;
  }
  @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .modal-header {
    display:flex; align-items:center; justify-content:space-between;
    padding:20px 24px; border-bottom:1px solid var(--border);
  }
  .modal-title { font-family:var(--font-display); font-size:20px; color:var(--text); }
  .modal-close { width:28px; height:28px; border-radius:6px; background:var(--surface-2); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text-3); transition:all 0.15s; }
  .modal-close:hover { background:var(--surface-3); color:var(--text); }
  .modal-body { padding:24px; display:flex; flex-direction:column; gap:16px; }
  .modal-footer { padding:16px 24px; border-top:1px solid var(--border); display:flex; gap:10px; justify-content:flex-end; }

  /* FORM FIELDS */
  .field { display:flex; flex-direction:column; gap:6px; }
  .field-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .field-label { font-size:11px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:var(--text-3); }
  .field-input { height:42px; padding:0 12px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; font-size:13px; color:var(--text); font-family:var(--font-body); outline:none; transition:border-color 0.15s, box-shadow 0.15s; }
  .field-input::placeholder { color:var(--text-3); }
  .field-input:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(201,168,76,0.1); }
  select.field-input { cursor:pointer; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235C5955' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; padding-right:32px; -webkit-appearance:none; }
  select.field-input option { background:var(--surface-2); }

  /* MODAL BUTTONS */
  .btn-primary { display:flex; align-items:center; gap:6px; padding:0 20px; height:38px; background:var(--gold); color:#0A0908; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.15s; font-family:var(--font-body); }
  .btn-primary:hover { background:#D4B558; box-shadow:0 4px 16px rgba(201,168,76,0.3); }
  .btn-secondary { display:flex; align-items:center; gap:6px; padding:0 16px; height:38px; background:transparent; color:var(--text-2); border:1px solid var(--border); border-radius:8px; font-size:13px; cursor:pointer; transition:all 0.15s; font-family:var(--font-body); }
  .btn-secondary:hover { background:var(--surface-2); color:var(--text); }
  .btn-danger { display:flex; align-items:center; gap:6px; padding:0 16px; height:38px; background:transparent; color:#B85555; border:1px solid rgba(184,85,85,0.3); border-radius:8px; font-size:13px; cursor:pointer; transition:all 0.15s; font-family:var(--font-body); margin-right:auto; }
  .btn-danger:hover { background:rgba(184,85,85,0.08); }

  /* EVENT DETAIL MODAL */
  .event-detail { display:flex; flex-direction:column; gap:0; }
  .detail-color-bar { height:4px; }
  .detail-body { padding:24px; display:flex; flex-direction:column; gap:14px; }
  .detail-name { font-family:var(--font-display); font-size:24px; color:var(--text); }
  .detail-row { display:flex; align-items:center; gap:10px; font-size:13px; color:var(--text-2); }
  .detail-icon { color:var(--text-3); flex-shrink:0; }
  .detail-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:99px; font-size:11px; font-weight:600; }

  /* LOADING */
  .loading-screen { min-height:100vh; background:var(--bg); display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:22px; color:var(--gold); }
  .loading-dot { animation:pulse 1.2s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }

  /* COLOR DOT */
  .color-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }

  /* LEGEND */
  .cal-legend { display:flex; align-items:center; gap:16px; padding:0 20px 12px; }
  .legend-item { display:flex; align-items:center; gap:6px; font-size:11px; color:var(--text-3); }
  .legend-dot { width:8px; height:8px; border-radius:50%; }
`

// ── EVENT CONTENT RENDERER ──
function renderEvent(info) {
  const { event } = info
  const color = getColor(event.extendedProps.service)
  const start = event.start ? event.start.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit', hour12:true }) : ''
  return (
    <div style={{
      background: `${color}18`,
      border: `1px solid ${color}40`,
      borderLeft: `3px solid ${color}`,
      borderRadius: '5px',
      padding: '4px 7px',
      height: '100%',
      overflow: 'hidden',
    }}>
      <div style={{ fontSize:'11px', fontWeight:700, color, marginBottom:'1px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
        {event.title}
      </div>
      <div style={{ fontSize:'10px', color:'rgba(240,237,232,0.7)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
        {event.extendedProps.service}
      </div>
      <div style={{ fontSize:'10px', color:'rgba(155,150,144,0.8)', marginTop:'1px' }}>
        {start} · {event.extendedProps.duration}
      </div>
    </div>
  )
}

// ── MAIN COMPONENT ──
export default function CalendarPage() {
  const [user, setUser]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const [view, setView]           = useState('timeGridWeek')
  const [weekLabel, setWeekLabel] = useState('')
  const [events, setEvents]       = useState(sampleEvents)

  // Modals
  const [newModal, setNewModal]         = useState(false)
  const [detailModal, setDetailModal]   = useState(null) // event object
  const [selectedSlot, setSelectedSlot] = useState(null)

  // New appointment form
  const [form, setForm] = useState({ clientName:'', service:'', date:'', startTime:'', duration:'60', notes:'' })

  const calRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const { data:{ user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

  // Update week label when calendar navigates
  const updateLabel = () => {
    const api = calRef.current?.getApi()
    if (!api) return
    const d = api.view.currentStart
    const end = api.view.currentEnd
    if (view === 'timeGridWeek') {
      const s = d.toLocaleDateString('en-US', { month:'short', day:'numeric' })
      const e = new Date(end.getTime() - 86400000).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })
      setWeekLabel(`${s} — ${e}`)
    } else if (view === 'timeGridDay') {
      setWeekLabel(d.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' }))
    } else {
      setWeekLabel(d.toLocaleDateString('en-US', { month:'long', year:'numeric' }))
    }
  }

  const goToday  = () => { calRef.current?.getApi().today();  updateLabel() }
  const goPrev   = () => { calRef.current?.getApi().prev();   updateLabel() }
  const goNext   = () => { calRef.current?.getApi().next();   updateLabel() }
  const setViewMode = (v) => { setView(v); calRef.current?.getApi().changeView(v); setTimeout(updateLabel, 50) }

  const handleDateClick = (info) => {
    const d = new Date(info.dateStr || info.date)
    const dateStr = d.toISOString().split('T')[0]
    const timeStr = d.toTimeString().slice(0,5)
    setForm(f => ({ ...f, date:dateStr, startTime:timeStr }))
    setNewModal(true)
  }

  const handleEventClick = (info) => {
    setDetailModal(info.event)
  }

  const handleAddAppointment = () => {
    if (!form.clientName || !form.service || !form.date || !form.startTime) return
    const start = new Date(`${form.date}T${form.startTime}`)
    const end   = new Date(start.getTime() + parseInt(form.duration) * 60000)
    const newEvent = {
      id: String(Date.now()),
      title: form.clientName,
      extendedProps: { service: form.service, duration: `${form.duration} min` },
      start: start.toISOString(),
      end:   end.toISOString(),
    }
    setEvents(e => [...e, newEvent])
    setNewModal(false)
    setForm({ clientName:'', service:'', date:'', startTime:'', duration:'60', notes:'' })
  }

  const handleDeleteEvent = () => {
    if (!detailModal) return
    setEvents(e => e.filter(ev => ev.id !== detailModal.id))
    setDetailModal(null)
  }

  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || ''
  const initials  = user?.email ? user.email[0].toUpperCase() : '?'

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <>
      <style>{css}</style>
      <div className="loading-screen">
        Booked<em style={{color:'#C9A84C',fontStyle:'italic'}}>Out</em>
        <span className="loading-dot" style={{marginLeft:4}}>…</span>
      </div>
    </>
  )

  const detailColor = detailModal ? getColor(detailModal.extendedProps?.service) : '#C9A84C'
  const detailStart = detailModal?.start ? new Date(detailModal.start).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit',hour12:true}) : ''
  const detailDate  = detailModal?.start ? new Date(detailModal.start).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}) : ''

  return (
    <>
      <style>{css}</style>
      <div className="layout">

        {/* ── SIDEBAR ── */}
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

        {/* ── MAIN ── */}
        <div className="main">

          {/* Topbar */}
          <header className="topbar">
            <div className="topbar-left">
              <div className="topbar-title">Cal<em>endar</em></div>
              {/* View tabs */}
              <div className="view-tabs">
                {[['timeGridDay','Day'],['timeGridWeek','Week'],['dayGridMonth','Month']].map(([v,label]) => (
                  <button key={v} className={`view-tab${view===v?' active':''}`} onClick={() => setViewMode(v)}>{label}</button>
                ))}
              </div>
            </div>
            <div className="topbar-right">
              {/* Nav controls */}
              <button className="today-btn" onClick={goToday}>
                <Icon name="today" size={13}/>
                Today
              </button>
              <button className="nav-btn" onClick={goPrev}><Icon name="chevronLeft" size={14}/></button>
              <span className="week-label">{weekLabel}</span>
              <button className="nav-btn" onClick={goNext}><Icon name="chevronRight" size={14}/></button>
              {/* New appointment */}
              <button className="new-appt-btn" onClick={() => setNewModal(true)}>
                <Icon name="plus" size={14} color="#0A0908"/>
                New Appointment
              </button>
            </div>
          </header>

          {/* Legend */}
          <div className="cal-legend" style={{background:'var(--surface)', borderBottom:'1px solid var(--border)', paddingTop:'10px'}}>
            {[['#C9A84C','Hair / Barber'],['#4E9B6F','Color / Styling'],['#B87460','Nails / Skin'],['#9B7EC8','Esthetics'],['#7EB8C9','Lash / Brow']].map(([color, label]) => (
              <div className="legend-item" key={label}>
                <div className="legend-dot" style={{background:color}}/>
                {label}
              </div>
            ))}
          </div>

          {/* Calendar */}
          <div className="cal-wrap">
            <FullCalendar
              ref={calRef}
              plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={false}
              events={events}
              eventContent={renderEvent}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              selectable={true}
              selectMirror={true}
              select={handleDateClick}
              nowIndicator={true}
              scrollTime="08:00:00"
              slotMinTime="07:00:00"
              slotMaxTime="21:00:00"
              slotDuration="00:30:00"
              slotLabelInterval="01:00:00"
              allDaySlot={false}
              expandRows={true}
              height="100%"
              datesSet={updateLabel}
              businessHours={{ daysOfWeek:[1,2,3,4,5,6], startTime:'09:00', endTime:'19:00' }}
            />
          </div>
        </div>
      </div>

      {/* ── NEW APPOINTMENT MODAL ── */}
      {newModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setNewModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">New Appointment</div>
              <button className="modal-close" onClick={() => setNewModal(false)}>
                <Icon name="x" size={14}/>
              </button>
            </div>
            <div className="modal-body">
              <div className="field">
                <label className="field-label">Client Name</label>
                <input className="field-input" type="text" placeholder="e.g. Jordan Smith"
                  value={form.clientName} onChange={e => setForm(f=>({...f,clientName:e.target.value}))}/>
              </div>
              <div className="field">
                <label className="field-label">Service</label>
                <select className="field-input" value={form.service} onChange={e => setForm(f=>({...f,service:e.target.value}))}>
                  <option value="" disabled>Select a service…</option>
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="field-row">
                <div className="field">
                  <label className="field-label">Date</label>
                  <input className="field-input" type="date" value={form.date}
                    onChange={e => setForm(f=>({...f,date:e.target.value}))}/>
                </div>
                <div className="field">
                  <label className="field-label">Start Time</label>
                  <input className="field-input" type="time" value={form.startTime}
                    onChange={e => setForm(f=>({...f,startTime:e.target.value}))}/>
                </div>
              </div>
              <div className="field">
                <label className="field-label">Duration</label>
                <select className="field-input" value={form.duration} onChange={e => setForm(f=>({...f,duration:e.target.value}))}>
                  {[['15','15 minutes'],['30','30 minutes'],['45','45 minutes'],['60','1 hour'],['75','1 hr 15 min'],['90','1 hr 30 min'],['105','1 hr 45 min'],['120','2 hours'],['150','2 hr 30 min'],['180','3 hours']].map(([v,l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="field-label">Notes <span style={{color:'var(--text-3)',fontWeight:400,textTransform:'none',letterSpacing:0}}>(optional)</span></label>
                <textarea className="field-input" placeholder="Service notes, preferences…"
                  style={{height:'72px',resize:'none',padding:'10px 12px',lineHeight:'1.5'}}
                  value={form.notes} onChange={e => setForm(f=>({...f,notes:e.target.value}))}/>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setNewModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAddAppointment}>
                <Icon name="check" size={13} color="#0A0908"/>
                Add Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EVENT DETAIL MODAL ── */}
      {detailModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDetailModal(null)}>
          <div className="modal">
            <div className="detail-color-bar" style={{background: detailColor}}/>
            <div className="modal-header" style={{borderBottom:'1px solid var(--border)'}}>
              <div className="modal-title">Appointment Details</div>
              <button className="modal-close" onClick={() => setDetailModal(null)}>
                <Icon name="x" size={14}/>
              </button>
            </div>
            <div className="detail-body">
              <div className="detail-name">{detailModal.title}</div>
              <div className="detail-row">
                <span className="detail-icon"><Icon name="scissors" size={14}/></span>
                <div className="detail-badge" style={{background:`${detailColor}18`, color:detailColor, border:`1px solid ${detailColor}35`}}>
                  <div style={{width:6,height:6,borderRadius:'50%',background:detailColor}}/>
                  {detailModal.extendedProps?.service}
                </div>
              </div>
              <div className="detail-row">
                <span className="detail-icon"><Icon name="calendar" size={14}/></span>
                {detailDate}
              </div>
              <div className="detail-row">
                <span className="detail-icon"><Icon name="clock" size={14}/></span>
                {detailStart} · {detailModal.extendedProps?.duration}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-danger" onClick={handleDeleteEvent}>
                <Icon name="trash" size={13} color="#B85555"/>
                Delete
              </button>
              <button className="btn-secondary" onClick={() => setDetailModal(null)}>Close</button>
              <button className="btn-primary">
                <Icon name="check" size={13} color="#0A0908"/>
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}