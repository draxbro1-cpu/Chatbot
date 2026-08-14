import React, { useState } from 'react'
import * as api from '../api'
import { useAuth, useToast } from '../context'
import { Button, Modal, FormField, Input, Textarea, Select, Badge, PageHeader, Empty } from '../components/ui'
import type { MediaAsset } from '../types'

const emptyForm = { key: '', label: '', type: 'image' as 'image' | 'video', url: '', caption: '' }

export default function Media() {
  const { currentBiz, updateCurrentBiz } = useAuth()
  const { addToast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const assets: MediaAsset[] = currentBiz?.mediaAssets ?? []

  function openAdd() {
    setForm(emptyForm)
    setModalOpen(true)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!currentBiz) return
    if (!form.key.trim() || !form.url.trim()) {
      addToast('Key and URL are required', 'error')
      return
    }
    setSaving(true)
    try {
      const updated = await api.addMedia(currentBiz._id, form)
      updateCurrentBiz(updated)
      addToast('Media asset added', 'success')
      setModalOpen(false)
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to add media', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(key: string) {
    if (!currentBiz) return
    if (!confirm(`Delete media asset "${key}"?`)) return
    try {
      const updated = await api.deleteMedia(currentBiz._id, key)
      updateCurrentBiz(updated)
      addToast('Asset deleted', 'success')
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Delete failed', 'error')
    }
  }

  if (!currentBiz) {
    return <div className="text-muted text-sm">No business selected</div>
  }

  return (
    <>
      <PageHeader
        title="Media Assets"
        action={
          <Button variant="primary" onClick={openAdd}>
            + Add Asset
          </Button>
        }
      />

      {assets.length === 0 ? (
        <Empty icon="🎬" text="No media assets yet. Click Add Asset to upload one." />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map(asset => (
            <MediaCard key={asset.key} asset={asset} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Media Asset">
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <FormField label="Key (unique identifier)">
            <Input
              value={form.key}
              onChange={e => setForm(p => ({ ...p, key: e.target.value }))}
              placeholder="e.g. promo-video-1"
              className="font-mono"
            />
          </FormField>
          <FormField label="Label">
            <Input
              value={form.label}
              onChange={e => setForm(p => ({ ...p, label: e.target.value }))}
              placeholder="Display name"
            />
          </FormField>
          <FormField label="Type">
            <Select
              value={form.type}
              onChange={e => setForm(p => ({ ...p, type: e.target.value as 'image' | 'video' }))}
              options={[
                { value: 'image', label: 'Image' },
                { value: 'video', label: 'Video' },
              ]}
            />
          </FormField>
          <FormField label="URL">
            <Input
              value={form.url}
              onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
              placeholder="https://…"
              type="url"
            />
          </FormField>
          <FormField label="Caption (optional)">
            <Textarea
              value={form.caption}
              onChange={e => setForm(p => ({ ...p, caption: e.target.value }))}
              rows={2}
              placeholder="Optional caption for WhatsApp message"
            />
          </FormField>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Adding…' : 'Add Asset'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

function MediaCard({
  asset,
  onDelete,
}: {
  asset: MediaAsset
  onDelete: (key: string) => void
}) {
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col group hover:border-orange-500/30 transition-colors">
      {/* Thumbnail */}
      <div className="h-24 bg-surface2 flex items-center justify-center overflow-hidden">
        {asset.type === 'image' ? (
          <img
            src={asset.url}
            alt={asset.label ?? asset.key}
            className="w-full h-full object-cover"
            onError={e => {
              ;(e.target as HTMLImageElement).style.display = 'none'
              ;(e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden')
            }}
          />
        ) : null}
        <span className={`text-3xl ${asset.type === 'image' ? 'hidden' : ''}`}>🎥</span>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <div className="flex items-start justify-between gap-1">
          <span className="text-xs font-medium text-foreground leading-tight truncate">
            {asset.label ?? asset.key}
          </span>
          <Badge color={asset.type === 'image' ? 'blue' : 'orange'}>{asset.type}</Badge>
        </div>
        <span className="text-xs text-muted font-mono truncate">{asset.key}</span>
        {asset.caption && (
          <span className="text-xs text-muted italic line-clamp-2">{asset.caption}</span>
        )}
      </div>

      {/* Delete */}
      <div className="px-3 pb-3">
        <button
          onClick={() => onDelete(asset.key)}
          className="w-full text-xs text-red-400 hover:bg-red-400/5 border border-red-400/20 rounded-lg py-1.5 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
