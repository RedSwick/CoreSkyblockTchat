import { useId, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'

export function Card({
  children,
  className = '',
  glow = false,
}: {
  children: ReactNode
  className?: string
  glow?: boolean
}) {
  return (
    <div
      className={`rounded-2xl p-4 shadow-lg shadow-black/20 ${
        glow
          ? 'bg-gradient-to-br from-sky-500/15 via-slate-900/70 to-indigo-500/10 border border-sky-500/25'
          : 'bg-gradient-to-b from-slate-900/80 to-slate-900/40 backdrop-blur border border-slate-800/80'
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }) {
  const base =
    'rounded-xl px-4 py-2.5 font-medium text-sm transition active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100'
  const styles = {
    primary:
      'bg-gradient-to-r from-sky-400 to-indigo-500 text-slate-950 shadow-md shadow-sky-500/25 hover:brightness-110',
    secondary: 'bg-slate-800/80 text-slate-100 border border-slate-700/60 hover:bg-slate-700/80',
    ghost: 'bg-transparent text-slate-300 hover:bg-slate-800/60',
    danger: 'bg-red-500/15 text-red-400 hover:bg-red-500/25',
  }
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl bg-slate-800/60 border border-slate-700/80 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-sky-400 focus:bg-slate-800/90 focus:ring-2 focus:ring-sky-500/20 ${props.className ?? ''}`}
    />
  )
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl bg-slate-800/60 border border-slate-700/80 px-3 py-2.5 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 ${props.className ?? ''}`}
    />
  )
}

export function Label({ children }: { children: ReactNode }) {
  return <label className="block text-xs font-medium text-slate-400 mb-1">{children}</label>
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold tracking-tight gradient-text">{title}</h1>
      {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
    </div>
  )
}

export function StatPill({
  label,
  value,
  accent = 'sky',
  icon,
}: {
  label: string
  value: string
  accent?: 'sky' | 'emerald' | 'amber' | 'fuchsia'
  icon?: string
}) {
  const colors: Record<string, string> = {
    sky: 'text-sky-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    fuchsia: 'text-fuchsia-400',
  }
  const glows: Record<string, string> = {
    sky: 'from-sky-500/15',
    emerald: 'from-emerald-500/15',
    amber: 'from-amber-500/15',
    fuchsia: 'from-fuchsia-500/15',
  }
  return (
    <div
      className={`flex-1 rounded-xl bg-gradient-to-b ${glows[accent]} to-slate-900/50 border border-slate-800/80 px-3 py-3 text-center`}
    >
      {icon && <div className="text-sm mb-0.5 opacity-80">{icon}</div>}
      <div className={`text-lg font-bold ${colors[accent]}`}>{value}</div>
      <div className="text-[11px] text-slate-400 mt-0.5">{label}</div>
    </div>
  )
}

export function ProgressRing({ value, max, size = 120, label }: { value: number; max: number; size?: number; label: string }) {
  const gradientId = useId()
  const radius = size / 2 - 8
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(1, max > 0 ? value / max : 0)
  const offset = circumference * (1 - pct)
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#1e293b" strokeWidth={10} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={10}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.4s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-slate-50">{Math.round(pct * 100)}%</span>
        <span className="text-[11px] text-slate-400">{label}</span>
      </div>
    </div>
  )
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="text-center text-sm text-slate-500 py-8 px-2">{children}</div>
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="h-6 w-6 rounded-full border-2 border-slate-700 border-t-sky-400 animate-spin" />
    </div>
  )
}
