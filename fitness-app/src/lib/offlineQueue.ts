/**
 * File d'attente locale pour les actions critiques (série loggée, eau,
 * pesée...) qui échouent faute de réseau — courant en salle de sport où la
 * 4G/wifi est capricieuse. Plutôt que de perdre l'action silencieusement,
 * elle est stockée dans localStorage puis rejouée automatiquement dès que
 * la connexion revient (voir flushOfflineQueue, appelé au démarrage et sur
 * l'évènement 'online').
 */
export type QueuedAction =
  | { id: string; type: 'add_set'; payload: AddSetPayload; createdAt: number }
  | { id: string; type: 'add_hydration'; payload: AddHydrationPayload; createdAt: number }
  | { id: string; type: 'upsert_weight'; payload: UpsertWeightPayload; createdAt: number }

export interface AddSetPayload {
  sessionId: string
  exerciseId: string
  setNumber: number
  weightKg: number | null
  reps: number | null
  rpe: number | null
  isPr: boolean
}

export interface AddHydrationPayload {
  profileId: string
  amountMl: number
}

export interface UpsertWeightPayload {
  profileId: string
  weightKg: number
  date: string
}

const STORAGE_KEY = 'duofit_offline_queue'

function readQueue(): QueuedAction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as QueuedAction[]) : []
  } catch {
    return []
  }
}

function writeQueue(queue: QueuedAction[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
  } catch {
    // Quota localStorage dépassé ou navigation privée : rien à faire de mieux
    // que d'abandonner silencieusement, la perte reste locale et ponctuelle.
  }
}

/** Détecte une vraie coupure réseau plutôt qu'une erreur applicative (droits, validation...). */
export function isNetworkError(err: unknown): boolean {
  if (!navigator.onLine) return true
  if (err instanceof TypeError && /fetch/i.test(err.message)) return true
  return false
}

export function enqueueAction(action: Omit<QueuedAction, 'id' | 'createdAt'>): void {
  const queue = readQueue()
  queue.push({ ...action, id: crypto.randomUUID(), createdAt: Date.now() } as QueuedAction)
  writeQueue(queue)
}

export function getQueueSize(): number {
  return readQueue().length
}

export interface QueueExecutors {
  add_set: (payload: AddSetPayload) => Promise<unknown>
  add_hydration: (payload: AddHydrationPayload) => Promise<unknown>
  upsert_weight: (payload: UpsertWeightPayload) => Promise<unknown>
}

/** Rejoue les actions en attente dans l'ordre, en gardant celles qui échouent encore. */
export async function flushOfflineQueue(executors: QueueExecutors): Promise<number> {
  const queue = readQueue()
  if (queue.length === 0) return 0

  const remaining: QueuedAction[] = []
  let flushed = 0
  for (const action of queue) {
    try {
      switch (action.type) {
        case 'add_set':
          await executors.add_set(action.payload)
          break
        case 'add_hydration':
          await executors.add_hydration(action.payload)
          break
        case 'upsert_weight':
          await executors.upsert_weight(action.payload)
          break
      }
      flushed++
    } catch {
      remaining.push(action)
    }
  }
  writeQueue(remaining)
  return flushed
}
