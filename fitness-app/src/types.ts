export type Sex = 'male' | 'female' | 'other'
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
export type Goal = 'gain_muscle' | 'lose_fat_tone' | 'maintain'
export type Location = 'home' | 'gym'

export interface Profile {
  id: string
  display_name: string
  sex: Sex | null
  height_cm: number | null
  birth_date: string | null
  activity_level: ActivityLevel
  goal: Goal
  target_weight_kg: number | null
  training_days_per_week: number
  couple_id: string | null
  onboarded: boolean
  takes_protein_shake: boolean
  created_at: string
}

export interface Couple {
  id: string
  invite_code: string
  created_at: string
}

export interface WeightLog {
  id: string
  profile_id: string
  logged_date: string
  weight_kg: number
  notes: string | null
  created_at: string
}

export interface Exercise {
  id: string
  name: string
  muscle_group: string
  equipment: 'gym' | 'home' | 'both'
  is_custom: boolean
  created_by: string | null
}

export interface Program {
  id: string
  profile_id: string
  name: string
  location: Location
  is_active: boolean
  created_at: string
}

export interface ProgramDay {
  id: string
  program_id: string
  day_label: string
  day_order: number
}

export interface ProgramExercise {
  id: string
  program_day_id: string
  exercise_id: string
  order_index: number
  target_sets: number
  target_reps_min: number
  target_reps_max: number
  target_rest_sec: number
  notes: string | null
}

export interface WorkoutSession {
  id: string
  profile_id: string
  program_day_id: string | null
  session_date: string
  location: Location
  started_at: string
  finished_at: string | null
  notes: string | null
}

export interface SessionSet {
  id: string
  session_id: string
  exercise_id: string
  set_number: number
  weight_kg: number | null
  reps: number | null
  rpe: number | null
  is_pr: boolean
  created_at: string
}

export interface HydrationLog {
  id: string
  profile_id: string
  logged_date: string
  amount_ml: number
  logged_at: string
}

export interface NutritionTarget {
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
}

export type MessageKind = 'custom' | 'pr_cheer' | 'hydration_nudge'

export interface Message {
  id: string
  couple_id: string
  from_profile_id: string
  to_profile_id: string
  kind: MessageKind
  body: string
  related_exercise_id: string | null
  is_read: boolean
  created_at: string
}
