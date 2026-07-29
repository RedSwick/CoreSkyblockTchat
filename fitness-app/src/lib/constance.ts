import { getHydrationTotalsSince, getLatestWeight, getSessionDatesSince, getTotalPrCount, getTotalSessionCount } from './api'
import { computeDailyHydrationStreak, computeWeeklyWorkoutStreak, type DailyStreak, type WeeklyStreak } from './streaks'
import { computeHydrationTargetMl } from './nutrition'
import type { UserStats } from './badges'
import type { Profile } from '../types'

export interface ConstanceData {
  weekly: WeeklyStreak
  daily: DailyStreak
  stats: UserStats
}

/** Historique regardé pour les streaks/records — 1 an, largement suffisant et borné. */
const HISTORY_DAYS = 365

export async function getConstanceData(profile: Profile): Promise<ConstanceData> {
  const [sessionDates, hydrationTotals, totalSessions, totalPrs, latestWeight] = await Promise.all([
    getSessionDatesSince(profile.id, HISTORY_DAYS),
    getHydrationTotalsSince(profile.id, HISTORY_DAYS),
    getTotalSessionCount(profile.id),
    getTotalPrCount(profile.id),
    getLatestWeight(profile.id),
  ])

  const weightKg = latestWeight?.weight_kg ?? profile.target_weight_kg ?? 70
  const targetMl = computeHydrationTargetMl(weightKg, true)

  const weekly = computeWeeklyWorkoutStreak(sessionDates, profile.training_days_per_week)
  const daily = computeDailyHydrationStreak(hydrationTotals, targetMl)

  const stats: UserStats = {
    totalSessions,
    totalPrs,
    bestHydrationStreakDays: daily.bestStreakDays,
    bestWorkoutStreakWeeks: weekly.bestStreakWeeks,
  }

  return { weekly, daily, stats }
}
