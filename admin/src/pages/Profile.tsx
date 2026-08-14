import React, { useEffect, useState } from 'react'
import * as api from '../api'
import { useAuth, useToast } from '../context'
import { Button, Card, FormField, Input, Textarea, PageHeader } from '../components/ui'
import type { Business } from '../types'

type FormData = Partial<Business>

export default function Profile() {
  const { currentBiz, updateCurrentBiz } = useAuth()
  const { addToast } = useToast()
  const [form, setForm] = useState<FormData>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (currentBiz) {
      setForm({
        businessName: currentBiz.businessName,
        businessType: currentBiz.businessType,
        tagline: currentBiz.tagline,
        areaInfo: currentBiz.areaInfo,
        greetingMessage: currentBiz.greetingMessage,
        systemPrompt: currentBiz.systemPrompt,
        triggerKeyword: currentBiz.triggerKeyword,
        adminPassword: currentBiz.adminPassword,
        phoneNumberId: currentBiz.phoneNumberId,
        active: currentBiz.active,
        buttons: currentBiz.buttons ?? { pricing: '', info: '', media: '' },
      })
    }
  }, [currentBiz?._id])

  function handleChange(field: keyof FormData, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleButtonChange(key: 'pricing' | 'info' | 'media', value: string) {
    setForm(prev => ({
      ...prev,
      buttons: { ...(prev.buttons ?? {}), [key]: value },
    }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!currentBiz) return
    setSaving(true)
    try {
      const updated = await api.updateBusiness(currentBiz._id, form)
      updateCurrentBiz(updated)
      addToast('Profile saved successfully', 'success')
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
    <form onSubmit={handleSave}>
      <PageHeader
        title="Business Profile"
        action={
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        }
      />

      <div className="flex flex-col gap-5">
        {/* Section 1: Basic Info */}
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <span>📋</span> Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Business Name">
              <Input
                value={form.businessName ?? ''}
                onChange={e => handleChange('businessName', e.target.value)}
                placeholder="e.g. FlexFit Gym"
              />
            </FormField>
            <FormField label="Business Type">
              <Input
                value={form.businessType ?? ''}
                onChange={e => handleChange('businessType', e.target.value)}
                placeholder="e.g. Gym & Fitness"
              />
            </FormField>
            <FormField label="Tagline">
              <Input
                value={form.tagline ?? ''}
                onChange={e => handleChange('tagline', e.target.value)}
                placeholder="e.g. Train Hard, Live Fit"
              />
            </FormField>
            <FormField label="Area / Location">
              <Input
                value={form.areaInfo ?? ''}
                onChange={e => handleChange('areaInfo', e.target.value)}
                placeholder="e.g. Sector 12, Noida"
              />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Greeting Message">
                <Textarea
                  value={form.greetingMessage ?? ''}
                  onChange={e => handleChange('greetingMessage', e.target.value)}
                  rows={3}
                  placeholder="Welcome message shown to new users…"
                />
              </FormField>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-muted uppercase tracking-wider">Active</label>
              <button
                type="button"
                onClick={() => handleChange('active', !form.active)}
                className={`relative inline-flex h-5 w-9 rounded-full border-2 border-transparent transition-colors ${
                  form.active ? 'bg-orange-500' : 'bg-surface2'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${
                    form.active ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="text-xs text-muted">{form.active ? 'On' : 'Off'}</span>
            </div>
          </div>
        </Card>

        {/* Section 2: System Config */}
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <span>⚙️</span> System Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Phone Number ID">
              <Input
                value={form.phoneNumberId ?? ''}
                onChange={e => handleChange('phoneNumberId', e.target.value)}
                placeholder="WhatsApp Phone Number ID"
                className="font-mono"
              />
            </FormField>
            <FormField label="Trigger Keyword">
              <Input
                value={form.triggerKeyword ?? ''}
                onChange={e => handleChange('triggerKeyword', e.target.value)}
                placeholder="e.g. gym"
                className="font-mono"
              />
            </FormField>
            <FormField label="Admin Password">
              <Input
                type="password"
                value={form.adminPassword ?? ''}
                onChange={e => handleChange('adminPassword', e.target.value)}
                placeholder="Admin login password"
              />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="System Prompt">
                <Textarea
                  value={form.systemPrompt ?? ''}
                  onChange={e => handleChange('systemPrompt', e.target.value)}
                  rows={5}
                  placeholder="AI system prompt for this business…"
                  className="font-mono text-xs"
                />
              </FormField>
            </div>
          </div>
        </Card>

        {/* Section 3: Welcome Buttons */}
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <span>🔘</span> Welcome Buttons
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Pricing Button Label">
              <Input
                value={form.buttons?.pricing ?? ''}
                onChange={e => handleButtonChange('pricing', e.target.value)}
                placeholder="e.g. 💰 Pricing"
              />
            </FormField>
            <FormField label="Info Button Label">
              <Input
                value={form.buttons?.info ?? ''}
                onChange={e => handleButtonChange('info', e.target.value)}
                placeholder="e.g. ℹ️ About Us"
              />
            </FormField>
            <FormField label="Media Button Label">
              <Input
                value={form.buttons?.media ?? ''}
                onChange={e => handleButtonChange('media', e.target.value)}
                placeholder="e.g. 🎬 Gallery"
              />
            </FormField>
          </div>
        </Card>
      </div>
    </form>
  )
}
