export type Effort = 'easy' | 'hard' | 'failure'

/** RPE approximatif associé à chaque ressenti, sur l'échelle 0-10 classique. */
export const EFFORT_RPE: Record<Effort, number> = { easy: 7, hard: 9, failure: 10 }

export const EFFORT_LABEL: Record<Effort, string> = {
  easy: '😌 Facile',
  hard: '💪 Dur',
  failure: '🔥 Échec',
}

export interface ProgressionSuggestion {
  weightKg: number | null
  reps: number | null
  note: string
}

function loadStep(weightKg: number): number {
  if (weightKg >= 40) return 2.5
  if (weightKg >= 15) return 1.25
  return 0.5
}

/**
 * Double progression, RIR-aware : la recherche montre que s'arrêter 1-2 reps
 * avant l'échec sur la plupart des séries donne une hypertrophie égale ou
 * meilleure qu'aller à l'échec systématiquement, avec moins de fatigue
 * (meilleur ratio stimulus/fatigue). Donc :
 * - dernière fois à l'échec (rpe 10) -> on ne monte pas, la charge était déjà
 *   suffisante, inutile de forcer plus.
 * - dernière fois pas à l'échec et haut de la fourchette de reps atteint ->
 *   on monte le poids et on repart en bas de fourchette.
 * - sinon -> on vise une rep de plus à la même charge avant de monter le poids.
 */
export function suggestProgression(params: {
  lastWeightKg: number | null
  lastReps: number | null
  lastRpe: number | null
  repsMin: number
  repsMax: number
}): ProgressionSuggestion {
  const { lastWeightKg, lastReps, lastRpe, repsMin, repsMax } = params

  if (lastWeightKg === null || lastReps === null) {
    return {
      weightKg: lastWeightKg,
      reps: repsMin,
      note: 'Première fois : choisis une charge qui te laisse 1-2 reps en réserve.',
    }
  }

  if (lastRpe !== null && lastRpe >= 10) {
    return {
      weightKg: lastWeightKg,
      reps: Math.max(repsMin, lastReps),
      note: `Tu étais à l'échec la dernière fois : reste à ${lastWeightKg}kg, pas besoin de forcer plus.`,
    }
  }

  if (lastReps >= repsMax) {
    const nextWeight = Math.round((lastWeightKg + loadStep(lastWeightKg)) * 100) / 100
    return {
      weightKg: nextWeight,
      reps: repsMin,
      note: `${repsMax} reps atteintes : monte à ${nextWeight}kg et repars à ${repsMin} reps.`,
    }
  }

  return {
    weightKg: lastWeightKg,
    reps: lastReps + 1,
    note: `Vise ${lastReps + 1} reps à ${lastWeightKg}kg avant de monter le poids.`,
  }
}

/**
 * Périodisation simple : une semaine de décharge (volume/charges réduits ~40%)
 * toutes les ~6 semaines d'entraînement consécutif évite le plateau/surmenage
 * et permet de repartir plus fort — recommandation classique pour quelqu'un qui
 * s'entraîne 5-6x/semaine sur la durée.
 */
export function isDeloadWeek(currentStreakWeeks: number): boolean {
  return currentStreakWeeks > 0 && currentStreakWeeks % 6 === 0
}
