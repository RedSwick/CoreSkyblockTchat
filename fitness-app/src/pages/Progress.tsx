import { useEffect, useState } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAuth } from '../contexts/AuthContext'
import {
  getExerciseHistory,
  getProgressPhotoUrl,
  listBodyMeasurements,
  listExercises,
  listSessions,
  listWeightLogs,
  upsertBodyMeasurement,
  upsertWeightLog,
  uploadProgressPhoto,
} from '../lib/api'
import { Button, Card, EmptyState, Input, Label, PageTitle, Select, Spinner } from '../components/ui'
import type { BodyMeasurement, Exercise, WeightLog, WorkoutSession } from '../types'

type MeasurementMetric = 'waist_cm' | 'chest_cm' | 'arm_cm' | 'thigh_cm'

const METRIC_LABEL: Record<MeasurementMetric, string> = {
  waist_cm: 'Taille',
  chest_cm: 'Poitrine',
  arm_cm: 'Bras',
  thigh_cm: 'Cuisse',
}

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

  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([])
  const [selectedMetric, setSelectedMetric] = useState<MeasurementMetric>('waist_cm')
  const [measurementDrafts, setMeasurementDrafts] = useState({ waist: '', chest: '', arm: '', thigh: '' })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [savingMeasurement, setSavingMeasurement] = useState(false)
  const [photoUrls, setPhotoUrls] = useState<{ first: string | null; last: string | null }>({ first: null, last: null })

  useEffect(() => {
    if (!profile) return
    let cancelled = false
    async function load() {
      const [w, s, ex, m] = await Promise.all([
        listWeightLogs(profile!.id),
        listSessions(profile!.id, 20),
        listExercises(),
        listBodyMeasurements(profile!.id),
      ])
      if (cancelled) return
      setWeightLogs(w)
      setSessions(s)
      setExercises(ex)
      setMeasurements(m)
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [profile])

  useEffect(() => {
    const withPhoto = measurements.filter((m) => m.photo_path)
    if (withPhoto.length === 0) {
      setPhotoUrls({ first: null, last: null })
      return
    }
    const first = withPhoto[0]
    const last = withPhoto[withPhoto.length - 1]
    let cancelled = false
    Promise.all([getProgressPhotoUrl(first.photo_path!), first.id === last.id ? null : getProgressPhotoUrl(last.photo_path!)]).then(
      ([firstUrl, lastUrl]) => {
        if (cancelled) return
        setPhotoUrls({ first: firstUrl, last: lastUrl ?? firstUrl })
      },
    )
    return () => {
      cancelled = true
    }
  }, [measurements])

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

  async function handleSaveMeasurement() {
    if (!profile) return
    setSavingMeasurement(true)
    try {
      let photoPath: string | undefined
      if (photoFile) {
        photoPath = await uploadProgressPhoto(profile.id, photoFile)
      }
      await upsertBodyMeasurement(profile.id, {
        waistCm: measurementDrafts.waist ? Number(measurementDrafts.waist) : null,
        chestCm: measurementDrafts.chest ? Number(measurementDrafts.chest) : null,
        armCm: measurementDrafts.arm ? Number(measurementDrafts.arm) : null,
        thighCm: measurementDrafts.thigh ? Number(measurementDrafts.thigh) : null,
        ...(photoPath ? { photoPath } : {}),
      })
      setMeasurementDrafts({ waist: '', chest: '', arm: '', thigh: '' })
      setPhotoFile(null)
      const m = await listBodyMeasurements(profile.id)
      setMeasurements(m)
    } finally {
      setSavingMeasurement(false)
    }
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

  const measurementChartData = measurements
    .filter((m) => m[selectedMetric] !== null)
    .map((m) => ({ date: formatDate(m.logged_date), value: m[selectedMetric] }))
  const measurementsWithMetric = measurements.filter((m) => m[selectedMetric] !== null)
  const firstMeasurement = measurementsWithMetric[0]
  const lastMeasurement = measurementsWithMetric[measurementsWithMetric.length - 1]
  const measurementDelta =
    firstMeasurement && lastMeasurement && firstMeasurement.id !== lastMeasurement.id
      ? Math.round(((lastMeasurement[selectedMetric] as number) - (firstMeasurement[selectedMetric] as number)) * 10) / 10
      : null

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
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-slate-300">Mensurations</h2>
          {measurementDelta !== null && (
            <span className={`text-xs ${measurementDelta <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {measurementDelta >= 0 ? '+' : ''}
              {measurementDelta} cm
            </span>
          )}
        </div>
        <Select value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value as MeasurementMetric)} className="mb-3">
          {(Object.keys(METRIC_LABEL) as MeasurementMetric[]).map((metric) => (
            <option key={metric} value={metric}>
              {METRIC_LABEL[metric]}
            </option>
          ))}
        </Select>
        {measurementChartData.length > 1 ? (
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={measurementChartData}>
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="value" stroke="#f472b6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState>Ajoute au moins 2 mesures de {METRIC_LABEL[selectedMetric].toLowerCase()} pour voir la courbe.</EmptyState>
        )}

        {(photoUrls.first || photoUrls.last) && (
          <div className="flex gap-2 mt-3">
            {photoUrls.first && (
              <div className="flex-1">
                <img src={photoUrls.first} alt="Avant" className="w-full rounded-xl object-cover aspect-[3/4]" />
                <p className="text-[11px] text-slate-500 text-center mt-1">Avant</p>
              </div>
            )}
            {photoUrls.last && photoUrls.last !== photoUrls.first && (
              <div className="flex-1">
                <img src={photoUrls.last} alt="Maintenant" className="w-full rounded-xl object-cover aspect-[3/4]" />
                <p className="text-[11px] text-slate-500 text-center mt-1">Maintenant</p>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div>
            <Label>Taille (cm)</Label>
            <Input
              type="number"
              step="0.5"
              value={measurementDrafts.waist}
              onChange={(e) => setMeasurementDrafts((d) => ({ ...d, waist: e.target.value }))}
            />
          </div>
          <div>
            <Label>Poitrine (cm)</Label>
            <Input
              type="number"
              step="0.5"
              value={measurementDrafts.chest}
              onChange={(e) => setMeasurementDrafts((d) => ({ ...d, chest: e.target.value }))}
            />
          </div>
          <div>
            <Label>Bras (cm)</Label>
            <Input
              type="number"
              step="0.5"
              value={measurementDrafts.arm}
              onChange={(e) => setMeasurementDrafts((d) => ({ ...d, arm: e.target.value }))}
            />
          </div>
          <div>
            <Label>Cuisse (cm)</Label>
            <Input
              type="number"
              step="0.5"
              value={measurementDrafts.thigh}
              onChange={(e) => setMeasurementDrafts((d) => ({ ...d, thigh: e.target.value }))}
            />
          </div>
        </div>
        <div className="mt-2">
          <Label>Photo de progression (optionnel)</Label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
            className="w-full text-xs text-slate-400 file:mr-2 file:rounded-lg file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-slate-200"
          />
        </div>
        <Button className="w-full mt-3" onClick={handleSaveMeasurement} disabled={savingMeasurement}>
          {savingMeasurement ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
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
