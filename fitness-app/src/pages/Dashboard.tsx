import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  getLatestWeight,
  getPartnerProfile,
  getTodayHydrationTotal,
  getWeeklySessionCount,
} from '../lib/api'
import { computeHydrationTargetMl, computeNutritionTargets, getAge } from '../lib/nutrition'
import { Card, PageTitle, ProgressRing, Spinner, StatPill } from '../components/ui'
import type { Profile } from '../types'

const GOAL_LABEL: Record<string, string> = {
  gain_muscle: 'Prise de muscle sèche',
  lose_fat_tone: 'Perte de gras & tonification',
  maintain: 'Maintien',
}

export function Dashboard() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [weightKg, setWeightKg] = useState<number | null>(null)
  const [hydrationMl, setHydrationMl] = useState(0)
  const [myWeeklyCount, setMyWeeklyCount] = useState(0)
  const [partner, setPartner] = useState<Profile | null>(null)
  const [partnerWeeklyCount, setPartnerWeeklyCount] = useState(0)

  useEffect(() => {
    if (!profile) return
    let cancelled = false
    async function load() {
      const [w, hydration, weekly, partnerProfile] = await Promise.all([
        getLatestWeight(profile!.id),
        getTodayHydrationTotal(profile!.id),
        getWeeklySessionCount(profile!.id),
        getPartnerProfile(profile!),
      ])
      if (cancelled) return
      setWeightKg(w?.weight_kg ?? null)
      setHydrationMl(hydration)
      setMyWeeklyCount(weekly)
      setPartner(partnerProfile)
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

  return (
    <div className="flex-1 px-4 py-6 overflow-y-auto space-y-5">
      <PageTitle title={`Salut ${profile.display_name} 👋`} subtitle={GOAL_LABEL[profile.goal]} />

      <div className="flex gap-2">
        <StatPill label="Poids actuel" value={weightKg ? `${weightKg} kg` : '—'} accent="sky" />
        <StatPill label="Objectif" value={profile.target_weight_kg ? `${profile.target_weight_kg} kg` : '—'} accent="emerald" />
        <StatPill label="Séances 7j" value={`${myWeeklyCount}/${profile.training_days_per_week}`} accent="amber" />
      </div>

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

      <Card className="flex items-center gap-4">
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

      <Link to="/workouts">
        <Card className="flex items-center justify-between hover:border-sky-600 transition">
          <div>
            <h2 className="font-medium text-slate-100">Séance du jour</h2>
            <p className="text-sm text-slate-400">Choisir un programme et démarrer</p>
          </div>
          <span className="text-2xl">🏋️</span>
        </Card>
      </Link>

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
