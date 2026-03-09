'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

const supabase = createClient()

// ── ICONS (inline SVG to avoid dependencies) ──
const Icon = ({ name, size = 16, color = 'currentColor' }) => {
  const icons = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    chevronLeft: <polyline points="15 18 9 12 15 6"/>,
    chevronRight: <polyline points="9 18 15 12 9 6"/>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    clock: <><circle cx='12' cy='12' r='10'/><polyline points='12 6 12 12 16 14'/></>,
    trending: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    dollar: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    scissors: <><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></>,
    arrowUp: <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>,
    menu: <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  )
}

// ── SAMPLE DATA (replace with Supabase queries) ──
const todayAppointments = [
  { id:1, name:'Jordan Smith',   service:'Fade + Line-up', time:'9:00 AM',  duration:'45 min', price:'$45', status:'now',  color:'#C9A84C' },
  { id:2, name:'Aaliyah Laurent', service:'Color Treatment', time:'10:30 AM', duration:'90 min', price:'$85', status:'next', color:'#4E9B6F' },
  { id:3, name:'Nina Clarke',    service:'Full Set',        time:'12:00 PM', duration:'60 min', price:'$65', status:'upcoming', color:'#B87460' },
  { id:4, name:'Marcus Webb',    service:'Beard Trim',      time:'1:30 PM',  duration:'30 min', price:'$25', status:'upcoming', color:'#C9A84C' },
  { id:5, name:'Simone Davis',   service:'Highlights',      time:'2:30 PM',  duration:'120 min', price:'$120', status:'upcoming', color:'#4E9B6F' },
]

const stats = [
  { label:"Today's Appointments", value:'8',      sub:'↑ 2 vs last Saturday', color:'#C9A84C', icon:'calendar' },
  { label:'Revenue This Month',   value:'$2,840', sub:'↑ 12% vs last month',  color:'#4E9B6F', icon:'dollar'   },
  { label:'Total Clients',        value:'143',    sub:'↑ 6 new this week',     color:'#B87460', icon:'users'    },
  { label:'Avg per Appointment',  value:'$58',    sub:'based on last 30 days', color:'#9B9690', icon:'trending' },
]

const quickActions = [
  { label:'New Appointment', icon:'plus',     color:'#C9A84C', bg:'rgba(201,168,76,0.08)',  border:'rgba(201,168,76,0.25)',  href:'/calendar?new=true' },
  { label:'Add Client',      icon:'users',    color:'#4E9B6F', bg:'rgba(78,155,111,0.08)',  border:'rgba(78,155,111,0.25)',  href:'/clients?new=true' },
  { label:'Calendar',        icon:'calendar', color:'#B87460', bg:'rgba(184,116,96,0.08)',  border:'rgba(184,116,96,0.25)',  href:'/calendar' },
  { label:'Send Reminder',   icon:'bell',     color:'#9B9690', bg:'rgba(155,150,144,0.08)', border:'rgba(155,150,144,0.2)',  href:'/reminders' },
]

const navItems = [
  { label:'Dashboard', icon:'grid',     href:'/dashboard', active:true  },
  { label:'Calendar',  icon:'calendar', href:'/calendar',  active:false },
  { label:'Clients',   icon:'users',    href:'/clients',   active:false },
  { label:'Reminders', icon:'bell',     href:'/reminders', active:false },
  { label:'Settings',  icon:'settings', href:'/settings',  active:false },
]

const availShortcut = { label:'My Availability', icon:'clock', href:'/settings/availability' }

