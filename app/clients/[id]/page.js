'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'

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
    plus:        <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    x:           <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    check:       <polyline points="20 6 9 17 4 12"/>,
    trash:       <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>,
    phone:       <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.09 6.09l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></>,
    mail:        <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    clock:       <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    scissors:    <><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></>,
    edit:        <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    star:        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    logout:      <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    note:        <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
    arrowLeft:   <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    dollar:      <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  )
}

const SERVICES = ['Fade','Fade + Line-up','Beard Trim','Line-up','Color Treatment','Highlights','Blowout','Full Set','Fill','Pedicure','Facial','Wax','Lash Set','Other']

const SERVICE_COLORS = {
  'Fade':'#C9A84C','Fade + Line-up':'#C9A84C','Beard Trim':'#C9A84C','Line-up':'#C9A84C',
  'Color Treatment':'#4E9B6F','Highlights':'#4E9B6F','Blowout':'#4E9B6F',
  'Full Set':'#B87460','Fill':'#B87460','Pedicure':'#B87460',
  'Facial':'#9B7EC8','Wax':'#9B7EC8','Lash Set':'#7EB8C9',
}
const getServiceColor = (s='') => {
  for (const [k,v] of Object.entries(SERVICE_COLORS)) {
    if (s.toLowerCase().includes(k.toLowerCase())) return v
  }
  return '#C9A84C'
}

const AVATAR_COLORS = [
  ['#C9A84C','rgba(201,168,76,0.15)'],
  ['#4E9B6F','rgba(78,155,111,0.15)'],
  ['#B87460','rgba(184,116,96,0.15)'],
  ['#9B7EC8','rgba(155,126,200,0.15)'],
  ['#7EB8C9','rgba(126,184,201,0.15)'],
]
const getAvatarColor = (name) => AVATAR_COLORS[(name?.charCodeAt(0)||0) % AVATAR_COLORS.length]
const getInitials = (name) => name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) || '?'

// ── SAMPLE DATA — replace with Supabase ──
const SAMPLE_CLIENTS = {
  '1': {
    id:'1', name:'Aaliyah Laurent', phone:'(305) 555-0142', email:'aaliyah@email.com',
    birthday:'1994-07-18', isVip:false, createdAt:'2025-06-01', visitCount:7,
    notes:'Prefers cool tones. Sensitive scalp. Always wants toner after color.',
    visits:[
      { id:'v1', date:'2026-03-06', service:'Color Treatment', duration:'90 min', price:85, status:'completed', notes:'Added toner, came out great.' },
      { id:'v2', date:'2026-03-20', service:'Highlights',      duration:'120 min', price:120, status:'upcoming',  notes:'' },
      { id:'v3', date:'2026-01-22', service:'Color Treatment', duration:'90 min', price:85, status:'completed', notes:'' },
      { id:'v4', date:'2025-12-10', service:'Blowout',         duration:'45 min', price:55, status:'completed', notes:'' },
      { id:'v5', date:'2025-11-05', service:'Color Treatment', duration:'90 min', price:85, status:'completed', notes:'' },
      { id:'v6', date:'2025-10-01', service:'Highlights',      duration:'120 min', price:110, status:'completed', notes:'First time going blonde.' },
      { id:'v7', date:'2025-08-14', service:'Color Treatment', duration:'90 min', price:80, status:'completed', notes:'' },
    ]
  },
  '2': {
    id:'2', name:'Jordan Smith', phone:'(786) 555-0198', email:'jordan@email.com',
    birthday:'1990-03-22', isVip:true, createdAt:'2025-01-10', visitCount:14,
    notes:'Every 2 weeks. Skin fade only. No taper — always bald on sides.',
    visits:[
      { id:'v1', date:'2026-03-08', service:'Fade + Line-up', duration:'45 min', price:45, status:'completed', notes:'' },
      { id:'v2', date:'2026-03-22', service:'Fade + Line-up', duration:'45 min', price:45, status:'upcoming',  notes:'' },
      { id:'v3', date:'2026-02-22', service:'Fade + Line-up', duration:'45 min', price:45, status:'completed', notes:'' },
      { id:'v4', date:'2026-02-08', service:'Fade + Line-up', duration:'45 min', price:45, status:'completed', notes:'' },
      { id:'v5', date:'2026-01-25', service:'Fade + Beard',   duration:'60 min', price:55, status:'completed', notes:'' },
    ]
  },
  '3': { id:'3', name:'Marcus Webb',    phone:'(954) 555-0167', email:'marcus@email.com',  birthday:'', isVip:false, createdAt:'2025-09-15', visitCount:3,  notes:'', visits:[{ id:'v1', date:'2026-03-01', service:'Beard Trim', duration:'30 min', price:25, status:'completed', notes:'' },{ id:'v2', date:'2026-01-15', service:'Beard Trim', duration:'30 min', price:25, status:'completed', notes:'' },{ id:'v3', date:'2025-11-20', service:'Fade', duration:'35 min', price:35, status:'completed', notes:'' }] },
  '4': { id:'4', name:'Nina Clarke',    phone:'(305) 555-0134', email:'nina@email.com',    birthday:'1998-11-03', isVip:false, createdAt:'2026-01-15', visitCount:2,  notes:'Prefers short almond shape.', visits:[{ id:'v1', date:'2026-02-22', service:'Full Set', duration:'60 min', price:65, status:'completed', notes:'Almond, medium length, nude.' },{ id:'v2', date:'2026-03-25', service:'Fill', duration:'45 min', price:45, status:'upcoming', notes:'' }] },
  '5': { id:'5', name:'Simone Davis',   phone:'(786) 555-0111', email:'simone@email.com',  birthday:'1992-05-30', isVip:true,  createdAt:'2025-08-20', visitCount:5,  notes:'Going lighter gradually. Currently level 7.', visits:[{ id:'v1', date:'2026-03-08', service:'Highlights', duration:'120 min', price:120, status:'completed', notes:'Lifted to level 8.' },{ id:'v2', date:'2026-02-10', service:'Highlights', duration:'120 min', price:115, status:'completed', notes:'' },{ id:'v3', date:'2026-04-05', service:'Color Treatment', duration:'90 min', price:90, status:'upcoming', notes:'' }] },
}

