import type { Sex } from '../types'

export const TIER_NAMES = ['Bronze', 'Argent', 'Or', 'Diamant', 'Légende'] as const
export type TierName = (typeof TIER_NAMES)[number]

export const TIER_COLORS: Record<TierName, string> = {
  Bronze: '#b45309',
  Argent: '#94a3b8',
  Or: '#eab308',
  Diamant: '#38bdf8',
  Légende: '#e879f9',
}

export const TIER_ICONS: Record<TierName, string> = {
  Bronze: '🥉',
  Argent: '🥈',
  Or: '🥇',
  Diamant: '💎',
  Légende: '👑',
}

type Metric = 'weight' | 'reps' | 'seconds'

interface ExerciseRankConfig {
  metric: Metric
  /** unité affichée (kg, reps, sec) */
  unit: string
  /** 4 seuils croissants = bornes basses de Argent / Or / Diamant / Légende */
  male: [number, number, number, number]
  female: [number, number, number, number]
}

/**
 * Seuils indicatifs pour un pratiquant loisir à intermédiaire (pas des standards
 * de compétition). Ajustables librement ici. Pour les mouvements aux haltères,
 * le seuil correspond au poids d'UN haltère (pas la somme des deux).
 */
export const RANK_CONFIG: Record<string, ExerciseRankConfig> = {
  'Développé couché barre': { metric: 'weight', unit: 'kg', male: [60, 100, 120, 140], female: [25, 40, 55, 70] },
  'Développé couché haltères': { metric: 'weight', unit: 'kg', male: [20, 32, 40, 48], female: [8, 14, 18, 24] },
  'Développé incliné haltères': { metric: 'weight', unit: 'kg', male: [18, 28, 36, 44], female: [7, 12, 16, 20] },
  Dips: { metric: 'reps', unit: 'reps', male: [5, 12, 20, 28], female: [2, 6, 10, 15] },
  'Tractions pronation': { metric: 'reps', unit: 'reps', male: [3, 8, 14, 20], female: [1, 3, 6, 10] },
  'Tractions supination': { metric: 'reps', unit: 'reps', male: [4, 9, 15, 22], female: [1, 4, 7, 11] },
  'Rowing barre': { metric: 'weight', unit: 'kg', male: [40, 65, 85, 105], female: [15, 25, 35, 45] },
  'Tirage vertical poulie': { metric: 'weight', unit: 'kg', male: [35, 55, 70, 90], female: [15, 25, 35, 45] },
  'Tirage horizontal poulie': { metric: 'weight', unit: 'kg', male: [35, 55, 70, 90], female: [15, 25, 35, 45] },
  'Soulevé de terre': { metric: 'weight', unit: 'kg', male: [70, 110, 140, 170], female: [30, 50, 70, 90] },
  'Développé militaire barre': { metric: 'weight', unit: 'kg', male: [30, 50, 65, 80], female: [12, 20, 28, 35] },
  'Développé militaire haltères': { metric: 'weight', unit: 'kg', male: [12, 20, 26, 32], female: [5, 9, 12, 16] },
  'Élévations latérales': { metric: 'weight', unit: 'kg', male: [8, 12, 16, 22], female: [3, 5, 7, 10] },
  'Curl biceps barre': { metric: 'weight', unit: 'kg', male: [20, 35, 45, 55], female: [8, 14, 18, 24] },
  'Curl biceps haltères': { metric: 'weight', unit: 'kg', male: [10, 16, 20, 26], female: [4, 7, 10, 14] },
  'Curl marteau': { metric: 'weight', unit: 'kg', male: [10, 16, 20, 26], female: [4, 7, 10, 14] },
  'Extension triceps poulie': { metric: 'weight', unit: 'kg', male: [15, 25, 35, 45], female: [6, 10, 15, 20] },
  'Squat barre': { metric: 'weight', unit: 'kg', male: [60, 100, 120, 150], female: [25, 45, 65, 85] },
  'Squat gobelet haltère': { metric: 'weight', unit: 'kg', male: [16, 24, 32, 40], female: [8, 14, 18, 24] },
  'Presse à cuisses': { metric: 'weight', unit: 'kg', male: [100, 160, 220, 280], female: [50, 90, 130, 170] },
  'Hip thrust': { metric: 'weight', unit: 'kg', male: [40, 80, 120, 160], female: [30, 60, 90, 120] },
  'Leg curl allongé': { metric: 'weight', unit: 'kg', male: [20, 35, 50, 65], female: [10, 18, 26, 34] },
  'Extension mollets debout': { metric: 'weight', unit: 'kg', male: [40, 70, 100, 130], female: [20, 35, 50, 65] },
  Pompes: { metric: 'reps', unit: 'reps', male: [15, 30, 45, 60], female: [8, 18, 28, 40] },
  'Pompes lestées': { metric: 'weight', unit: 'kg', male: [5, 15, 25, 35], female: [2, 8, 14, 20] },
  'Gainage planche': { metric: 'seconds', unit: 'sec', male: [30, 60, 90, 120], female: [30, 60, 90, 120] },
}

