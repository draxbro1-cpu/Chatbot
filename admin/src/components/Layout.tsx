import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context'

const navItems = [
  { to: '/chatbots',           label: 'Chatbots',          icon: '🤖', end: false },
  { to: '/flownware-chatbot',  label: 'Flownware Bot',     icon: '🚀', end: false },
  { to: '/realestate-chatbot', label: 'Real Estate Bot',   icon: '🏠', end: false },
  { to: '/',                   label: 'Dashboard',         icon: '📊', end: true  },
  { to: '/profile',            label: 'Business Profile',  icon: '🏢', end: false },
  { to: '/knowledge',          label: 'Knowledge Base',    icon: '📚', end: false },
  { to: '/media',              label: 'Media Assets',      icon: '🖼️', end: false },
  { to: '/members',            label: 'Members',           icon: '👥', end: false },
  { to: '/schedules',          label: 'Schedules',         icon: '📅', end: false },
  { to: '/sessions',           label: 'WA Sessions',       icon: '💬', end: false },
]

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const { wabaId, businesses, currentBiz, setCurrentBiz, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function handleBizChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const biz = businesses.find(b => b._id === e.target.value)
    if (biz) setCurrentBiz(biz)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo / Header */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <span className="text-base font-bold text-foreground">Trio Admin</span>
        </div>
        <span className="text-xs text-muted font-mono">{wabaId || 'Admin Panel'}</span>
      </div>

      {/* Business selector */}
      {businesses.length > 0 && (
        <div className="px-4 py-3 border-b border-border">
          <label className="text-xs text-muted mb-1 block uppercase tracking-wider">Business</label>
          <select
            value={currentBiz?._id ?? ''}
            onChange={handleBizChange}
            className="w-full bg-surface2 border border-border rounded-lg px-2 py-1.5 text-xs text-foreground focus:outline-none focus:border-orange-500 appearance-none"
          >
            {businesses.map(b => (
              <option key={b._id} value={b._id} className="bg-surface2">
                {b.businessName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onLinkClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 transition-all ${
                isActive
                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                  : 'text-muted hover:bg-surface2 hover:text-foreground border border-transparent'
              }`
            }
          >
            <span className="text-base leading-none">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted hover:text-red-400 hover:bg-red-400/5 transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { currentBiz } = useAuth()

  return (
    <div className="flex h-screen overflow-hidden bg-app">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 flex-shrink-0 bg-surface border-r border-border">
        <SidebarContent />
      </aside>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-surface border-r border-border flex flex-col md:hidden transform transition-transform duration-250 ease-in-out ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent onLinkClick={() => setDrawerOpen(false)} />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TopBar */}
        <header className="flex items-center justify-between px-4 py-3 bg-surface border-b border-border flex-shrink-0 h-14">
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-surface2 text-muted hover:text-foreground transition-colors"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <rect x="2" y="4" width="16" height="2" rx="1" />
              <rect x="2" y="9" width="16" height="2" rx="1" />
              <rect x="2" y="14" width="16" height="2" rx="1" />
            </svg>
          </button>
          <div className="hidden md:block" />
          {currentBiz && (
            <span className="inline-flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full px-3 py-1 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              {currentBiz.businessName}
            </span>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
