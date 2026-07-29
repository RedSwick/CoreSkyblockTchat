import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { createCouple, joinCouple, updateProfile, upsertWeightLog } from '../lib/api'
import { Button, Card, Input, Label, PageTitle, Select } from '../components/ui'
import type { ActivityLevel, Goal, Sex } from '../types'

const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string }[] = [
  { value: 'sedentary', label: 'Sédentaire (bureau, peu de marche)' },
  { value: 'light', label: 'Légèrement actif (1-3 activités/sem hors muscu)' },
  { value: 'moderate', label: 'Modérément actif' },
  { value: 'active', label: 'Actif (travail physique ou beaucoup de marche)' },
  { value: 'very_active', label: 'Très actif' },
]

export function Onboarding() {
  const { profile, user, refreshProfile } = useAuth()
  const navigate = useNavigate()

  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [sex, setSex] = useState<Sex>(profile?.sex ?? 'male')
  const [heightCm, setHeightCm] = useState(profile?.height_cm?.toString() ?? '')
  const [weightKg, setWeightKg] = useState('')
  const [targetWeightKg, setTargetWeightKg] = useState(profile?.target_weight_kg?.toString() ?? '')
  const [activity, setActivity] = useState<ActivityLevel>(profile?.activity_level ?? 'moderate')
  const [goal, setGoal] = useState<Goal>(profile?.goal ?? 'gain_muscle')
  const [trainingDays, setTrainingDays] = useState(profile?.training_days_per_week ?? 5)

  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [joinCode, setJoinCode] = useState('')
  const [coupleError, setCoupleError] = useState<string | null>(null)
  const [linked, setLinked] = useState(Boolean(profile?.couple_id))

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCreateCouple() {
    if (!user) return
    setCoupleError(null)
    try {
      const code = await createCouple(user.id)
      setInviteCode(code)
      setLinked(true)
      await refreshProfile()
    } catch (err) {
      setCoupleError(err instanceof Error ? err.message : 'Erreur')
    }
  }

  async function handleJoinCouple() {
    if (!user) return
    setCoupleError(null)
    try {
      await joinCouple(user.id, joinCode)
      setLinked(true)
      await refreshProfile()
    } catch (err) {
      setCoupleError(err instanceof Error ? err.message : 'Code invalide')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setError(null)
    try {
      await updateProfile(user.id, {
        display_name: displayName || 'Moi',
        sex,
        height_cm: heightCm ? Number(heightCm) : null,
        target_weight_kg: targetWeightKg ? Number(targetWeightKg) : null,
        activity_level: activity,
        goal,
        training_days_per_week: trainingDays,
        onboarded: true,
      })
      if (weightKg) {
        await upsertWeightLog(user.id, Number(weightKg))
      }
      await refreshProfile()
      navigate('/workouts', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex-1 px-4 py-6 overflow-y-auto">
      <PageTitle title="Bienvenue 👋" subtitle="Configure ton profil pour un plan et une diète adaptés." />

      <form onSubmit={handleSubmit} className="space-y-5">
        <Card className="space-y-3">
          <div>
            <Label>Prénom</Label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
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
              <Input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder="178" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Poids actuel (kg)</Label>
              <Input type="number" step="0.1" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="73" required />
            </div>
            <div>
              <Label>Poids objectif (kg)</Label>
              <Input type="number" step="0.1" value={targetWeightKg} onChange={(e) => setTargetWeightKg(e.target.value)} placeholder="85" />
            </div>
          </div>
        </Card>

        <Card className="space-y-3">
          <div>
            <Label>Objectif principal</Label>
            <Select value={goal} onChange={(e) => setGoal(e.target.value as Goal)}>
              <option value="gain_muscle">Prise de muscle (le plus sec possible)</option>
              <option value="lose_fat_tone">Perte de gras & tonification</option>
              <option value="maintain">Maintien</option>
            </Select>
          </div>
          <div>
            <Label>Niveau d'activité (hors muscu)</Label>
            <Select value={activity} onChange={(e) => setActivity(e.target.value as ActivityLevel)}>
              {ACTIVITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Séances de muscu visées / semaine</Label>
            <Input
              type="number"
              min={1}
              max={7}
              value={trainingDays}
              onChange={(e) => setTrainingDays(Number(e.target.value))}
            />
          </div>
        </Card>

        <Card className="space-y-3">
          <Label>Lier ton compte à ton/ta partenaire</Label>
          {linked ? (
            <p className="text-sm text-emerald-400">✓ Compte lié. Vous pourrez voir votre constance mutuelle.</p>
          ) : (
            <>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" className="flex-1" onClick={handleCreateCouple}>
                  Générer un code
                </Button>
              </div>
              {inviteCode && (
                <p className="text-sm text-slate-300">
                  Code à partager : <span className="font-mono text-sky-400 text-base">{inviteCode}</span>
                </p>
              )}
              <div className="flex gap-2 pt-1">
                <Input placeholder="Coller le code reçu" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} />
                <Button type="button" variant="secondary" onClick={handleJoinCouple} disabled={!joinCode}>
                  Rejoindre
                </Button>
              </div>
              {coupleError && <p className="text-sm text-red-400">{coupleError}</p>}
            </>
          )}
        </Card>

        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? 'Sauvegarde…' : 'Valider et continuer'}
        </Button>
      </form>
    </div>
  )
}