export interface RankResult {
  tierIndex: number
  tierName: TierName
  color: string
  icon: string
  value: number | null
  metric: Metric
  unit: string
  nextThreshold: number | null
  progressPct: number
}

export function hasRankConfig(exerciseName: string): boolean {
  return exerciseName in RANK_CONFIG
}

export function getExerciseMetric(exerciseName: string): Metric | null {
  return RANK_CONFIG[exerciseName]?.metric ?? null
}

export function computeExerciseRank(exerciseName: string, sex: Sex | null, value: number | null): RankResult | null {
  const config = RANK_CONFIG[exerciseName]
  if (!config) return null
  const thresholds = sex === 'female' ? config.female : config.male

  if (value === null || value <= 0) {
    return {
      tierIndex: 0,
      tierName: TIER_NAMES[0],
      color: TIER_COLORS[TIER_NAMES[0]],
      icon: TIER_ICONS[TIER_NAMES[0]],
      value: null,
      metric: config.metric,
      unit: config.unit,
      nextThreshold: thresholds[0],
      progressPct: 0,
    }
  }

  let tierIndex = 0
  for (let i = 0; i < thresholds.length; i++) {
    if (value >= thresholds[i]) tierIndex = i + 1
  }

  const tierName = TIER_NAMES[tierIndex]
  const prevThreshold = tierIndex === 0 ? 0 : thresholds[tierIndex - 1]
  const nextThreshold = tierIndex < thresholds.length ? thresholds[tierIndex] : null
  const progressPct = nextThreshold
    ? Math.min(100, Math.round(((value - prevThreshold) / (nextThreshold - prevThreshold)) * 100))
    : 100

  return {
    tierIndex,
    tierName,
    color: TIER_COLORS[tierName],
    icon: TIER_ICONS[tierName],
    value,
    metric: config.metric,
    unit: config.unit,
    nextThreshold,
    progressPct,
  }
}

export function getMuscleGroups(muscleGroup: string): string[] {
  return muscleGroup.split(' / ').map((s) => s.trim())
}

export interface MuscleGroupRank {
  muscleGroup: string
  tierIndex: number
  tierName: TierName
  color: string
  icon: string
  exerciseCount: number
}

export function computeMuscleGroupRanks(
  exercises: { id: string; name: string; muscle_group: string }[],
  bestValues: Record<string, number | null>,
  sex: Sex | null,
): MuscleGroupRank[] {
  const byGroup = new Map<string, number[]>()

  for (const ex of exercises) {
    if (!hasRankConfig(ex.name)) continue
    const best = bestValues[ex.id]
    if (best === undefined || best === null) continue
    const rank = computeExerciseRank(ex.name, sex, best)
    if (!rank) continue
    for (const group of getMuscleGroups(ex.muscle_group)) {
      const list = byGroup.get(group) ?? []
      list.push(rank.tierIndex)
      byGroup.set(group, list)
    }
  }

  return Array.from(byGroup.entries())
    .map(([muscleGroup, tierIndices]) => {
      const avg = tierIndices.reduce((a, b) => a + b, 0) / tierIndices.length
      const tierIndex = Math.round(avg)
      const tierName = TIER_NAMES[tierIndex]
      return {
        muscleGroup,
        tierIndex,
        tierName,
        color: TIER_COLORS[tierName],
        icon: TIER_ICONS[tierName],
        exerciseCount: tierIndices.length,
      }
    })
    .sort((a, b) => b.tierIndex - a.tierIndex)
}
