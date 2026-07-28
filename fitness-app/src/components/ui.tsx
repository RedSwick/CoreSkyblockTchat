import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-slate-900/60 border border-slate-800 p-4 shadow-sm ${className}`}>
      {children}
    </div>
  )
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }) {
  const base = 'rounded-xl px-4 py-2.5 font-medium text-sm transition active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100'
  const styles = {
    primary: 'bg-sky-500 text-slate-950 hover:bg-sky-400',
    secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700',
    ghost: 'bg-transparent text-slate-300 hover:bg-slate-800/60',
    danger: 'bg-red-500/15 text-red-400 hover:bg-red-500/25',
  }
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl bg-slate-800/80 border border-slate-700 px-3 py-2.5 text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-500 ${props.className ?? ''}`}
    />
  )
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl bg-slate-800/80 border border-slate-700 px-3 py-2.5 text-slate-100 outline-none focus:border-sky-500 ${props.className ?? ''}`}
    />
  )
}

export function Label({ children }: { children: ReactNode }) {
  return <label className="block text-xs font-medium text-slate-400 mb-1">{children}</label>
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h1 className="text-xl font-semibold text-slate-50">{title}</h1>
      {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  )
}

export function StatPill({ label, value, accent = 'sky' }: { label: string; value: string; accent?: 'sky' | 'emerald' | 'amber' | 'fuchsia' }) {
  const colors: Record<string, string> = {
    sky: 'text-sky-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    fuchsia: 'text-fuchsia-400',
  }
  return (
    <div className="flex-1 rounded-xl bg-slate-900/60 border border-slate-800 px-3 py-2.5 text-center">
      <div className={`text-lg font-semibold ${colors[accent]}`}>{value}</div>
      <div className="text-[11px] text-slate-400 mt-0.5">{label}</div>
    </div>
  )
}

export function ProgressRing({ value, max, size = 120, label }: { value: number; max: number; size?: number; label: string }) {
  const radius = size / 2 - 8
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(1, max > 0 ? value / max : 0)
  const offset = circumference * (1 - pct)
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#1e293b" strokeWidth={10} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#38bdf8"
          strokeWidth={10}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.4s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-semibold text-slate-50">{Math.round(pct * 100)}%</span>
        <span className="text-[11px] text-slate-400">{label}</span>
      </div>
    </div>
  )
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="text-center text-sm text-slate-500 py-8">{children}</div>
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="h-6 w-6 rounded-full border-2 border-slate-700 border-t-sky-400 animate-spin" />
    </div>
  )
}
