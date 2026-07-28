import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAuth } from '../contexts/AuthContext'
import {
  getBestPerformance,
  getExercise,
  getExerciseHistory,
  getPartnerProfile,
  logQuickPr,
  markSetAsPr,
  sendMessage,
  type BestPerformance,
} from '../lib/api'
import { computeExerciseRank, getExerciseMetric, hasRankConfig, type RankResult } from '../lib/ranks'
import { EXERCISE_INFO } from '../lib/exerciseInfo'
import { Pictogram } from '../components/pictograms'
import { RankBadge } from '../components/RankBadge'
import { Button, Card, Spinner } from '../components/ui'
import type { Exercise, Profile } from '../types'

export function ExerciseDetail() {
  const { exerciseId } = useParams<{ exerciseId: string }>()
  const { profile } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [best, setBest] = useState<BestPerformance>({ maxWeight: null, maxReps: null })
  const [history, setHistory] = useState<{ session_date: string; weight_kg: number | null; reps: number | null }[]>([])
  const [partner, setPartner] = useState<Profile | null>(null)

  const [weightInput, setWeightInput] = useState('')
  const [repsInput, setRepsInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!exerciseId || !profile) return
    let cancelled = false
    async function load() {
      const [ex, b, p] = await Promise.all([
        getExercise(exerciseId!),
        getBestPerformance(profile!.id, exerciseId!),
        getPartnerProfile(profile!),
      ])
      if (cancelled) return
      setExercise(ex)
      setBest(b)
      setPartner(p)
      if (hasRankConfig(ex.name)) {
        const h = await getExerciseHistory(profile!.id, exerciseId!)
        if (!cancelled) setHistory(h)
      }
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [exerciseId, profile])

  if (!profile || loading || !exercise) return <Spinner />

  const info = EXERCISE_INFO[exercise.name]
  const config = hasRankConfig(exercise.name)
  const metric = getExerciseMetric(exercise.name)
  const currentValue = metric === 'weight' ? best.maxWeight : best.maxReps
  const rank: RankResult | null = config ? computeExerciseRank(exercise.name, profile.sex, currentValue) : null

  async function handleLogPr(e: React.FormEvent) {
    e.preventDefault()
    if (!profile || !exercise || !metric) return
    setSaving(true)
    try {
      const weightKg = metric === 'weight' && weightInput ? Number(weightInput) : null
      const reps = metric !== 'weight' ? (repsInput ? Number(repsInput) : null) : repsInput ? Number(repsInput) : null
      const newValue = metric === 'weight' ? weightKg : reps
      if (newValue === null) return

      const oldValue = metric === 'weight' ? best.maxWeight : best.maxReps
      const isRecord = oldValue === null || newValue > oldValue
      const oldRank = computeExerciseRank(exercise.name, profile.sex, oldValue)
      const newRank = computeExerciseRank(exercise.name, profile.sex, newValue)

      const created = await logQuickPr({ profileId: profile.id, exercise, weightKg, reps })
      if (isRecord) {
        await markSetAsPr(created.id)
      }

      setBest((prev) => ({
        maxWeight: weightKg !== null && (prev.maxWeight === null || weightKg > prev.maxWeight) ? weightKg : prev.maxWeight,
        maxReps: reps !== null && (prev.maxReps === null || reps > prev.maxReps) ? reps : prev.maxReps,
      }))
      setWeightInput('')
      setRepsInput('')

      if (isRecord && newRank && (!oldRank || newRank.tierIndex > oldRank.tierIndex)) {
        setCelebrate(true)
        setTimeout(() => setCelebrate(false), 2800)
      }

      if (isRecord && partner && profile.couple_id) {
        const unit = newRank?.unit ?? ''
        await sendMessage({
          coupleId: profile.couple_id,
          fromProfileId: profile.id,
          toProfileId: partner.id,
          kind: 'pr_cheer',
          body: `🏆 ${profile.display_name} vient de faire un nouveau record à ${exercise.name} : ${newValue}${unit} !`,
          relatedExerciseId: exercise.id,
        })
        setToast(`PR envoyé à ${partner.display_name} 🎉`)
        setTimeout(() => setToast(null), 3000)
      }
    } finally {
      setSaving(false)
    }
  }

  const chartData = history
    .map((h) => ({
      date: new Date(h.session_date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      valeur: metric === 'weight' ? h.weight_kg : h.reps,
    }))
    .filter((d) => d.valeur !== null)

  return (
    <div className="flex-1 px-4 py-6 overflow-y-auto space-y-4 pb-10">
      <button onClick={() => navigate(-1)} className="text-sm text-slate-400 mb-1">
        ← Retour
      </button>

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-800 text-sky-400">
            {info && <Pictogram pattern={info.pattern} size={36} />}
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-50">{exercise.name}</h1>
            <p className="text-xs text-slate-500">{exercise.muscle_group}</p>
          </div>
        </div>
        {rank && (
          <div className={celebrate ? 'rank-pop' : ''}>
            <RankBadge rank={rank} size="lg" />
          </div>
        )}
      </div>

      {celebrate && (
        <div className="text-center text-sm font-medium text-amber-300 glow-pulse rounded-xl bg-amber-500/10 py-2">
          🎉 Rang supérieur débloqué !
        </div>
      )}
      {toast && <div className="text-center text-sm text-emerald-400">{toast}</div>}

      {rank && (
        <Card>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-400">Ton record</span>
            <span className="font-medium text-slate-100">
              {rank.value !== null ? `${rank.value}${rank.unit}` : 'Pas encore de record'}
            </span>
          </div>
          {rank.nextThreshold !== null ? (
            <>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-sky-500" style={{ width: `${rank.progressPct}%` }} />
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                {Math.max(0, rank.nextThreshold - (rank.value ?? 0))}
                {rank.unit} avant le prochain rang
              </p>
            </>
          ) : (
            <p className="text-xs text-amber-400">Rang maximum atteint 👑</p>
          )}
        </Card>
      )}

      {info && (
        <Card className="space-y-3">
          <div>
            <h2 className="text-sm font-medium text-slate-300 mb-1">À quoi ça sert</h2>
            <p className="text-sm text-slate-400">{info.purpose}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-slate-300 mb-1">Comment le faire</h2>
            <ol className="text-sm text-slate-400 space-y-1 list-decimal list-inside">
              {info.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="text-sm font-medium text-slate-300 mb-1">Respiration / contraction</h2>
            <p className="text-sm text-slate-400">{info.cue}</p>
          </div>
          {info.mistakes.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-slate-300 mb-1">Erreurs fréquentes</h2>
              <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                {info.mistakes.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      {chartData.length > 1 && (
        <Card>
          <h2 className="text-sm font-medium text-slate-300 mb-2">Historique</h2>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="valeur" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {metric && (
        <Card>
          <h2 className="text-sm font-medium text-slate-300 mb-2">Mettre à jour ton record</h2>
          <form onSubmit={handleLogPr} className="flex gap-2">
            {metric === 'weight' && (
              <input
                type="number"
                step="0.5"
                inputMode="decimal"
                placeholder="kg"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="w-24 rounded-lg bg-slate-800/80 border border-slate-700 px-2 py-2 text-sm text-slate-100 outline-none focus:border-sky-500"
                required
              />
            )}
            <input
              type="number"
              inputMode="numeric"
              placeholder={metric === 'seconds' ? 'secondes' : 'reps'}
              value={repsInput}
              onChange={(e) => setRepsInput(e.target.value)}
              className="w-24 rounded-lg bg-slate-800/80 border border-slate-700 px-2 py-2 text-sm text-slate-100 outline-none focus:border-sky-500"
              required={metric !== 'weight'}
            />
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? '…' : 'Valider'}
            </Button>
          </form>
        </Card>
      )}
    </div>
  )
}
