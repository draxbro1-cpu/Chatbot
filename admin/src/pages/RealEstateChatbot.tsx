import { useState } from 'react'
import { Card } from '../components/ui'

const FLOW_STEPS = [
  { step: 1, name: 'Welcome Menu', description: 'Greeting + Find Property / Ask a Question buttons', type: 'button' },
  { step: 2, name: 'Intent', description: 'Buy / Sell / Rent selection', type: 'button' },
  { step: 3, name: 'Property Type', description: 'Flat, Villa, Plot, Row House, Commercial, PG/Hostel', type: 'list' },
  { step: 4, name: 'BHK Selection', description: '1 BHK / 2 BHK / 3 BHK+ (skipped for Plot/Commercial/PG)', type: 'button' },
  { step: 5, name: 'Budget Range', description: 'Under 25L to 2 Crore+ range selection', type: 'list' },
  { step: 6, name: 'Location Preference', description: 'User types preferred city or locality', type: 'text' },
  { step: 7, name: 'Full Name', description: 'Asks for customer full name', type: 'text' },
  { step: 8, name: 'Phone / WhatsApp', description: 'Asks for phone number', type: 'text' },
  { step: 9, name: 'Confirmation', description: 'Property enquiry summary card sent to user', type: 'text' },
]

const PROPERTY_TYPES = [
  { name: 'Flat / Apartment', icon: '🏢', desc: 'Residential apartments' },
  { name: 'Villa / Bungalow', icon: '🏡', desc: 'Independent houses' },
  { name: 'Plot / Land', icon: '🌍', desc: 'Residential or commercial plots' },
  { name: 'Row House', icon: '🏘️', desc: 'Semi-independent houses' },
  { name: 'Commercial', icon: '🏪', desc: 'Shop, office, showroom' },
  { name: 'PG / Hostel', icon: '🛏️', desc: 'Paying guest or hostel' },
]

const BUDGET_RANGES = [
  'Under 25 Lakh', '25L - 50 Lakh', '50L - 1 Crore',
  '1Cr - 2 Crore', '2 Crore+', 'Flexible / Not Sure',
]

const TRIGGER_KEYWORDS = [
  'property', 'flat', 'plot', 'villa', 'ghar', 'real estate', 'rent',
  'buy', 'sell', 'pg', 'makaan', 'makan', 'house', 'apartment',
  'commercial', 'shop', 'office',
]

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function RealEstateChatbot() {
  const [activeTab, setActiveTab] = useState<'overview' | 'flow' | 'ai'>('overview')

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: '📊' },
    { id: 'flow' as const, label: 'Flow Steps', icon: '🔄' },
    { id: 'ai' as const, label: 'AI Context', icon: '🤖' },
  ]

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-xl flex items-center justify-center text-lg">🏠</div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Real Estate Chatbot</h1>
            <p className="text-xs text-muted">Property Lead Capture Bot</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <span className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full px-3 py-1 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Active
          </span>
          <span className="text-xs text-muted">Keyword-triggered chatbot</span>
        </div>
      </div>

      <div className="flex gap-1 mb-6 bg-surface2 rounded-xl p-1 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
              activeTab === tab.id ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-muted hover:text-foreground'
            )}
          >
            <span>{tab.icon}</span><span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Intents', value: '3', sub: 'Buy / Sell / Rent', color: 'text-emerald-400' },
              { label: 'Property Types', value: '6', sub: 'Flat to PG', color: 'text-blue-400' },
              { label: 'Flow Steps', value: '9', sub: 'Lead capture', color: 'text-orange-400' },
            ].map(stat => (
              <Card key={stat.label} className="p-4">
                <p className="text-xs text-muted mb-1">{stat.label}</p>
                <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
                <p className="text-xs text-muted mt-0.5">{stat.sub}</p>
              </Card>
            ))}
          </div>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Trigger Keywords</h3>
            <div className="flex flex-wrap gap-1.5">
              {TRIGGER_KEYWORDS.map(kw => (
                <span key={kw} className="inline-flex items-center px-2.5 py-1 rounded-lg bg-surface2 border border-border text-xs text-muted">{kw}</span>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Property Types</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PROPERTY_TYPES.map(pt => (
                <div key={pt.name} className="flex items-center gap-3 p-3 bg-surface2 rounded-xl border border-border">
                  <span className="text-xl">{pt.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{pt.name}</p>
                    <p className="text-xs text-muted">{pt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Budget Ranges</h3>
            <div className="flex flex-wrap gap-2">
              {BUDGET_RANGES.map(b => (
                <span key={b} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">{b}</span>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'flow' && (
        <div className="space-y-3">
          <p className="text-sm text-muted mb-4">Property lead capture flow: User sends property-related keyword, selects intent (Buy/Sell/Rent), then provides property preferences and contact details.</p>
          {FLOW_STEPS.map(step => (
            <Card key={step.step} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-sm font-bold text-emerald-400 flex-shrink-0">{step.step}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground text-sm">{step.name}</p>
                    <span className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded font-mono uppercase',
                      step.type === 'button' && 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
                      step.type === 'list' && 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
                      step.type === 'text' && 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
                    )}>{step.type}</span>
                  </div>
                  <p className="text-xs text-muted">{step.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">AI System Prompt (Groq - Llama 3.1)</h3>
            <p className="text-xs text-muted mb-3">This prompt is sent to Groq AI for out-of-flow questions and post-completion follow-ups.</p>
            <div className="bg-surface2 border border-border rounded-xl p-4 text-xs text-muted font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
{`You are a smart WhatsApp Real Estate AI assistant.
Reply in the same language as the customer (English, Hindi, or Hinglish).
Keep replies friendly, concise (max 3-4 lines), and helpful.
Always guide the customer toward sharing their property requirements
or scheduling a site visit.

SERVICES:
1. Residential Properties - Flats, Villas, Row Houses, Plots
2. Commercial Properties - Offices, Shops, Showrooms, Warehouses
3. Rental Properties - Flats, PG/Hostels, Commercial Spaces
4. Property Consultation - Legal, Loans, Documentation

RULES:
- If asked about specific properties: ask for location & budget
- If asked for site visit: invite to share Name + Phone
- If out of scope: redirect to property-related services
- NEVER fabricate property listings or prices
- Keep replies short - max 3-4 lines`}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">AI Settings</h3>
            <div className="space-y-3 text-sm">
              {[['Model', 'llama-3.1-8b-instant'], ['Max Tokens', '250'], ['Temperature', '0.7'], ['Provider', 'Groq Cloud']].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-muted">{k}</span>
                  <code className="text-xs bg-surface2 border border-border rounded px-2 py-1 text-foreground">{v}</code>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
