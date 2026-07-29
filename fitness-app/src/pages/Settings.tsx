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

      <Card className="space-y-3">
        <h2 className="text-sm font-medium text-slate-300">Compléments : ce qui marche vraiment</h2>
        <p className="text-xs text-slate-500">
          D'après la littérature scientifique actuelle (pas de miracle, juste ce qui a des preuves solides) :
        </p>
        <div className="space-y-2">
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2.5">
            <p className="text-sm text-emerald-300 font-medium">✅ Prouvés — les seuls vraiment indispensables</p>
            <ul className="text-xs text-slate-400 mt-1 space-y-1 list-disc list-inside">
              <li><strong className="text-slate-300">Créatine monohydrate</strong>, 3-5g/jour, tous les jours (pas besoin de phase de charge, la régularité compte plus que l'horaire).</li>
              <li><strong className="text-slate-300">Protéines</strong>, ~1.6-2.2g/kg/jour réparties sur 3-5 prises — c'est déjà calculé pour toi sur le Dashboard.</li>
            </ul>
          </div>
          <div className="rounded-xl bg-sky-500/10 border border-sky-500/20 px-3 py-2.5">
            <p className="text-sm text-sky-300 font-medium">🔵 Utiles en option (performance à l'entraînement)</p>
            <ul className="text-xs text-slate-400 mt-1 space-y-1 list-disc list-inside">
              <li><strong className="text-slate-300">Caféine</strong>, 3-6mg/kg 30-60min avant la séance (~200-400mg pour toi) : plus de répétitions avant l'échec.</li>
              <li><strong className="text-slate-300">Bêta-alanine</strong>, 3.2-6.4g/jour : retarde la fatigue sur les séries longues (12+ reps). Picotements bénins possibles.</li>
              <li><strong className="text-slate-300">Citrulline malate</strong>, 6-8g avant la séance : effet plus modeste, surtout utile si tu ressens un manque d'endurance musculaire.</li>
            </ul>
          </div>
          <div className="rounded-xl bg-slate-800/60 border border-slate-700/60 px-3 py-2.5">
            <p className="text-sm text-slate-300 font-medium">⚪ Pas nécessaire dans ton cas</p>
            <p className="text-xs text-slate-500 mt-1">
              Les <strong className="text-slate-400">BCAA</strong> n'apportent quasiment rien si tes apports en protéines totales sont déjà suffisants (ce qui est ton cas avec ton shake + ton alimentation) — les études montrent qu'un acide aminé complet (whey, viande, œufs...) fait mieux. Tu peux garder ta créatine et sauter les BCAA sans rien perdre, et économiser sur le budget courses.
            </p>
          </div>
        </div>
        <p className="text-[11px] text-slate-600">
          Rien ne remplace le sommeil, l'entraînement progressif et un apport calorique adapté — les compléments ne font qu'ajouter quelques % par-dessus.
        </p>
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
