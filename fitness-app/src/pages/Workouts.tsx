import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  deactivateProgram,
  getProgramDays,
  listPrograms,
  seedProgramFromTemplate,
  startSession,
} from '../lib/api'
import { ALL_TEMPLATES, templatesForGoal, type ProgramTemplate } from '../lib/programs'
import { Button, Card, EmptyState, PageTitle, Spinner } from '../components/ui'
import type { Program, ProgramDay } from '../types'

export function Workouts() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [programs, setPrograms] = useState<Program[]>([])
  const [daysByProgram, setDaysByProgram] = useState<Record<string, ProgramDay[]>>({})
  const [busy, setBusy] = useState<string | null>(null)

  async function load() {
    if (!profile) return
    setLoading(true)
    const list = await listPrograms(profile.id)
    setPrograms(list)
    const entries = await Promise.all(list.map(async (p) => [p.id, await getProgramDays(p.id)] as const))
    setDaysByProgram(Object.fromEntries(entries))
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  async function handleAddTemplate(template: ProgramTemplate) {
    if (!profile) return
    setBusy(template.key)
    try {
      await seedProgramFromTemplate(profile.id, template)
      await load()
    } finally {
      setBusy(null)
    }
  }

  async function handleRemoveProgram(programId: string) {
    setBusy(programId)
    try {
      await deactivateProgram(programId)
      await load()
    } finally {
      setBusy(null)
    }
  }

  async function handleStart(day: ProgramDay, location: 'home' | 'gym') {
    if (!profile) return
    const session = await startSession(profile.id, day.id, location)
    navigate(`/session/${session.id}`)
  }

  if (!profile || loading) return <Spinner />

  const activeKeys = new Set(programs.map((p) => p.name))
  const suggested = templatesForGoal(profile.goal).filter((t) => !activeKeys.has(t.name))
  const others = ALL_TEMPLATES.filter((t) => !activeKeys.has(t.name) && !suggested.includes(t))

  return (
    <div className="flex-1 px-4 py-6 overflow-y-auto space-y-5">
      <PageTitle title="Entraînement" subtitle="Tes programmes et séances" />

      {programs.length === 0 && <EmptyState>Aucun programme actif. Ajoute-en un ci-dessous pour démarrer.</EmptyState>}

      {programs.map((program) => (
        <Card key={program.id}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-medium text-slate-100">{program.name}</h2>
              <p className="text-xs text-slate-500">{program.location === 'home' ? 'Maison' : 'Salle (Basic Fit)'}</p>
            </div>
            <button
              className="text-xs text-slate-500 underline"
              onClick={() => handleRemoveProgram(program.id)}
              disabled={busy === program.id}
            >
              retirer
            </button>
          </div>
          <div className="space-y-2">
            {(daysByProgram[program.id] ?? []).map((day) => (
              <div key={day.id} className="flex items-center justify-between rounded-xl bg-slate-800/60 px-3 py-2">
                <span className="text-sm text-slate-200">{day.day_label}</span>
                <Button variant="secondary" className="px-3 py-1.5 text-xs" onClick={() => handleStart(day, program.location)}>
                  Démarrer
                </Button>
              </div>
            ))}
          </div>
        </Card>
      ))}

      {suggested.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-slate-400 mb-2">Suggéré pour ton objectif</h2>
          <div className="space-y-3">
            {suggested.map((t) => (
              <TemplateCard key={t.key} template={t} onAdd={() => handleAddTemplate(t)} busy={busy === t.key} />
            ))}
          </div>
        </div>
      )}

      {others.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-slate-400 mb-2">Autres programmes</h2>
          <div className="space-y-3">
            {others.map((t) => (
              <TemplateCard key={t.key} template={t} onAdd={() => handleAddTemplate(t)} busy={busy === t.key} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TemplateCard({ template, onAdd, busy }: { template: ProgramTemplate; onAdd: () => void; busy: boolean }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-slate-100">{template.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{template.location === 'home' ? 'Maison' : 'Salle'}</p>
          <p className="text-sm text-slate-400 mt-1.5">{template.description}</p>
        </div>
        <Button variant="secondary" className="shrink-0 px-3 py-1.5 text-xs" onClick={onAdd} disabled={busy}>
          {busy ? '…' : 'Ajouter'}
        </Button>
      </div>
    </Card>
  )
}
