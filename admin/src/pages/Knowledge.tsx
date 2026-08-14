import React, { useEffect, useState } from 'react'
import * as api from '../api'
import { useAuth, useToast } from '../context'
import { Button, PageHeader } from '../components/ui'

export default function Knowledge() {
  const { currentBiz, updateCurrentBiz } = useAuth()
  const { addToast } = useToast()
  const [knowledge, setKnowledge] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!currentBiz) return
    setLoading(true)
    // Fetch full business (currentBiz may lack knowledge field)
    api.getBusiness(currentBiz._id)
      .then(biz => setKnowledge(biz.knowledge ?? ''))
      .catch(err => addToast(err instanceof Error ? err.message : 'Failed to load knowledge base', 'error'))
      .finally(() => setLoading(false))
  }, [currentBiz?._id])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!currentBiz) return
    setSaving(true)
    try {
      const updated = await api.updateBusiness(currentBiz._id, { knowledge })
      updateCurrentBiz(updated)
      addToast('Knowledge base saved', 'success')
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (!currentBiz) {
    return <div className="text-muted text-sm">No business selected</div>
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col h-full">
      <PageHeader
        title="Knowledge Base"
        action={
          <Button type="submit" variant="primary" disabled={saving || loading}>
            {saving ? 'Saving…' : 'Save Knowledge Base'}
          </Button>
        }
      />

      <div className="flex flex-col gap-2 flex-1">
        <p className="text-xs text-muted">
          This text is fed to the AI as the business knowledge base. Include FAQs, pricing,
          schedules, policies, and any information users may ask about.
        </p>

        {loading ? (
          <div className="flex-1 bg-surface border border-border rounded-xl animate-pulse min-h-[400px]" />
        ) : (
          <textarea
            value={knowledge}
            onChange={e => setKnowledge(e.target.value)}
            className="flex-1 w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder-muted focus:outline-none focus:border-orange-500 transition-colors resize-none font-mono min-h-[400px]"
            placeholder="Enter your business knowledge base here…&#10;&#10;Include:&#10;- Pricing plans&#10;- Class schedules&#10;- Facilities&#10;- FAQ&#10;- Policies"
            spellCheck={false}
          />
        )}

        <div className="text-xs text-muted text-right">
          {knowledge.length.toLocaleString()} characters
        </div>
      </div>
    </form>
  )
}
