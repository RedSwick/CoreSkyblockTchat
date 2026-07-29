import type { ActivityLevel, Goal, NutritionTarget, Sex } from '../types'

const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

export function getAge(birthDate: string | null): number {
  if (!birthDate) return 25
  const b = new Date(birthDate)
  const diff = Date.now() - b.getTime()
  return Math.max(15, Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)))
}

/** Mifflin-St Jeor : dépense énergétique de base (BMR) */
function bmr(sex: Sex | null, weightKg: number, heightCm: number, age: number): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return sex === 'female' ? base - 161 : base + 5
}

export function tdee(
  sex: Sex | null,
  weightKg: number,
  heightCm: number,
  age: number,
  activity: ActivityLevel,
): number {
  return bmr(sex, weightKg, heightCm, age) * ACTIVITY_MULTIPLIER[activity]
}

/**
 * Calcule les objectifs caloriques/macros du jour.
 * - gain_muscle : surplus FIXE de +300 kcal/jour (pas un pourcentage du TDEE) +
 *   protéines hautes pour prise de masse la plus sèche possible. La littérature
 *   (lean bulk) converge sur ~250-350 kcal/jour de surplus quel que soit le niveau
 *   d'activité : au-delà, le surplus part surtout en graisse plutôt qu'en muscle.
 *   Un pourcentage du TDEE ferait exploser le surplus pour quelqu'un de "très
 *   actif" (ex. +12% sur ~3300 kcal = +400, mais sur un TDEE encore plus haut ça
 *   grimpe vite bien au-delà de ce qui est utile), donc on fixe la valeur absolue.
 * - lose_fat_tone : déficit modéré (-15%) mais protéines suffisantes pour
 *   préserver le muscle en se tonifiant, reste flexible (pas de suivi strict imposé).
 * - maintain : TDEE tel quel.
 */
export function computeNutritionTargets(params: {
  sex: Sex | null
  weightKg: number
  heightCm: number
  age: number
  activity: ActivityLevel
  goal: Goal
}): NutritionTarget {
  const { sex, weightKg, heightCm, age, activity, goal } = params
  const maintenance = tdee(sex, weightKg, heightCm, age, activity)

  let calories: number
  let proteinPerKg: number
  let fatPerKg: number

  switch (goal) {
    case 'gain_muscle':
      calories = maintenance + 300
      proteinPerKg = 2.2
      fatPerKg = 0.9
      break
    case 'lose_fat_tone':
      calories = maintenance * 0.85
      proteinPerKg = 1.8
      fatPerKg = 0.8
      break
    default:
      calories = maintenance
      proteinPerKg = 1.8
      fatPerKg = 0.9
  }

  const protein_g = Math.round(proteinPerKg * weightKg)
  const fat_g = Math.round(fatPerKg * weightKg)
  const remaining = calories - (protein_g * 4 + fat_g * 9)
  const carbs_g = Math.max(0, Math.round(remaining / 4))

  return {
    calories: Math.round(calories),
    protein_g,
    carbs_g,
    fat_g,
  }
}

/** Objectif d'hydratation quotidien (ml), plus élevé les jours d'entraînement.
 *  Boire suffisamment aide à réduire la rétention d'eau (le corps retient
 *  moins l'eau quand l'apport est régulier), donc l'objectif reste volontairement
 *  généreux même en cas de rétention d'eau. */
export function computeHydrationTargetMl(weightKg: number, isTrainingDay: boolean): number {
  const base = weightKg * 35
  return Math.round((base + (isTrainingDay ? 500 : 0)) / 50) * 50
}
