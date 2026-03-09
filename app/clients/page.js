'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

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
    search:      <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    x:           <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    trash:       <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>,
    check:       <polyline points="20 6 9 17 4 12"/>,
    user:        <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    phone:       <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.09 6.09l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></>,
    mail:        <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    clock:       <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    scissors:    <><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></>,
    logout:      <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    arrowUp:     <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>,</>,
    arrowDown:   <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>,
    filter:      <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    star:        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  )
}

const SERVICES = ['Fade','Fade + Line-up','Beard Trim','Line-up','Color Treatment','Highlights','Blowout','Full Set','Fill','Pedicure','Facial','Wax','Lash Set','Other']

const AVATAR_COLORS = [
  ['#C9A84C','rgba(201,168,76,0.15)'],
  ['#4E9B6F','rgba(78,155,111,0.15)'],
  ['#B87460','rgba(184,116,96,0.15)'],
  ['#9B7EC8','rgba(155,126,200,0.15)'],
  ['#7EB8C9','rgba(126,184,201,0.15)'],
]

const getAvatarColor = (name) => {
  const idx = (name?.charCodeAt(0) || 0) % AVATAR_COLORS.length
  return AVATAR_COLORS[idx]
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
}

const getBadge = (client) => {
  if (client.isVip) return { label:'VIP', color:'#C9A84C', bg:'rgba(201,168,76,0.12)', border:'rgba(201,168,76,0.3)' }
  const isNew = client.visitCount <= 1 || (client.createdAt && (new Date() - new Date(client.createdAt)) < 30 * 86400000)
  if (isNew) return { label:'New', color:'#9B9690', bg:'rgba(155,150,144,0.1)', border:'rgba(155,150,144,0.2)' }
  return { label:'Regular', color:'#4E9B6F', bg:'rgba(78,155,111,0.12)', border:'rgba(78,155,111,0.25)' }
}

const navItems = [
  { label:'Dashboard', icon:'grid',     href:'/dashboard', active:false },
  { label:'Calendar',  icon:'calendar', href:'/calendar',  active:false },
  { label:'Clients',   icon:'users',    href:'/clients',   active:true  },
  { label:'Reminders', icon:'bell',     href:'/reminders', active:false },
  { label:'Settings',  icon:'settings', href:'/settings',  active:false },
]