const navItems = [
  { label:'Dashboard', icon:'grid',     href:'/dashboard', active:false },
  { label:'Calendar',  icon:'calendar', href:'/calendar',  active:false },
  { label:'Clients',   icon:'users',    href:'/clients',   active:true  },
  { label:'Reminders', icon:'bell',     href:'/reminders', active:false },
  { label:'Settings',  icon:'settings', href:'/settings',  active:false },
]

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  :root {
    --bg:#0A0908; --surface:#111010; --surface-2:#181716; --surface-3:#1F1E1C;
    --border:#272523; --border-2:#312F2D; --text:#F0EDE8; --text-2:#9B9690;
    --text-3:#5C5955; --gold:#C9A84C; --gold-bg:rgba(201,168,76,0.08);
    --green:#4E9B6F; --rose:#B87460; --red:#B85555;
    --sidebar-w:220px; --sidebar-collapsed:56px;
    --font-display:'Cormorant Garamond',serif; --font-body:'DM Sans',sans-serif;
  }
  html,body { height:100%; background:var(--bg); overflow:hidden; }
  body { font-family:var(--font-body); -webkit-font-smoothing:antialiased; color:var(--text); }
  .layout { display:flex; height:100vh; overflow:hidden; }

  /* SIDEBAR */
  .sidebar { width:var(--sidebar-w); flex-shrink:0; background:var(--surface); border-right:1px solid var(--border); display:flex; flex-direction:column; transition:width 0.28s cubic-bezier(0.4,0,0.2,1); overflow:hidden; z-index:10; }
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
  .user-avatar-sm { width:32px; height:32px; border-radius:50%; background:var(--gold-bg); border:1px solid rgba(201,168,76,0.3); display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:14px; color:var(--gold); flex-shrink:0; }
  .user-info { overflow:hidden; }
  .user-name-sm { font-size:12px; font-weight:600; color:var(--text); white-space:nowrap; }
  .user-plan { font-size:10px; color:var(--text-3); white-space:nowrap; margin-top:1px; }
  .sidebar.collapsed .user-info { display:none; }

  /* MAIN */
  .main { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }

  /* TOPBAR */
  .topbar { height:56px; flex-shrink:0; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; padding:0 28px; background:var(--surface); }
  .back-btn { display:flex; align-items:center; gap:8px; font-size:13px; color:var(--text-3); text-decoration:none; transition:color 0.15s; background:none; border:none; cursor:pointer; font-family:var(--font-body); padding:0; }
  .back-btn:hover { color:var(--text-2); }
  .topbar-right { display:flex; align-items:center; gap:10px; }
  .edit-btn { display:flex; align-items:center; gap:7px; padding:0 16px; height:36px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; font-size:13px; color:var(--text-2); cursor:pointer; transition:all 0.15s; font-family:var(--font-body); }
  .edit-btn:hover { background:var(--surface-3); color:var(--text); }
  .appt-btn { display:flex; align-items:center; gap:7px; padding:0 18px; height:36px; background:var(--gold); color:#0A0908; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.15s; font-family:var(--font-body); }
  .appt-btn:hover { background:#D4B558; box-shadow:0 4px 16px rgba(201,168,76,0.3); }

  /* CONTENT */
  .content { flex:1; overflow-y:auto; padding:28px; display:grid; grid-template-columns:320px 1fr; gap:20px; align-items:start; }
  .content::-webkit-scrollbar { width:5px; }
  .content::-webkit-scrollbar-thumb { background:var(--border-2); border-radius:99px; }

  /* LEFT COLUMN — PROFILE */
  .profile-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; overflow:hidden; position:sticky; top:0; }
  .profile-top { padding:28px 24px 20px; display:flex; flex-direction:column; align-items:center; text-align:center; border-bottom:1px solid var(--border); position:relative; }
  .profile-avatar { width:72px; height:72px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:28px; font-weight:600; margin-bottom:14px; position:relative; }
  .vip-ring { position:absolute; inset:-3px; border-radius:50%; border:2px solid var(--gold); }
  .profile-name { font-family:var(--font-display); font-size:22px; color:var(--text); margin-bottom:6px; }
  .profile-badges { display:flex; align-items:center; justify-content:center; gap:8px; margin-bottom:4px; }
  .badge { font-size:9px; font-weight:700; padding:3px 9px; border-radius:99px; letter-spacing:0.04em; border:1px solid; }
  .vip-toggle { width:30px; height:30px; border-radius:8px; background:none; border:1px solid transparent; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.12s; position:absolute; top:16px; right:16px; }
  .vip-toggle:hover { background:rgba(201,168,76,0.1); border-color:rgba(201,168,76,0.3); }

  /* CONTACT ROWS */
  .contact-list { padding:16px 20px; display:flex; flex-direction:column; gap:2px; border-bottom:1px solid var(--border); }
  .contact-row { display:flex; align-items:center; gap:12px; padding:10px 0; }
  .contact-icon { color:var(--text-3); flex-shrink:0; }
  .contact-val { font-size:13px; color:var(--text-2); }
  .contact-val a { color:var(--text-2); text-decoration:none; transition:color 0.15s; }
  .contact-val a:hover { color:var(--gold); }
  .contact-empty { font-size:13px; color:var(--text-3); font-style:italic; }

  /* STATS ROW */
  .profile-stats { display:grid; grid-template-columns:1fr 1fr; gap:0; border-bottom:1px solid var(--border); }
  .profile-stat { padding:14px 20px; text-align:center; border-right:1px solid var(--border); }
  .profile-stat:last-child { border-right:none; }
  .profile-stat-val { font-family:var(--font-display); font-size:22px; color:var(--text); line-height:1; margin-bottom:4px; }
  .profile-stat-label { font-size:10px; color:var(--text-3); font-weight:500; letter-spacing:0.06em; text-transform:uppercase; }

  /* NOTES */
  .notes-section { padding:16px 20px; }
  .notes-label { font-size:10px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--text-3); margin-bottom:8px; display:flex; align-items:center; justify-content:space-between; }
  .notes-text { font-size:13px; color:var(--text-2); line-height:1.7; }
  .notes-empty { font-size:13px; color:var(--text-3); font-style:italic; }
  .notes-edit { background:none; border:none; color:var(--text-3); cursor:pointer; transition:color 0.15s; padding:0; }
  .notes-edit:hover { color:var(--gold); }
  .notes-textarea { width:100%; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; padding:10px 12px; font-size:13px; color:var(--text); font-family:var(--font-body); outline:none; resize:none; line-height:1.7; transition:border-color 0.15s; }
  .notes-textarea:focus { border-color:var(--gold); }
  .notes-actions { display:flex; gap:8px; margin-top:8px; justify-content:flex-end; }
  .btn-xs { padding:0 12px; height:30px; border-radius:6px; font-size:12px; font-family:var(--font-body); cursor:pointer; transition:all 0.15s; display:flex; align-items:center; gap:5px; }
  .btn-xs-primary { background:var(--gold); color:#0A0908; border:none; font-weight:600; }
  .btn-xs-primary:hover { background:#D4B558; }
  .btn-xs-ghost { background:none; color:var(--text-3); border:1px solid var(--border); }
  .btn-xs-ghost:hover { background:var(--surface-2); color:var(--text-2); }

  /* RIGHT COLUMN — VISIT HISTORY */
  .history-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
  .history-title { font-family:var(--font-display); font-size:20px; color:var(--text); }
  .history-count { font-size:12px; color:var(--text-3); background:var(--surface); border:1px solid var(--border); padding:3px 10px; border-radius:99px; }

  /* VISIT CARDS */
  .visit-card { background:var(--surface); border:1px solid var(--border); border-radius:12px; overflow:hidden; margin-bottom:10px; transition:border-color 0.15s; }
  .visit-card:hover { border-color:var(--border-2); }
  .visit-card.featured { border-color:rgba(201,168,76,0.4); box-shadow:0 0 0 1px rgba(201,168,76,0.15); }
  .visit-card.upcoming { border-color:rgba(78,155,111,0.35); }
  .visit-top { display:flex; align-items:center; gap:14px; padding:14px 18px; }
  .visit-bar { width:3px; border-radius:99px; align-self:stretch; min-height:40px; flex-shrink:0; }
  .visit-date-col { min-width:90px; flex-shrink:0; }
  .visit-date { font-size:13px; font-weight:600; color:var(--text); }
  .visit-relative { font-size:11px; color:var(--text-3); margin-top:2px; }
  .visit-service-col { flex:1; min-width:0; }
  .visit-service { font-size:14px; font-weight:600; color:var(--text); }
  .visit-meta { font-size:12px; color:var(--text-3); margin-top:2px; }
  .visit-right { display:flex; align-items:center; gap:12px; flex-shrink:0; }
  .visit-price { font-family:var(--font-display); font-size:18px; color:var(--text); }
  .visit-status { font-size:9px; font-weight:700; padding:3px 9px; border-radius:99px; letter-spacing:0.06em; border:1px solid; }
  .status-completed { color:var(--text-3); background:rgba(155,150,144,0.08); border-color:rgba(155,150,144,0.2); }
  .status-upcoming  { color:var(--green); background:rgba(78,155,111,0.1); border-color:rgba(78,155,111,0.25); }
  .status-cancelled { color:var(--red); background:rgba(184,85,85,0.08); border-color:rgba(184,85,85,0.2); text-decoration:line-through; }
  .featured-label { display:flex; align-items:center; gap:6px; padding:6px 18px 10px 18px; font-size:11px; font-weight:600; color:var(--gold); letter-spacing:0.06em; }
  .visit-notes { padding:0 18px 14px 35px; font-size:12px; color:var(--text-3); line-height:1.6; border-top:1px solid var(--border); padding-top:10px; }

  /* EMPTY HISTORY */
  .empty-history { text-align:center; padding:48px 20px; color:var(--text-3); }
  .empty-history-icon { font-size:28px; opacity:0.3; margin-bottom:12px; }

  /* MODAL */
  .modal-overlay { position:fixed; inset:0; z-index:200; background:rgba(0,0,0,0.7); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; padding:24px; animation:fadeIn 0.15s ease; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .modal { background:var(--surface); border:1px solid var(--border-2); border-radius:16px; width:100%; max-width:480px; box-shadow:0 32px 80px rgba(0,0,0,0.7); animation:slideUp 0.2s cubic-bezier(0.16,1,0.3,1); overflow:hidden; }
  @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .modal-header { display:flex; align-items:center; justify-content:space-between; padding:20px 24px; border-bottom:1px solid var(--border); }
  .modal-title { font-family:var(--font-display); font-size:20px; color:var(--text); }
  .modal-close { width:28px; height:28px; border-radius:6px; background:var(--surface-2); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text-3); transition:all 0.15s; }
  .modal-close:hover { background:var(--surface-3); color:var(--text); }
  .modal-body { padding:24px; display:flex; flex-direction:column; gap:14px; }
  .modal-footer { padding:16px 24px; border-top:1px solid var(--border); display:flex; gap:10px; justify-content:flex-end; }
  .field { display:flex; flex-direction:column; gap:6px; }
  .field-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .field-label { font-size:11px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:var(--text-3); }
  .field-input { height:42px; padding:0 12px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; font-size:13px; color:var(--text); font-family:var(--font-body); outline:none; transition:border-color 0.15s; }
  .field-input::placeholder { color:var(--text-3); }
  .field-input:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(201,168,76,0.1); }
  select.field-input { cursor:pointer; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%235C5955' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; padding-right:32px; -webkit-appearance:none; }
  select.field-input option { background:var(--surface-2); }
  .btn-primary { display:flex; align-items:center; gap:6px; padding:0 20px; height:38px; background:var(--gold); color:#0A0908; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.15s; font-family:var(--font-body); }
  .btn-primary:hover { background:#D4B558; }
  .btn-secondary { display:flex; align-items:center; gap:6px; padding:0 16px; height:38px; background:transparent; color:var(--text-2); border:1px solid var(--border); border-radius:8px; font-size:13px; cursor:pointer; transition:all 0.15s; font-family:var(--font-body); }
  .btn-secondary:hover { background:var(--surface-2); }

  /* LOADING */
  .loading-screen { min-height:100vh; background:var(--bg); display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:22px; color:var(--gold); }
  .loading-dot { animation:pulse 1.2s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }

  /* NOT FOUND */
  .not-found { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; color:var(--text-3); }
`

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' })
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Math.floor((new Date() - new Date(dateStr + 'T12:00:00')) / 86400000)
  if (diff < 0)  return `in ${Math.abs(diff)} day${Math.abs(diff)!==1?'s':''}`
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7)  return `${diff} days ago`
  if (diff < 30) return `${Math.floor(diff/7)} wk ago`
  if (diff < 365) return `${Math.floor(diff/30)} mo ago`
  return `${Math.floor(diff/365)} yr ago`
}

function totalSpend(visits) {
  return visits.filter(v=>v.status==='completed').reduce((sum,v)=>sum+(v.price||0),0)
}

// Find the "featured" visit — most recent upcoming, or most recent completed
function getFeaturedVisit(visits) {
  const upcoming  = visits.filter(v=>v.status==='upcoming').sort((a,b)=>new Date(a.date)-new Date(b.date))
  const completed = visits.filter(v=>v.status==='completed').sort((a,b)=>new Date(b.date)-new Date(a.date))
  return upcoming[0] || completed[0] || null
}

export default function ClientProfilePage() {
  const [user, setUser]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const [client, setClient]       = useState(null)
  const [notFound, setNotFound]   = useState(false)
  const [editingNotes, setEditingNotes] = useState(false)
  const [notesVal, setNotesVal]   = useState('')
  const [editingContact, setEditingContact] = useState(false)
  const [contactForm, setContactForm] = useState({ name:'', phone:'', email:'', birthday:'' })
  const [apptModal, setApptModal] = useState(false)
  const [apptForm, setApptForm]   = useState({ service:'', date:'', startTime:'', duration:'60', notes:'' })
  const router  = useRouter()
  const params  = useParams()

  useEffect(() => {
    async function init() {
      const { data:{ user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      // TODO: fetch from Supabase
      // const { data } = await supabase
      //   .from('clients').select('*, appointments(*)')
      //   .eq('id', params.id).eq('provider_id', user.id).single()
      // if (!data) { setNotFound(true); setLoading(false); return }
      // setClient(data)

      const found = SAMPLE_CLIENTS[params.id]
      if (!found) { setNotFound(true); setLoading(false); return }
      setClient(found)
      setNotesVal(found.notes || '')
      setContactForm({ name: found.name||'', phone: found.phone||'', email: found.email||'', birthday: found.birthday||'' })
      setLoading(false)
    }
    init()
  }, [params.id])

  const toggleVip = () => {
    setClient(c => ({ ...c, isVip: !c.isVip }))
    // TODO: supabase.from('clients').update({ is_vip: !client.isVip }).eq('id', client.id)
  }

  const saveNotes = () => {
    setClient(c => ({ ...c, notes: notesVal }))
    setEditingNotes(false)
    // TODO: supabase.from('clients').update({ notes: notesVal }).eq('id', client.id)
  }

  const saveContact = () => {
    setClient(c => ({ ...c, name: contactForm.name, phone: contactForm.phone, email: contactForm.email, birthday: contactForm.birthday }))
    setEditingContact(false)
    // TODO: supabase.from('clients').update({ name: contactForm.name, phone: contactForm.phone, email: contactForm.email, birthday: contactForm.birthday }).eq('id', client.id)
  }

  const handleAddVisit = () => {
    if (!apptForm.service || !apptForm.date) return
    const newVisit = {
      id: 'v' + Date.now(),
      date: apptForm.date,
      service: apptForm.service,
      duration: apptForm.duration + ' min',
      price: 0,
      status: 'upcoming',
      notes: apptForm.notes,
    }
    setClient(c => ({ ...c, visits: [...c.visits, newVisit], visitCount: c.visitCount + 1 }))
    setApptModal(false)
    setApptForm({ service:'', date:'', startTime:'', duration:'60', notes:'' })
    // TODO: insert into appointments table in Supabase
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

  const [avatarText, avatarBg] = client ? getAvatarColor(client.name) : ['#C9A84C','rgba(201,168,76,0.15)']
  const featuredVisit = client ? getFeaturedVisit(client.visits) : null
  const sortedVisits  = client ? [...client.visits].sort((a,b) => new Date(b.date) - new Date(a.date)) : []
  const spend = client ? totalSpend(client.visits) : 0

  const getBadge = (c) => {
    if (c.isVip) return { label:'VIP', color:'#C9A84C', bg:'rgba(201,168,76,0.12)', border:'rgba(201,168,76,0.3)' }
    const isNew = c.visitCount <= 1 || (c.createdAt && (new Date() - new Date(c.createdAt)) < 30*86400000)
    if (isNew) return { label:'New', color:'#9B9690', bg:'rgba(155,150,144,0.1)', border:'rgba(155,150,144,0.2)' }
    return { label:'Regular', color:'#4E9B6F', bg:'rgba(78,155,111,0.12)', border:'rgba(78,155,111,0.25)' }
  }

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
          <div style={{padding:'8px', borderTop:'1px solid var(--border)'}}>
            <a href='/settings/availability'
              style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 12px',borderRadius:'8px',textDecoration:'none',color:'var(--text-3)',fontSize:'12px',fontWeight:500,transition:'all 0.15s'}}
              onMouseOver={e=>{e.currentTarget.style.background='var(--surface-2)';e.currentTarget.style.color='var(--gold)'}}
              onMouseOut={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color='var(--text-3)'}}>
              <Icon name='clock' size={14}/>
              <span style={{whiteSpace:'nowrap',overflow:'hidden',opacity:collapsed?0:1,transition:'opacity 0.15s'}}>My Availability</span>
            </a>
          </div>
          <div className="sidebar-footer">
            <div className="sidebar-user">
              <div className="user-avatar-sm">{initials}</div>
              <div className="user-info">
                <div className="user-name-sm">{firstName}</div>
                <div className="user-plan">Solo Plan · Free Trial</div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">

          {/* Topbar */}
          <header className="topbar">
            <button className="back-btn" onClick={() => router.push('/clients')}>
              <Icon name="arrowLeft" size={15}/>
              All Clients
            </button>
            {client && (
              <div className="topbar-right">
                <button className="edit-btn" onClick={() => { setContactForm({ name:client.name||'', phone:client.phone||'', email:client.email||'', birthday:client.birthday||'' }); setEditingContact(true) }}>
                  <Icon name="edit" size={14}/>
                  Edit Profile
                </button>
                <button className="appt-btn" onClick={() => setApptModal(true)}>
                  <Icon name="plus" size={14} color="#0A0908"/>
                  New Appointment
                </button>
              </div>
            )}
          </header>

          {/* Content */}
          {notFound ? (
            <div className="not-found">
              <div style={{fontSize:'32px',opacity:0.3}}>👤</div>
              <div style={{fontFamily:'var(--font-display)',fontSize:'20px',color:'var(--text-2)'}}>Client not found</div>
              <button className="back-btn" onClick={() => router.push('/clients')} style={{marginTop:8}}>
                <Icon name="arrowLeft" size={14}/> Back to clients
              </button>
            </div>
          ) : client && (
            <div className="content">

              {/* LEFT — Profile card */}
              <div>
                <div className="profile-card">

                  {/* Avatar + name */}
                  <div className="profile-top">
                    {/* VIP toggle star */}
                    <button className="vip-toggle" onClick={toggleVip}
                      title={client.isVip ? 'Remove VIP status' : 'Mark as VIP'}
                      style={{color: client.isVip ? '#C9A84C' : 'var(--text-3)'}}>
                      <Icon name="star" size={14} color={client.isVip ? '#C9A84C' : 'currentColor'}/>
                    </button>

                    <div className="profile-avatar" style={{background: avatarBg, color: avatarText}}>
                      {getInitials(client.name)}
                      {client.isVip && <div className="vip-ring"/>}
                    </div>

                    <div className="profile-name">{client.name}</div>

                    <div className="profile-badges">
                      {(() => { const b = getBadge(client); return (
                        <div className="badge" style={{color:b.color, background:b.bg, borderColor:b.border}}>{b.label}</div>
                      )})()}
                      {client.birthday && (
                        <div className="badge" style={{color:'var(--rose)',background:'rgba(184,116,96,0.1)',borderColor:'rgba(184,116,96,0.25)'}}>
                          🎂 {new Date(client.birthday+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'})}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact info */}
                  <div className="contact-list">
                    {editingContact ? (
                      <>
                        <div style={{display:'flex',flexDirection:'column',gap:'10px',paddingBottom:'4px'}}>
                          <div className="field">
                            <label className="field-label">Phone</label>
                            <input className="field-input" type="tel" placeholder="(305) 555-0100"
                              style={{height:'38px'}}
                              value={contactForm.phone}
                              onChange={e => setContactForm(f=>({...f, phone:e.target.value}))}/>
                          </div>
                          <div className="field">
                            <label className="field-label">Email</label>
                            <input className="field-input" type="email" placeholder="client@email.com"
                              style={{height:'38px'}}
                              value={contactForm.email}
                              onChange={e => setContactForm(f=>({...f, email:e.target.value}))}/>
                          </div>
                          <div className="field">
                            <label className="field-label">Birthday</label>
                            <input className="field-input" type="date"
                              style={{height:'38px'}}
                              value={contactForm.birthday}
                              onChange={e => setContactForm(f=>({...f, birthday:e.target.value}))}/>
                          </div>
                        </div>
                        <div className="notes-actions">
                          <button className="btn-xs btn-xs-ghost" onClick={() => setEditingContact(false)}>Cancel</button>
                          <button className="btn-xs btn-xs-primary" onClick={saveContact}>
                            <Icon name="check" size={11} color="#0A0908"/>
                            Save
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="contact-row">
                          <span className="contact-icon"><Icon name="phone" size={14}/></span>
                          {client.phone
                            ? <span className="contact-val"><a href={`tel:${client.phone}`}>{client.phone}</a></span>
                            : <span className="contact-empty">No phone</span>}
                        </div>
                        <div className="contact-row">
                          <span className="contact-icon"><Icon name="mail" size={14}/></span>
                          {client.email
                            ? <span className="contact-val"><a href={`mailto:${client.email}`}>{client.email}</a></span>
                            : <span className="contact-empty">No email</span>}
                        </div>
                        <div className="contact-row">
                          <span className="contact-icon"><Icon name="calendar" size={14}/></span>
                          <span className="contact-val" style={{color:'var(--text-3)'}}>
                            Client since {formatDate(client.createdAt)}
                          </span>
                        </div>
                        <button
                          onClick={() => { setEditingContact(true); setContactForm({ phone:client.phone||'', email:client.email||'', birthday:client.birthday||'' }) }}
                          style={{display:'flex',alignItems:'center',gap:'6px',marginTop:'8px',padding:'7px 12px',background:'var(--surface-2)',border:'1px solid var(--border)',borderRadius:'8px',fontSize:'12px',color:'var(--text-3)',cursor:'pointer',transition:'all 0.15s',fontFamily:'var(--font-body)',width:'100%',justifyContent:'center'}}
                          onMouseOver={e=>{e.currentTarget.style.borderColor='rgba(201,168,76,0.3)';e.currentTarget.style.color='var(--gold)'}}
                          onMouseOut={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--text-3)'}}>
                          <Icon name="edit" size={13} color="currentColor"/>
                          Edit Contact Info
                        </button>
                      </>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="profile-stats">
                    <div className="profile-stat">
                      <div className="profile-stat-val">{client.visitCount}</div>
                      <div className="profile-stat-label">Visits</div>
                    </div>
                    <div className="profile-stat">
                      <div className="profile-stat-val">${spend}</div>
                      <div className="profile-stat-label">Total Spent</div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="notes-section">
                    <div className="notes-label">
                      Provider Notes
                      {!editingNotes && (
                        <button className="notes-edit" onClick={() => { setEditingNotes(true); setNotesVal(client.notes||'') }}>
                          <Icon name="edit" size={13}/>
                        </button>
                      )}
                    </div>
                    {editingNotes ? (
                      <>
                        <textarea className="notes-textarea" rows={4}
                          value={notesVal} onChange={e => setNotesVal(e.target.value)}
                          placeholder="Preferences, allergies, style notes…"
                          autoFocus/>
                        <div className="notes-actions">
                          <button className="btn-xs btn-xs-ghost" onClick={() => setEditingNotes(false)}>Cancel</button>
                          <button className="btn-xs btn-xs-primary" onClick={saveNotes}>
                            <Icon name="check" size={11} color="#0A0908"/>
                            Save
                          </button>
                        </div>
                      </>
                    ) : (
                      client.notes
                        ? <div className="notes-text">{client.notes}</div>
                        : <div className="notes-empty">No notes yet.</div>
                    )}
                  </div>

                </div>
              </div>

              {/* RIGHT — Visit history */}
              <div>
                <div className="history-header">
                  <div className="history-title">Visit History</div>
                  <div className="history-count">{sortedVisits.length} visit{sortedVisits.length!==1?'s':''}</div>
                </div>

                {sortedVisits.length === 0 ? (
                  <div className="empty-history">
                    <div className="empty-history-icon">📋</div>
                    <div style={{fontSize:'14px',color:'var(--text-2)',marginBottom:'6px'}}>No visits yet</div>
                    <div style={{fontSize:'13px'}}>Book their first appointment to get started.</div>
                  </div>
                ) : (
                  sortedVisits.map(visit => {
                    const isFeatured = featuredVisit && visit.id === featuredVisit.id
                    const isUpcoming = visit.status === 'upcoming'
                    const color = getServiceColor(visit.service)

                    return (
                      <div key={visit.id}
                        className={`visit-card${isFeatured ? ' featured' : ''}${isUpcoming ? ' upcoming' : ''}`}>

                        {/* Featured label */}
                        {isFeatured && (
                          <div className="featured-label">
                            <div style={{width:6,height:6,borderRadius:'50%',background: isUpcoming ? '#4E9B6F' : '#C9A84C'}}/>
                            {isUpcoming ? 'Next Appointment' : 'Most Recent Visit'}
                          </div>
                        )}

                        <div className="visit-top">
                          {/* Color bar */}
                          <div className="visit-bar" style={{background: color}}/>

                          {/* Date */}
                          <div className="visit-date-col">
                            <div className="visit-date">{formatDate(visit.date)}</div>
                            <div className="visit-relative">{timeAgo(visit.date)}</div>
                          </div>

                          {/* Service */}
                          <div className="visit-service-col">
                            <div className="visit-service">{visit.service}</div>
                            <div className="visit-meta">{visit.duration}</div>
                          </div>

                          {/* Price + status */}
                          <div className="visit-right">
                            {visit.price > 0 && (
                              <div className="visit-price">${visit.price}</div>
                            )}
                            <div className={`visit-status status-${visit.status}`}>
                              {visit.status.toUpperCase()}
                            </div>
                          </div>
                        </div>

                        {/* Visit notes */}
                        {visit.notes && (
                          <div className="visit-notes">
                            {visit.notes}
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EDIT CONTACT MODAL */}
      {editingContact && client && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setEditingContact(false)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Edit Profile</div>
              <button className="modal-close" onClick={() => setEditingContact(false)}>
                <Icon name="x" size={14}/>
              </button>
            </div>
            <div className="modal-body">
              <div className="field">
                <label className="field-label">Full Name</label>
                <input className="field-input" type="text" value={contactForm.name}
                  onChange={e => setContactForm(f=>({...f,name:e.target.value}))}
                  placeholder="Full name"/>
              </div>
              <div className="field-row">
                <div className="field">
                  <label className="field-label">Phone</label>
                  <input className="field-input" type="tel" value={contactForm.phone}
                    onChange={e => setContactForm(f=>({...f,phone:e.target.value}))}
                    placeholder="(305) 555-0100"/>
                </div>
                <div className="field">
                  <label className="field-label">Birthday</label>
                  <input className="field-input" type="date" value={contactForm.birthday}
                    onChange={e => setContactForm(f=>({...f,birthday:e.target.value}))}/>
                </div>
              </div>
              <div className="field">
                <label className="field-label">Email</label>
                <input className="field-input" type="email" value={contactForm.email}
                  onChange={e => setContactForm(f=>({...f,email:e.target.value}))}
                  placeholder="client@email.com"/>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setEditingContact(false)}>Cancel</button>
              <button className="btn-primary" onClick={saveContact}>
                <Icon name="check" size={13} color="#0A0908"/>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW APPOINTMENT MODAL */}
      {apptModal && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setApptModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">New Appointment</div>
              <button className="modal-close" onClick={() => setApptModal(false)}>
                <Icon name="x" size={14}/>
              </button>
            </div>
            <div className="modal-body">
              <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 14px',background:'var(--gold-bg)',border:'1px solid rgba(201,168,76,0.2)',borderRadius:'8px'}}>
                <div style={{width:32,height:32,borderRadius:'50%',background:avatarBg,color:avatarText,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-display)',fontSize:'14px',fontWeight:600,flexShrink:0}}>
                  {getInitials(client.name)}
                </div>
                <div>
                  <div style={{fontSize:'13px',fontWeight:600,color:'var(--text)'}}>{client.name}</div>
                  <div style={{fontSize:'11px',color:'var(--text-3)'}}>{client.visitCount} previous visit{client.visitCount!==1?'s':''}</div>
                </div>
              </div>
              <div className="field">
                <label className="field-label">Service</label>
                <select className="field-input" value={apptForm.service}
                  onChange={e => setApptForm(f=>({...f,service:e.target.value}))}>
                  <option value="" disabled>Select a service…</option>
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="field-row">
                <div className="field">
                  <label className="field-label">Date</label>
                  <input className="field-input" type="date" value={apptForm.date}
                    onChange={e => setApptForm(f=>({...f,date:e.target.value}))}/>
                </div>
                <div className="field">
                  <label className="field-label">Start Time</label>
                  <input className="field-input" type="time" value={apptForm.startTime}
                    onChange={e => setApptForm(f=>({...f,startTime:e.target.value}))}/>
                </div>
              </div>
              <div className="field">
                <label className="field-label">Duration</label>
                <select className="field-input" value={apptForm.duration}
                  onChange={e => setApptForm(f=>({...f,duration:e.target.value}))}>
                  {[['15','15 min'],['30','30 min'],['45','45 min'],['60','1 hour'],['75','1h 15m'],['90','1h 30m'],['120','2 hours'],['150','2h 30m'],['180','3 hours']].map(([v,l])=>(
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="field-label">Notes <span style={{color:'var(--text-3)',fontWeight:400,textTransform:'none',letterSpacing:0}}>(optional)</span></label>
                <textarea className="field-input" placeholder="Service notes…"
                  style={{height:'64px',resize:'none',padding:'10px 12px',lineHeight:'1.5'}}
                  value={apptForm.notes} onChange={e => setApptForm(f=>({...f,notes:e.target.value}))}/>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setApptModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAddVisit}>
                <Icon name="check" size={13} color="#0A0908"/>
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}