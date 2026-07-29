export interface UserStats {
  totalSessions: number
  totalPrs: number
  bestHydrationStreakDays: number
  bestWorkoutStreakWeeks: number
}

export interface BadgeDef {
  id: string
  label: string
  icon: string
  description: string
  check: (stats: UserStats) => boolean
}

export const BADGES: BadgeDef[] = [
  { id: 'sessions_10', label: '10 séances', icon: '🏋️', description: '10 séances loggées au total', check: (s) => s.totalSessions >= 10 },
  { id: 'sessions_25', label: '25 séances', icon: '🏋️', description: '25 séances loggées au total', check: (s) => s.totalSessions >= 25 },
  { id: 'sessions_50', label: '50 séances', icon: '💪', description: '50 séances loggées au total', check: (s) => s.totalSessions >= 50 },
  { id: 'sessions_100', label: '100 séances', icon: '💪', description: '100 séances loggées au total', check: (s) => s.totalSessions >= 100 },
  { id: 'pr_5', label: '5 records', icon: '🏆', description: '5 records personnels battus', check: (s) => s.totalPrs >= 5 },
  { id: 'pr_25', label: '25 records', icon: '🏆', description: '25 records personnels battus', check: (s) => s.totalPrs >= 25 },
  { id: 'pr_50', label: '50 records', icon: '👑', description: '50 records personnels battus', check: (s) => s.totalPrs >= 50 },
  { id: 'hydration_7', label: '7 jours hydraté(e)', icon: '💧', description: "7 jours d'affilée à l'objectif d'hydratation", check: (s) => s.bestHydrationStreakDays >= 7 },
  { id: 'hydration_30', label: '30 jours hydraté(e)', icon: '💧', description: "30 jours d'affilée à l'objectif d'hydratation", check: (s) => s.bestHydrationStreakDays >= 30 },
  { id: 'hydration_60', label: '60 jours hydraté(e)', icon: '🌊', description: "60 jours d'affilée à l'objectif d'hydratation", check: (s) => s.bestHydrationStreakDays >= 60 },
  { id: 'streak_4', label: '1 mois de constance', icon: '🔥', description: "4 semaines d'affilée à l'objectif de séances", check: (s) => s.bestWorkoutStreakWeeks >= 4 },
  { id: 'streak_12', label: '3 mois de constance', icon: '🔥', description: "12 semaines d'affilée à l'objectif de séances", check: (s) => s.bestWorkoutStreakWeeks >= 12 },
  { id: 'streak_26', label: '6 mois de constance', icon: '⚡', description: "26 semaines d'affilée à l'objectif de séances", check: (s) => s.bestWorkoutStreakWeeks >= 26 },
]

export function computeUnlockedBadges(stats: UserStats): { badge: BadgeDef; unlocked: boolean }[] {
  return BADGES.map((badge) => ({ badge, unlocked: badge.check(stats) }))
}
