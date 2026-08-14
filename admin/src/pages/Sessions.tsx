import { useCallback, useEffect, useState } from 'react'
import * as api from '../api'
import { useAuth, useToast } from '../context'
import { Button, Table, Tr, Td, PageHeader, Empty } from '../components/ui'
import type { Session } from '../types'

const TABLE_HEADERS = ['Phone', 'Messages', 'Last Active', 'Actions']

export default function Sessions() {
  const { currentBiz } = useAuth()
  const { addToast } = useToast()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [clearing, setClearing] = useState(false)

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

  async function handleDelete(s: Session) {
    if (!confirm(`Delete session for ${s.phone ?? s._id}?`)) return
    try {
      await api.deleteSession(s._id)
      setSessions(prev => prev.filter(x => x._id !== s._id))
      addToast('Session deleted', 'success')
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
      addToast(`Cleared ${result.deleted} session(s)`, 'success')
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Clear failed', 'error')
    } finally {
      setClearing(false)
    }
  }

  if (!currentBiz) return <div className="text-muted text-sm">No business selected</div>

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
              <Td>
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-400/10 text-blue-400 text-xs font-bold">
                  {Array.isArray(s.messages) ? s.messages.length : 0}
                </span>
              </Td>
              <Td className="text-xs text-muted">
                {s.lastActivity ? formatRelative(s.lastActivity) : '—'}
              </Td>
              <Td>
                <Button size="sm" variant="danger" onClick={() => handleDelete(s)}>
                  Delete
                </Button>
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
