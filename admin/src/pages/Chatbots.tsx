import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { activateBusiness, deactivateBusiness, getBotFlags, activateBotFlag, deactivateBotFlag } from '../api'
import { useAuth, useToast } from '../context'
import type { Business } from '../types'

const HARDCODED_BOTS = [
  {
    id: 'flownware',
    name: 'Flownware Bot',
    type: 'Digital Agency',
    icon: '🚀',
    gradient: 'from-blue-500/20 to-cyan-500/10',
    accent: 'text-blue-400',
    trigger: 'hi / hello / quote',
    desc: 'Lead capture bot — 12-step questionnaire for digital marketing services',
    route: '/flownware',
  },
  {
    id: 'realestate',
    name: 'Real Estate Bot',
    type: 'Property',
    icon: '🏠',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    accent: 'text-emerald-400',
    trigger: 'property / flat / plot / villa',
    desc: 'Property lead capture — Buy, Sell, Rent with 9-step enquiry flow',
    route: '/real-estate',
  },
]

const BIZ_META: Record<string, { icon: string; gradient: string; accent: string }> = {
  gym:        { icon: '🏋️', gradient: 'from-orange-500/20 to-red-500/10',    accent: 'text-orange-400' },
  cafe:       { icon: '☕',  gradient: 'from-amber-500/20 to-yellow-500/10', accent: 'text-amber-400'  },
  restaurant: { icon: '🍽️', gradient: 'from-green-500/20 to-emerald-500/10', accent: 'text-green-400'  },
  clinic:     { icon: '🏥', gradient: 'from-blue-500/20 to-cyan-500/10',     accent: 'text-blue-400'   },
  salon:      { icon: '✂️', gradient: 'from-purple-500/20 to-pink-500/10',   accent: 'text-purple-400' },
}
const DEFAULT_META = { icon: '🏢', gradient: 'from-gray-500/20 to-gray-500/10', accent: 'text-gray-400' }