// ── STYLES ──
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0A0908; --surface: #111010; --surface-2: #181716; --surface-3: #1F1E1C;
    --border: #272523; --border-2: #312F2D; --text: #F0EDE8; --text-2: #9B9690;
    --text-3: #5C5955; --gold: #C9A84C; --gold-bg: rgba(201,168,76,0.08);
    --green: #4E9B6F; --rose: #B87460; --sidebar-w: 220px; --sidebar-collapsed: 56px;
    --font-display: 'Cormorant Garamond', serif; --font-body: 'DM Sans', sans-serif;
  }
  html, body { height: 100%; background: var(--bg); overflow: hidden; }
  body { font-family: var(--font-body); -webkit-font-smoothing: antialiased; color: var(--text); }

  .layout { display: flex; height: 100vh; overflow: hidden; }

  /* ── SIDEBAR ── */
  .sidebar {
    width: var(--sidebar-w); flex-shrink: 0;
    background: var(--surface); border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    transition: width 0.28s cubic-bezier(0.4,0,0.2,1);
    overflow: hidden; position: relative; z-index: 10;
  }
  .sidebar.collapsed { width: var(--sidebar-collapsed); }

  .sidebar-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 16px; height: 56px; border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .sidebar-logo {
    font-family: var(--font-display); font-size: 18px; color: var(--text);
    text-decoration: none; white-space: nowrap; overflow: hidden;
    opacity: 1; transition: opacity 0.2s;
  }
  .sidebar-logo em { color: var(--gold); font-style: italic; }
  .sidebar.collapsed .sidebar-logo { opacity: 0; width: 0; }
  .sidebar-toggle {
    width: 28px; height: 28px; border-radius: 6px;
    background: var(--surface-2); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text-3); transition: all 0.15s;
    flex-shrink: 0;
  }
  .sidebar-toggle:hover { background: var(--surface-3); color: var(--text-2); }

  .sidebar-nav { flex: 1; padding: 12px 0; overflow: hidden; }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 0 12px; height: 40px; margin: 2px 8px;
    border-radius: 8px; text-decoration: none;
    color: var(--text-3); font-size: 13px; font-weight: 500;
    transition: all 0.15s; white-space: nowrap; cursor: pointer;
    position: relative;
  }
  .nav-item:hover { background: var(--surface-2); color: var(--text-2); }
  .nav-item.active { background: var(--gold-bg); color: var(--gold); }
  .nav-item.active .nav-icon { color: var(--gold); }
  .nav-icon { flex-shrink: 0; transition: color 0.15s; }
  .nav-label { transition: opacity 0.15s, width 0.15s; overflow: hidden; }
  .sidebar.collapsed .nav-label { opacity: 0; width: 0; }
  .nav-tooltip {
    position: absolute; left: calc(100% + 10px); top: 50%; transform: translateY(-50%);
    background: var(--surface-3); border: 1px solid var(--border-2);
    color: var(--text-2); font-size: 11px; font-weight: 500;
    padding: 4px 10px; border-radius: 6px; white-space: nowrap;
    opacity: 0; pointer-events: none; transition: opacity 0.15s;
    z-index: 100;
  }
  .sidebar.collapsed .nav-item:hover .nav-tooltip { opacity: 1; }

  .sidebar-footer {
    padding: 12px 8px; border-top: 1px solid var(--border); flex-shrink: 0;
  }
  .sidebar-user {
    display: flex; align-items: center; gap: 10px;
    padding: 8px; border-radius: 8px; overflow: hidden;
  }
  .user-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--gold-bg); border: 1px solid rgba(201,168,76,0.3);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-size: 14px; color: var(--gold);
    flex-shrink: 0;
  }
  .user-info { overflow: hidden; }
  .user-name { font-size: 12px; font-weight: 600; color: var(--text); white-space: nowrap; }
  .user-plan { font-size: 10px; color: var(--text-3); white-space: nowrap; margin-top: 1px; }
  .sidebar.collapsed .user-info { display: none; }

  /* ── MAIN ── */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }

  /* ── TOPBAR ── */
  .topbar {
    height: 56px; flex-shrink: 0;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 28px; background: var(--surface);
  }
  .topbar-left { display: flex; flex-direction: column; }
  .topbar-greeting { font-family: var(--font-display); font-size: 17px; color: var(--text); line-height: 1.2; }
  .topbar-greeting em { color: var(--gold); font-style: italic; }
  .topbar-date { font-size: 11px; color: var(--text-3); margin-top: 1px; }
  .topbar-right { display: flex; align-items: center; gap: 10px; }
  .topbar-btn {
    width: 34px; height: 34px; border-radius: 8px;
    background: var(--surface-2); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text-3); transition: all 0.15s;
  }
  .topbar-btn:hover { background: var(--surface-3); color: var(--text-2); border-color: var(--border-2); }
  .logout-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 0 14px; height: 34px;
    background: transparent; border: 1px solid var(--border);
    border-radius: 8px; font-size: 12px; font-weight: 500;
    color: var(--text-3); cursor: pointer; transition: all 0.15s;
    font-family: var(--font-body);
  }
  .logout-btn:hover { border-color: #B85555; color: #B85555; background: rgba(184,85,85,0.06); }

  /* ── CONTENT ── */
  .content { flex: 1; overflow-y: auto; padding: 24px 28px; }
  .content::-webkit-scrollbar { width: 5px; }
  .content::-webkit-scrollbar-thumb { background: var(--border-2); border-radius: 99px; }

  /* ── STATS ── */
  .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 24px; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; padding: 18px 20px;
    transition: border-color 0.15s, transform 0.15s;
    position: relative; overflow: hidden;
  }
  .stat-card:hover { border-color: var(--border-2); transform: translateY(-2px); }
  .stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  }
  .stat-icon {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 14px;
  }
  .stat-value {
    font-family: var(--font-display); font-size: 28px; color: var(--text);
    line-height: 1; margin-bottom: 4px;
  }
  .stat-label { font-size: 11px; color: var(--text-3); font-weight: 500; margin-bottom: 6px; letter-spacing: 0.02em; }
  .stat-sub { font-size: 11px; color: var(--green); display: flex; align-items: center; gap: 4px; }

  /* ── GRID BOTTOM ── */
  .bottom-grid { display: grid; grid-template-columns: 1fr 340px; gap: 14px; }

  /* ── SCHEDULE ── */
  .panel {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; overflow: hidden;
  }
  .panel-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px; border-bottom: 1px solid var(--border);
  }
  .panel-title { font-family: var(--font-display); font-size: 16px; color: var(--text); }
  .panel-action {
    font-size: 12px; color: var(--gold); text-decoration: none;
    background: none; border: none; cursor: pointer;
    font-family: var(--font-body); transition: opacity 0.15s;
  }
  .panel-action:hover { opacity: 0.7; }
  .panel-body { padding: 12px; }

  /* appointment row */
  .appt-row {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--surface-2);
    margin-bottom: 8px; transition: border-color 0.15s;
    cursor: default;
  }
  .appt-row:last-child { margin-bottom: 0; }
  .appt-row:hover { border-color: var(--border-2); }
  .appt-bar { width: 3px; border-radius: 99px; align-self: stretch; flex-shrink: 0; min-height: 36px; }
  .appt-time { font-size: 10px; color: var(--text-3); width: 56px; flex-shrink: 0; font-weight: 500; }
  .appt-info { flex: 1; min-width: 0; }
  .appt-name { font-size: 13px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .appt-svc  { font-size: 11px; color: var(--text-3); margin-top: 1px; }
  .appt-price { font-size: 12px; font-weight: 600; color: var(--gold); flex-shrink: 0; }
  .appt-badge {
    font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 99px;
    flex-shrink: 0; letter-spacing: 0.04em;
  }
  .badge-now  { background: rgba(201,168,76,0.15); color: var(--gold);  border: 1px solid rgba(201,168,76,0.3); }
  .badge-next { background: rgba(78,155,111,0.12); color: var(--green); border: 1px solid rgba(78,155,111,0.25); }

  /* empty state */
  .empty-state { text-align: center; padding: 40px 20px; color: var(--text-3); }
  .empty-icon { font-size: 28px; margin-bottom: 10px; opacity: 0.5; }
  .empty-text { font-size: 13px; margin-bottom: 14px; }
  .empty-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; background: var(--gold-bg);
    border: 1px solid rgba(201,168,76,0.25); border-radius: 8px;
    font-size: 12px; color: var(--gold); cursor: pointer;
    font-family: var(--font-body); transition: all 0.15s;
  }
  .empty-btn:hover { background: rgba(201,168,76,0.14); }

  /* ── QUICK ACTIONS ── */
  .quick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 12px; }
  .quick-btn {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 8px; padding: 16px 12px; border-radius: 10px;
    border: 1px solid; cursor: pointer; transition: all 0.15s;
    font-family: var(--font-body); text-decoration: none;
  }
  .quick-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
  .quick-label { font-size: 11px; font-weight: 600; letter-spacing: 0.02em; }

  /* ── RIGHT PANEL ── */
  .right-col { display: flex; flex-direction: column; gap: 14px; }

  /* mini stats */
  .mini-stat {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px; background: var(--surface-2);
    border-bottom: 1px solid var(--border);
  }
  .mini-stat:last-child { border-bottom: none; }
  .mini-stat-label { font-size: 11px; color: var(--text-3); }
  .mini-stat-val { font-family: var(--font-display); font-size: 18px; color: var(--text); }

  /* upcoming clients */
  .client-row {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--surface-2);
    margin-bottom: 8px;
  }
  .client-row:last-child { margin-bottom: 0; }
  .c-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; flex-shrink: 0;
  }
  .c-name { font-size: 12px; font-weight: 600; color: var(--text); }
  .c-meta { font-size: 10px; color: var(--text-3); margin-top: 1px; }
  .c-time { font-size: 10px; color: var(--text-3); flex-shrink: 0; }

  /* loading */
  .loading-screen {
    min-height: 100vh; background: var(--bg);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-size: 22px; color: var(--gold);
  }
  .loading-dot { animation: pulse 1.2s ease-in-out infinite; }
  @keyframes pulse { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }

  /* ── QUICK ACTIONS SECTION LABEL ── */
  .section-eyebrow {
    font-size: 10px; font-weight: 600; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--text-3);
    margin-bottom: 14px; margin-top: 24px;
    display: flex; align-items: center; gap: 10px;
  }
  .section-eyebrow::after { content: ''; flex: 1; height: 1px; background: var(--border); }
