import type { WeightTrend } from './weightTrend'

export interface WeeklyRecap {
  sessionsCount: number
  sessionsTarget: number
  tonnageKg: number
  prCount: number
  weightTrend: WeightTrend
  hydrationStreakDays: number
  note: string
}

function tonnageNote(tonnageKg: number): string {
  if (tonnageKg <= 0) return ''
  const rounded = Math.round(tonnageKg)
  return `${rounded.toLocaleString('fr-FR')} kg soulevés au total`
}

/**
 * Compose un petit bilan "coach" à partir de données déjà calculées ailleurs
 * (séries loggées, streaks, tendance de poids) plutôt que de refaire des
 * requêtes ici : cette fonction reste pure et testable.
 */
export function computeWeeklyRecap(params: {
  sessionsCount: number
  sessionsTarget: number
  tonnageKg: number
  prCount: number
  weightTrend: WeightTrend
  hydrationStreakDays: number
}): WeeklyRecap {
  const { sessionsCount, sessionsTarget, tonnageKg, prCount, weightTrend, hydrationStreakDays } = params

  const parts: string[] = []
  if (sessionsCount >= sessionsTarget && sessionsTarget > 0) {
    parts.push('objectif de séances atteint 💪')
  } else if (sessionsTarget > 0) {
    parts.push(`${sessionsTarget - sessionsCount} séance(s) de moins que prévu`)
  }
  if (prCount > 0) {
    parts.push(`${prCount} record${prCount > 1 ? 's' : ''} battu${prCount > 1 ? 's' : ''} 🏆`)
  }
  const tonnage = tonnageNote(tonnageKg)
  if (tonnage) parts.push(tonnage)

  const note = parts.length > 0 ? parts.join(' · ') : 'Pas encore de séance loggée cette semaine.'

  return { sessionsCount, sessionsTarget, tonnageKg, prCount, weightTrend, hydrationStreakDays, note }
}