export default function Chatbots() {
  const { businesses, setBusinesses } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [activating, setActivating] = useState<string | null>(null)
  const [botFlags, setBotFlags] = useState<{ flownware: boolean; realestate: boolean }>({ flownware: true, realestate: true })
  const [flagLoading, setFlagLoading] = useState<string | null>(null)

  useEffect(() => {
    getBotFlags().then(setBotFlags).catch(() => {})
  }, [])

  async function handleFlagToggle(botId: string, currentlyActive: boolean) {
    setFlagLoading(botId)
    try {
      const result = currentlyActive
        ? await deactivateBotFlag(botId)
        : await activateBotFlag(botId)
      setBotFlags(prev => ({ ...prev, [botId]: result.active }))
      addToast(result.active ? `${botId} bot activated!` : `${botId} bot deactivated`)
    } catch (e) {
      addToast('Failed: ' + (e instanceof Error ? e.message : 'Unknown'), 'error')
    } finally {
      setFlagLoading(null)
    }
  }

  const handleActivate = async (biz: Business) => {
    if (biz.active || activating) return
    setActivating(biz._id)
    try {
      const result = await activateBusiness(biz._id)
      setBusinesses(result.businesses)
      addToast(`${biz.businessName} activated!`)
    } catch (e: unknown) {
      addToast('Activation failed: ' + (e instanceof Error ? e.message : 'Unknown error'), 'error')
    } finally {
      setActivating(null)
    }
  }

  const handleDeactivate = async (biz: Business) => {
    if (!biz.active || activating) return
    setActivating(biz._id)
    try {
      const result = await deactivateBusiness(biz._id)
      setBusinesses(result.businesses)
      addToast(`${biz.businessName} deactivated`)
    } catch (e: unknown) {
      addToast('Deactivation failed: ' + (e instanceof Error ? e.message : 'Unknown error'), 'error')
    } finally {
      setActivating(null)
    }
  }

  const activeBiz = businesses.find(b => b.active)

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Chatbots</h1>
        <p className="text-sm text-muted mt-1">
          Only <span className="text-foreground font-medium">one chatbot</span> can be active at a time.
          The active bot responds to WhatsApp messages on your WABA.
        </p>
      </div>

      {/* Active banner */}
      {activeBiz && (
        <div className="mb-5 flex items-center gap-3 bg-green-500/8 border border-green-500/20 rounded-xl px-4 py-3">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
          <span className="text-sm text-green-400 font-medium">
            {BIZ_META[activeBiz.businessType ?? '']?.icon ?? '🏢'} {activeBiz.businessName}
          </span>
          <span className="text-sm text-muted ml-0.5">is currently active</span>
          <code className="ml-auto text-xs bg-green-500/10 text-green-400 border border-green-500/20 rounded-md px-2 py-0.5 font-mono">
            Send &quot;{activeBiz.triggerKeyword}&quot;
          </code>
        </div>
      )}

      {/* Bot grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {businesses.map(biz => {
          const meta = BIZ_META[biz.businessType ?? ''] ?? DEFAULT_META
          const isActivating = activating === biz._id

          return (
            <div
              key={biz._id}
              className={`relative bg-surface border rounded-2xl overflow-hidden transition-all duration-200 ${
                biz.active
                  ? 'border-green-500/40 shadow-lg shadow-green-500/5 ring-1 ring-green-500/10'
                  : 'border-border hover:border-[#2e3250] hover:shadow-md'
              }`}
            >
              {/* Top accent bar */}
              <div className={`h-1 w-full bg-gradient-to-r ${meta.gradient}`} />

              <div className="p-5">
                {/* Card header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-xl flex-shrink-0`}>
                      {meta.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-foreground leading-tight truncate">{biz.businessName}</p>
                      <p className="text-xs text-muted capitalize mt-0.5">{biz.businessType ?? 'business'}</p>
                    </div>
                  </div>

                  {/* Status pill */}
                  <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    biz.active
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-surface2 text-muted border-border'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${biz.active ? 'bg-green-400 animate-pulse' : 'bg-[#4b5563]'}`} />
                    {biz.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Trigger keyword */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-muted">Trigger:</span>
                  <code className={`text-xs px-2 py-0.5 rounded-md font-mono bg-surface2 border border-border ${meta.accent}`}>
                    {biz.triggerKeyword ?? '—'}
                  </code>
                </div>

                {/* Location */}
                {biz.areaInfo && (
                  <p className="text-xs text-muted truncate mb-4" title={biz.areaInfo}>
                    📍 {biz.areaInfo}
                  </p>
                )}

                {/* Tagline */}
                {biz.tagline && (
                  <p className="text-xs text-muted italic truncate mb-4" title={biz.tagline}>
                    "{biz.tagline}"
                  </p>
                )}

                {/* Action button */}
                <div className="mt-auto pt-2">
                  {biz.active ? (
                    <button
                      onClick={() => handleDeactivate(biz)}
                      disabled={!!activating}
                      className="w-full py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/30 border border-red-500/30 disabled:opacity-40 disabled:cursor-not-allowed text-red-400 text-sm font-semibold transition-colors"
                    >
                      {isActivating ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-3.5 h-3.5 border-2 border-red-400/40 border-t-red-400 rounded-full animate-spin" />
                          Deactivating…
                        </span>
                      ) : (
                        'Deactivate'
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivate(biz)}
                      disabled={!!activating}
                      className="w-full py-2 rounded-xl bg-orange-500 hover:bg-orange-400 active:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                    >
                      {isActivating ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Activating…
                        </span>
                      ) : (
                        'Set Active'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {businesses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted gap-3">
          <span className="text-5xl">🤖</span>
          <p className="text-sm">No chatbots configured yet.</p>
        </div>
      )}

      {/* ── Hardcoded Bots section ─────────────────────────────────────────── */}
      <div className="mt-8 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-sm font-semibold text-foreground">Always-On Bots</h2>
          <span className="text-xs text-muted bg-surface2 border border-border rounded-full px-2 py-0.5">Hardcoded — always active</span>
        </div>
        <p className="text-xs text-muted">Ye bots hamesha active rehte hain — keyword se trigger hote hain, activate/deactivate nahi hote.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {HARDCODED_BOTS.map(bot => {
          const isActive = botFlags[bot.id as keyof typeof botFlags]
          const isLoading = flagLoading === bot.id
          return (
            <div
              key={bot.id}
              className={`relative bg-surface border rounded-2xl overflow-hidden transition-all duration-200 ${
                isActive
                  ? 'border-green-500/40 shadow-lg shadow-green-500/5 ring-1 ring-green-500/10'
                  : 'border-border hover:border-[#2e3250]'
              }`}
            >
              {/* Top accent bar */}
              <div className={`h-1 w-full bg-gradient-to-r ${bot.gradient}`} />

              <div className="p-5">
                {/* Card header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${bot.gradient} flex items-center justify-center text-xl flex-shrink-0`}>
                      {bot.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-foreground leading-tight truncate">{bot.name}</p>
                      <p className="text-xs text-muted capitalize mt-0.5">{bot.type}</p>
                    </div>
                  </div>
                  {/* Status badge */}
                  <span className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    isActive
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-surface2 text-muted border-border'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-[#4b5563]'}`} />
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Trigger */}
                <div className="flex items-start gap-2 mb-3">
                  <span className="text-xs text-muted mt-0.5">Trigger:</span>
                  <code className={`text-xs px-2 py-0.5 rounded-md font-mono bg-surface2 border border-border ${bot.accent} leading-relaxed`}>
                    {bot.trigger}
                  </code>
                </div>

                {/* Description */}
                <p className="text-xs text-muted mb-4 leading-relaxed">{bot.desc}</p>

                {/* Buttons */}
                <div className="flex gap-2">
                  {isActive ? (
                    <button
                      onClick={() => handleFlagToggle(bot.id, true)}
                      disabled={isLoading}
                      className="flex-1 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 disabled:opacity-40 disabled:cursor-not-allowed text-red-400 text-sm font-semibold transition-colors"
                    >
                      {isLoading ? <span className="flex items-center justify-center gap-2"><span className="w-3.5 h-3.5 border-2 border-red-400/40 border-t-red-400 rounded-full animate-spin" />...</span> : 'Deactivate'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFlagToggle(bot.id, false)}
                      disabled={isLoading}
                      className="flex-1 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                    >
                      {isLoading ? <span className="flex items-center justify-center gap-2"><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />...</span> : 'Set Active'}
                    </button>
                  )}
                  <button
                    onClick={() => navigate(bot.route)}
                    className="px-3 py-2 rounded-xl border border-border hover:border-orange-500/30 text-muted hover:text-foreground text-xs font-medium transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
