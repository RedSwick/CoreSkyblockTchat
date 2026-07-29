import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { updateProfile } from '../lib/api'
import { Button, Card, Input, Label, PageTitle, Select } from '../components/ui'
import type { ActivityLevel, Goal, Sex } from '../types'

export function Settings() {
  const { profile, user, refreshProfile, signOut } = useAuth()
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [sex, setSex] = useState<Sex>(profile?.sex ?? 'male')
  const [heightCm, setHeightCm] = useState(profile?.height_cm?.toString() ?? '')
  const [targetWeightKg, setTargetWeightKg] = useState(profile?.target_weight_kg?.toString() ?? '')
  const [activity, setActivity] = useState<ActivityLevel>(profile?.activity_level ?? 'moderate')
  const [goal, setGoal] = useState<Goal>(profile?.goal ?? 'gain_muscle')
  const [trainingDays, setTrainingDays] = useState(profile?.training_days_per_week ?? 4)
  const [takesProteinShake, setTakesProteinShake] = useState(profile?.takes_protein_shake ?? false)
  const [hasPhysicalJob, setHasPhysicalJob] = useState(profile?.has_physical_job ?? false)
  const [saved, setSaved] = useState(false)

  if (!profile || !user) return null

  async function handleSave() {
    await updateProfile(user!.id, {
      display_name: displayName,
      sex,
      height_cm: heightCm ? Number(heightCm) : null,
      target_weight_kg: targetWeightKg ? Number(targetWeightKg) : null,
      activity_level: activity,
      goal,
      training_days_per_week: trainingDays,
      takes_protein_shake: takesProteinShake,
      has_physical_job: hasPhysicalJob,
    })
    await refreshProfile()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex-1 px-4 py-6 overflow-y-auto space-y-4">
      <PageTitle title="Réglages" subtitle={user.email ?? undefined} />

      <Card className="space-y-3">
        <div>
          <Label>Prénom</Label>
          <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Sexe</Label>
            <Select value={sex} onChange={(e) => setSex(e.target.value as Sex)}>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
              <option value="other">Autre</option>
            </Select>
          </div>
          <div>
            <Label>Taille (cm)</Label>
            <Input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Poids objectif (kg)</Label>
          <Input type="number" step="0.1" value={targetWeightKg} onChange={(e) => setTargetWeightKg(e.target.value)} />
        </div>
        <div>
          <Label>Objectif</Label>
          <Select value={goal} onChange={(e) => setGoal(e.target.value as Goal)}>
            <option value="gain_muscle">Prise de muscle</option>
            <option value="lose_fat_tone">Perte de gras & tonification</option>
            <option value="maintain">Maintien</option>
          </Select>
        </div>
        <div>
          <Label>Niveau d'activité</Label>
          <Select value={activity} onChange={(e) => setActivity(e.target.value as ActivityLevel)}>
            <option value="sedentary">Sédentaire</option>
            <option value="light">Légèrement actif</option>
            <option value="moderate">Modérément actif</option>
            <option value="active">Actif</option>
            <option value="very_active">Très actif</option>
          </Select>
        </div>
        <div>
          <Label>Séances / semaine visées</Label>
          <Input type="number" min={1} max={7} value={trainingDays} onChange={(e) => setTrainingDays(Number(e.target.value))} />
        </div>
        <label className="flex items-center justify-between gap-3 rounded-xl bg-slate-800/60 px-3 py-2.5">
          <span className="text-sm text-slate-200">Je prends un shake de protéine tous les jours</span>
          <input
            type="checkbox"
            checked={takesProteinShake}
            onChange={(e) => setTakesProteinShake(e.target.checked)}
            className="h-5 w-5 accent-sky-500"
          />
        </label>
        <label className="flex items-center justify-between gap-3 rounded-xl bg-slate-800/60 px-3 py-2.5">
          <span className="text-sm text-slate-200">Métier physique (debout, manuel, extérieur)</span>
          <input
            type="checkbox"
            checked={hasPhysicalJob}
            onChange={(e) => setHasPhysicalJob(e.target.checked)}
            className="h-5 w-5 accent-sky-500"
          />
        </label>
        {hasPhysicalJob && (
          <p className="text-xs text-slate-500 -mt-1">
            Augmente l'objectif d'hydratation même les jours sans séance (pertes en sueur liées au travail).
          </p>
        )}
        <Button className="w-full" onClick={handleSave}>
          {saved ? 'Enregistré ✓' : 'Enregistrer'}
        </Button>
      </Card>

      <Button variant="danger" className="w-full" onClick={signOut}>
        Se déconnecter
      </Button>

      <p className="text-center text-xs text-slate-600">
        Icônes musculaires par{' '}
        <a href="https://www.flaticon.com/authors/cube29" target="_blank" rel="noreferrer" className="underline">
          cube29
        </a>{' '}
        —{' '}
        <a href="https://www.flaticon.com" target="_blank" rel="noreferrer" className="underline">
          Flaticon
        </a>
      </p>
    </div>
  )
}
