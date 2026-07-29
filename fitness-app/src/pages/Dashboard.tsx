import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  getLatestWeight,
  getNextProgramDay,
  getPartnerProfile,
  getProgramExercises,
  getTodayHydrationTotal,
  getWeeklySessionCount,
  listPrograms,
  startSession,
} from '../lib/api'
import { computeHydrationTargetMl, computeNutritionTargets, getAge } from '../lib/nutrition'
import { suggestDailyMeals } from '../lib/meals'
import { getConstanceData, type ConstanceData } from '../lib/constance'
import { isDeloadWeek } from '../lib/progression'
import { Button, Card, EmptyState, PageTitle, ProgressRing, Spinner, StatPill } from '../components/ui'
import type { Location, Profile, Program, ProgramDay, ProgramExercise, Exercise } from '../types'

const GOAL_LABEL: Record<string, string> = {
  gain_muscle: 'Prise de muscle sèche',
  lose_fat_tone: 'Perte de gras & tonification',
  maintain: 'Maintien',
}

const COST_LABEL = ['€', '€€', '€€€']

export function Dashboard() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [weightKg, setWeightKg] = useState<number | null>(null)
  const [hydrationMl, setHydrationMl] = useState(0)
  const [myWeeklyCount, setMyWeeklyCount] = useState(0)
  const [partner, setPartner] = useState<Profile | null>(null)
  const [partnerWeeklyCount, setPartnerWeeklyCount] = useState(0)

  const [locationChoice, setLocationChoice] = useState<Location>('gym')
  const [programsByLocation, setProgramsByLocation] = useState<Record<Location, Program[]>>({ gym: [], home: [] })
  const [coachLoading, setCoachLoading] = useState(true)
  const [nextDay, setNextDay] = useState<ProgramDay | null>(null)
  const [nextDayExercises, setNextDayExercises] = useState<(ProgramExercise & { exercise: Exercise })[]>([])
  const [starting, setStarting] = useState(false)

  const [mealSeed, setMealSeed] = useState(0)
  const [constance, setConstance] = useState<ConstanceData | null>(null)

  useEffect(() => {
    if (!profile) return
    let cancelled = false
    async function load() {
      const [w, hydration, weekly, partnerProfile, programs, constanceData] = await Promise.all([
        getLatestWeight(profile!.id),
        getTodayHydrationTotal(profile!.id),
        getWeeklySessionCount(profile!.id),
        getPartnerProfile(profile!),
        listPrograms(profile!.id),
        getConstanceData(profile!),
      ])
      if (cancelled) return
      setWeightKg(w?.weight_kg ?? null)
      setHydrationMl(hydration)
      setMyWeeklyCount(weekly)
      setPartner(partnerProfile)
      setConstance(constanceData)
      const byLocation: Record<Location, Program[]> = {
        gym: programs.filter((p) => p.location === 'gym'),
        home: programs.filter((p) => p.location === 'home'),
      }
      setProgramsByLocation(byLocation)
      setLocationChoice(byLocation.gym.length > 0 || byLocation.home.length === 0 ? 'gym' : 'home')
      if (partnerProfile) {
        const pWeekly = await getWeeklySessionCount(partnerProfile.id)
        if (!cancelled) setPartnerWeeklyCount(pWeekly)
      }
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [profile])

  useEffect(() => {
    if (!profile || loading) return
    let cancelled = false
    async function loadCoach() {
      setCoachLoading(true)
      const program = programsByLocation[locationChoice][0]
      if (!program) {
        if (!cancelled) {
          setNextDay(null)
          setNextDayExercises([])
          setCoachLoading(false)
        }
        return
      }
      const day = await getNextProgramDay(profile!.id, program)
      if (cancelled) return
      setNextDay(day)
      if (day) {
        const ex = await getProgramExercises(day.id)
        if (!cancelled) setNextDayExercises(ex)
      } else {
        setNextDayExercises([])
      }
      setCoachLoading(false)
    }
    loadCoach()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, loading, locationChoice, programsByLocation])

  async function handleStartSuggested() {
    if (!profile || !nextDay) return
    setStarting(true)
    try {
      const session = await startSession(profile.id, nextDay.id, locationChoice)
      navigate(`/session/${session.id}`)
    } finally {
      setStarting(false)
    }
  }

  if (!profile || loading) return <Spinner />

  const effectiveWeight = weightKg ?? profile.target_weight_kg ?? 70
  const nutrition =
    profile.height_cm && weightKg
      ? computeNutritionTargets({
          sex: profile.sex,
          weightKg,
          heightCm: profile.height_cm,
          age: getAge(profile.birth_date),
          activity: profile.activity_level,
          goal: profile.goal,
        })
      : null
  const hydrationTarget = computeHydrationTargetMl(effectiveWeight, true)
  const meals = nutrition ? suggestDailyMeals(nutrition, profile.goal, mealSeed, profile.takes_protein_shake) : null
  const hasAnyProgram = programsByLocation.gym.length > 0 || programsByLocation.home.length > 0

  return (
    <div className="flex-1 px-4 py-6 overflow-y-auto space-y-5">
      <PageTitle title={`Salut ${profile.display_name} 👋`} subtitle={GOAL_LABEL[profile.goal]} />

      <div className="flex gap-2">
        <StatPill label="Poids actuel" value={weightKg ? `${weightKg} kg` : '—'} accent="sky" />
        <StatPill label="Objectif" value={profile.target_weight_kg ? `${profile.target_weight_kg} kg` : '—'} accent="emerald" />
        <StatPill label="Séances 7j" value={`${myWeeklyCount}/${profile.training_days_per_week}`} accent="amber" />
      </div>

      {constance && (constance.weekly.currentStreakWeeks > 0 || constance.daily.currentStreakDays > 0) && (
        <Card className="flex gap-3">
          <div className="flex-1 flex items-center gap-2.5">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-lg font-bold text-amber-400 leading-tight">
                {constance.weekly.currentStreakWeeks} sem.
              </p>
              <p className="text-[11px] text-slate-400">de constance</p>
            </div>
          </div>
          <div className="w-px bg-slate-800" />
          <div className="flex-1 flex items-center gap-2.5">
            <span className="text-2xl">💧</span>
            <div>
              <p className="text-lg font-bold text-sky-400 leading-tight">{constance.daily.currentStreakDays} j.</p>
              <p className="text-[11px] text-slate-400">bien hydraté(e)</p>
            </div>
          </div>
        </Card>
      )}

      {nutrition ? (
        <Card>
          <h2 className="text-sm font-medium text-slate-300 mb-3">Objectif du jour</h2>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <div className="text-lg font-semibold text-sky-400">{nutrition.calories}</div>
              <div className="text-[11px] text-slate-400">kcal</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-emerald-400">{nutrition.protein_g}g</div>
              <div className="text-[11px] text-slate-400">protéines</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-amber-400">{nutrition.carbs_g}g</div>
              <div className="text-[11px] text-slate-400">glucides</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-fuchsia-400">{nutrition.fat_g}g</div>
              <div className="text-[11px] text-slate-400">lipides</div>
            </div>
          </div>
          {profile.goal === 'lose_fat_tone' && (
            <p className="text-xs text-slate-500 mt-3">
              Repère indicatif, pas besoin de peser chaque gramme : vise les protéines en priorité, le reste peut rester flexible.
            </p>
          )}
        </Card>
      ) : (
        <Card>
          <p className="text-sm text-slate-400">
            Renseigne ta taille et ton poids dans <Link to="/settings" className="text-sky-400 underline">Réglages</Link> pour calculer tes objectifs caloriques.
          </p>
        </Card>
      )}

      {meals && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-slate-300">Repas suggérés du jour</h2>
            <button
              onClick={() => setMealSeed((s) => s + 1)}
              className="text-xs text-sky-400 underline underline-offset-2"
            >
              🔄 changer
            </button>
          </div>
          <div className="space-y-2.5">
            {meals.map((m) => (
              <div key={m.slot} className="rounded-xl bg-slate-800/60 px-3 py-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">{m.slotLabel}</p>
                    <p className="text-sm font-medium text-slate-100">{m.meal.name}</p>
                  </div>
                  <span className="text-xs text-emerald-400 shrink-0">{COST_LABEL[m.meal.costTier - 1]}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{m.meal.ingredients.join(' · ')}</p>
                <p className="text-xs text-slate-500 mt-1">{m.meal.instructions}</p>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  {m.meal.calories} kcal · {m.meal.protein_g}g P · {m.meal.carbs_g}g G · {m.meal.fat_g}g L
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card glow className="flex items-center gap-4">
        <ProgressRing value={hydrationMl} max={hydrationTarget} label="hydratation" />
        <div className="flex-1">
          <p className="text-sm text-slate-300">
            {(hydrationMl / 1000).toFixed(1)} L / {(hydrationTarget / 1000).toFixed(1)} L
          </p>
          <Link to="/hydration" className="text-sm text-sky-400 underline mt-1 inline-block">
            Ajouter de l'eau →
          </Link>
        </div>
      </Card>

      {constance && isDeloadWeek(constance.weekly.currentStreakWeeks) && (
        <Card className="border border-amber-500/40 bg-amber-500/5">
          <p className="text-sm text-amber-300 font-medium">🪫 Semaine de décharge conseillée</p>
          <p className="text-xs text-slate-400 mt-1">
            {constance.weekly.currentStreakWeeks} semaines d'affilée à l'objectif : réduis un peu cette semaine
            (garde le même geste mais ~60-70% des charges, ou 1-2 séries en moins par exercice) pour récupérer et
            repartir plus fort ensuite. C'est normal et ça fait partie de la progression.
          </p>
        </Card>
      )}

      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium text-slate-100">Séance du jour</h2>
          <div className="flex rounded-lg bg-slate-800 p-0.5 text-xs">
            <button
              onClick={() => setLocationChoice('home')}
              className={`px-2.5 py-1 rounded-md transition ${locationChoice === 'home' ? 'bg-gradient-to-r from-sky-400 to-indigo-500 text-slate-950 font-medium shadow-sm' : 'text-slate-400'}`}
            >
              🏠 Maison
            </button>
            <button
              onClick={() => setLocationChoice('gym')}
              className={`px-2.5 py-1 rounded-md transition ${locationChoice === 'gym' ? 'bg-gradient-to-r from-sky-400 to-indigo-500 text-slate-950 font-medium shadow-sm' : 'text-slate-400'}`}
            >
              🏋️ Salle
            </button>
          </div>
        </div>

        {coachLoading ? (
          <Spinner />
        ) : !hasAnyProgram ? (
          <EmptyState>
            Ajoute un programme dans <Link to="/workouts" className="text-sky-400 underline">Entraînement</Link> pour que ton coach te propose une séance.
          </EmptyState>
        ) : !nextDay ? (
          <EmptyState>
            Pas de programme {locationChoice === 'home' ? 'maison' : 'salle'} actif. Ajoute-en un dans{' '}
            <Link to="/workouts" className="text-sky-400 underline">Entraînement</Link>.
          </EmptyState>
        ) : (
          <>
            <p className="text-sm text-slate-300 mb-2">{nextDay.day_label}</p>
            <p className="text-xs text-slate-500 mb-3">{nextDayExercises.map((e) => e.exercise.name).join(' · ')}</p>
            <Button className="w-full" onClick={handleStartSuggested} disabled={starting}>
              {starting ? 'Démarrage…' : 'Démarrer cette séance'}
            </Button>
          </>
        )}
      </Card>

      {partner && (
        <Card>
          <h2 className="text-sm font-medium text-slate-300 mb-2">{partner.display_name}</h2>
          <p className="text-sm text-slate-400">
            {partnerWeeklyCount} séance{partnerWeeklyCount > 1 ? 's' : ''} cette semaine
            {partner.training_days_per_week ? ` / ${partner.training_days_per_week} visées` : ''}
          </p>
          <Link to="/couple" className="text-sm text-sky-400 underline mt-1 inline-block">
            Voir le détail →
          </Link>
        </Card>
      )}
    </div>
  )
}
