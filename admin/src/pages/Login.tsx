import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as api from '../api'
import { useAuth, useToast } from '../context'

const FEATURES = [
  { icon: '🤖', title: 'AI-Powered Chatbots', desc: 'RAG-based WhatsApp bots with real knowledge retrieval' },
  { icon: '🔀', title: 'Multi-Business Routing', desc: 'One WABA, multiple businesses — keyword-based switching' },
  { icon: '📊', title: 'Unified Dashboard', desc: 'Members, schedules, sessions — all in one place' },
]

const BIZ_ICONS = ['🏋️', '☕', '🍽️', '🏥', '✂️']

export default function Login() {
  const [wabaId, setWabaId]     = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const { login }    = useAuth()
  const { addToast } = useToast()
  const navigate     = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!wabaId.trim() || !password.trim()) {
      setError('Please fill in both fields')
      return
    }
    setLoading(true)
    try {
      const res = await api.login(wabaId.trim(), password.trim())
      if (res.ok) {
        login(res.token, res.wabaId, res.businesses)
        addToast('Welcome back! 👋')
        navigate('/chatbots')
      } else {
        setError('Invalid credentials')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#080a0f]">

      {/* ── Left brand panel (desktop only) ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[44%] xl:w-[42%] flex-col justify-between relative overflow-hidden bg-[#0c0e16] border-r border-[#1e2238]">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-orange-500/6 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 rounded-full bg-orange-500/4 blur-3xl" />

        {/* Orange top bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-600 via-orange-400 to-transparent" />

        <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-auto pb-12">
            <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Trio Admin</span>
          </div>

          {/* Headline */}
          <div className="mb-10">
            <h1 className="text-[2.4rem] xl:text-[2.8rem] font-extrabold text-white leading-[1.15] tracking-tight mb-4">
              One panel.<br/>
              <span className="text-orange-400">Every business.</span>
            </h1>
            <p className="text-[#8b92a8] text-base leading-relaxed max-w-xs">
              Manage all your WhatsApp AI chatbots from a single dashboard. Switch businesses instantly, no extra setup.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-10">
            {FEATURES.map(f => (
              <div key={f.title} className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#1a1d2e] border border-[#252840] flex items-center justify-center text-base flex-shrink-0 mt-0.5">
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#d4d8e8]">{f.title}</p>
                  <p className="text-xs text-[#5c6480] mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Business type pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {BIZ_ICONS.map((icon, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-xl bg-[#141620] border border-[#252840] flex items-center justify-center text-base"
              >
                {icon}
              </div>
            ))}
            <span className="text-xs text-[#5c6480] ml-1">& more business types</span>
          </div>
        </div>
      </div>

      {/* ── Right login panel ────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-[360px]">

          {/* Mobile-only logo */}
          <div className="flex lg:hidden items-center justify-center gap-2.5 mb-10">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <span className="text-white font-bold text-lg">Trio Admin</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1.5">Sign in</h2>
            <p className="text-sm text-[#6b7280]">Enter your WABA ID and admin password to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* WABA ID */}
            <div>
              <label className="block text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                WABA ID
              </label>
              <input
                type="text"
                value={wabaId}
                onChange={e => { setWabaId(e.target.value); setError('') }}
                placeholder="e.g. 1360387522681431"
                autoComplete="username"
                disabled={loading}
                className="w-full bg-[#10131c] border border-[#1e2238] hover:border-[#2e3250] focus:border-orange-500 rounded-xl px-4 py-3 text-[#e8eaf0] text-sm placeholder:text-[#3a3f55] focus:outline-none transition-colors disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="Admin password"
                autoComplete="current-password"
                disabled={loading}
                className="w-full bg-[#10131c] border border-[#1e2238] hover:border-[#2e3250] focus:border-orange-500 rounded-xl px-4 py-3 text-[#e8eaf0] text-sm placeholder:text-[#3a3f55] focus:outline-none transition-colors disabled:opacity-50"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span className="text-sm text-red-400">{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-400 active:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-colors mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-[#3a3f55] mt-8">
            Trio Admin · Multi-Business WhatsApp Chatbot Manager
          </p>
        </div>
      </div>
    </div>
  )
}
