import { useCallback, useEffect, useState } from 'react'
import * as api from '../api'
import { useAuth, useToast } from '../context'
import { Button, Table, Tr, Td, PageHeader, Empty } from '../components/ui'
import type { Session } from '../types'

const TABLE_HEADERS = ['Phone', 'Bot Status', 'Messages', 'Last Active', 'Actions']

export default function Sessions() {
  const { currentBiz } = useAuth()
  const { addToast } = useToast()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [clearing, setClearing] = useState(false)
  const [toggling, setToggling] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!currentBiz) return
    setLoading(true)
    try {
      const data = await api.getSessions(currentBiz._id)
      setSessions(data)
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to load sessions', 'error')
    } finally {
      setLoading(false)
    }
  }, [currentBiz?._id])

  useEffect(() => { void load() }, [load])

  async function handleTogglePause(s: Session) {
    setToggling(s._id)
    try {
      const updated = s.botPaused
        ? await api.resumeSession(s._id)
        : await api.pauseSession(s._id)
      setSessions(prev => prev.map(x => x._id === s._id ? updated : x))
      addToast(updated.botPaused ? `Bot paused for ${s.phone ?? s._id}` : `Bot resumed for ${s.phone ?? s._id}`)
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Toggle failed', 'error')
    } finally {
      setToggling(null)
    }
  }

  async function handleDelete(s: Session) {
    if (!confirm(`Delete session for ${s.phone ?? s._id}?`)) return
    try {
      await api.deleteSession(s._id)
      setSessions(prev => prev.filter(x => x._id !== s._id))
      addToast('Session deleted')
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Delete failed', 'error')
    }
  }

  async function handleClearAll() {
    if (!currentBiz) return
    if (!confirm(`Clear ALL sessions for ${currentBiz.businessName}? This cannot be undone.`)) return
    setClearing(true)
    try {
      const result = await api.clearSessions(currentBiz._id)
      setSessions([])
      addToast(`Cleared ${result.deleted} session(s)`)
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Clear failed', 'error')
    } finally {
      setClearing(false)
    }
  }

  if (!currentBiz) return <div className="text-muted text-sm">No business selected</div>

  const pausedCount = sessions.filter(s => s.botPaused).length

  return (
    <>
      <PageHeader
        title="WA Sessions"
        action={
          sessions.length > 0 ? (
            <Button variant="danger" onClick={handleClearAll} disabled={clearing}>
              {clearing ? 'Clearing…' : '🗑 Clear All'}
            </Button>
          ) : undefined
        }
      />

      {/* Info banner */}
      <div className="mb-5 flex items-start gap-3 bg-blue-500/8 border border-blue-500/20 rounded-xl px-4 py-3">
        <span className="text-lg flex-shrink-0">💡</span>
        <div>
          <p className="text-sm text-blue-300 font-medium">Human Takeover</p>
          <p className="text-xs text-muted mt-0.5">
            Jab aap manually kisi user se baat karna chahein — <strong className="text-foreground">Pause Bot</strong> click karo.
            Bot us contact ke liye band ho jayega. Kaam ho jaaye to <strong className="text-foreground">Resume Bot</strong> karo.
          </p>
        </div>
      </div>

      {pausedCount > 0 && (
        <div className="mb-4 flex items-center gap-2 bg-yellow-500/8 border border-yellow-500/20 rounded-xl px-4 py-2.5">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-sm text-yellow-400 font-medium">{pausedCount} contact{pausedCount > 1 ? 's' : ''} — Bot paused (manual mode)</span>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-surface rounded-lg" />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <Empty icon="💬" text="No active sessions" />
      ) : (
        <Table headers={TABLE_HEADERS}>
          {sessions.map(s => (
            <Tr key={s._id}>
              <Td className="font-mono text-xs">{s.phone ?? '—'}</Td>

              {/* Bot Status badge */}
              <Td>
                {s.botPaused ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    Paused
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Bot Active
                  </span>
                )}
              </Td>

              <Td>
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-400/10 text-blue-400 text-xs font-bold">
                  {Array.isArray(s.messages) ? s.messages.length : 0}
                </span>
              </Td>

              <Td className="text-xs text-muted">
                {s.lastActivity ? formatRelative(s.lastActivity) : '—'}
              </Td>

              <Td>
                <div className="flex items-center gap-2">
                  {/* Human takeover toggle */}
                  <button
                    onClick={() => handleTogglePause(s)}
                    disabled={toggling === s._id}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      s.botPaused
                        ? 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20'
                        : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20'
                    }`}
                  >
                    {toggling === s._id ? '…' : s.botPaused ? '▶ Resume Bot' : '⏸ Pause Bot'}
                  </button>

                  <Button size="sm" variant="danger" onClick={() => handleDelete(s)}>
                    Delete
                  </Button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      )}
    </>
  )
}

function formatRelative(dateStr: string) {
  try {
    const date = new Date(dateStr)
    const diff = Date.now() - date.getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    return `${days}d ago`
  } catch {
    return dateStr
  }
}
