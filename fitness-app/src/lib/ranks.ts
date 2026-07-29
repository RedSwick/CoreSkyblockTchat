import type { Sex } from '../types'

// Inspiré des systèmes de rangs type League of Legends / Valorant : des paliers
// principaux, chacun divisé en 3 divisions (sauf les paliers "apex" du haut,
// comme Master/Grandmaster/Challenger dans ces jeux, qui sont continus).
export const TIER_NAMES = [
  'Bronze',
  'Argent',
  'Or',
  'Platine',
  'Émeraude',
  'Diamant',
  'Maître',
  'Grand Maître',
  'Challenger',
] as const
export type TierName = (typeof TIER_NAMES)[number]

/** Index (0-based) du premier palier "apex" sans division (Maître). */
const APEX_START_INDEX = 6

export const TIER_COLORS: Record<TierName, string> = {
  Bronze: '#b45309',
  Argent: '#94a3b8',
  Or: '#eab308',
  Platine: '#22d3ee',
  Émeraude: '#10b981',
  Diamant: '#60a5fa',
  Maître: '#a78bfa',
  'Grand Maître': '#d946ef',
  Challenger: '#f97316',
}

export const TIER_ICONS: Record<TierName, string> = {
  Bronze: '🥉',
  Argent: '🥈',
  Or: '🥇',
  Platine: '🔷',
  Émeraude: '💚',
  Diamant: '💎',
  Maître: '🔮',
  'Grand Maître': '🌟',
  Challenger: '👑',
}

type Metric = 'weight' | 'reps' | 'seconds'

interface ExerciseRankConfig {
  metric: Metric
  /** unité affichée (kg, reps, sec) */
  unit: string
  /**
   * 4 seuils croissants, utilisés comme points d'ancrage pour dériver les 9
   * paliers (avec divisions) ci-dessous — voir `buildFineBoundaries`.
   * Historiquement ces 4 valeurs marquaient Argent / Or / Diamant / Légende ;
   * elles servent maintenant de base à un système plus fin.
   */
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

/**
 * Construit les 21 bornes fines (Bronze 1/2/3 → ... → Diamant 3, puis Maître,
 * Grand Maître, Challenger sans division) à partir des 4 seuils d'ancrage.
 * Chacun des 4 anciens intervalles est subdivisé en 2, donnant 8 seuils de
 * palier ; les 6 premiers paliers sont ensuite chacun coupés en 3 divisions.
 */
function buildFineBoundaries(anchors: [number, number, number, number]): number[] {
  const [t1, t2, t3, t4] = anchors
  const tierStarts = [
    0,
    t1 / 2,
    t1,
    t1 + (t2 - t1) / 2,
    t2,
    t2 + (t3 - t2) / 2,
    t3,
    t3 + (t4 - t3) / 2,
    t4,
  ]

  const fine: number[] = []
  for (let i = 0; i < TIER_NAMES.length; i++) {
    const lo = tierStarts[i]
    if (i < APEX_START_INDEX) {
      const hi = tierStarts[i + 1]
      const width = hi - lo
      fine.push(lo, lo + width / 3, lo + (2 * width) / 3)
    } else {
      fine.push(lo)
    }
  }
  return fine
}

export interface RankResult {
  tierIndex: number
  tierName: TierName
  /** 1-3 pour Bronze→Diamant, absent pour Maître/Grand Maître/Challenger */
  division: number | null
  /** "Or 2", ou juste "Challenger" pour les paliers apex */
  label: string
  color: string
  icon: string
  value: number | null
  metric: Metric
  unit: string
  nextThreshold: number | null
  progressPct: number
}

function buildResult(config: ExerciseRankConfig, fineIndex: number, value: number | null, fine: number[]): RankResult {
  const tierIndex = fineIndex < APEX_START_INDEX * 3 ? Math.floor(fineIndex / 3) : APEX_START_INDEX + (fineIndex - APEX_START_INDEX * 3)
  const division = tierIndex < APEX_START_INDEX ? (fineIndex % 3) + 1 : null
  const tierName = TIER_NAMES[tierIndex]
  const label = division ? `${tierName} ${division}` : tierName

  const lo = fine[fineIndex]
  const nextThreshold = fineIndex < fine.length - 1 ? fine[fineIndex + 1] : null
  const progressPct =
    nextThreshold !== null && value !== null
      ? Math.min(100, Math.max(0, Math.round(((value - lo) / (nextThreshold - lo)) * 100)))
      : value !== null
        ? 100
        : 0

  return {
    tierIndex,
    tierName,
    division,
    label,
    color: TIER_COLORS[tierName],
    icon: TIER_ICONS[tierName],
    value,
    metric: config.metric,
    unit: config.unit,
    nextThreshold,
    progressPct,
  }
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
  const anchors = sex === 'female' ? config.female : config.male
  const fine = buildFineBoundaries(anchors)

  if (value === null || value <= 0) {
    return buildResult(config, 0, null, fine)
  }

  let fineIndex = 0
  for (let i = 0; i < fine.length; i++) {
    if (value >= fine[i]) fineIndex = i
  }

  return buildResult(config, fineIndex, value, fine)
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
