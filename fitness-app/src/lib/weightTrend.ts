import type { Goal } from '../types'

export interface WeightTrend {
  recentAvgKg: number | null
  priorAvgKg: number | null
  /** Variation estimée par semaine (moyenne des 7 derniers jours - moyenne des 7 jours d'avant). */
  weeklyRateKg: number | null
}

/**
 * Moyennes glissantes sur 7 jours (plutôt que pesée du jour vs pesée d'il y a
 * une semaine) pour lisser les fluctuations d'eau/digestion et estimer une
 * vraie tendance. Nécessite au moins une pesée dans chacune des deux fenêtres.
 */
export function computeWeightTrend(
  logs: { logged_date: string; weight_kg: number }[],
  today = new Date(),
): WeightTrend {
  const recentCutoff = new Date(today)
  recentCutoff.setDate(recentCutoff.getDate() - 7)
  const priorCutoff = new Date(today)
  priorCutoff.setDate(priorCutoff.getDate() - 14)

  const recent = logs.filter((l) => new Date(l.logged_date) > recentCutoff)
  const prior = logs.filter((l) => new Date(l.logged_date) > priorCutoff && new Date(l.logged_date) <= recentCutoff)

  const avg = (arr: typeof logs) => (arr.length ? arr.reduce((sum, l) => sum + l.weight_kg, 0) / arr.length : null)
  const recentAvgKg = avg(recent)
  const priorAvgKg = avg(prior)
  const weeklyRateKg = recentAvgKg !== null && priorAvgKg !== null ? recentAvgKg - priorAvgKg : null

  return { recentAvgKg, priorAvgKg, weeklyRateKg }
}

export interface CalorieAdjustmentSuggestion {
  deltaKcal: number
  note: string
}

/**
 * Un coach ajuste les calories selon ce qui se passe réellement plutôt que de
 * se fier indéfiniment à une formule de départ. Cibles usuelles : ~0.15-0.35
 * kg/semaine en prise de masse sèche (lean bulk), ~0.3-0.7% du poids de corps
 * par semaine en perte de gras. En dehors de ces fourchettes, propose un
 * ajustement de 150 kcal/jour dans le bon sens.
 */
export function suggestCalorieAdjustment(
  goal: Goal,
  weeklyRateKg: number | null,
  weightKg: number,
): CalorieAdjustmentSuggestion | null {
  if (weeklyRateKg === null) return null

  if (goal === 'gain_muscle') {
    if (weeklyRateKg < 0.05) {
      return {
        deltaKcal: 150,
        note: `Ton poids stagne (${weeklyRateKg >= 0 ? '+' : ''}${weeklyRateKg.toFixed(2)}kg/sem en moyenne) : +150 kcal/jour pour relancer la prise de muscle.`,
      }
    }
    if (weeklyRateKg > 0.5) {
      return {
        deltaKcal: -150,
        note: `Tu prends vite (+${weeklyRateKg.toFixed(2)}kg/sem) : -150 kcal/jour pour rester le plus sec possible.`,
      }
    }
    return null
  }

  if (goal === 'lose_fat_tone') {
    const weeklyPct = weeklyRateKg / weightKg
    if (weeklyPct > -0.003) {
      return {
        deltaKcal: -150,
        note: 'Le poids ne baisse plus vraiment ces 2 dernières semaines : -150 kcal/jour pour relancer la perte.',
      }
    }
    if (weeklyPct < -0.01) {
      return {
        deltaKcal: 150,
        note: `Tu perds vite (${weeklyRateKg.toFixed(2)}kg/sem) : +150 kcal/jour pour préserver le muscle.`,
      }
    }
    return null
  }

  return null
}
