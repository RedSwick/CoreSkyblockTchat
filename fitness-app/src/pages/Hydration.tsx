import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { addHydration, getLatestWeight, getTodayHydrationTotal, listHydrationLogs } from '../lib/api'
import { computeHydrationTargetMl } from '../lib/nutrition'
import { Button, Card, EmptyState, PageTitle, ProgressRing, Spinner } from '../components/ui'
import type { HydrationLog } from '../types'

const QUICK_ADD = [150, 250, 500]

export function Hydration() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [target, setTarget] = useState(2500)
  const [history, setHistory] = useState<HydrationLog[]>([])

  async function load() {
    if (!profile) return
    const [t, latestWeight, logs] = await Promise.all([
      getTodayHydrationTotal(profile.id),
      getLatestWeight(profile.id),
      listHydrationLogs(profile.id),
    ])
    setTotal(t)
    setTarget(computeHydrationTargetMl(latestWeight?.weight_kg ?? profile.target_weight_kg ?? 70, true))
    setHistory(logs)
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  async function handleAdd(amount: number) {
    if (!profile) return
    setTotal((t) => t + amount)
    await addHydration(profile.id, amount)
    load()
  }

  if (!profile || loading) return <Spinner />

  const byDay = new Map<string, number>()
  for (const log of history) {
    byDay.set(log.logged_date, (byDay.get(log.logged_date) ?? 0) + log.amount_ml)
  }
  const days = Array.from(byDay.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1)).slice(0, 7)

  return (
    <div className="flex-1 px-4 py-6 overflow-y-auto space-y-5">
      <PageTitle title="Hydratation" subtitle="Objectif quotidien adapté à ton poids" />

      <Card glow className="flex flex-col items-center py-6">
        <ProgressRing value={total} max={target} size={160} label="aujourd'hui" />
        <p className="text-sm text-slate-400 mt-3">
          {(total / 1000).toFixed(2)} L / {(target / 1000).toFixed(2)} L
        </p>
        {profile.sex === 'female' && (
          <p className="text-xs text-slate-500 mt-2 text-center px-4">
            Boire régulièrement aide le corps à moins retenir l'eau : viser l'objectif aide contre la rétention.
          </p>
        )}
      </Card>

      <div className="grid grid-cols-3 gap-2">
        {QUICK_ADD.map((amount) => (
          <Button key={amount} variant="secondary" onClick={() => handleAdd(amount)}>
            +{amount} ml
          </Button>
        ))}
      </div>

      <Card>
        <h2 className="text-sm font-medium text-slate-300 mb-2">7 derniers jours</h2>
        {days.length === 0 ? (
          <EmptyState>Pas encore d'historique.</EmptyState>
        ) : (
          <div className="space-y-1.5">
            {days.map(([date, amount]) => (
              <div key={date} className="flex items-center gap-2">
                <span className="text-xs text-slate-500 w-16">
                  {new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                </span>
                <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 to-indigo-500"
                    style={{ width: `${Math.min(100, (amount / target) * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400 w-12 text-right">{(amount / 1000).toFixed(1)}L</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
