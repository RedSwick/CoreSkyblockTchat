import { differenceInCalendarDays, format, parseISO, startOfISOWeek, subDays, subWeeks } from 'date-fns'

export interface WeeklyStreak {
  /** Semaines consécutives (jusqu'à la semaine dernière incluse) où l'objectif hebdo a été atteint */
  currentStreakWeeks: number
  /** Meilleure série jamais atteinte */
  bestStreakWeeks: number
  thisWeekCount: number
  thisWeekTarget: number
}

function weekKey(date: Date): string {
  return format(startOfISOWeek(date), 'yyyy-MM-dd')
}

/** `sessionDates` : une entrée par séance (ISO yyyy-MM-dd), doublons acceptés. */
export function computeWeeklyWorkoutStreak(sessionDates: string[], weeklyTarget: number, today = new Date()): WeeklyStreak {
  const counts = new Map<string, number>()
  for (const d of sessionDates) {
    const key = weekKey(parseISO(d))
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  const thisWeekKey = weekKey(today)
  const thisWeekCount = counts.get(thisWeekKey) ?? 0

  let currentStreakWeeks = 0
  let cursor = subWeeks(startOfISOWeek(today), 1)
  for (;;) {
    const count = counts.get(format(cursor, 'yyyy-MM-dd')) ?? 0
    if (count < weeklyTarget) break
    currentStreakWeeks++
    cursor = subWeeks(cursor, 1)
  }
  if (thisWeekCount >= weeklyTarget) currentStreakWeeks++

  const sortedKeys = Array.from(counts.keys()).sort()
  let best = 0
  let run = 0
  let prevDate: Date | null = null
  for (const key of sortedKeys) {
    const count = counts.get(key)!
    const d = parseISO(key)
    if (count >= weeklyTarget) {
      run = prevDate && differenceInCalendarDays(d, prevDate) === 7 ? run + 1 : 1
      best = Math.max(best, run)
      prevDate = d
    } else {
      prevDate = null
      run = 0
    }
  }
  best = Math.max(best, currentStreakWeeks)

  return { currentStreakWeeks, bestStreakWeeks: best, thisWeekCount, thisWeekTarget: weeklyTarget }
}

export interface DailyStreak {
  currentStreakDays: number
  bestStreakDays: number
  metToday: boolean
}

/** `dailyTotals` : ml total par jour (clé ISO yyyy-MM-dd). */
export function computeDailyHydrationStreak(dailyTotals: Record<string, number>, targetMl: number, today = new Date()): DailyStreak {
  const todayKey = format(today, 'yyyy-MM-dd')
  const metToday = (dailyTotals[todayKey] ?? 0) >= targetMl

  let currentStreakDays = 0
  let cursor = subDays(today, 1)
  for (;;) {
    const total = dailyTotals[format(cursor, 'yyyy-MM-dd')] ?? 0
    if (total < targetMl) break
    currentStreakDays++
    cursor = subDays(cursor, 1)
  }
  if (metToday) currentStreakDays++

  const sortedKeys = Object.keys(dailyTotals).sort()
  let best = 0
  let run = 0
  let prevDate: Date | null = null
  for (const key of sortedKeys) {
    const total = dailyTotals[key]
    const d = parseISO(key)
    if (total >= targetMl) {
      run = prevDate && differenceInCalendarDays(d, prevDate) === 1 ? run + 1 : 1
      best = Math.max(best, run)
      prevDate = d
    } else {
      prevDate = null
      run = 0
    }
  }
  best = Math.max(best, currentStreakDays)

  return { currentStreakDays, bestStreakDays: best, metToday }
}
