import { useState } from 'react'
import { Card } from '../components/ui'

const FLOW_STEPS = [
  { step: 1, name: 'Welcome Menu', description: 'Greeting + Get a Quote / Ask a Question buttons', type: 'button' },
  { step: 2, name: 'Full Name', description: 'Asks for customer full name', type: 'text' },
  { step: 3, name: 'Business Name', description: 'Asks for business name', type: 'text' },
  { step: 4, name: 'Phone / WhatsApp', description: 'Asks for phone number', type: 'text' },
  { step: 5, name: 'Email Address', description: 'Asks for email', type: 'text' },
  { step: 6, name: 'Instagram / Website', description: 'Asks for IG or website URL (skip option)', type: 'button' },
  { step: 7, name: 'Business Description', description: 'What does your business do?', type: 'text' },
  { step: 8, name: 'Services (Multi-select)', description: 'Meta Ads, Google Ads, SEO, Website Dev, etc.', type: 'list' },
  { step: 9, name: 'Challenges (Multi-select)', description: 'Need leads, Low sales, No website, etc.', type: 'list' },
  { step: 10, name: 'Budget', description: 'Under 10K to 1 Lakh+ range selection', type: 'list' },
  { step: 11, name: 'Goals (Multi-select)', description: 'More Leads, Sales, Brand Awareness, etc.', type: 'list' },
  { step: 12, name: 'Confirmation', description: 'Summary card + Our team will contact you in 24 hours', type: 'text' },
]

const PRICING_PLANS = [
  { name: 'Basic Plan', upfront: '25,000', monthly: '6,000/mo', features: '1-page landing page + GMB + basic SEO' },
  { name: 'Advance Plan', upfront: '30,000', monthly: '10,000/mo', features: '5 pages + WhatsApp chatbot + schema markup' },
  { name: 'Pro Plan', upfront: '40,000', monthly: '15,000/mo', features: '7 pages + animations + weekly rank tracking' },
]

const SERVICES = [
  'Website Design & Development', 'Landing Pages', 'SEO Optimization',
  'Agentic SEO (AI-powered)', 'GMB Optimization', 'WhatsApp Automation',
  'WhatsApp Marketing', 'Social Media Marketing', 'Performance Optimization',
]

