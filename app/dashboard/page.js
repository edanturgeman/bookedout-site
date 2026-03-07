'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
        setLoading(false)
      }
    }
    getUser()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <main className="min-h-screen bg-[#0F0D0B] flex items-center justify-center">
      <div className="text-[#7A746D]">Loading...</div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#0F0D0B]">
      {/* Top Nav */}
      <nav className="border-b border-[#2E2925] px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#FAF7F2]">Booked<span className="text-[#C9A84C]">Out</span></h1>
        <div className="flex items-center gap-4">
          <span className="text-[#7A746D] text-sm">{user.email}</span>
          <button onClick={handleLogout}
            className="text-sm border border-[#2E2925] text-[#7A746D] hover:border-[#C4856F] hover:text-[#C4856F] px-4 py-2 rounded-xl transition-all">
            Log out
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-[#FAF7F2]">
            Welcome back 👋
          </h2>
          <p className="text-[#7A746D] mt-1">Here's what's happening today.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Today's Appointments", value: '0', icon: '📅' },
            { label: 'Total Clients', value: '0', icon: '👤' },
            { label: 'This Month', value: '$0', icon: '💰' },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#1C1916] border border-[#2E2925] rounded-2xl p-6">
              <div className="text-2xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold text-[#FAF7F2] mb-1">{stat.value}</div>
              <div className="text-[#7A746D] text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h3 className="text-[#FAF7F2] font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'New Appointment', icon: '➕', color: 'border-[#C4856F] hover:bg-[#C4856F]/10' },
              { label: 'Add Client', icon: '👤', color: 'border-[#C9A84C] hover:bg-[#C9A84C]/10' },
              { label: 'View Calendar', icon: '📅', color: 'border-[#8FAF8F] hover:bg-[#8FAF8F]/10' },
              { label: 'Send Reminder', icon: '💬', color: 'border-[#7A9CBF] hover:bg-[#7A9CBF]/10' },
            ].map((action) => (
              <button key={action.label}
                className={`bg-[#1C1916] border ${action.color} rounded-2xl p-4 text-center transition-all`}>
                <div className="text-2xl mb-2">{action.icon}</div>
                <div className="text-[#FAF7F2] text-sm font-medium">{action.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-[#1C1916] border border-[#2E2925] rounded-2xl p-6">
          <h3 className="text-[#FAF7F2] font-semibold mb-4">Today's Schedule</h3>
          <div className="text-center py-10 text-[#7A746D]">
            <div className="text-4xl mb-3">📅</div>
            <p className="text-sm">No appointments today.</p>
            <button className="mt-4 text-[#C4856F] text-sm hover:underline">+ Add your first appointment</button>
          </div>
        </div>
      </div>
    </main>
  )
}