export interface Business {
  _id: string
  phoneNumberId?: string
  wabaId?: string
  triggerKeyword?: string
  adminPassword?: string
  businessName: string
  businessType?: string
  tagline?: string
  areaInfo?: string
  knowledge?: string
  systemPrompt?: string
  greetingMessage?: string
  mediaAssets: MediaAsset[]
  buttons?: { pricing?: string; info?: string; media?: string }
  active: boolean
}

export interface MediaAsset {
  key: string
  label?: string
  type: 'image' | 'video'
  url: string
  caption?: string
}

export interface Member {
  _id: string
  businessId: string
  name?: string
  phone?: string
  email?: string
  plan?: string
  startDate?: string
  expiryDate?: string
  paymentStatus?: 'paid' | 'due' | 'overdue'
  nextPaymentDate?: string
  notes?: string
  createdAt?: string
}

export interface Schedule {
  _id: string
  businessId: string
  title?: string
  type?: string
  date?: string
  time?: string
  instructor?: string
  capacity?: number
  bookedCount?: number
  isActive?: boolean
}

export interface Session {
  _id: string
  phone?: string
  businessId: string
  messages: unknown[]
  lastActivity?: string
}

export interface Stats {
  totalMembers: number
  activeMembers: number
  dueMembers: number
  activeSessions: number
  upcomingClasses: number
}
