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
    save:        <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>,
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
  { key:'sun', label:'Sunday' },
  { key:'mon', label:'Monday' },
  { key:'tue', label:'Tuesday' },
  { key:'wed', label:'Wednesday' },
  { key:'thu', label:'Thursday' },
  { key:'fri', label:'Friday' },
  { key:'sat', label:'Saturday' },
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

const SERVICE_CATEGORIES = { hair:'Hair', nails:'Nails', skin:'Skin', lash:'Lash/Brow', other:'Other' }

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

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  :root {
    --bg:#0A0908; --surface:#111010; --surface-2:#181716; --surface-3:#1F1E1C;
    --border:#272523; --border-2:#312F2D; --text:#F0EDE8; --text-2:#9B9690;
    --text-3:#5C5955; --gold:#C9A84C; --gold-bg:rgba(201,168,76,0.08);
    --green:#4E9B6F; --green-bg:rgba(78,155,111,0.10); --red:#B85555;
    --rose:#B87460; --rose-bg:rgba(184,116,96,0.10);
    --sidebar-w:220px; --sidebar-collapsed:56px;
    --font-display:'Cormorant Garamond',serif; --font-body:'DM Sans',sans-serif;
  }
  html,body { height:100%; background:var(--bg); overflow:hidden; }
  body { font-family:var(--font-body); -webkit-font-smoothing:antialiased; color:var(--text); }
  .layout { display:flex; height:100vh; overflow:hidden; }

  /* ── SIDEBAR ── */
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

  /* ── MAIN ── */
  .main { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }

  /* ── TOPBAR ── */
  .topbar { height:56px; flex-shrink:0; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; padding:0 28px; background:var(--surface); }
  .topbar-title { font-family:var(--font-display); font-size:20px; color:var(--text); }
  .topbar-title em { color:var(--gold); font-style:italic; }
  .topbar-right { display:flex; align-items:center; gap:10px; }
  .save-btn { display:flex; align-items:center; gap:7px; padding:0 20px; height:36px; background:var(--gold); color:#0A0908; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.15s; font-family:var(--font-body); }
  .save-btn:hover { background:#D4B558; box-shadow:0 4px 16px rgba(201,168,76,0.3); transform:translateY(-1px); }
  .save-btn.saved { background:var(--green); }
  .logout-btn { display:flex; align-items:center; gap:6px; padding:0 14px; height:36px; background:transparent; border:1px solid var(--border); border-radius:8px; font-size:12px; font-weight:500; color:var(--text-3); cursor:pointer; transition:all 0.15s; font-family:var(--font-body); }
  .logout-btn:hover { border-color:#B85555; color:#B85555; }

  /* ── SETTINGS TABS ── */
  .settings-tabs { display:flex; gap:0; border-bottom:1px solid var(--border); background:var(--surface); padding:0 28px; flex-shrink:0; overflow-x:auto; }
  .settings-tab { padding:14px 18px; font-size:13px; font-weight:500; color:var(--text-3); cursor:pointer; border-bottom:2px solid transparent; transition:all 0.15s; margin-bottom:-1px; white-space:nowrap; }
  .settings-tab:hover { color:var(--text-2); }
  .settings-tab.active { color:var(--gold); border-bottom-color:var(--gold); }

  /* ── CONTENT ── */
  .content { flex:1; overflow-y:auto; padding:32px 28px; }
  .content::-webkit-scrollbar { width:5px; }
  .content::-webkit-scrollbar-thumb { background:var(--border-2); border-radius:99px; }

  /* ── SECTION ── */
  .section { margin-bottom:32px; }
  .section-header { margin-bottom:20px; }
  .section-title { font-family:var(--font-display); font-size:20px; color:var(--text); margin-bottom:4px; }
  .section-sub { font-size:13px; color:var(--text-3); line-height:1.6; }

  /* ── PANEL ── */
  .panel { background:var(--surface); border:1px solid var(--border); border-radius:12px; overflow:hidden; margin-bottom:16px; }
  .panel-header { padding:16px 20px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
  .panel-title { font-size:13px; font-weight:600; color:var(--text); }
  .panel-sub { font-size:11px; color:var(--text-3); margin-top:2px; }

  /* ── DAY ROWS ── */
  .day-row { display:flex; align-items:center; gap:16px; padding:14px 20px; border-bottom:1px solid var(--border); transition:background 0.12s; }
  .day-row:last-child { border-bottom:none; }
  .day-row:hover { background:var(--surface-2); }
  .day-row.inactive { opacity:0.45; }

  /* ── TOGGLE ── */
  .toggle-wrap { display:flex; align-items:center; gap:10px; width:120px; flex-shrink:0; cursor:pointer; }
  .toggle { width:38px; height:22px; border-radius:99px; position:relative; flex-shrink:0; transition:background 0.2s; cursor:pointer; border:none; background:transparent; padding:0; }
  .toggle.on  { background:var(--gold); }
  .toggle.off { background:var(--surface-3); border:1px solid var(--border-2); }
  .toggle-knob { position:absolute; top:3px; width:16px; height:16px; border-radius:50%; background:#fff; transition:left 0.2s cubic-bezier(0.4,0,0.2,1); }
  .toggle.on  .toggle-knob { left:19px; }
  .toggle.off .toggle-knob { left:3px; background:var(--text-3); }
  .toggle-label { font-size:13px; font-weight:500; color:var(--text); white-space:nowrap; }

  /* ── TIME SELECTS ── */
  .time-row { display:flex; align-items:center; gap:10px; flex:1; }
  .time-label { font-size:11px; color:var(--text-3); white-space:nowrap; }
  .time-select { height:36px; padding:0 10px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; font-size:13px; color:var(--text); font-family:var(--font-body); outline:none; cursor:pointer; transition:border-color 0.15s; min-width:110px; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%235C5955' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 10px center; padding-right:28px; -webkit-appearance:none; }
  .time-select:focus { border-color:var(--gold); }
  .time-select option { background:var(--surface-2); }
  .time-select:disabled { opacity:0.3; cursor:not-allowed; }
  .time-separator { font-size:12px; color:var(--text-3); }
  .hours-badge { font-size:10px; color:var(--text-3); background:var(--surface-3); border:1px solid var(--border); padding:2px 8px; border-radius:99px; white-space:nowrap; margin-left:auto; }
  .copy-btn { font-size:11px; color:var(--gold); background:none; border:none; cursor:pointer; font-family:var(--font-body); transition:opacity 0.15s; padding:0; }
  .copy-btn:hover { opacity:0.7; }

  /* ── OPTIONS ── */
  .option-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:20px; }
  .option-field { display:flex; flex-direction:column; gap:6px; }
  .option-label { font-size:11px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:var(--text-3); }
  .option-select { height:42px; padding:0 12px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; font-size:13px; color:var(--text); font-family:var(--font-body); outline:none; cursor:pointer; transition:border-color 0.15s; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%235C5955' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; padding-right:32px; -webkit-appearance:none; }
  .option-select:focus { border-color:var(--gold); }
  .option-select option { background:var(--surface-2); }
  .option-input { height:42px; padding:0 12px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; font-size:13px; color:var(--text); font-family:var(--font-body); outline:none; transition:border-color 0.15s; }
  .option-input:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(201,168,76,0.1); }
  .option-hint { font-size:11px; color:var(--text-3); margin-top:2px; line-height:1.5; }

  /* ── BLOCKED DATES ── */
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
  .empty-blocked { padding:24px; text-align:center; color:var(--text-3); font-size:13px; }

  /* ── INFO BANNER ── */
  .info-banner { display:flex; align-items:flex-start; gap:10px; padding:12px 16px; background:var(--gold-bg); border:1px solid rgba(201,168,76,0.2); border-radius:8px; margin-bottom:24px; }
  .info-banner-text { font-size:12px; color:var(--text-2); line-height:1.6; }
  .info-banner-text strong { color:var(--gold); }

  /* ── CARD SECTIONS (Profile / Notifications / Billing) ── */
  .card-section { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:24px; margin-bottom:16px; }
  .card-section-title { font-size:11px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:var(--text-3); margin-bottom:18px; }

  /* ── FIELDS ── */
  .field { margin-bottom:14px; }
  .field:last-child { margin-bottom:0; }
  .field-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px; }
  .field-grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin-bottom:14px; }
  .field-label { display:block; font-size:12px; font-weight:500; color:var(--text-2); margin-bottom:7px; }
  .field-label-opt { color:var(--text-3); font-weight:400; }
  .field-hint { font-size:11px; color:var(--text-3); margin-top:6px; }
  .field-input { width:100%; height:44px; padding:0 14px; background:var(--surface-2); border:1px solid var(--border); border-radius:6px; font-size:13px; color:var(--text); font-family:var(--font-body); outline:none; transition:border-color 0.15s, box-shadow 0.15s; }
  .field-input::placeholder { color:var(--text-3); }
  .field-input:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(201,168,76,0.1); }
  .field-input:disabled { opacity:0.4; cursor:not-allowed; }
  .field-select { cursor:pointer; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%235C5955' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 14px center; padding-right:36px; -webkit-appearance:none; }
  .field-select option { background:var(--surface-2); color:var(--text); }
  .field-textarea { height:90px; padding:12px 14px; resize:vertical; }

  /* ── BUTTONS ── */
  .btn-secondary { height:38px; padding:0 18px; background:transparent; color:var(--text-2); border:1px solid var(--border); border-radius:6px; font-size:12px; font-weight:500; font-family:var(--font-body); cursor:pointer; transition:all 0.15s; }
  .btn-secondary:hover { background:var(--surface-2); color:var(--text); border-color:var(--border-2); }
  .btn-danger { height:38px; padding:0 18px; background:rgba(184,85,85,0.12); color:#B85555; border:1px solid rgba(184,85,85,0.25); border-radius:6px; font-size:13px; font-weight:600; font-family:var(--font-body); cursor:pointer; transition:all 0.15s; }
  .btn-danger:hover { background:rgba(184,85,85,0.2); }
  .btn-upgrade { height:36px; padding:0 16px; background:var(--gold); color:#0A0908; border:none; border-radius:6px; font-size:12px; font-weight:600; font-family:var(--font-body); cursor:pointer; transition:all 0.15s; width:100%; margin-top:12px; }
  .btn-upgrade:hover { background:#D4B558; }
  .btn-add-service { width:100%; height:44px; background:transparent; border:1px dashed var(--border-2); border-radius:8px; color:var(--text-3); font-size:13px; font-family:var(--font-body); cursor:pointer; transition:all 0.15s; margin-top:8px; }
  .btn-add-service:hover { border-color:var(--gold); color:var(--gold); background:var(--gold-bg); }
  .btn-remove { width:28px; height:28px; background:transparent; border:1px solid var(--border); border-radius:50%; color:var(--text-3); cursor:pointer; transition:all 0.15s; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .btn-remove:hover { border-color:#B85555; color:#B85555; background:rgba(184,85,85,0.08); }
  .btn-row { display:flex; gap:10px; align-items:center; margin-top:16px; }
  .save-row { display:flex; justify-content:flex-end; margin-top:20px; }

  /* ── SERVICES ── */
  .services-list { display:flex; flex-direction:column; gap:8px; margin-bottom:8px; }
  .service-row { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; background:var(--surface); border:1px solid var(--border); border-radius:8px; transition:border-color 0.15s; }
  .service-row:hover { border-color:var(--border-2); }
  .service-info { flex:1; }
  .service-name { font-size:13px; font-weight:600; color:var(--text); margin-bottom:2px; }
  .service-meta { font-size:11px; color:var(--text-3); }
  .service-right { display:flex; align-items:center; gap:14px; }
  .service-price { font-size:14px; font-weight:600; color:var(--gold); }
  .add-service-form { background:var(--surface-2); border:1px solid var(--border); border-radius:10px; padding:20px; margin-top:8px; }
  .empty-state { text-align:center; padding:32px; font-size:13px; color:var(--text-3); }

  /* ── NOTIFICATIONS ── */
  .notif-row { display:flex; align-items:center; justify-content:space-between; padding:14px 0; border-bottom:1px solid var(--surface-3); }
  .notif-row:last-child { border-bottom:none; padding-bottom:0; }
  .notif-info { flex:1; padding-right:20px; }
  .notif-title { font-size:13px; font-weight:500; color:var(--text); margin-bottom:3px; }
  .notif-desc { font-size:12px; color:var(--text-3); line-height:1.5; }
  .notif-toggle { width:38px; height:22px; border-radius:99px; position:relative; cursor:pointer; border:none; padding:0; transition:background 0.2s; flex-shrink:0; }
  .notif-toggle.on  { background:var(--gold); }
  .notif-toggle.off { background:var(--surface-3); border:1px solid var(--border-2); }
  .notif-toggle-knob { position:absolute; top:3px; width:16px; height:16px; border-radius:50%; background:#fff; transition:left 0.2s; }
  .notif-toggle.on  .notif-toggle-knob { left:19px; }
  .notif-toggle.off .notif-toggle-knob { left:3px; background:var(--text-3); }

  /* ── BILLING ── */
  .billing-plan-card { background:var(--surface-2); border:1px solid rgba(201,168,76,0.2); border-radius:10px; padding:20px 24px; display:flex; align-items:center; justify-content:space-between; }
  .billing-plan-name { font-family:var(--font-display); font-size:22px; color:var(--text); margin-bottom:4px; }
  .billing-plan-price { font-size:26px; font-weight:600; color:var(--gold); margin-bottom:6px; }
  .billing-plan-period { font-size:13px; color:var(--text-3); font-weight:400; }
  .billing-plan-status { display:flex; align-items:center; gap:7px; font-size:12px; color:var(--text-3); }
  .status-dot { width:6px; height:6px; border-radius:50%; background:var(--green); flex-shrink:0; }
  .billing-plan-badge { padding:5px 12px; background:var(--green-bg); border:1px solid rgba(78,155,111,0.25); border-radius:99px; font-size:11px; font-weight:600; color:var(--green); }
  .plan-compare-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .plan-compare-card { background:var(--surface-2); border:1px solid var(--border); border-radius:10px; padding:20px; }
  .plan-compare-card.selected { border-color:rgba(201,168,76,0.3); background:rgba(201,168,76,0.04); }
  .plan-compare-name { font-family:var(--font-display); font-size:20px; color:var(--text); margin-bottom:4px; }
  .plan-compare-price { font-size:22px; font-weight:600; color:var(--gold); margin-bottom:8px; }
  .plan-compare-price span { font-size:13px; color:var(--text-3); font-weight:400; }
  .plan-compare-desc { font-size:12px; color:var(--text-3); line-height:1.55; }
  .plan-current-badge { display:inline-block; margin-top:12px; padding:4px 10px; background:var(--gold-bg); border:1px solid rgba(201,168,76,0.2); border-radius:99px; font-size:10px; font-weight:600; color:var(--gold); letter-spacing:0.06em; text-transform:uppercase; }
  .payment-row { display:flex; align-items:center; justify-content:space-between; }
  .payment-info { display:flex; align-items:center; gap:14px; }
  .payment-card-icon { font-size:22px; }
  .payment-card-label { font-size:13px; font-weight:500; color:var(--text); margin-bottom:2px; }
  .payment-card-exp { font-size:11px; color:var(--text-3); }
  .danger-section { border-color:rgba(184,85,85,0.2) !important; }
  .danger-title { font-size:11px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:#B85555; margin-bottom:18px; }
  .danger-desc { font-size:13px; color:var(--text-3); line-height:1.6; margin-bottom:16px; }
  .cancel-confirm { background:rgba(184,85,85,0.06); border:1px solid rgba(184,85,85,0.15); border-radius:8px; padding:16px; }
  .cancel-confirm-text { font-size:13px; color:var(--text-2); margin-bottom:14px; }

  /* ── TOAST ── */
  .toast { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); z-index:300; display:flex; align-items:center; gap:10px; padding:12px 20px; background:var(--surface-3); border:1px solid var(--border-2); border-radius:10px; font-size:13px; color:var(--text); box-shadow:0 8px 32px rgba(0,0,0,0.5); animation:toastIn 0.25s cubic-bezier(0.16,1,0.3,1); }
  .toast.success { border-color:rgba(78,155,111,0.4); }
  @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }

  /* ── LOADING ── */
  .loading-screen { min-height:100vh; background:var(--bg); display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:22px; color:var(--gold); }
  .loading-dot { animation:pulse 1.2s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
`

export default function SettingsPage() {
  const [user, setUser]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const [saved, setSaved]         = useState(false)
  const [toast, setToast]         = useState(null)
  const [activeTab, setActiveTab] = useState('availability')
  const router = useRouter()

  // ── Availability state ──────────────────────────────────────
  const [schedule, setSchedule]   = useState(DEFAULT_SCHEDULE)
  const [buffer, setBuffer]       = useState('0')
  const [maxAppts, setMaxAppts]   = useState('')
  const [timezone, setTimezone]   = useState('America/New_York')
  const [blockedDates, setBlockedDates] = useState([
    { id:1, date:'2026-03-15', reason:'Personal day' },
    { id:2, date:'2026-03-28', reason:'Holiday' },
  ])
  const [newDate, setNewDate]     = useState('')
  const [newReason, setNewReason] = useState('')

  // ── Profile state ───────────────────────────────────────────
  const [profile, setProfile] = useState({
    firstName:'', lastName:'', businessName:'', specialty:'', phone:'', bio:''
  })
  const setP = (k, v) => setProfile(p => ({ ...p, [k]: v }))

  // ── Services state ──────────────────────────────────────────
  const [services, setServices] = useState([
    { id:1, name:'Fade',           duration:45, price:45, category:'hair' },
    { id:2, name:'Fade + Line-up', duration:60, price:55, category:'hair' },
  ])
  const [showAddSvc, setShowAddSvc] = useState(false)
  const [newSvc, setNewSvc] = useState({ name:'', duration:'', price:'', category:'hair' })
  const setSvc = (k, v) => setNewSvc(s => ({ ...s, [k]: v }))

  // ── Notifications state ─────────────────────────────────────
  const [notifPrefs, setNotifPrefs] = useState({
    reminder24h:true, reminder1h:true, bookingConfirm:true,
    reviewRequest:true, winBack:true, birthday:true, newsletter:false,
  })

  // ── Billing state ───────────────────────────────────────────
  const [showCancel, setShowCancel] = useState(false)

  // ── Auth ────────────────────────────────────────────────────
  useEffect(() => {
    async function getUser() {
      const { data:{ user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const meta = user.user_metadata || {}
      setProfile({
        firstName:    meta.first_name    || '',
        lastName:     meta.last_name     || '',
        businessName: meta.business_name || '',
        specialty:    meta.specialty     || '',
        phone:        meta.phone         || '',
        bio:          meta.bio           || '',
      })
      setLoading(false)
      // TODO: load availability from Supabase
      // const { data } = await supabase.from('availability').select('*').eq('user_id', user.id).single()
      // if (data) { setSchedule(data.schedule); setBuffer(data.buffer); ... }
    }
    getUser()
  }, [])

  // ── Helpers ─────────────────────────────────────────────────
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const toggleDay    = (key)              => setSchedule(s => ({ ...s, [key]: { ...s[key], active: !s[key].active } }))
  const updateTime   = (key, field, val) => setSchedule(s => ({ ...s, [key]: { ...s[key], [field]: val } }))

  const copyMonToAll = () => {
    const { start, end } = schedule.mon
    setSchedule(s => {
      const updated = { ...s }
      DAYS.forEach(d => { if (updated[d.key].active) updated[d.key] = { ...updated[d.key], start, end } })
      return updated
    })
    showToast('✓ Hours copied to all active days')
  }

  const addBlockedDate = () => {
    if (!newDate) return
    const formatted = new Date(newDate + 'T12:00:00').toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' })
    setBlockedDates(b => [...b, { id: Date.now(), date: newDate, displayDate: formatted, reason: newReason || 'Day off' }])
    setNewDate(''); setNewReason('')
  }
  const removeBlockedDate = (id) => setBlockedDates(b => b.filter(d => d.id !== id))

  const addService = () => {
    if (!newSvc.name || !newSvc.price) return
    setServices(s => [...s, { id: Date.now(), ...newSvc, price: parseFloat(newSvc.price), duration: parseInt(newSvc.duration) || 30 }])
    setNewSvc({ name:'', duration:'', price:'', category:'hair' })
    setShowAddSvc(false)
  }

  const handleSave = async () => {
    // TODO: persist to Supabase based on activeTab
    setSaved(true)
    showToast('✓ Settings saved successfully')
    setTimeout(() => setSaved(false), 2500)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || ''
  const initials  = user?.email ? user.email[0].toUpperCase() : '?'

  const NOTIF_GROUPS = [
    { label:'Appointment Reminders', items:[
      { key:'reminder24h',    title:'24-hour reminder',     desc:'Sent to your client the day before their appointment' },
      { key:'reminder1h',     title:'1-hour reminder',      desc:'Sent to your client 1 hour before their appointment' },
      { key:'bookingConfirm', title:'Booking confirmation', desc:'Sent immediately when a new appointment is booked' },
    ]},
    { label:'Client Engagement', items:[
      { key:'reviewRequest', title:'Review requests',    desc:'Sent 2 hours after an appointment is completed' },
      { key:'winBack',       title:'Win-back campaigns', desc:"Automatically sent to clients who haven't visited in 90+ days" },
      { key:'birthday',      title:'Birthday messages',  desc:'Sent to clients on their birthday' },
    ]},
    { label:'Business Updates', items:[
      { key:'newsletter', title:'Monthly newsletter', desc:'AI-generated monthly business newsletter sent to your clients' },
    ]},
  ]

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
            <div className="topbar-title">Set<em>tings</em></div>
            <div className="topbar-right">
              <button className={`save-btn${saved ? ' saved' : ''}`} onClick={handleSave}>
                <Icon name={saved ? 'check' : 'save'} size={14} color="#0A0908"/>
                {saved ? 'Saved!' : 'Save Changes'}
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                <Icon name="logout" size={13}/> Log out
              </button>
            </div>
          </header>

          {/* Tab bar */}
          <div className="settings-tabs">
            {[
              ['availability', 'My Availability'],
              ['profile',      'Profile'],
              ['services',     'Services'],
              ['notifications','Notifications'],
              ['billing',      'Billing'],
            ].map(([key, label]) => (
              <div key={key} className={`settings-tab${activeTab === key ? ' active' : ''}`}
                onClick={() => setActiveTab(key)}>
                {label}
              </div>
            ))}
          </div>

          {/* ── CONTENT ── */}
          <div className="content">

            {/* ════════════════ AVAILABILITY ════════════════ */}
            {activeTab === 'availability' && (
              <>
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
                      <button className="copy-btn" onClick={copyMonToAll}>Copy Monday hours to all active days</button>
                    </div>
                  </div>
                  <div className="panel">
                    {DAYS.map(day => {
                      const d = schedule[day.key]
                      const hrs = calcHours(d.start, d.end)
                      return (
                        <div key={day.key} className={`day-row${!d.active ? ' inactive' : ''}`}>
                          <div className="toggle-wrap" onClick={() => toggleDay(day.key)}>
                            <button className={`toggle${d.active ? ' on' : ' off'}`}><div className="toggle-knob"/></button>
                            <span className="toggle-label">{day.label}</span>
                          </div>
                          <div className="time-row">
                            {d.active ? (
                              <>
                                <span className="time-label">From</span>
                                <select className="time-select" value={d.start} onChange={e => updateTime(day.key, 'start', e.target.value)}>
                                  {TIMES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                                <span className="time-separator">→</span>
                                <span className="time-label">To</span>
                                <select className="time-select" value={d.end} onChange={e => updateTime(day.key, 'end', e.target.value)}>
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
                        <input className="option-input" type="number" min="1" max="30" placeholder="No limit"
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
                              <button className="blocked-remove" onClick={() => removeBlockedDate(b.id)}><Icon name="x" size={12}/></button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                    <div className="add-blocked">
                      <input className="add-blocked-input" type="date" value={newDate} onChange={e => setNewDate(e.target.value)}/>
                      <input className="add-blocked-input" type="text" placeholder="Reason (optional)"
                        value={newReason} onChange={e => setNewReason(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addBlockedDate()} style={{maxWidth:'180px'}}/>
                      <button className="add-blocked-btn" onClick={addBlockedDate}>
                        <Icon name="plus" size={13}/> Block Date
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{display:'flex', justifyContent:'flex-end', paddingBottom:'20px'}}>
                  <button className={`save-btn${saved ? ' saved' : ''}`} onClick={handleSave} style={{fontSize:'14px', height:'42px', padding:'0 28px'}}>
                    <Icon name={saved ? 'check' : 'save'} size={15} color="#0A0908"/>
                    {saved ? 'Saved!' : 'Save Availability'}
                  </button>
                </div>
              </>
            )}

            {/* ════════════════ PROFILE ════════════════ */}
            {activeTab === 'profile' && (
              <>
                <div className="card-section">
                  <div className="card-section-title">Personal Info</div>
                  <div className="field-grid-2">
                    <div className="field">
                      <label className="field-label">First name</label>
                      <input className="field-input" type="text" placeholder="Jordan"
                        value={profile.firstName} onChange={e => setP('firstName', e.target.value)}/>
                    </div>
                    <div className="field">
                      <label className="field-label">Last name</label>
                      <input className="field-input" type="text" placeholder="Smith"
                        value={profile.lastName} onChange={e => setP('lastName', e.target.value)}/>
                    </div>
                  </div>
                  <div className="field">
                    <label className="field-label">Phone number</label>
                    <input className="field-input" type="tel" placeholder="+1 (555) 000-0000"
                      value={profile.phone} onChange={e => setP('phone', e.target.value)}/>
                  </div>
                </div>

                <div className="card-section">
                  <div className="card-section-title">Business Info</div>
                  <div className="field">
                    <label className="field-label">Business / shop name</label>
                    <input className="field-input" type="text" placeholder="Smith's Barbershop"
                      value={profile.businessName} onChange={e => setP('businessName', e.target.value)}/>
                  </div>
                  <div className="field">
                    <label className="field-label">Specialty</label>
                    <select className="field-input field-select" value={profile.specialty} onChange={e => setP('specialty', e.target.value)}>
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
                  <div className="field">
                    <label className="field-label">Bio <span className="field-label-opt">(shown on your booking page)</span></label>
                    <textarea className="field-input field-textarea"
                      placeholder="Tell clients a little about yourself and your work…"
                      value={profile.bio} onChange={e => setP('bio', e.target.value)}/>
                  </div>
                </div>

                <div className="card-section">
                  <div className="card-section-title">Account</div>
                  <div className="field">
                    <label className="field-label">Email address</label>
                    <input className="field-input" type="email" value={user?.email || ''} disabled/>
                    <p className="field-hint">To change your email, contact support.</p>
                  </div>
                  <div className="field">
                    <label className="field-label">Password</label>
                    <button className="btn-secondary">Change Password</button>
                  </div>
                </div>

                <div className="save-row">
                  <button className={`save-btn${saved ? ' saved' : ''}`} onClick={handleSave}>
                    <Icon name={saved ? 'check' : 'save'} size={14} color="#0A0908"/>
                    {saved ? 'Saved!' : 'Save Profile'}
                  </button>
                </div>
              </>
            )}

            {/* ════════════════ SERVICES ════════════════ */}
            {activeTab === 'services' && (
              <>
                <div className="section-header">
                  <div className="section-title">Services</div>
                  <div className="section-sub">Manage the services you offer and their pricing.</div>
                </div>

                <div className="services-list">
                  {services.length === 0 && <div className="empty-state">No services added yet.</div>}
                  {services.map(svc => (
                    <div key={svc.id} className="service-row">
                      <div className="service-info">
                        <div className="service-name">{svc.name}</div>
                        <div className="service-meta">{svc.duration} min · {SERVICE_CATEGORIES[svc.category] || svc.category}</div>
                      </div>
                      <div className="service-right">
                        <div className="service-price">${svc.price}</div>
                        <button className="btn-remove" onClick={() => setServices(s => s.filter(x => x.id !== svc.id))}>
                          <Icon name="x" size={11}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {showAddSvc ? (
                  <div className="add-service-form">
                    <div style={{fontSize:'11px', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-3)', marginBottom:'16px'}}>New Service</div>
                    <div className="field">
                      <label className="field-label">Service name</label>
                      <input className="field-input" type="text" placeholder="e.g. Fade + Beard Trim"
                        value={newSvc.name} onChange={e => setSvc('name', e.target.value)}/>
                    </div>
                    <div className="field-grid-3">
                      <div className="field">
                        <label className="field-label">Price ($)</label>
                        <input className="field-input" type="number" placeholder="45"
                          value={newSvc.price} onChange={e => setSvc('price', e.target.value)}/>
                      </div>
                      <div className="field">
                        <label className="field-label">Duration (min)</label>
                        <input className="field-input" type="number" placeholder="45"
                          value={newSvc.duration} onChange={e => setSvc('duration', e.target.value)}/>
                      </div>
                      <div className="field">
                        <label className="field-label">Category</label>
                        <select className="field-input field-select" value={newSvc.category} onChange={e => setSvc('category', e.target.value)}>
                          {Object.entries(SERVICE_CATEGORIES).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="btn-row">
                      <button className="save-btn" onClick={addService}>
                        <Icon name="plus" size={14} color="#0A0908"/> Add Service
                      </button>
                      <button className="btn-secondary" onClick={() => setShowAddSvc(false)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button className="btn-add-service" onClick={() => setShowAddSvc(true)}>+ Add Service</button>
                )}
              </>
            )}

            {/* ════════════════ NOTIFICATIONS ════════════════ */}
            {activeTab === 'notifications' && (
              <>
                <div className="section-header">
                  <div className="section-title">Notifications</div>
                  <div className="section-sub">Control which automated messages are sent to your clients.</div>
                </div>

                {NOTIF_GROUPS.map(group => (
                  <div key={group.label} className="card-section">
                    <div className="card-section-title">{group.label}</div>
                    {group.items.map(item => (
                      <div key={item.key} className="notif-row">
                        <div className="notif-info">
                          <div className="notif-title">{item.title}</div>
                          <div className="notif-desc">{item.desc}</div>
                        </div>
                        <button
                          className={`notif-toggle${notifPrefs[item.key] ? ' on' : ' off'}`}
                          onClick={() => setNotifPrefs(p => ({ ...p, [item.key]: !p[item.key] }))}>
                          <div className="notif-toggle-knob"/>
                        </button>
                      </div>
                    ))}
                  </div>
                ))}

                <div className="save-row">
                  <button className={`save-btn${saved ? ' saved' : ''}`} onClick={handleSave}>
                    <Icon name={saved ? 'check' : 'save'} size={14} color="#0A0908"/>
                    {saved ? 'Saved!' : 'Save Preferences'}
                  </button>
                </div>
              </>
            )}

            {/* ════════════════ BILLING ════════════════ */}
            {activeTab === 'billing' && (
              <>
                <div className="section-header">
                  <div className="section-title">Billing</div>
                  <div className="section-sub">Manage your plan and subscription.</div>
                </div>

                <div className="card-section">
                  <div className="card-section-title">Current Plan</div>
                  <div className="billing-plan-card">
                    <div>
                      <div className="billing-plan-name">Solo</div>
                      <div className="billing-plan-price">$14.99<span className="billing-plan-period"> / month</span></div>
                      <div className="billing-plan-status">
                        <span className="status-dot"/>
                        Free Trial — next charge on April 8, 2026
                      </div>
                    </div>
                    <div className="billing-plan-badge">Active</div>
                  </div>
                </div>

                <div className="card-section">
                  <div className="card-section-title">Change Plan</div>
                  <div className="plan-compare-grid">
                    <div className="plan-compare-card selected">
                      <div className="plan-compare-name">Solo</div>
                      <div className="plan-compare-price">$14.99<span>/mo</span></div>
                      <div className="plan-compare-desc">1 provider, unlimited clients, all core features</div>
                      <div className="plan-current-badge">Current Plan</div>
                    </div>
                    <div className="plan-compare-card">
                      <div className="plan-compare-name">Shop Owner</div>
                      <div className="plan-compare-price">$99.99<span>/mo</span></div>
                      <div className="plan-compare-desc">Up to 6 chairs, shop analytics, team management</div>
                      <button className="btn-upgrade">Upgrade →</button>
                    </div>
                  </div>
                  <p className="field-hint" style={{marginTop:'12px'}}>Plan changes take effect at the start of your next billing period.</p>
                </div>

                <div className="card-section">
                  <div className="card-section-title">Payment Method</div>
                  <div className="payment-row">
                    <div className="payment-info">
                      <div className="payment-card-icon">💳</div>
                      <div>
                        <div className="payment-card-label">Visa ending in 4242</div>
                        <div className="payment-card-exp">Expires 12/27</div>
                      </div>
                    </div>
                    <button className="btn-secondary">Update Card</button>
                  </div>
                </div>

                <div className="card-section danger-section">
                  <div className="danger-title">Cancel Subscription</div>
                  <p className="danger-desc">Canceling will end your subscription at the close of your current billing period. Your data will be retained for 30 days.</p>
                  {!showCancel ? (
                    <button className="btn-danger" onClick={() => setShowCancel(true)}>Cancel Subscription</button>
                  ) : (
                    <div className="cancel-confirm">
                      <p className="cancel-confirm-text">Are you sure? This will cancel your plan at the end of your billing period.</p>
                      <div className="btn-row">
                        <button className="btn-danger">Yes, Cancel My Plan</button>
                        <button className="btn-secondary" onClick={() => setShowCancel(false)}>Keep My Plan</button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

          </div>{/* end .content */}
        </div>{/* end .main */}
      </div>{/* end .layout */}

      {/* Toast */}
      {toast && (
        <div className={`toast${toast.type === 'success' ? ' success' : ''}`}>
          <Icon name="check" size={14} color="#4E9B6F"/>
          {toast.msg}
        </div>
      )}
    </>
  )
}