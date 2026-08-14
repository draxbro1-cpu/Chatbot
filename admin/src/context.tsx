import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { setToken } from './api'
import type { Business } from './types'

// ─── Auth ─────────────────────────────────────────────────────────────────────

interface AuthState {
  token: string
  wabaId: string
  businesses: Business[]
  currentBiz: Business | null
}

interface AuthCtx extends AuthState {
  isLoggedIn: boolean
  login: (token: string, wabaId: string, businesses: Business[]) => void
  logout: () => void
  setCurrentBiz: (biz: Business) => void
  updateCurrentBiz: (biz: Business) => void
  setBusinesses: (businesses: Business[]) => void
}

const STORAGE_KEY = 'trio-auth-v2'

const defaultAuth: AuthState = {
  token: '',
  wabaId: '',
  businesses: [],
  currentBiz: null,
}

function loadAuth(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as AuthState
  } catch {
    // ignore
  }
  return defaultAuth
}

const AuthContext = createContext<AuthCtx | null>(null)

// ─── Toast ────────────────────────────────────────────────────────────────────

interface Toast {
  id: number
  message: string
  type: 'success' | 'error'
}

interface ToastCtx {
  addToast: (message: string, type?: 'success' | 'error') => void
}

const ToastContext = createContext<ToastCtx | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(loadAuth)
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastIdRef = useRef(0)

  // Sync token to api module on every auth change
  useEffect(() => {
    setToken(auth.token)
  }, [auth.token])

  const login = useCallback((token: string, wabaId: string, businesses: Business[]) => {
    const next: AuthState = {
      token,
      wabaId,
      businesses,
      currentBiz: businesses[0] ?? null,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setAuth(next)
    setToken(token)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setAuth(defaultAuth)
    setToken('')
  }, [])

  const setCurrentBiz = useCallback((biz: Business) => {
    setAuth(prev => {
      const next = { ...prev, currentBiz: biz }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const updateCurrentBiz = useCallback((biz: Business) => {
    setAuth(prev => {
      const businesses = prev.businesses.map(b => (b._id === biz._id ? biz : b))
      const currentBiz = prev.currentBiz?._id === biz._id ? biz : prev.currentBiz
      const next = { ...prev, businesses, currentBiz }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const setBusinesses = useCallback((businesses: Business[]) => {
    setAuth(prev => {
      const currentBiz = prev.currentBiz
        ? (businesses.find(b => b._id === prev.currentBiz?._id) ?? prev.currentBiz)
        : prev.currentBiz
      const next = { ...prev, businesses, currentBiz }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const addToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = ++toastIdRef.current
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const authCtx: AuthCtx = {
    ...auth,
    isLoggedIn: !!auth.token,
    login,
    logout,
    setCurrentBiz,
    updateCurrentBiz,
    setBusinesses,
  }

  return (
    <AuthContext.Provider value={authCtx}>
      <ToastContext.Provider value={{ addToast }}>
        {children}
        {/* Toast container */}
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
          {toasts.map(toast => (
            <div
              key={toast.id}
              className={`pointer-events-auto min-w-[280px] max-w-sm rounded-lg bg-surface border px-4 py-3 shadow-lg text-sm text-foreground border-l-4 ${
                toast.type === 'success' ? 'border-l-green-400' : 'border-l-red-400'
              } animate-[fadeInUp_0.2s_ease-out]`}
            >
              {toast.message}
            </div>
          ))}
        </div>
      </ToastContext.Provider>
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthCtx {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AppProvider')
  return ctx
}

export function useToast(): ToastCtx {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within AppProvider')
  return ctx
}