`

export default function Dashboard() {
  const [user, setUser]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' })
  const initials = user?.email ? user.email[0].toUpperCase() : '?'
  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'there'

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

          {/* Header */}
          <div className="sidebar-header">
            <a className="sidebar-logo" href="/dashboard">
              Booked<em>Out</em>
            </a>
            <button className="sidebar-toggle" onClick={() => setCollapsed(c => !c)}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
              <Icon name={collapsed ? 'chevronRight' : 'chevronLeft'} size={13}/>
            </button>
          </div>

          {/* Nav */}
          <nav className="sidebar-nav">
            {navItems.map(item => (
              <a key={item.label} className={`nav-item${item.active ? ' active' : ''}`} href={item.href}>
                <span className="nav-icon">
                  <Icon name={item.icon} size={16}
                    color={item.active ? '#C9A84C' : 'currentColor'}/>
                </span>
                <span className="nav-label">{item.label}</span>
                <span className="nav-tooltip">{item.label}</span>
              </a>
            ))}
          </nav>

          {/* Availability shortcut */}
          <div style={{padding:'8px', borderTop:'1px solid var(--border)'}}>
            <a href='/settings?tab=availability'
              style={{display:'flex', alignItems:'center', gap:'10px', padding:'8px 12px', borderRadius:'8px', textDecoration:'none', color:'var(--text-3)', fontSize:'12px', fontWeight:500, transition:'all 0.15s', background:'transparent'}}
              onMouseOver={e => { e.currentTarget.style.background='var(--surface-2)'; e.currentTarget.style.color='var(--gold)' }}
              onMouseOut={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text-3)' }}>
              <Icon name='clock' size={14} color='currentColor'/>
              <span style={{whiteSpace:'nowrap', overflow:'hidden', opacity: collapsed ? 0 : 1, transition:'opacity 0.15s'}}>My Availability</span>
            </a>
          </div>

          {/* Footer / User */}
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
              <div className="topbar-greeting">
                Good {now.getHours() < 12 ? 'morning' : now.getHours() < 17 ? 'afternoon' : 'evening'},&nbsp;
                <em>{firstName}</em>
              </div>
              <div className="topbar-date">{dateStr}</div>
            </div>
            <div className="topbar-right">
              <button className="topbar-btn" title="Notifications" onClick={() => router.push('/reminders')}>
                <Icon name="bell" size={15}/>
              </button>
              <button className="topbar-btn" title="Settings" onClick={() => router.push('/settings')}>
                <Icon name="settings" size={15}/>
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                <Icon name="logout" size={13}/>
                Log out
              </button>
            </div>
          </header>

          {/* Scrollable content */}
          <div className="content">

            {/* Stats Row */}
            <div className="stats-grid">
              {stats.map((s, i) => (
                <div className="stat-card" key={i}
                  style={{'--accent': s.color}}>
                  <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:s.color,borderRadius:'12px 12px 0 0'}}/>
                  <div className="stat-icon"
                    style={{background:`${s.color}15`, border:`1px solid ${s.color}30`}}>
                    <Icon name={s.icon} size={15} color={s.color}/>
                  </div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-sub" style={{color: s.color === '#9B9690' ? '#9B9690' : '#4E9B6F'}}>
                    <Icon name="arrowUp" size={10} color={s.color === '#9B9690' ? '#9B9690' : '#4E9B6F'}/>
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom grid */}
            <div className="bottom-grid">

              {/* Today's Schedule */}
              <div>
                <div className="panel">
                  <div className="panel-header">
                    <div className="panel-title">Today's Schedule</div>
                    <button className="panel-action" onClick={() => router.push('/calendar')}>View full calendar →</button>
                  </div>
                  <div className="panel-body">
                    {todayAppointments.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon">◷</div>
                        <div className="empty-text">No appointments today.</div>
                        <button className="empty-btn">
                          <Icon name="plus" size={12} color="#C9A84C"/>
                          Add your first appointment
                        </button>
                      </div>
                    ) : (
                      todayAppointments.map(appt => (
                        <div className="appt-row" key={appt.id}>
                          <div className="appt-bar" style={{background: appt.color}}/>
                          <div className="appt-time">{appt.time}</div>
                          <div className="appt-info">
                            <div className="appt-name">{appt.name}</div>
                            <div className="appt-svc">{appt.service} · {appt.duration}</div>
                          </div>
                          <div className="appt-price">{appt.price}</div>
                          {appt.status === 'now'  && <div className="appt-badge badge-now">NOW</div>}
                          {appt.status === 'next' && <div className="appt-badge badge-next">NEXT</div>}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="section-eyebrow" style={{marginTop:'20px'}}>Quick Actions</div>
                <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px'}}>
                  {quickActions.map(a => (
                    <button key={a.label} className="quick-btn"
                      style={{background: a.bg, borderColor: a.border, color: a.color}}
                      onClick={() => router.push(a.href)}>
                      <Icon name={a.icon} size={18} color={a.color}/>
                      <span className="quick-label">{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right column */}
              <div className="right-col">

                {/* Today at a glance */}
                <div className="panel">
                  <div className="panel-header">
                    <div className="panel-title">Today at a Glance</div>
                  </div>
                  <div>
                    {[
                      { label:'Appointments',    val: todayAppointments.length },
                      { label:'Completed',        val: '0' },
                      { label:"Today's Revenue",  val: '$0' },
                      { label:'Next client in',   val: '—' },
                    ].map((row, i) => (
                      <div className="mini-stat" key={i}>
                        <div className="mini-stat-label">{row.label}</div>
                        <div className="mini-stat-val">{row.val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* My Hours */}
                <div className="panel">
                  <div className="panel-header">
                    <div className="panel-title">My Hours Today</div>
                    <button className="panel-action" onClick={() => router.push('/settings?tab=availability')}>Edit →</button>
                  </div>
                  <div style={{padding:'14px 16px', display:'flex', flexDirection:'column', gap:'8px'}}>
                    {[
                      {day:'Monday', hours:'9:00 AM – 6:00 PM', active:true},
                      {day:'Tuesday', hours:'9:00 AM – 6:00 PM', active:false},
                      {day:'Wednesday', hours:'9:00 AM – 6:00 PM', active:false},
                    ].slice(0,1).map((d,i) => (
                      <div key={i} style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                          <div style={{width:6, height:6, borderRadius:'50%', background:'var(--green)', flexShrink:0}}/>
                          <span style={{fontSize:'12px', color:'var(--text-2)', fontWeight:600}}>{new Date().toLocaleDateString('en-US',{weekday:'long'})}</span>
                        </div>
                        <span style={{fontSize:'12px', color:'var(--text-3)'}}>9:00 AM – 6:00 PM</span>
                      </div>
                    ))}
                    <div style={{fontSize:'11px', color:'var(--text-3)', paddingTop:'6px', borderTop:'1px solid var(--border)', marginTop:'4px'}}>
                      Next day off: <span style={{color:'var(--text-2)'}}>Sunday</span>
                    </div>
                  </div>
                </div>

                {/* Upcoming clients */}
                <div className="panel">
                  <div className="panel-header">
                    <div className="panel-title">Upcoming Clients</div>
                    <button className="panel-action" onClick={() => router.push('/clients')}>See all →</button>
                  </div>
                  <div className="panel-body">
                    {todayAppointments.slice(0,4).map((appt, i) => {
                      const colors = ['#C9A84C','#4E9B6F','#B87460','#9B9690']
                      const bgs    = ['rgba(201,168,76,0.12)','rgba(78,155,111,0.12)','rgba(184,116,96,0.12)','rgba(155,150,144,0.1)']
                      const initials = appt.name.split(' ').map(n => n[0]).join('')
                      return (
                        <div className="client-row" key={appt.id}>
                          <div className="c-avatar"
                            style={{background: bgs[i % bgs.length], color: colors[i % colors.length]}}>
                            {initials}
                          </div>
                          <div style={{flex:1, minWidth:0}}>
                            <div className="c-name">{appt.name}</div>
                            <div className="c-meta">{appt.service}</div>
                          </div>
                          <div className="c-time">{appt.time}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}