import { supabase } from './supabase'
import type {
  Exercise,
  HydrationLog,
  Profile,
  Program,
  ProgramDay,
  ProgramExercise,
  SessionSet,
  WeightLog,
  WorkoutSession,
} from '../types'
import type { ProgramTemplate } from './programs'

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

// ---------------------------------------------------------------------------
// Profil & couple
// ---------------------------------------------------------------------------
export async function getProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error) throw error
  return data as Profile
}

export async function updateProfile(userId: string, patch: Partial<Profile>): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', userId)
    .select('*')
    .single()
  if (error) throw error
  return data as Profile
}

export async function createCouple(userId: string): Promise<string> {
  const { data, error } = await supabase.from('couples').insert({}).select('id, invite_code').single()
  if (error) throw error
  await updateProfile(userId, { couple_id: data.id })
  return data.invite_code as string
}

export async function joinCouple(userId: string, inviteCode: string): Promise<void> {
  const { data, error } = await supabase
    .from('couples')
    .select('id')
    .eq('invite_code', inviteCode.trim().toLowerCase())
    .single()
  if (error || !data) throw new Error("Code d'invitation introuvable")
  await updateProfile(userId, { couple_id: data.id })
}

export async function getPartnerProfile(profile: Profile): Promise<Profile | null> {
  if (!profile.couple_id) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('couple_id', profile.couple_id)
    .neq('id', profile.id)
    .maybeSingle()
  if (error) throw error
  return (data as Profile) ?? null
}

// ---------------------------------------------------------------------------
// Poids
// ---------------------------------------------------------------------------
export async function listWeightLogs(profileId: string, limit = 60): Promise<WeightLog[]> {
  const { data, error } = await supabase
    .from('weight_logs')
    .select('*')
    .eq('profile_id', profileId)
    .order('logged_date', { ascending: true })
    .limit(limit)
  if (error) throw error
  return data as WeightLog[]
}

