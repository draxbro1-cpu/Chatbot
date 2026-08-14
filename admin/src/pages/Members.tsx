import React, { useCallback, useEffect, useState } from 'react'
import * as api from '../api'
import { useAuth, useToast } from '../context'
import {
  Button,
  Modal,
  FormField,
  Input,
  Textarea,
  Select,
  Badge,
  Table,
  Tr,
  Td,
  PageHeader,
  Empty,
} from '../components/ui'
import type { Member } from '../types'

const emptyForm: Omit<Member, '_id'> = {
  businessId: '',
  name: '',
  phone: '',
  email: '',
  plan: '',
  startDate: '',
  expiryDate: '',
  paymentStatus: 'paid',
  nextPaymentDate: '',
  notes: '',
}

const statusColors: Record<string, 'green' | 'yellow' | 'red'> = {
  paid: 'green',
  due: 'yellow',
  overdue: 'red',
}

const TABLE_HEADERS = ['Name', 'Phone', 'Plan', 'Status', 'Expiry', 'Actions']

export default function Members() {
  const { currentBiz } = useAuth()
  const { addToast } = useToast()
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Member | null>(null)
  const [form, setForm] = useState<Omit<Member, '_id'>>(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    if (!currentBiz) return
    setLoading(true)
    try {
      const data = await api.getMembers(currentBiz._id)
      setMembers(data)
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Failed to load members', 'error')
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

  function openEdit(m: Member) {
    setEditing(m)
    setForm({
      businessId: m.businessId,
      name: m.name ?? '',
      phone: m.phone ?? '',
      email: m.email ?? '',
      plan: m.plan ?? '',
      startDate: m.startDate ?? '',
      expiryDate: m.expiryDate ?? '',
      paymentStatus: m.paymentStatus ?? 'paid',
      nextPaymentDate: m.nextPaymentDate ?? '',
      notes: m.notes ?? '',
    })
    setModalOpen(true)
  }

  function handleField(field: keyof Omit<Member, '_id'>, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        const updated = await api.updateMember(editing._id, form)
        setMembers(prev => prev.map(m => (m._id === updated._id ? updated : m)))
        addToast('Member updated', 'success')
      } else {
        const created = await api.createMember(form)
        setMembers(prev => [...prev, created])
        addToast('Member added', 'success')
      }
      setModalOpen(false)
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(m: Member) {
    if (!confirm(`Delete member "${m.name ?? m.phone}"?`)) return
    try {
      await api.deleteMember(m._id)
      setMembers(prev => prev.filter(x => x._id !== m._id))
      addToast('Member deleted', 'success')
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Delete failed', 'error')
    }
  }

  if (!currentBiz) return <div className="text-muted text-sm">No business selected</div>

  return (
    <>
      <PageHeader
        title="Members"
        action={<Button variant="primary" onClick={openAdd}>+ Add Member</Button>}
      />

      {loading ? (
        <div className="animate-pulse space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-surface rounded-lg" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <Empty icon="👥" text="No members yet. Add the first one!" />
      ) : (
        <Table headers={TABLE_HEADERS}>
          {members.map(m => (
            <Tr key={m._id}>
              <Td>
                <div>
                  <div className="font-medium text-sm">{m.name ?? '—'}</div>
                  {m.email && <div className="text-xs text-muted">{m.email}</div>}
                </div>
              </Td>
              <Td className="font-mono text-xs">{m.phone ?? '—'}</Td>
              <Td>{m.plan ?? '—'}</Td>
              <Td>
                {m.paymentStatus ? (
                  <Badge color={statusColors[m.paymentStatus] ?? 'gray'}>
                    {m.paymentStatus}
                  </Badge>
                ) : '—'}
              </Td>
              <Td className="text-xs">{m.expiryDate ? formatDate(m.expiryDate) : '—'}</Td>
              <Td>
                <div className="flex gap-1.5">
                  <Button size="sm" variant="outline" onClick={() => openEdit(m)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(m)}>Del</Button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Member' : 'Add Member'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Name">
              <Input value={form.name ?? ''} onChange={e => handleField('name', e.target.value)} placeholder="Full name" />
            </FormField>
            <FormField label="Phone">
              <Input value={form.phone ?? ''} onChange={e => handleField('phone', e.target.value)} placeholder="+91…" />
            </FormField>
            <FormField label="Email">
              <Input type="email" value={form.email ?? ''} onChange={e => handleField('email', e.target.value)} placeholder="email@example.com" />
            </FormField>
            <FormField label="Plan">
              <Input value={form.plan ?? ''} onChange={e => handleField('plan', e.target.value)} placeholder="e.g. Monthly, Annual" />
            </FormField>
            <FormField label="Start Date">
              <Input type="date" value={form.startDate ?? ''} onChange={e => handleField('startDate', e.target.value)} />
            </FormField>
            <FormField label="Expiry Date">
              <Input type="date" value={form.expiryDate ?? ''} onChange={e => handleField('expiryDate', e.target.value)} />
            </FormField>
            <FormField label="Payment Status">
              <Select
                value={form.paymentStatus ?? 'paid'}
                onChange={e => handleField('paymentStatus', e.target.value)}
                options={[
                  { value: 'paid', label: 'Paid' },
                  { value: 'due', label: 'Due' },
                  { value: 'overdue', label: 'Overdue' },
                ]}
              />
            </FormField>
            <FormField label="Next Payment Date">
              <Input type="date" value={form.nextPaymentDate ?? ''} onChange={e => handleField('nextPaymentDate', e.target.value)} />
            </FormField>
          </div>
          <FormField label="Notes">
            <Textarea
              value={form.notes ?? ''}
              onChange={e => handleField('notes', e.target.value)}
              rows={2}
              placeholder="Optional notes…"
            />
          </FormField>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Update' : 'Add Member'}
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
