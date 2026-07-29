import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getAllBestPerformances, listExercises, type BestPerformance } from '../lib/api'
import {
  computeExerciseRank,
  computeMuscleGroupRanks,
  getMuscleGroups,
  hasRankConfig,
  TIER_COLORS,
  TIER_ICONS,
  TIER_NAMES,
} from '../lib/ranks'
import { Card, PageTitle, Spinner } from '../components/ui'
import { RankBadge } from '../components/RankBadge'
import { MuscleIcon } from '../components/MuscleMap'
import { getConstanceData } from '../lib/constance'
import { computeUnlockedBadges, type UserStats } from '../lib/badges'
import type { Exercise } from '../types'

export function Ranks() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [bestValues, setBestValues] = useState<Record<string, BestPerformance>>({})
  const [stats, setStats] = useState<UserStats | null>(null)

  useEffect(() => {
    if (!profile) return
    let cancelled = false
    async function load() {
      const [ex, best, constance] = await Promise.all([
        listExercises(),
        getAllBestPerformances(profile!.id),
        getConstanceData(profile!),
      ])
      if (cancelled) return
      setExercises(ex)
      setBestValues(best)
      setStats(constance.stats)
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [profile])

  const rankableExercises = useMemo(() => exercises.filter((e) => hasRankConfig(e.name)), [exercises])

  const bestForRank = useMemo(() => {
    const map: Record<string, number | null> = {}
    for (const ex of rankableExercises) {
      const best = bestValues[ex.id]
      if (!best) {
        map[ex.id] = null
        continue
      }
      map[ex.id] = best.maxWeight ?? best.maxReps ?? null
    }
    return map
  }, [rankableExercises, bestValues])

  const groupRanks = useMemo(
    () => (profile ? computeMuscleGroupRanks(rankableExercises, bestForRank, profile.sex) : []),
    [rankableExercises, bestForRank, profile],
  )

  const overallTierIndex = groupRanks.length
    ? Math.round(groupRanks.reduce((sum, g) => sum + g.tierIndex, 0) / groupRanks.length)
    : 0
  const overallTierName = TIER_NAMES[overallTierIndex]

  const byGroup = useMemo(() => {
    const map = new Map<string, Exercise[]>()
    for (const ex of rankableExercises) {
      for (const group of getMuscleGroups(ex.muscle_group)) {
        const list = map.get(group) ?? []
        list.push(ex)
        map.set(group, list)
      }
    }
    return map
  }, [rankableExercises])

  if (!profile || loading) return <Spinner />

  return (
    <div className="flex-1 px-4 py-6 overflow-y-auto space-y-5">
      <PageTitle title="Rangs" subtitle="Ton niveau par exercice et par groupe musculaire" />

      {groupRanks.length > 0 && (
        <Card glow className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl"
            style={{ backgroundColor: `${TIER_COLORS[overallTierName]}22` }}
          >
            {TIER_ICONS[overallTierName]}
          </div>
          <div>
            <p className="text-xs text-slate-400">Rang général</p>
            <p className="text-lg font-semibold" style={{ color: TIER_COLORS[overallTierName] }}>
              {overallTierName}
            </p>
          </div>
        </Card>
      )}

      {groupRanks.length === 0 && (
        <Card>
          <p className="text-sm text-slate-400">
            Enregistre au moins une série sur un exercice pour débloquer tes premiers rangs.
          </p>
        </Card>
      )}

      {stats && (
        <Card>
          <h2 className="font-medium text-slate-100 mb-3">Badges</h2>
          <div className="grid grid-cols-4 gap-2">
            {computeUnlockedBadges(stats).map(({ badge, unlocked }) => (
              <div
                key={badge.id}
                title={badge.description}
                className={`flex flex-col items-center gap-1 rounded-xl px-1.5 py-2.5 text-center ${
                  unlocked ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-slate-800/40 border border-slate-800'
                }`}
              >
                <span className={`text-xl ${unlocked ? '' : 'grayscale opacity-30'}`}>{badge.icon}</span>
                <span className={`text-[10px] leading-tight ${unlocked ? 'text-amber-300' : 'text-slate-600'}`}>
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {Array.from(byGroup.entries()).map(([group, exList]) => {
        const groupRank = groupRanks.find((g) => g.muscleGroup === group)
        return (
          <Card key={group}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800">
                  <MuscleIcon muscleGroup={group} size={30} />
                </div>
                <h2 className="font-medium text-slate-100">{group}</h2>
              </div>
              {groupRank ? (
                <span className="text-sm font-medium" style={{ color: groupRank.color }}>
                  {groupRank.icon} {groupRank.tierName}
                </span>
              ) : (
                <span className="text-xs text-slate-500">—</span>
              )}
            </div>
            <div className="space-y-2">
              {exList.map((ex) => {
                const best = bestValues[ex.id]
                const value = best?.maxWeight ?? best?.maxReps ?? null
                const rank = computeExerciseRank(ex.name, profile.sex, value)
                return (
                  <button
                    key={ex.id}
                    onClick={() => navigate(`/exercise/${ex.id}`)}
                    className="w-full flex items-center justify-between rounded-xl bg-slate-800/60 px-3 py-2.5 text-left hover:bg-slate-800"
                  >
                    <span className="text-sm text-slate-200">{ex.name}</span>
                    <RankBadge rank={rank} size="sm" />
                  </button>
                )
              })}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