export async function getLatestWeight(profileId: string): Promise<WeightLog | null> {
  const { data, error } = await supabase
    .from('weight_logs')
    .select('*')
    .eq('profile_id', profileId)
    .order('logged_date', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return (data as WeightLog) ?? null
}

export async function upsertWeightLog(profileId: string, weightKg: number, date = todayIso()): Promise<void> {
  const { error } = await supabase
    .from('weight_logs')
    .upsert({ profile_id: profileId, logged_date: date, weight_kg: weightKg }, { onConflict: 'profile_id,logged_date' })
  if (error) throw error
}

// ---------------------------------------------------------------------------
// Hydratation
// ---------------------------------------------------------------------------
export async function getTodayHydrationTotal(profileId: string): Promise<number> {
  const { data, error } = await supabase
    .from('hydration_logs')
    .select('amount_ml')
    .eq('profile_id', profileId)
    .eq('logged_date', todayIso())
  if (error) throw error
  return (data as { amount_ml: number }[]).reduce((sum, r) => sum + r.amount_ml, 0)
}

export async function addHydration(profileId: string, amountMl: number): Promise<void> {
  const { error } = await supabase
    .from('hydration_logs')
    .insert({ profile_id: profileId, amount_ml: amountMl, logged_date: todayIso() })
  if (error) throw error
}

export async function listHydrationLogs(profileId: string, days = 14): Promise<HydrationLog[]> {
  const since = new Date()
  since.setDate(since.getDate() - days)
  const { data, error } = await supabase
    .from('hydration_logs')
    .select('*')
    .eq('profile_id', profileId)
    .gte('logged_date', since.toISOString().slice(0, 10))
    .order('logged_date', { ascending: true })
  if (error) throw error
  return data as HydrationLog[]
}

// ---------------------------------------------------------------------------
// Exercices & programmes
// ---------------------------------------------------------------------------
export async function listExercises(): Promise<Exercise[]> {
  const { data, error } = await supabase.from('exercises').select('*').order('muscle_group')
  if (error) throw error
  return data as Exercise[]
}

export async function listPrograms(profileId: string): Promise<Program[]> {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('profile_id', profileId)
    .eq('is_active', true)
    .order('created_at')
  if (error) throw error
  return data as Program[]
}

export async function getProgramDays(programId: string): Promise<ProgramDay[]> {
  const { data, error } = await supabase
    .from('program_days')
    .select('*')
    .eq('program_id', programId)
    .order('day_order')
  if (error) throw error
  return data as ProgramDay[]
}

export async function getProgramExercises(programDayId: string): Promise<(ProgramExercise & { exercise: Exercise })[]> {
  const { data, error } = await supabase
    .from('program_exercises')
    .select('*, exercise:exercises(*)')
    .eq('program_day_id', programDayId)
    .order('order_index')
  if (error) throw error
  return data as unknown as (ProgramExercise & { exercise: Exercise })[]
}

export async function seedProgramFromTemplate(profileId: string, template: ProgramTemplate): Promise<Program> {
  const exercises = await listExercises()
  const byName = new Map(exercises.map((e) => [e.name, e]))

  const { data: program, error: programError } = await supabase
    .from('programs')
    .insert({ profile_id: profileId, name: template.name, location: template.location })
    .select('*')
    .single()
  if (programError) throw programError

  for (let dayIndex = 0; dayIndex < template.days.length; dayIndex++) {
    const day = template.days[dayIndex]
    const { data: programDay, error: dayError } = await supabase
      .from('program_days')
      .insert({ program_id: program.id, day_label: day.label, day_order: dayIndex })
      .select('*')
      .single()
    if (dayError) throw dayError

    const rows = day.exercises
      .map((ex, orderIndex) => {
        const exercise = byName.get(ex.name)
        if (!exercise) return null
        return {
          program_day_id: programDay.id,
          exercise_id: exercise.id,
          order_index: orderIndex,
          target_sets: ex.sets,
          target_reps_min: ex.repsMin,
          target_reps_max: ex.repsMax,
          target_rest_sec: ex.restSec,
        }
      })
      .filter((r): r is NonNullable<typeof r> => r !== null)

    if (rows.length) {
      const { error: peError } = await supabase.from('program_exercises').insert(rows)
      if (peError) throw peError
    }
  }

  return program as Program
}

export async function deactivateProgram(programId: string): Promise<void> {
  const { error } = await supabase.from('programs').update({ is_active: false }).eq('id', programId)
  if (error) throw error
}

// ---------------------------------------------------------------------------
// Séances & séries
// ---------------------------------------------------------------------------
export async function startSession(
  profileId: string,
  programDayId: string | null,
  location: 'home' | 'gym',
): Promise<WorkoutSession> {
  const { data, error } = await supabase
    .from('workout_sessions')
    .insert({ profile_id: profileId, program_day_id: programDayId, location })
    .select('*')
    .single()
  if (error) throw error
  return data as WorkoutSession
}

export async function getSession(sessionId: string): Promise<WorkoutSession> {
  const { data, error } = await supabase.from('workout_sessions').select('*').eq('id', sessionId).single()
  if (error) throw error
  return data as WorkoutSession
}

export async function finishSession(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from('workout_sessions')
    .update({ finished_at: new Date().toISOString() })
    .eq('id', sessionId)
  if (error) throw error
}

export async function addSet(set: {
  sessionId: string
  exerciseId: string
  setNumber: number
  weightKg: number | null
  reps: number | null
  rpe: number | null
}): Promise<SessionSet> {
  const { data, error } = await supabase
    .from('session_sets')
    .insert({
      session_id: set.sessionId,
      exercise_id: set.exerciseId,
      set_number: set.setNumber,
      weight_kg: set.weightKg,
      reps: set.reps,
      rpe: set.rpe,
    })
    .select('*')
    .single()
  if (error) throw error
  return data as SessionSet
}

export async function markSetAsPr(setId: string): Promise<void> {
  const { error } = await supabase.from('session_sets').update({ is_pr: true }).eq('id', setId)
  if (error) throw error
}

export async function getLastSetsForExercise(profileId: string, exerciseId: string): Promise<SessionSet[]> {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('id, session_sets!inner(*)')
    .eq('profile_id', profileId)
    .eq('session_sets.exercise_id', exerciseId)
    .order('session_date', { ascending: false })
    .limit(1)
  if (error) throw error
  const rows = data as unknown as { session_sets: SessionSet[] }[]
  return rows[0]?.session_sets ?? []
}

export async function listSessions(profileId: string, limit = 30): Promise<WorkoutSession[]> {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('*')
    .eq('profile_id', profileId)
    .order('session_date', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data as WorkoutSession[]
}

export async function getSessionSets(sessionId: string): Promise<(SessionSet & { exercise: Exercise })[]> {
  const { data, error } = await supabase
    .from('session_sets')
    .select('*, exercise:exercises(*)')
    .eq('session_id', sessionId)
    .order('set_number')
  if (error) throw error
  return data as unknown as (SessionSet & { exercise: Exercise })[]
}

export async function getExerciseHistory(
  profileId: string,
  exerciseId: string,
  limit = 20,
): Promise<{ session_date: string; weight_kg: number | null; reps: number | null }[]> {
  const { data, error } = await supabase
    .from('session_sets')
    .select('weight_kg, reps, workout_sessions!inner(session_date, profile_id)')
    .eq('exercise_id', exerciseId)
    .eq('workout_sessions.profile_id', profileId)
    .order('session_date', { ascending: true, foreignTable: 'workout_sessions' })
    .limit(limit)
  if (error) throw error
  return (data as unknown as { weight_kg: number | null; reps: number | null; workout_sessions: { session_date: string } }[]).map(
    (r) => ({ session_date: r.workout_sessions.session_date, weight_kg: r.weight_kg, reps: r.reps }),
  )
}

// ---------------------------------------------------------------------------
// Constance (pour la vue "couple")
// ---------------------------------------------------------------------------
export async function getWeeklySessionCount(profileId: string): Promise<number> {
  const since = new Date()
  since.setDate(since.getDate() - 7)
  const { count, error } = await supabase
    .from('workout_sessions')
    .select('id', { count: 'exact', head: true })
    .eq('profile_id', profileId)
    .gte('session_date', since.toISOString().slice(0, 10))
  if (error) throw error
  return count ?? 0
}