const TRIGGER_KEYWORDS = [
  'hi', 'hello', 'start', 'hey', 'helo', 'hii', 'hiii', 'namaste', 'namaskar',
  'hiya', 'menu', 'main menu', 'help', 'restart', 'flownware', 'quote', 'get quote',
  'reset', 'shuru', 'hlo', 'hola', 'bot', 'start flow',
]

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function FlownwareChatbot() {
  const [activeTab, setActiveTab] = useState<'overview' | 'flow' | 'ai' | 'pricing'>('overview')

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: '📊' },
    { id: 'flow' as const, label: 'Flow Steps', icon: '🔄' },
    { id: 'ai' as const, label: 'AI Context', icon: '🤖' },
    { id: 'pricing' as const, label: 'Pricing', icon: '💰' },
  ]

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-xl flex items-center justify-center text-lg">🚀</div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Flownware Chatbot</h1>
            <p className="text-xs text-muted">Digital Agency Lead Capture Bot</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <span className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full px-3 py-1 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Active
          </span>
          <span className="text-xs text-muted">WABA: 1360387522681431</span>
        </div>
      </div>

      <div className="flex gap-1 mb-6 bg-surface2 rounded-xl p-1 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
              activeTab === tab.id ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'text-muted hover:text-foreground'
            )}>
            <span>{tab.icon}</span><span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Company', value: 'Flownware', color: 'text-blue-400' },
              { label: 'Location', value: 'Mumbai', color: 'text-green-400' },
              { label: 'Websites Delivered', value: '120+', color: 'text-orange-400' },
              { label: 'Avg Delivery', value: '7 Days', color: 'text-purple-400' },
            ].map(stat => (
              <Card key={stat.label} className="p-4">
                <p className="text-xs text-muted mb-1">{stat.label}</p>
                <p className={cn('text-lg font-bold', stat.color)}>{stat.value}</p>
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
            <h3 className="text-sm font-semibold text-foreground mb-3">Services Offered</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SERVICES.map((svc, i) => (
                <div key={svc} className="flex items-center gap-2 text-sm text-muted">
                  <span className="text-orange-400 text-xs">#{i + 1}</span><span>{svc}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Company Details</h3>
            <div className="space-y-2 text-sm">
              {[
                ['Tagline', '"We Build Websites That Generate Leads While You Sleep"'],
                ['Contact', '+91 83699 03001'],
                ['Email', 'contact@flownware.com'],
                ['Service Cities', 'Mumbai, Delhi NCR, Pune, Nashik, Ahmedabad'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between"><span className="text-muted">{k}</span><span className="text-foreground">{v}</span></div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'flow' && (
        <div className="space-y-3">
          <p className="text-sm text-muted mb-4">Lead capture flow: User taps Get a Quote, completes 10-step questionnaire, receives confirmation. After completion, AI (Groq) handles follow-up questions.</p>
          {FLOW_STEPS.map(step => (
            <Card key={step.step} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-sm font-bold text-orange-400 flex-shrink-0">{step.step}</div>
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
            <p className="text-xs text-muted mb-3">This prompt is sent to Groq AI when users ask questions or after completing the lead capture flow.</p>
            <div className="bg-surface2 border border-border rounded-xl p-4 text-xs text-muted font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
{`You are Flownware's smart WhatsApp AI sales assistant.
Reply in the same language as the customer (English, Hindi, or Hinglish).
Keep replies friendly, concise (max 3 to 4 lines), and highly engaging.

COMPANY: Flownware - Premium Web Design, Development & Digital Marketing Agency
TAGLINE: "We Build Websites That Generate Leads While You Sleep"
LOCATION: Kandivali East, Mumbai, Maharashtra
CONTACT: WhatsApp +91 83699 03001 | Email: contact@flownware.com

KEY STATS: 120+ websites | 7-day delivery | 3.5x conversion increase | 99.8% retention

RULES:
- If asked about pricing: give exact plan details
- If asked for consultation: invite to type "Hi" or call
- NEVER fabricate stats
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

      {activeTab === 'pricing' && (
        <div className="space-y-4">
          <p className="text-sm text-muted mb-2">Pricing plans shared with customers when they ask about pricing during the chatbot flow.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PRICING_PLANS.map(plan => (
              <Card key={plan.name} className="p-5 relative overflow-hidden">
                <div className={cn(
                  'absolute top-0 left-0 w-full h-1 bg-gradient-to-r',
                  plan.name === 'Pro Plan' && 'from-orange-500 to-yellow-400',
                  plan.name === 'Advance Plan' && 'from-blue-500 to-cyan-400',
                  plan.name === 'Basic Plan' && 'from-gray-500 to-gray-400',
                )} />
                <h4 className="font-bold text-foreground text-sm mb-3">{plan.name}</h4>
                <div className="space-y-2">
                  <div><span className="text-xs text-muted">Upfront</span><p className="text-lg font-bold text-orange-400">{plan.upfront}</p></div>
                  <div><span className="text-xs text-muted">Monthly</span><p className="text-sm font-semibold text-foreground">{plan.monthly}</p></div>
                  <div className="pt-2 border-t border-border/50"><span className="text-xs text-muted">Includes</span><p className="text-xs text-foreground mt-1">{plan.features}</p></div>
                </div>
              </Card>
            ))}
          </div>
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Portfolio Results</h3>
            <div className="space-y-2">
              {[['Pari Tours', '+150% leads'], ['Trio Fitness', '+140% memberships'], ['Real Estate Clients', '+95-130% inquiries']].map(([c, r]) => (
                <div key={c} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-foreground">{c}</span>
                  <span className="text-sm font-semibold text-green-400">{r}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