// Sample clients — will be replaced with Supabase queries
const SAMPLE_CLIENTS = [
  { id:'1', name:'Aaliyah Laurent', phone:'(305) 555-0142', email:'aaliyah@email.com', lastService:'Color Treatment', lastVisit:'2026-03-06', visitCount:7, isVip:false, createdAt:'2025-06-01', notes:'Prefers cool tones. Sensitive scalp.' },
  { id:'2', name:'Jordan Smith',    phone:'(786) 555-0198', email:'jordan@email.com',  lastService:'Fade + Line-up',  lastVisit:'2026-03-08', visitCount:14, isVip:true,  createdAt:'2025-01-10', notes:'Every 2 weeks. Skin fade only.' },
  { id:'3', name:'Marcus Webb',     phone:'(954) 555-0167', email:'marcus@email.com',  lastService:'Beard Trim',      lastVisit:'2026-03-01', visitCount:3,  isVip:false, createdAt:'2025-09-15', notes:'' },
  { id:'4', name:'Nina Clarke',     phone:'(305) 555-0134', email:'nina@email.com',    lastService:'Full Set',        lastVisit:'2026-02-22', visitCount:2,  isVip:false, createdAt:'2026-01-15', notes:'Prefers short almond shape.' },
  { id:'5', name:'Simone Davis',    phone:'(786) 555-0111', email:'simone@email.com',  lastService:'Highlights',      lastVisit:'2026-03-08', visitCount:5,  isVip:true,  createdAt:'2025-08-20', notes:'Going lighter gradually.' },
  { id:'6', name:'Brandon Lee',     phone:'(954) 555-0188', email:'brandon@email.com', lastService:'Fade',            lastVisit:'2026-02-15', visitCount:11, isVip:false, createdAt:'2025-03-01', notes:'Low fade, no line on neck.' },
  { id:'7', name:'Camille Rivers',  phone:'(305) 555-0155', email:'camille@email.com', lastService:'Facial',          lastVisit:'2026-03-03', visitCount:1,  isVip:false, createdAt:'2026-03-03', notes:'First visit. Dry skin.' },
  { id:'8', name:'Derek Okafor',    phone:'(786) 555-0122', email:'derek@email.com',   lastService:'Fade + Line-up',  lastVisit:'2026-02-28', visitCount:8,  isVip:false, createdAt:'2025-07-10', notes:'' },
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
  .user-avatar-sm { width:32px; height:32px; border-radius:50%; background:var(--gold-bg); border:1px solid rgba(201,168,76,0.3); display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:14px; color:var(--gold); flex-shrink:0; }
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
  .client-count { font-size:12px; color:var(--text-3); background:var(--surface-2); border:1px solid var(--border); padding:3px 10px; border-radius:99px; }
  .topbar-right { display:flex; align-items:center; gap:10px; }
  .new-client-btn { display:flex; align-items:center; gap:7px; padding:0 18px; height:36px; background:var(--gold); color:#0A0908; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.15s; font-family:var(--font-body); }
  .new-client-btn:hover { background:#D4B558; box-shadow:0 4px 16px rgba(201,168,76,0.3); transform:translateY(-1px); }
  .logout-btn { display:flex; align-items:center; gap:6px; padding:0 14px; height:36px; background:transparent; border:1px solid var(--border); border-radius:8px; font-size:12px; color:var(--text-3); cursor:pointer; transition:all 0.15s; font-family:var(--font-body); }
  .logout-btn:hover { border-color:var(--red); color:var(--red); }

  /* TOOLBAR */
  .toolbar { display:flex; align-items:center; gap:10px; padding:16px 28px; border-bottom:1px solid var(--border); background:var(--surface); flex-shrink:0; }
  .search-wrap { position:relative; flex:1; max-width:360px; }
  .search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); pointer-events:none; }
  .search-input { width:100%; height:38px; padding:0 12px 0 38px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; font-size:13px; color:var(--text); font-family:var(--font-body); outline:none; transition:border-color 0.15s; }
  .search-input::placeholder { color:var(--text-3); }
  .search-input:focus { border-color:var(--gold); }
  .filter-tabs { display:flex; gap:2px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; padding:3px; }
  .filter-tab { padding:5px 14px; border-radius:6px; font-size:12px; font-weight:500; color:var(--text-3); cursor:pointer; transition:all 0.15s; border:none; background:none; font-family:var(--font-body); }
  .filter-tab.active { background:var(--surface-3); color:var(--text); border:1px solid var(--border-2); }
  .sort-btn { display:flex; align-items:center; gap:6px; padding:0 14px; height:38px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; font-size:12px; color:var(--text-2); cursor:pointer; transition:all 0.15s; font-family:var(--font-body); margin-left:auto; }
  .sort-btn:hover { background:var(--surface-3); }

  /* CONTENT */
  .content { flex:1; overflow-y:auto; }
  .content::-webkit-scrollbar { width:5px; }
  .content::-webkit-scrollbar-thumb { background:var(--border-2); border-radius:99px; }

  /* ALPHABET DIVIDER */
  .alpha-section { }
  .alpha-label { padding:10px 28px 6px; font-size:11px; font-weight:700; color:var(--text-3); letter-spacing:0.1em; display:flex; align-items:center; gap:10px; }
  .alpha-label::after { content:''; flex:1; height:1px; background:var(--border); }

  /* CLIENT ROWS */
  .clients-list { padding:0 28px; display:flex; flex-direction:column; gap:8px; padding-bottom:8px; }
  .client-card { display:flex; align-items:center; gap:16px; padding:14px 18px; background:var(--surface); border:1px solid var(--border); border-radius:12px; cursor:pointer; transition:all 0.15s; text-decoration:none; }
  .client-card:hover { border-color:var(--border-2); background:var(--surface-2); transform:translateY(-1px); box-shadow:0 4px 16px rgba(0,0,0,0.2); }
  .client-avatar { width:42px; height:42px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:16px; font-weight:600; flex-shrink:0; }
  .client-name { font-size:14px; font-weight:600; color:var(--text); margin-bottom:2px; }
  .client-meta { font-size:12px; color:var(--text-3); display:flex; align-items:center; gap:8px; }
  .client-meta-dot { width:3px; height:3px; border-radius:50%; background:var(--text-3); }
  .client-info { flex:1; min-width:0; }
  .client-right { display:flex; align-items:center; gap:12px; flex-shrink:0; }
  .client-last { text-align:right; }
  .client-last-service { font-size:12px; color:var(--text-2); font-weight:500; white-space:nowrap; }
  .client-last-date { font-size:11px; color:var(--text-3); margin-top:2px; }
  .badge { font-size:9px; font-weight:700; padding:3px 9px; border-radius:99px; letter-spacing:0.04em; border:1px solid; white-space:nowrap; }
  .delete-btn { width:30px; height:30px; border-radius:8px; background:none; border:1px solid transparent; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text-3); transition:all 0.12s; flex-shrink:0; }
  .delete-btn:hover { background:rgba(184,85,85,0.1); border-color:rgba(184,85,85,0.3); color:var(--red); }

  /* EMPTY STATE */
  .empty-state { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:80px 20px; color:var(--text-3); gap:12px; }
  .empty-icon { font-size:36px; opacity:0.3; }
  .empty-title { font-family:var(--font-display); font-size:20px; color:var(--text-2); }
  .empty-sub { font-size:13px; text-align:center; max-width:280px; line-height:1.6; }
  .empty-btn { display:flex; align-items:center; gap:7px; padding:0 20px; height:38px; background:var(--gold-bg); border:1px solid rgba(201,168,76,0.25); border-radius:8px; font-size:13px; color:var(--gold); cursor:pointer; font-family:var(--font-body); transition:all 0.15s; margin-top:8px; }
  .empty-btn:hover { background:rgba(201,168,76,0.14); }

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
  .field-req { color:var(--gold); }
  .field-input { height:42px; padding:0 12px; background:var(--surface-2); border:1px solid var(--border); border-radius:8px; font-size:13px; color:var(--text); font-family:var(--font-body); outline:none; transition:border-color 0.15s, box-shadow 0.15s; }
  .field-input::placeholder { color:var(--text-3); }
  .field-input:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(201,168,76,0.1); }
  select.field-input { cursor:pointer; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%235C5955' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; padding-right:32px; -webkit-appearance:none; }
  select.field-input option { background:var(--surface-2); }
  .btn-primary { display:flex; align-items:center; gap:6px; padding:0 20px; height:38px; background:var(--gold); color:#0A0908; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.15s; font-family:var(--font-body); }
  .btn-primary:hover { background:#D4B558; }
  .btn-secondary { display:flex; align-items:center; gap:6px; padding:0 16px; height:38px; background:transparent; color:var(--text-2); border:1px solid var(--border); border-radius:8px; font-size:13px; cursor:pointer; transition:all 0.15s; font-family:var(--font-body); }
  .btn-secondary:hover { background:var(--surface-2); }
  .btn-danger { display:flex; align-items:center; gap:6px; padding:0 16px; height:38px; background:transparent; color:var(--red); border:1px solid rgba(184,85,85,0.3); border-radius:8px; font-size:13px; cursor:pointer; transition:all 0.15s; font-family:var(--font-body); margin-right:auto; }
  .btn-danger:hover { background:rgba(184,85,85,0.08); }

  /* CONFIRM MODAL */
  .confirm-body { padding:24px; }
  .confirm-text { font-size:14px; color:var(--text-2); line-height:1.6; margin-top:8px; }
  .confirm-name { color:var(--text); font-weight:600; }

  /* TOAST */
  .toast { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); z-index:300; display:flex; align-items:center; gap:10px; padding:12px 20px; background:var(--surface-3); border:1px solid var(--border-2); border-radius:10px; font-size:13px; color:var(--text); box-shadow:0 8px 32px rgba(0,0,0,0.5); animation:toastIn 0.25s cubic-bezier(0.16,1,0.3,1); white-space:nowrap; }
  @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }

  /* LOADING */
  .loading-screen { min-height:100vh; background:var(--bg); display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:22px; color:var(--gold); }
  .loading-dot { animation:pulse 1.2s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
`

function timeAgo(dateStr) {
  if (!dateStr) return '—'
  const diff = Math.floor((new Date() - new Date(dateStr)) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7)  return `${diff} days ago`
  if (diff < 30) return `${Math.floor(diff/7)} week${Math.floor(diff/7)>1?'s':''} ago`
  if (diff < 365) return `${Math.floor(diff/30)} month${Math.floor(diff/30)>1?'s':''} ago`
  return `${Math.floor(diff/365)} year${Math.floor(diff/365)>1?'s':''} ago`
}

export default function ClientsPage() {
  const [user, setUser]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const [clients, setClients]     = useState(SAMPLE_CLIENTS)
  const [search, setSearch]       = useState('')
  const [filter, setFilter]       = useState('all') // all, vip, regular, new
  const [sortAsc, setSortAsc]     = useState(true)

  // Modals
  const [newModal, setNewModal]         = useState(false)
  const [deleteModal, setDeleteModal]   = useState(null) // client object
  const [toast, setToast]               = useState(null)

  // New client form
  const [form, setForm] = useState({
    name:'', phone:'', email:'', lastService:'', lastVisit:'', notes:''
  })
  const [formErrors, setFormErrors] = useState({})
  const [dupWarning, setDupWarning] = useState(null) // existing client with same name

  useEffect(() => {
    async function getUser() {
      const { data:{ user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      setLoading(false)
      // TODO: load clients from Supabase
      // const { data } = await supabase.from('clients').select('*').eq('provider_id', user.id).order('name')
      // if (data) setClients(data)
    }
    getUser()
  }, [])

  // Auto-open new client modal if ?new=true in URL
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setNewModal(true)
      // Clean the URL so refreshing doesn't reopen it
      router.replace('/clients')
    }
  }, [searchParams])

  const showToast = (msg, color = '#4E9B6F') => {
    setToast({ msg, color })
    setTimeout(() => setToast(null), 3000)
  }

  // Filter + search + sort
  const filtered = clients
    .filter(c => {
      const q = search.toLowerCase()
      const matchSearch = !q || c.name.toLowerCase().includes(q) || c.phone?.includes(q) || c.email?.toLowerCase().includes(q) || c.lastService?.toLowerCase().includes(q)
      const badge = getBadge(c).label.toLowerCase()
      const matchFilter = filter === 'all' || badge === filter
      return matchSearch && matchFilter
    })
    .sort((a, b) => sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name))

  // Group by first letter
  const grouped = filtered.reduce((acc, client) => {
    const letter = client.name[0].toUpperCase()
    if (!acc[letter]) acc[letter] = []
    acc[letter].push(client)
    return acc
  }, {})

  const validateForm = () => {
    const errors = {}
    if (!form.name.trim()) errors.name = 'Name is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreate = () => {
    if (!validateForm()) return
    const newClient = {
      id: String(Date.now()),
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      lastService: form.lastService || '—',
      lastVisit: form.lastVisit || null,
      visitCount: form.lastVisit ? 1 : 0,
      isVip: false,
      createdAt: new Date().toISOString(),
      notes: form.notes.trim(),
    }
    setClients(c => [...c, newClient])
    // TODO: insert into Supabase
    // await supabase.from('clients').insert({ ...newClient, provider_id: user.id })
    setNewModal(false)
    setForm({ name:'', phone:'', email:'', lastService:'', lastVisit:'', notes:'' })
    setFormErrors({})
    showToast(`✓ ${newClient.name} added`)
  }

  const handleDelete = () => {
    if (!deleteModal) return
    setClients(c => c.filter(cl => cl.id !== deleteModal.id))
    // TODO: delete from Supabase
    // await supabase.from('clients').delete().eq('id', deleteModal.id)
    showToast(`${deleteModal.name} removed`, '#B85555')
    setDeleteModal(null)
  }

  const toggleVip = (clientId) => {
    setClients(c => c.map(cl => cl.id === clientId ? { ...cl, isVip: !cl.isVip } : cl))
    // TODO: update Supabase
    // await supabase.from('clients').update({ is_vip: !client.isVip }).eq('id', clientId)
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
          <div style={{padding:'8px', borderTop:'1px solid var(--border)'}}>
            <a href='/settings/availability'
              style={{display:'flex', alignItems:'center', gap:'10px', padding:'8px 12px', borderRadius:'8px', textDecoration:'none', color:'var(--text-3)', fontSize:'12px', fontWeight:500, transition:'all 0.15s'}}
              onMouseOver={e => { e.currentTarget.style.background='var(--surface-2)'; e.currentTarget.style.color='var(--gold)' }}
              onMouseOut={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text-3)' }}>
              <Icon name='clock' size={14} color='currentColor'/>
              <span style={{whiteSpace:'nowrap', overflow:'hidden', opacity: collapsed ? 0 : 1, transition:'opacity 0.15s'}}>My Availability</span>
            </a>
          </div>
          <div className="sidebar-footer">
            <div className="sidebar-user">
              <div className="user-avatar-sm">{initials}</div>
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
            <div className="topbar-left">
              <div className="topbar-title">Cli<em>ents</em></div>
              <div className="client-count">{filtered.length} of {clients.length}</div>
            </div>
            <div className="topbar-right">
              <button className="new-client-btn" onClick={() => setNewModal(true)}>
                <Icon name="plus" size={14} color="#0A0908"/>
                New Client
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                <Icon name="logout" size={13}/>
                Log out
              </button>
            </div>
          </header>

          {/* Toolbar */}
          <div className="toolbar">
            <div className="search-wrap">
              <span className="search-icon"><Icon name="search" size={14} color="#5C5955"/></span>
              <input className="search-input" placeholder="Search by name, service, phone…"
                value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            <div className="filter-tabs">
              {[['all','All'],['vip','VIP'],['regular','Regular'],['new','New']].map(([key,label]) => (
                <button key={key} className={`filter-tab${filter===key?' active':''}`}
                  onClick={() => setFilter(key)}>{label}</button>
              ))}
            </div>
            <button className="sort-btn" onClick={() => setSortAsc(s => !s)}>
              <Icon name={sortAsc ? 'arrowUp' : 'arrowDown'} size={13}/>
              A–Z {sortAsc ? '↑' : '↓'}
            </button>
          </div>

          {/* Client list */}
          <div className="content">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👤</div>
                <div className="empty-title">No clients found</div>
                <div className="empty-sub">
                  {search ? `No results for "${search}". Try a different name or service.` : 'Add your first client to get started.'}
                </div>
                {!search && (
                  <button className="empty-btn" onClick={() => setNewModal(true)}>
                    <Icon name="plus" size={13} color="#C9A84C"/>
                    Add First Client
                  </button>
                )}
              </div>
            ) : (
              Object.keys(grouped).sort().map(letter => (
                <div className="alpha-section" key={letter}>
                  <div className="alpha-label">{letter}</div>
                  <div className="clients-list">
                    {grouped[letter].map(client => {
                      const [textColor, bgColor] = getAvatarColor(client.name)
                      const badge = getBadge(client)
                      return (
                        <div className="client-card" key={client.id}
                          onClick={() => router.push(`/clients/${client.id}`)}>
                          {/* Avatar */}
                          <div className="client-avatar"
                            style={{background: bgColor, color: textColor}}>
                            {getInitials(client.name)}
                          </div>

                          {/* Info */}
                          <div className="client-info">
                            <div className="client-name">{client.name}</div>
                            <div className="client-meta">
                              {client.phone && <span>{client.phone}</span>}
                              {client.phone && client.email && <span className="client-meta-dot"/>}
                              {client.email && <span>{client.email}</span>}
                            </div>
                          </div>

                          {/* Right side */}
                          <div className="client-right">
                            <div className="client-last">
                              <div className="client-last-service">{client.lastService}</div>
                              <div className="client-last-date">{timeAgo(client.lastVisit)}</div>
                            </div>
                            <div className="badge"
                              style={{color:badge.color, background:badge.bg, borderColor:badge.border}}>
                              {badge.label}
                            </div>
                            <button className="delete-btn"
                              onClick={e => { e.stopPropagation(); setDeleteModal(client) }}>
                              <Icon name="trash" size={13}/>
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
            <div style={{height:32}}/>
          </div>
        </div>
      </div>

      {/* NEW CLIENT MODAL */}
      {newModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setNewModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">New Client</div>
              <button className="modal-close" onClick={() => { setNewModal(false); setFormErrors({}); setDupWarning(null) }}>
                <Icon name="x" size={14}/>
              </button>
            </div>
            <div className="modal-body">
              <div className="field-row">
                <div className="field">
                  <label className="field-label">Full Name <span className="field-req">*</span></label>
                  <input className="field-input" type="text" placeholder="e.g. Jordan Smith"
                    value={form.name} onChange={e => {
                    const val = e.target.value
                    setForm(f=>({...f,name:val}))
                    const match = clients.filter(c => c.name.trim().toLowerCase() === val.trim().toLowerCase())
                    setDupWarning(match.length > 0 ? match : null)
                  }}
                    style={formErrors.name ? {borderColor:'#B85555'} : {}}/>
                  {formErrors.name && <span style={{fontSize:'11px',color:'#B85555'}}>{formErrors.name}</span>}
                  {dupWarning && !formErrors.name && (
                    <div style={{marginTop:'4px', padding:'10px 12px', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:'8px'}}>
                      <div style={{fontSize:'11px', fontWeight:700, color:'var(--gold)', marginBottom:'6px', letterSpacing:'0.04em'}}>⚠ CLIENT ALREADY EXISTS</div>
                      {dupWarning.map(d => (
                        <div key={d.id} style={{fontSize:'11px', color:'var(--text-2)', marginBottom:'4px', display:'flex', alignItems:'center', gap:'8px'}}>
                          <div style={{width:5, height:5, borderRadius:'50%', background:'var(--gold)', flexShrink:0}}/>
                          <span style={{fontWeight:600, color:'var(--text)'}}>{d.name}</span>
                          {d.phone && <span style={{color:'var(--text-3)'}}>· {d.phone}</span>}
                          {d.email && <span style={{color:'var(--text-3)'}}>· {d.email}</span>}
                        </div>
                      ))}
                      <div style={{fontSize:'11px', color:'var(--text-3)', marginTop:'6px'}}>Still a different person? You can continue — they will be saved as separate profiles.</div>
                    </div>
                  )}
                </div>
                <div className="field">
                  <label className="field-label">Phone</label>
                  <input className="field-input" type="tel" placeholder="(305) 555-0100"
                    value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))}/>
                </div>
              </div>
              <div className="field">
                <label className="field-label">Email</label>
                <input className="field-input" type="email" placeholder="client@email.com"
                  value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))}/>
              </div>
              <div className="field-row">
                <div className="field">
                  <label className="field-label">Last Service</label>
                  <select className="field-input" value={form.lastService}
                    onChange={e => setForm(f=>({...f,lastService:e.target.value}))}>
                    <option value="">Select service…</option>
                    {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label className="field-label">Last Visit Date</label>
                  <input className="field-input" type="date" value={form.lastVisit}
                    onChange={e => setForm(f=>({...f,lastVisit:e.target.value}))}/>
                </div>
              </div>
              <div className="field">
                <label className="field-label">Notes <span style={{color:'var(--text-3)',fontWeight:400,textTransform:'none',letterSpacing:0}}>(optional)</span></label>
                <textarea className="field-input" placeholder="Preferences, allergies, style notes…"
                  style={{height:'72px',resize:'none',padding:'10px 12px',lineHeight:'1.5'}}
                  value={form.notes} onChange={e => setForm(f=>({...f,notes:e.target.value}))}/>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => { setNewModal(false); setFormErrors({}); setDupWarning(null) }}>Cancel</button>
              <button className="btn-primary" onClick={handleCreate}>
                <Icon name="check" size={13} color="#0A0908"/>
                Add Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDeleteModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Delete Client</div>
              <button className="modal-close" onClick={() => setDeleteModal(null)}>
                <Icon name="x" size={14}/>
              </button>
            </div>
            <div className="confirm-body">
              <div className="confirm-text">
                Are you sure you want to delete <span className="confirm-name">{deleteModal.name}</span>?
                This will permanently remove their profile and all associated history. This cannot be undone.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-danger" onClick={handleDelete}>
                <Icon name="trash" size={13}/>
                Delete Permanently
              </button>
              <button className="btn-secondary" onClick={() => setDeleteModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="toast" style={{borderColor: toast.color === '#B85555' ? 'rgba(184,85,85,0.4)' : 'rgba(78,155,111,0.4)'}}>
          <div style={{width:6,height:6,borderRadius:'50%',background:toast.color,flexShrink:0}}/>
          {toast.msg}
        </div>
      )}
    </>
  )
}