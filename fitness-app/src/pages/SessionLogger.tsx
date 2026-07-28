import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  addSet,
  finishSession,
  getLastSetsForExercise,
  getProgramExercises,
  getSession,
  getSessionSets,
  markSetAsPr,
} from '../lib/api'
import { Button, Card, PageTitle, Spinner } from '../components/ui'
import type { Exercise, ProgramExercise, SessionSet, WorkoutSession } from '../types'

type ExerciseWithTarget = ProgramExercise & { exercise: Exercise }

export function SessionLogger() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const { profile } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<WorkoutSession | null>(null)
  const [exercises, setExercises] = useState<ExerciseWithTarget[]>([])
  const [loggedSets, setLoggedSets] = useState<Record<string, SessionSet[]>>({})
  const [suggestions, setSuggestions] = useState<Record<string, SessionSet | undefined>>({})
  const [drafts, setDrafts] = useState<Record<string, { weight: string; reps: string }>>({})
  const [finishing, setFinishing] = useState(false)

  useEffect(() => {
    if (!sessionId || !profile) return
    let cancelled = false
    async function load() {
      const s = await getSession(sessionId!)
      if (cancelled) return
      setSession(s)

      let exList: ExerciseWithTarget[] = []
      if (s.program_day_id) {
        exList = await getProgramExercises(s.program_day_id)
      }
      if (cancelled) return
      setExercises(exList)

      const existingSets = await getSessionSets(sessionId!)
      const grouped: Record<string, SessionSet[]> = {}
      for (const set of existingSets) {
        grouped[set.exercise_id] = grouped[set.exercise_id] ?? []
        grouped[set.exercise_id].push(set)
      }
      if (cancelled) return
      setLoggedSets(grouped)

      const suggestionEntries = await Promise.all(
        exList.map(async (pe) => {
          const last = await getLastSetsForExercise(profile!.id, pe.exercise_id)
          const best = last.reduce<SessionSet | undefined>((acc, cur) => {
            if (!acc) return cur
            return (cur.weight_kg ?? 0) > (acc.weight_kg ?? 0) ? cur : acc
          }, undefined)
          return [pe.exercise_id, best] as const
        }),
      )
      if (cancelled) return
      setSuggestions(Object.fromEntries(suggestionEntries))
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [sessionId, profile])

  function updateDraft(exerciseId: string, patch: Partial<{ weight: string; reps: string }>) {
    setDrafts((prev) => {
      const current = prev[exerciseId] ?? { weight: '', reps: '' }
      return { ...prev, [exerciseId]: { ...current, ...patch } }
    })
  }

  async function handleAddSet(exerciseId: string) {
    if (!sessionId) return
    const draft = drafts[exerciseId] ?? { weight: '', reps: '' }
    const setNumber = (loggedSets[exerciseId]?.length ?? 0) + 1
    const weight = draft.weight ? Number(draft.weight) : null
    const reps = draft.reps ? Number(draft.reps) : null
    const created = await addSet({ sessionId, exerciseId, setNumber, weightKg: weight, reps, rpe: null })

    const best = suggestions[exerciseId]
    if (weight && (!best || weight > (best.weight_kg ?? 0))) {
      await markSetAsPr(created.id)
      created.is_pr = true
    }

    setLoggedSets((prev) => ({ ...prev, [exerciseId]: [...(prev[exerciseId] ?? []), created] }))
    updateDraft(exerciseId, { weight: '', reps: '' })
  }

  async function handleFinish() {
    if (!sessionId) return
    setFinishing(true)
    try {
      await finishSession(sessionId)
      navigate('/progress', { replace: true })
    } finally {
      setFinishing(false)
    }
  }

  if (loading || !session) return <Spinner />

  return (
    <div className="flex-1 px-4 py-6 overflow-y-auto space-y-4 pb-24">
      <PageTitle title="Séance en cours" subtitle={new Date(session.session_date).toLocaleDateString('fr-FR')} />

      {exercises.length === 0 && (
        <Card>
          <p className="text-sm text-slate-400">Aucun exercice programmé pour ce jour.</p>
        </Card>
      )}

      {exercises.map((pe) => {
        const sets = loggedSets[pe.exercise_id] ?? []
        const suggestion = suggestions[pe.exercise_id]
        const draft = drafts[pe.exercise_id] ?? { weight: '', reps: '' }
        return (
          <Card key={pe.id}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-slate-100">{pe.exercise.name}</h3>
              <span className="text-xs text-slate-500">
                {pe.target_sets} x {pe.target_reps_min}-{pe.target_reps_max}
              </span>
            </div>
            {suggestion && (
              <p className="text-xs text-slate-500 mb-2">
                Dernière fois : {suggestion.weight_kg ?? '?'}kg x {suggestion.reps ?? '?'}
              </p>
            )}

            {sets.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {sets.map((s) => (
                  <span
                    key={s.id}
                    className={`text-xs rounded-lg px-2 py-1 ${s.is_pr ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'}`}
                  >
                    {s.weight_kg ?? '—'}kg x {s.reps ?? '—'} {s.is_pr && '🏆'}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="number"
                inputMode="decimal"
                placeholder="kg"
                value={draft.weight}
                onChange={(e) => updateDraft(pe.exercise_id, { weight: e.target.value })}
                className="w-20 rounded-lg bg-slate-800/80 border border-slate-700 px-2 py-2 text-sm text-slate-100 outline-none focus:border-sky-500"
              />
              <input
                type="number"
                inputMode="numeric"
                placeholder="reps"
                value={draft.reps}
                onChange={(e) => updateDraft(pe.exercise_id, { reps: e.target.value })}
                className="w-20 rounded-lg bg-slate-800/80 border border-slate-700 px-2 py-2 text-sm text-slate-100 outline-none focus:border-sky-500"
              />
              <Button variant="secondary" className="flex-1 py-2 text-sm" onClick={() => handleAddSet(pe.exercise_id)}>
                + Série {sets.length + 1}
              </Button>
            </div>
          </Card>
        )
      })}

      <Button className="w-full" onClick={handleFinish} disabled={finishing}>
        {finishing ? 'Enregistrement…' : 'Terminer la séance'}
      </Button>
    </div>
  )
}
