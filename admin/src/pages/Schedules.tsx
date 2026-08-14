import React, { useCallback, useEffect, useState } from 'react'
import * as api from '../api'
import { useAuth, useToast } from '../context'
import {
  Button,
  Modal,
  FormField,
  Input,
  Select,
  Badge,
  Table,
  Tr,
  Td,
  PageHeader,
  Empty,
} from '../components/ui'
import type { Schedule } from '../types'

const emptyForm: Omit<Schedule, '_id'> = {
  businessId: '',
  title: '',
  type: 'class',
  date: '',
  time: '',
  instructor: '',
  capacity: 20,
  bookedCount: 0,
  isActive: true,
}

const typeColors: Record<string, 'orange' | 'blue' | 'green' | 'gray'> = {
  class: 'orange',
  pt: 'blue',
  event: 'green',
  other: 'gray',
}

const TABLE_HEADERS = ['Title', 'Type', 'Date', 'Time', 'Instructor', 'Spots', 'Actions']

export default function Schedules() {
  const { currentBiz } = useAuth()
  const { addToast } = useToast()
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Schedule | null>(null)
  const [form, setForm] = useState<Omit<Schedule, '_id'>>(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    if (!currentBiz) return
    setLoading(true)
    try {
      const data = await api.getSchedules(currentBiz._id)
      setSchedules(data)
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to load schedules', 'error')
    } finally {
      setLoading(false)
    }
  }, [currentBiz?._id])

  useEffect(() => { void load() }, [load])

  function openAdd() {
    setEditing(null)
    setForm({ ...emptyForm, businessId: currentBiz?._id ?? '' })
    setModalOpen(true)
  }

  function openEdit(s: Schedule) {
    setEditing(s)
    setForm({
      businessId: s.businessId,
      title: s.title ?? '',
      type: s.type ?? 'class',
      date: s.date ?? '',
      time: s.time ?? '',
      instructor: s.instructor ?? '',
      capacity: s.capacity ?? 20,
      bookedCount: s.bookedCount ?? 0,
      isActive: s.isActive ?? true,
    })
    setModalOpen(true)
  }

  function handleField<K extends keyof Omit<Schedule, '_id'>>(field: K, value: Omit<Schedule, '_id'>[K]) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        const updated = await api.updateSchedule(editing._id, form)
        setSchedules(prev => prev.map(s => (s._id === updated._id ? updated : s)))
        addToast('Schedule updated', 'success')
      } else {
        const created = await api.createSchedule(form)
        setSchedules(prev => [...prev, created])
        addToast('Schedule added', 'success')
      }
      setModalOpen(false)
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(s: Schedule) {
    if (!confirm(`Delete schedule "${s.title ?? s._id}"?`)) return
    try {
      await api.deleteSchedule(s._id)
      setSchedules(prev => prev.filter(x => x._id !== s._id))
      addToast('Schedule deleted', 'success')
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Delete failed', 'error')
    }
  }

  if (!currentBiz) return <div className="text-muted text-sm">No business selected</div>

  return (
    <>
      <PageHeader
        title="Schedules"
        action={<Button variant="primary" onClick={openAdd}>+ Add Schedule</Button>}
      />

      {loading ? (
        <div className="animate-pulse space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-surface rounded-lg" />
          ))}
        </div>
      ) : schedules.length === 0 ? (
        <Empty icon="📅" text="No schedules yet. Add the first one!" />
      ) : (
        <Table headers={TABLE_HEADERS}>
          {schedules.map(s => (
            <Tr key={s._id}>
              <Td className="font-medium">{s.title ?? '—'}</Td>
              <Td>
                {s.type ? (
                  <Badge color={typeColors[s.type] ?? 'gray'}>{s.type}</Badge>
                ) : '—'}
              </Td>
              <Td className="text-xs">{s.date ? formatDate(s.date) : '—'}</Td>
              <Td className="font-mono text-xs">{s.time ?? '—'}</Td>
              <Td>{s.instructor ?? '—'}</Td>
              <Td>
                <span className="text-xs">
                  {s.bookedCount ?? 0}/{s.capacity ?? '?'}
                </span>
              </Td>
              <Td>
                <div className="flex gap-1.5">
                  <Button size="sm" variant="outline" onClick={() => openEdit(s)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(s)}>Del</Button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Schedule' : 'Add Schedule'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Title">
            <Input
              value={form.title ?? ''}
              onChange={e => handleField('title', e.target.value)}
              placeholder="e.g. Morning Yoga"
            />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Type">
              <Select
                value={form.type ?? 'class'}
                onChange={e => handleField('type', e.target.value)}
                options={[
                  { value: 'class', label: 'Class' },
                  { value: 'pt', label: 'Personal Training' },
                  { value: 'event', label: 'Event' },
                  { value: 'other', label: 'Other' },
                ]}
              />
            </FormField>
            <FormField label="Instructor">
              <Input
                value={form.instructor ?? ''}
                onChange={e => handleField('instructor', e.target.value)}
                placeholder="Instructor name"
              />
            </FormField>
            <FormField label="Date">
              <Input
                type="date"
                value={form.date ?? ''}
                onChange={e => handleField('date', e.target.value)}
              />
            </FormField>
            <FormField label="Time">
              <Input
                type="time"
                value={form.time ?? ''}
                onChange={e => handleField('time', e.target.value)}
              />
            </FormField>
            <FormField label="Capacity">
              <Input
                type="number"
                min={1}
                value={form.capacity ?? 20}
                onChange={e => handleField('capacity', parseInt(e.target.value, 10) || 0)}
              />
            </FormField>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Update' : 'Add Schedule'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch {
    return d
  }
}
