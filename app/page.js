import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0F0D0B] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#FAF7F2]">
            Booked<span className="text-[#C9A84C]">Out</span>
          </h1>
          <p className="text-[#7A746D] mt-2 text-sm italic">personal care, elevated</p>
        </div>

        {/* Cards */}
        <div className="flex gap-4 justify-center">
          <Link href="/login" className="flex-1 bg-[#1C1916] border border-[#2E2925] rounded-2xl p-6 text-center hover:border-[#C4856F] transition-all">
            <div className="text-3xl mb-3">🔑</div>
            <div className="text-[#FAF7F2] font-semibold">Log In</div>
            <div className="text-[#7A746D] text-xs mt-1">I have an account</div>
          </Link>
          <Link href="/signup" className="flex-1 bg-[#1C1916] border border-[#2E2925] rounded-2xl p-6 text-center hover:border-[#C9A84C] transition-all">
            <div className="text-3xl mb-3">✨</div>
            <div className="text-[#FAF7F2] font-semibold">Sign Up</div>
            <div className="text-[#7A746D] text-xs mt-1">Start free trial</div>
          </Link>
        </div>
      </div>
    </main>
  )
}