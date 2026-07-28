import { useEffect, useState } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAuth } from '../contexts/AuthContext'
import { getExerciseHistory, listExercises, listSessions, listWeightLogs, upsertWeightLog } from '../lib/api'
import { Button, Card, EmptyState, Input, PageTitle, Select, Spinner } from '../components/ui'
import type { Exercise, WeightLog, WorkoutSession } from '../types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
}

export function Progress() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([])
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [newWeight, setNewWeight] = useState('')
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [selectedExercise, setSelectedExercise] = useState<string>('')
  const [exerciseHistory, setExerciseHistory] = useState<{ session_date: string; weight_kg: number | null }[]>([])

  useEffect(() => {
    if (!profile) return
    let cancelled = false
    async function load() {
      const [w, s, ex] = await Promise.all([
        listWeightLogs(profile!.id),
        listSessions(profile!.id, 20),
        listExercises(),
      ])
      if (cancelled) return
      setWeightLogs(w)
      setSessions(s)
      setExercises(ex)
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [profile])

  useEffect(() => {
    if (!profile || !selectedExercise) {
      setExerciseHistory([])
      return
    }
    getExerciseHistory(profile.id, selectedExercise).then(setExerciseHistory)
  }, [profile, selectedExercise])

  async function handleAddWeight() {
    if (!profile || !newWeight) return
    await upsertWeightLog(profile.id, Number(newWeight))
    setNewWeight('')
    const w = await listWeightLogs(profile.id)
    setWeightLogs(w)
  }

  if (!profile || loading) return <Spinner />

  const weightChartData = weightLogs.map((w) => ({ date: formatDate(w.logged_date), poids: w.weight_kg }))
  const exerciseChartData = exerciseHistory.map((h, i) => ({
    date: formatDate(h.session_date),
    charge: h.weight_kg,
    idx: i,
  }))

  const first = weightLogs[0]
  const last = weightLogs[weightLogs.length - 1]
  const delta = first && last ? Math.round((last.weight_kg - first.weight_kg) * 10) / 10 : null

  return (
    <div className="flex-1 px-4 py-6 overflow-y-auto space-y-5">
      <PageTitle title="Progrès" subtitle="Poids, charges, historique" />

      <Card>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-slate-300">Poids corporel</h2>
          {delta !== null && (
            <span className={`text-xs ${delta >= 0 ? 'text-emerald-400' : 'text-sky-400'}`}>
              {delta >= 0 ? '+' : ''}
              {delta} kg
            </span>
          )}
        </div>
        {weightChartData.length > 1 ? (
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightChartData}>
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="poids" stroke="#38bdf8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState>Ajoute au moins 2 pesées pour voir la courbe.</EmptyState>
        )}
        <div className="flex gap-2 mt-3">
          <Input type="number" step="0.1" placeholder="Poids du jour (kg)" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} />
          <Button variant="secondary" onClick={handleAddWeight} disabled={!newWeight}>
            OK
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-medium text-slate-300 mb-2">Progression sur un exercice</h2>
        <Select value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)}>
          <option value="">Choisir un exercice…</option>
          {exercises.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name}
            </option>
          ))}
        </Select>
        {selectedExercise &&
          (exerciseChartData.length > 1 ? (
            <div className="h-40 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={exerciseChartData}>
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="charge" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState>Pas encore assez de séries enregistrées pour cet exercice.</EmptyState>
          ))}
      </Card>

      <Card>
        <h2 className="text-sm font-medium text-slate-300 mb-2">Historique des séances</h2>
        {sessions.length === 0 ? (
          <EmptyState>Aucune séance enregistrée.</EmptyState>
        ) : (
          <div className="space-y-1.5">
            {sessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-300">{formatDate(s.session_date)}</span>
                <span className="text-slate-500 text-xs">{s.location === 'home' ? 'Maison' : 'Salle'}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
