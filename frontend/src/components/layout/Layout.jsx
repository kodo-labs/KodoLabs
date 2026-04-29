import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-[radial-gradient(circle_at_50%_0%,rgba(0,112,235,0.10),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(134,84,239,0.10),transparent_28%),linear-gradient(180deg,#fbfbff_0%,#f8f9ff_60%,#f7f8fb_100%)]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-950/30 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="min-w-0 flex-1 overflow-y-auto">
        <Outlet context={{ onMenuClick: () => setSidebarOpen(true) }} />
      </main>
    </div>
  )
}
