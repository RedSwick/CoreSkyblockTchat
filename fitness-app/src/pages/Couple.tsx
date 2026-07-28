import { useEffect, useState } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAuth } from '../contexts/AuthContext'
import {
  createCouple,
  getPartnerProfile,
  getWeeklySessionCount,
  joinCouple,
  listSessions,
  listWeightLogs,
} from '../lib/api'
import { Button, Card, EmptyState, Input, PageTitle, Spinner } from '../components/ui'
import type { Profile, WeightLog, WorkoutSession } from '../types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
}

export function Couple() {
  const { profile, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [partner, setPartner] = useState<Profile | null>(null)
  const [partnerWeekly, setPartnerWeekly] = useState(0)
  const [partnerSessions, setPartnerSessions] = useState<WorkoutSession[]>([])
  const [partnerWeights, setPartnerWeights] = useState<WeightLog[]>([])
  const [myWeekly, setMyWeekly] = useState(0)

  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function load() {
    if (!profile) return
    setLoading(true)
    const p = await getPartnerProfile(profile)
    setPartner(p)
    const mine = await getWeeklySessionCount(profile.id)
    setMyWeekly(mine)
    if (p) {
      const [weekly, sessions, weights] = await Promise.all([
        getWeeklySessionCount(p.id),
        listSessions(p.id, 10),
        listWeightLogs(p.id),
      ])
      setPartnerWeekly(weekly)
      setPartnerSessions(sessions)
      setPartnerWeights(weights)
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  async function handleCreateCouple() {
    if (!profile) return
    const code = await createCouple(profile.id)
    setInviteCode(code)
    await refreshProfile()
  }

  async function handleJoinCouple() {
    if (!profile) return
    setError(null)
    try {
      await joinCouple(profile.id, joinCode)
      await refreshProfile()
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Code invalide')
    }
  }

  if (!profile || loading) return <Spinner />

  if (!profile.couple_id) {
    return (
      <div className="flex-1 px-4 py-6 space-y-4">
        <PageTitle title="Couple" subtitle="Lie ton compte pour voir sa constance et son évolution" />
        <Card className="space-y-3">
          <Button variant="secondary" className="w-full" onClick={handleCreateCouple}>
            Générer un code
          </Button>
          {inviteCode && (
            <p className="text-sm text-slate-300 text-center">
              Code à partager : <span className="font-mono text-sky-400 text-base">{inviteCode}</span>
            </p>
          )}
          <div className="flex gap-2">
            <Input placeholder="Coller le code reçu" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} />
            <Button variant="secondary" onClick={handleJoinCouple} disabled={!joinCode}>
              Rejoindre
            </Button>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </Card>
      </div>
    )
  }

  if (!partner) {
    return (
      <div className="flex-1 px-4 py-6">
        <PageTitle title="Couple" />
        <EmptyState>En attente que ton/ta partenaire rejoigne avec le code.</EmptyState>
      </div>
    )
  }

  const weightData = partnerWeights.map((w) => ({ date: formatDate(w.logged_date), poids: w.weight_kg }))

  return (
    <div className="flex-1 px-4 py-6 overflow-y-auto space-y-5">
      <PageTitle title={partner.display_name} subtitle="Sa constance et son évolution" />

      <div className="flex gap-2">
        <Card className="flex-1 text-center">
          <div className="text-lg font-semibold text-sky-400">
            {myWeekly}/{profile.training_days_per_week}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Toi cette semaine</div>
        </Card>
        <Card className="flex-1 text-center">
          <div className="text-lg font-semibold text-fuchsia-400">
            {partnerWeekly}/{partner.training_days_per_week}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">{partner.display_name} cette semaine</div>
        </Card>
      </div>

      <Card>
        <h2 className="text-sm font-medium text-slate-300 mb-2">Évolution du poids</h2>
        {weightData.length > 1 ? (
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="poids" stroke="#e879f9" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState>Pas encore assez de pesées.</EmptyState>
        )}
      </Card>

      <Card>
        <h2 className="text-sm font-medium text-slate-300 mb-2">Dernières séances</h2>
        {partnerSessions.length === 0 ? (
          <EmptyState>Aucune séance enregistrée.</EmptyState>
        ) : (
          <div className="space-y-1.5">
            {partnerSessions.map((s) => (
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
