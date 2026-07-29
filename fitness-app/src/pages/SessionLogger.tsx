import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  addSet,
  finishSession,
  getAllBestPerformances,
  getLastSetsForExercise,
  getPartnerProfile,
  getProgramExercises,
  getSession,
  getSessionSets,
  markSetAsPr,
  sendMessage,
  type BestPerformance,
} from '../lib/api'
import { computeExerciseRank, hasRankConfig } from '../lib/ranks'
import { RankBadge } from '../components/RankBadge'
import { MuscleIcon } from '../components/MuscleMap'
import { Button, Card, PageTitle, Spinner } from '../components/ui'
import type { Exercise, Profile, ProgramExercise, SessionSet, WorkoutSession } from '../types'

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
  const [bests, setBests] = useState<Record<string, BestPerformance>>({})
  const [partner, setPartner] = useState<Profile | null>(null)
  const [drafts, setDrafts] = useState<Record<string, { weight: string; reps: string }>>({})
  const [celebrating, setCelebrating] = useState<string | null>(null)
  const [finishing, setFinishing] = useState(false)

  useEffect(() => {
    if (!sessionId || !profile) return
    let cancelled = false
    async function load() {
      const [s, allBests, partnerProfile] = await Promise.all([
        getSession(sessionId!),
        getAllBestPerformances(profile!.id),
        getPartnerProfile(profile!),
      ])
      if (cancelled) return
      setSession(s)
      setBests(allBests)
      setPartner(partnerProfile)

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

  async function handleAddSet(pe: ExerciseWithTarget) {
    if (!sessionId || !profile) return
    const exerciseId = pe.exercise_id
    const draft = drafts[exerciseId] ?? { weight: '', reps: '' }
    const setNumber = (loggedSets[exerciseId]?.length ?? 0) + 1
    const weight = draft.weight ? Number(draft.weight) : null
    const reps = draft.reps ? Number(draft.reps) : null
    const created = await addSet({ sessionId, exerciseId, setNumber, weightKg: weight, reps, rpe: null })

    const oldBest = bests[exerciseId]?.maxWeight ?? null
    const isRecord = weight !== null && (oldBest === null || weight > oldBest)

    if (isRecord) {
      await markSetAsPr(created.id)
      created.is_pr = true
      setBests((prev) => ({ ...prev, [exerciseId]: { maxWeight: weight, maxReps: prev[exerciseId]?.maxReps ?? null } }))

      if (hasRankConfig(pe.exercise.name)) {
        const oldRank = computeExerciseRank(pe.exercise.name, profile.sex, oldBest)
        const newRank = computeExerciseRank(pe.exercise.name, profile.sex, weight)
        if (newRank && oldRank && newRank.tierIndex > oldRank.tierIndex) {
          setCelebrating(exerciseId)
          setTimeout(() => setCelebrating(null), 2800)
        }
      }

      if (partner && profile.couple_id) {
        sendMessage({
          coupleId: profile.couple_id,
          fromProfileId: profile.id,
          toProfileId: partner.id,
          kind: 'pr_cheer',
          body: `🏆 ${profile.display_name} vient de faire un nouveau record à ${pe.exercise.name} : ${weight}kg !`,
          relatedExerciseId: exerciseId,
        })
      }
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

  if (loading || !session || !profile) return <Spinner />

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
        const rank = hasRankConfig(pe.exercise.name)
          ? computeExerciseRank(pe.exercise.name, profile.sex, bests[pe.exercise_id]?.maxWeight ?? bests[pe.exercise_id]?.maxReps ?? null)
          : null
        return (
          <Card key={pe.id} className={celebrating === pe.exercise_id ? 'glow-pulse' : ''}>
            <div className="flex items-center justify-between mb-1 gap-2">
              <button
                onClick={() => navigate(`/exercise/${pe.exercise_id}`)}
                className="flex items-center gap-2 text-left min-w-0"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800">
                  <MuscleIcon muscleGroup={pe.exercise.muscle_group} size={30} />
                </span>
                <span className="font-medium text-slate-100 underline decoration-slate-700 underline-offset-2 truncate">
                  {pe.exercise.name}
                </span>
              </button>
              <div className="flex items-center gap-2 shrink-0">
                <RankBadge rank={rank} size="sm" />
                <span className="text-xs text-slate-500">
                  {pe.target_sets}x{pe.target_reps_min}-{pe.target_reps_max}
                </span>
              </div>
            </div>
            {celebrating === pe.exercise_id && (
              <p className="text-xs text-amber-300 mb-2">🎉 Rang supérieur débloqué !</p>
            )}
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
              <Button variant="secondary" className="flex-1 py-2 text-sm" onClick={() => handleAddSet(pe)}>
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
