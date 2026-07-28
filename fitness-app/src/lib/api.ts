import { supabase } from './supabase'
import type {
  Exercise,
  HydrationLog,
  Message,
  MessageKind,
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
export async function getExercise(exerciseId: string): Promise<Exercise> {
  const { data, error } = await supabase.from('exercises').select('*').eq('id', exerciseId).single()
  if (error) throw error
  return data as Exercise
}

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

/** Détermine le prochain jour à faire dans un programme, en fonction de la dernière séance réalisée sur ce programme. */
export async function getNextProgramDay(profileId: string, program: Program): Promise<ProgramDay | null> {
  const days = await getProgramDays(program.id)
  if (days.length === 0) return null

  const dayIds = days.map((d) => d.id)
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('program_day_id, session_date, started_at')
    .eq('profile_id', profileId)
    .in('program_day_id', dayIds)
    .order('session_date', { ascending: false })
    .order('started_at', { ascending: false })
    .limit(1)
  if (error) throw error

  const last = (data as { program_day_id: string | null }[])[0]
  if (!last?.program_day_id) return days[0]

  const idx = days.findIndex((d) => d.id === last.program_day_id)
  if (idx === -1) return days[0]
  return days[(idx + 1) % days.length]
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

export async function getRecentPrs(
  profileId: string,
  limit = 5,
): Promise<(SessionSet & { exercise: Exercise; session_date: string })[]> {
  const { data, error } = await supabase
    .from('session_sets')
    .select('*, exercise:exercises(*), workout_sessions!inner(session_date, profile_id)')
    .eq('is_pr', true)
    .eq('workout_sessions.profile_id', profileId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (
    data as unknown as (SessionSet & { exercise: Exercise; workout_sessions: { session_date: string } })[]
  ).map((r) => ({ ...r, session_date: r.workout_sessions.session_date }))
}

// ---------------------------------------------------------------------------
// Rangs : meilleures perfs par exercice
// ---------------------------------------------------------------------------
export interface BestPerformance {
  maxWeight: number | null
  maxReps: number | null
}

export async function getBestPerformance(profileId: string, exerciseId: string): Promise<BestPerformance> {
  const { data, error } = await supabase
    .from('session_sets')
    .select('weight_kg, reps, workout_sessions!inner(profile_id)')
    .eq('exercise_id', exerciseId)
    .eq('workout_sessions.profile_id', profileId)
  if (error) throw error
  const rows = data as unknown as { weight_kg: number | null; reps: number | null }[]
  return rows.reduce<BestPerformance>(
    (acc, r) => ({
      maxWeight: r.weight_kg != null && (acc.maxWeight === null || r.weight_kg > acc.maxWeight) ? r.weight_kg : acc.maxWeight,
      maxReps: r.reps != null && (acc.maxReps === null || r.reps > acc.maxReps) ? r.reps : acc.maxReps,
    }),
    { maxWeight: null, maxReps: null },
  )
}

export async function getAllBestPerformances(profileId: string): Promise<Record<string, BestPerformance>> {
  const { data, error } = await supabase
    .from('session_sets')
    .select('exercise_id, weight_kg, reps, workout_sessions!inner(profile_id)')
    .eq('workout_sessions.profile_id', profileId)
  if (error) throw error
  const rows = data as unknown as { exercise_id: string; weight_kg: number | null; reps: number | null }[]
  const result: Record<string, BestPerformance> = {}
  for (const row of rows) {
    const cur = result[row.exercise_id] ?? { maxWeight: null, maxReps: null }
    if (row.weight_kg != null && (cur.maxWeight === null || row.weight_kg > cur.maxWeight)) cur.maxWeight = row.weight_kg
    if (row.reps != null && (cur.maxReps === null || row.reps > cur.maxReps)) cur.maxReps = row.reps
    result[row.exercise_id] = cur
  }
  return result
}

export async function logQuickPr(params: {
  profileId: string
  exercise: Exercise
  weightKg: number | null
  reps: number | null
}): Promise<SessionSet> {
  const location = params.exercise.equipment === 'home' ? 'home' : 'gym'
  const session = await startSession(params.profileId, null, location)
  const created = await addSet({
    sessionId: session.id,
    exerciseId: params.exercise.id,
    setNumber: 1,
    weightKg: params.weightKg,
    reps: params.reps,
    rpe: null,
  })
  await finishSession(session.id)
  return created
}

// ---------------------------------------------------------------------------
// Messages entre partenaires
// ---------------------------------------------------------------------------
export async function sendMessage(params: {
  coupleId: string
  fromProfileId: string
  toProfileId: string
  kind: MessageKind
  body: string
  relatedExerciseId?: string
}): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      couple_id: params.coupleId,
      from_profile_id: params.fromProfileId,
      to_profile_id: params.toProfileId,
      kind: params.kind,
      body: params.body,
      related_exercise_id: params.relatedExerciseId ?? null,
    })
    .select('*')
    .single()
  if (error) throw error
  return data as Message
}

export async function listMessages(coupleId: string, limit = 50): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('couple_id', coupleId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data as Message[]
}

export async function getUnreadCount(profileId: string): Promise<number> {
  const { count, error } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('to_profile_id', profileId)
    .eq('is_read', false)
  if (error) throw error
  return count ?? 0
}

export async function markAllMessagesRead(profileId: string): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('to_profile_id', profileId)
    .eq('is_read', false)
  if (error) throw error
}

export function subscribeToIncomingMessages(profileId: string, onMessage: (msg: Message) => void): () => void {
  const channel = supabase
    .channel(`messages-${profileId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `to_profile_id=eq.${profileId}` },
      (payload) => onMessage(payload.new as Message),
    )
    .subscribe()
  return () => {
    supabase.removeChannel(channel)
  }
}
