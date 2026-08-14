import React from 'react'

// ─── Badge ────────────────────────────────────────────────────────────────────

const badgeColors = {
  green: 'bg-green-400/10 text-green-400 border-green-400/20',
  red: 'bg-red-400/10 text-red-400 border-red-400/20',
  yellow: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  blue: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  gray: 'bg-gray-400/10 text-gray-400 border-gray-400/20',
}

interface BadgeProps {
  children: React.ReactNode
  color?: keyof typeof badgeColors
}

export function Badge({ children, color = 'gray' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${badgeColors[color]}`}>
      {children}
    </span>
  )
}

// ─── Button ──────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'outline'
type ButtonSize = 'sm' | 'md'

interface ButtonProps {
  children: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-orange-500 hover:bg-orange-600 text-white border-transparent',
  ghost: 'bg-transparent hover:bg-surface2 text-foreground border-transparent',
  danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-400/20',
  outline: 'bg-transparent hover:bg-surface2 text-foreground border-border',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  onClick,
  className = '',
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 font-medium rounded-lg border transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  )
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string | number
  color?: 'orange' | 'green' | 'blue' | 'yellow' | 'red'
}

const statColorMap = {
  orange: 'text-orange-400',
  green: 'text-green-400',
  blue: 'text-blue-400',
  yellow: 'text-yellow-400',
  red: 'text-red-400',
}

export function StatCard({ label, value, color = 'orange' }: StatCardProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-2">
      <span className="text-muted text-xs font-medium uppercase tracking-wider">{label}</span>
      <span className={`text-3xl font-bold ${statColorMap[color]}`}>{value}</span>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-2 animate-pulse">
      <div className="h-3 w-20 bg-surface2 rounded" />
      <div className="h-9 w-16 bg-surface2 rounded" />
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg mx-4 bg-surface border border-border rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors p-1 rounded-lg hover:bg-surface2"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.293 4.293a1 1 0 011.414 0L8 6.586l2.293-2.293a1 1 0 111.414 1.414L9.414 8l2.293 2.293a1 1 0 01-1.414 1.414L8 9.414l-2.293 2.293a1 1 0 01-1.414-1.414L6.586 8 4.293 5.707a1 1 0 010-1.414z" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

// ─── FormField ────────────────────────────────────────────────────────────────

interface FormFieldProps {
  label: string
  children: React.ReactNode
}

export function FormField({ label, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted uppercase tracking-wider">{label}</label>
      {children}
    </div>
  )
}

// ─── Input ────────────────────────────────────────────────────────────────────

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ className = '', ...props }, ref) {
    return (
      <input
        ref={ref}
        {...props}
        className={`w-full bg-surface2 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted focus:outline-none focus:border-orange-500 transition-colors ${className}`}
      />
    )
  }
)

// ─── Textarea ─────────────────────────────────────────────────────────────────

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className = '', ...props }, ref) {
    return (
      <textarea
        ref={ref}
        {...props}
        className={`w-full bg-surface2 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted focus:outline-none focus:border-orange-500 transition-colors resize-vertical ${className}`}
      />
    )
  }
)

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: { value: string; label: string }[]
}

export function Select({ options, className = '', ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={`w-full bg-surface2 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-orange-500 transition-colors appearance-none ${className}`}
    >
      {options.map(o => (
        <option key={o.value} value={o.value} className="bg-surface2">
          {o.label}
        </option>
      ))}
    </select>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-surface border border-border rounded-xl ${className}`}>
      {children}
    </div>
  )
}

// ─── Empty ────────────────────────────────────────────────────────────────────

interface EmptyProps {
  icon?: string
  text: string
}

export function Empty({ icon = '📭', text }: EmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted">
      <span className="text-4xl">{icon}</span>
      <span className="text-sm">{text}</span>
    </div>
  )
}

// ─── Table ────────────────────────────────────────────────────────────────────

interface TableProps {
  headers: string[]
  children: React.ReactNode
}

export function Table({ headers, children }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-surface2">
            {headers.map(h => (
              <th
                key={h}
                className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function Tr({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <tr className={`border-b border-border/50 hover:bg-surface2/50 transition-colors ${className}`}>
      {children}
    </tr>
  )
}

export function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-3 text-foreground ${className}`}>
      {children}
    </td>
  )
}

// ─── PageHeader ───────────────────────────────────────────────────────────────

interface PageHeaderProps {
  title: string
  action?: React.ReactNode
}

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl font-bold text-foreground">{title}</h1>
      {action && <div>{action}</div>}
    </div>
  )
}
