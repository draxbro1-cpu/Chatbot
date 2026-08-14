import { useEffect, useState } from 'react'
import * as api from '../api'
import { useAuth, useToast } from '../context'
import { StatCard, StatCardSkeleton, Card, Badge } from '../components/ui'
import type { Stats } from '../types'

export default function Dashboard() {
  const { currentBiz } = useAuth()
  const { addToast } = useToast()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentBiz) return
    setLoading(true)
    api.getStats(currentBiz._id)
      .then(setStats)
      .catch(err => addToast(err instanceof Error ? err.message : 'Failed to load stats', 'error'))
      .finally(() => setLoading(false))
  }, [currentBiz?._id])

  if (!currentBiz) {
    return (
      <div className="flex items-center justify-center h-64 text-muted text-sm">
        No business selected
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted mt-0.5">{currentBiz.businessName}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : stats ? (
          <>
            <StatCard label="Total Members" value={stats.totalMembers} color="orange" />
            <StatCard label="Active Members" value={stats.activeMembers} color="green" />
            <StatCard label="Due Members" value={stats.dueMembers} color="yellow" />
            <StatCard label="Active Sessions" value={stats.activeSessions} color="blue" />
            <StatCard label="Upcoming Classes" value={stats.upcomingClasses} color="orange" />
          </>
        ) : (
          <div className="col-span-full text-muted text-sm">Failed to load statistics</div>
        )}
      </div>

      {/* Business Info Card */}
      <Card className="p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <span>🏪</span> Business Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow label="Business Name" value={currentBiz.businessName} />
          <InfoRow label="Type" value={currentBiz.businessType} />
          <InfoRow label="Tagline" value={currentBiz.tagline} />
          <InfoRow label="Area" value={currentBiz.areaInfo} />
          <InfoRow label="WABA ID" value={currentBiz.wabaId} mono />
          <InfoRow label="Phone Number ID" value={currentBiz.phoneNumberId} mono />
          <InfoRow label="Trigger Keyword" value={currentBiz.triggerKeyword} mono />
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted uppercase tracking-wider">Status</span>
            <Badge color={currentBiz.active ? 'green' : 'red'}>
              {currentBiz.active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  )
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value?: string
  mono?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted uppercase tracking-wider">{label}</span>
      <span className={`text-sm text-foreground ${mono ? 'font-mono' : ''}`}>
        {value ?? <span className="text-muted italic">—</span>}
      </span>
    </div>
  )
}
