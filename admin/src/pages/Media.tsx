import React, { useRef, useState } from 'react'
import * as api from '../api'
import { useAuth, useToast } from '../context'
import { Button, Modal, FormField, Input, Textarea, Badge, PageHeader, Empty } from '../components/ui'
import type { MediaAsset } from '../types'

const emptyForm = { key: '', label: '', caption: '' }

function slugify(name: string) {
  return name
    .replace(/\.[^/.]+$/, '')       // remove extension
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function Media() {
  const { currentBiz, updateCurrentBiz } = useAuth()
  const { addToast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm]           = useState(emptyForm)
  const [file, setFile]           = useState<File | null>(null)
  const [preview, setPreview]     = useState<string>('')
  const [fileType, setFileType]   = useState<'image' | 'video'>('image')
  const [dragging, setDragging]   = useState(false)
  const [uploading, setUploading] = useState(false)

  const assets: MediaAsset[] = currentBiz?.mediaAssets ?? []

  function openAdd() {
    setForm(emptyForm)
    setFile(null)
    setPreview('')
    setFileType('image')
    setModalOpen(true)
  }

  function handleFileChange(picked: File | null) {
    if (!picked) return
    const isVideo = picked.type.startsWith('video/')
    setFile(picked)
    setFileType(isVideo ? 'video' : 'image')
    setForm(p => ({ ...p, key: p.key || slugify(picked.name), label: p.label || picked.name.replace(/\.[^/.]+$/, '') }))
    if (!isVideo) {
      const reader = new FileReader()
      reader.onload = e => setPreview(e.target?.result as string)
      reader.readAsDataURL(picked)
    } else {
      setPreview('video')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!currentBiz || !file) {
      addToast('Please select a file', 'error')
      return
    }
    if (!form.key.trim()) {
      addToast('Key is required', 'error')
      return
    }
    setUploading(true)
    try {
      // 1. Upload to Cloudinary
      const { url, type } = await api.uploadFile(file)
      // 2. Save to business media assets
      const updated = await api.addMedia(currentBiz._id, { key: form.key.trim(), label: form.label.trim() || form.key.trim(), type, url, caption: form.caption.trim() })
      updateCurrentBiz(updated)
      addToast('Media uploaded successfully!')
      setModalOpen(false)
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(key: string) {
    if (!currentBiz) return
    if (!confirm(`Delete "${key}"?`)) return
    try {
      const updated = await api.deleteMedia(currentBiz._id, key)
      updateCurrentBiz(updated)
      addToast('Asset deleted')
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Delete failed', 'error')
    }
  }

  if (!currentBiz) return <div className="text-muted text-sm">No business selected</div>

  return (
    <>
      <PageHeader
        title="Media Assets"
        action={<Button variant="primary" onClick={openAdd}>+ Upload Asset</Button>}
      />

      {assets.length === 0 ? (
        <Empty icon="🎬" text="No media assets yet. Click Upload Asset to add one." />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map(asset => (
            <MediaCard key={asset.key} asset={asset} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal open={modalOpen} onClose={() => !uploading && setModalOpen(false)} title="Upload Media Asset">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Drop zone */}
          <div
            onClick={() => !uploading && fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFileChange(e.dataTransfer.files[0] ?? null) }}
            className={`relative rounded-xl border-2 border-dashed cursor-pointer transition-all overflow-hidden
              ${dragging ? 'border-orange-400 bg-orange-500/8' : file ? 'border-orange-500/40 bg-surface2' : 'border-border hover:border-orange-500/30 hover:bg-surface2'}`}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={e => handleFileChange(e.target.files?.[0] ?? null)}
            />

            {!file ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10 px-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-2xl">📁</div>
                <div>
                  <p className="text-sm font-medium text-foreground">Drop image or video here</p>
                  <p className="text-xs text-muted mt-0.5">or click to browse • JPG, PNG, GIF, MP4, MOV up to 100MB</p>
                </div>
              </div>
            ) : fileType === 'image' && preview ? (
              <div className="relative">
                <img src={preview} alt="preview" className="w-full max-h-48 object-contain bg-surface2 p-2" />
                <div className="absolute top-2 right-2 bg-black/60 rounded-lg px-2 py-0.5 text-xs text-white">
                  {file.name}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-2xl flex-shrink-0">🎥</div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-xs text-muted">{(file.size / 1024 / 1024).toFixed(1)} MB · Video</p>
                </div>
              </div>
            )}

            {/* Change file hint */}
            {file && (
              <div className="absolute bottom-2 right-2 text-xs text-muted bg-surface/80 rounded px-1.5 py-0.5">
                Click to change
              </div>
            )}
          </div>

          {/* Key */}
          <FormField label="Key (unique identifier)">
            <Input
              value={form.key}
              onChange={e => setForm(p => ({ ...p, key: e.target.value }))}
              placeholder="e.g. promo-video-1"
              className="font-mono"
              disabled={uploading}
            />
          </FormField>

          {/* Label */}
          <FormField label="Label (display name)">
            <Input
              value={form.label}
              onChange={e => setForm(p => ({ ...p, label: e.target.value }))}
              placeholder="e.g. Promo Video"
              disabled={uploading}
            />
          </FormField>

          {/* Caption */}
          <FormField label="Caption (shown in WhatsApp with the media)">
            <Textarea
              value={form.caption}
              onChange={e => setForm(p => ({ ...p, caption: e.target.value }))}
              rows={2}
              placeholder="e.g. Check out our gym facilities!"
              disabled={uploading}
            />
          </FormField>

          <div className="flex gap-2 justify-end pt-1">
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={uploading}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={uploading || !file}>
              {uploading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading…
                </span>
              ) : 'Upload & Save'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

function MediaCard({ asset, onDelete }: { asset: MediaAsset; onDelete: (key: string) => void }) {
  const [imgErr, setImgErr] = useState(false)

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col group hover:border-orange-500/30 transition-colors">
      {/* Thumbnail */}
      <div className="h-28 bg-surface2 flex items-center justify-center overflow-hidden relative">
        {asset.type === 'image' && !imgErr ? (
          <img
            src={asset.url}
            alt={asset.label ?? asset.key}
            className="w-full h-full object-cover"
            onError={() => setImgErr(true)}
          />
        ) : asset.type === 'video' ? (
          <div className="flex flex-col items-center gap-1 text-muted">
            <span className="text-3xl">🎥</span>
            <span className="text-xs">Video</span>
          </div>
        ) : (
          <span className="text-3xl">🖼️</span>
        )}
        {/* Type badge overlay */}
        <div className="absolute top-2 right-2">
          <Badge color={asset.type === 'image' ? 'blue' : 'orange'}>{asset.type}</Badge>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="text-xs font-semibold text-foreground leading-tight truncate">{asset.label ?? asset.key}</p>
        <p className="text-xs text-muted font-mono truncate">{asset.key}</p>
        {asset.caption && <p className="text-xs text-muted italic line-clamp-2">"{asset.caption}"</p>}
      </div>

      {/* Actions */}
      <div className="px-3 pb-3 flex gap-2">
        <a
          href={asset.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-xs text-muted hover:text-foreground border border-border hover:border-orange-500/30 rounded-lg py-1.5 transition-colors"
        >
          View
        </a>
        <button
          onClick={() => onDelete(asset.key)}
          className="flex-1 text-xs text-red-400 hover:bg-red-400/5 border border-red-400/20 rounded-lg py-1.5 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
