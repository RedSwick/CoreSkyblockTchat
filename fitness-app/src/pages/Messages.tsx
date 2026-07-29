import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  getPartnerProfile,
  listMessages,
  markAllMessagesRead,
  sendMessage,
  subscribeToIncomingMessages,
} from '../lib/api'
import { Button, EmptyState, PageTitle, Spinner } from '../components/ui'
import type { Message, Profile } from '../types'

const QUICK_MESSAGES = [
  'Bravo mon cœur ! 💪',
  'Trop fort(e) ! 🔥',
  'Fier/fière de toi !',
  'Continue comme ça 👏',
  "Faut boire de l'eau ! 💧",
  'On y retourne demain ?',
]

function formatTime(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  return sameDay
    ? d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export function Messages() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [partner, setPartner] = useState<Profile | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!profile) return
    let cancelled = false

    async function load() {
      const p = await getPartnerProfile(profile!)
      if (cancelled) return
      setPartner(p)
      if (profile!.couple_id) {
        const msgs = await listMessages(profile!.couple_id)
        if (cancelled) return
        setMessages(msgs.slice().reverse())
      }
      await markAllMessagesRead(profile!.id)
      setLoading(false)
    }
    load()

    const unsubscribe = subscribeToIncomingMessages(profile.id, (msg) => {
      setMessages((prev) => [...prev, msg])
      markAllMessagesRead(profile.id)
    })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [profile])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  async function handleSend(body: string) {
    if (!profile || !partner || !profile.couple_id || !body.trim()) return
    setSending(true)
    try {
      const msg = await sendMessage({
        coupleId: profile.couple_id,
        fromProfileId: profile.id,
        toProfileId: partner.id,
        kind: 'custom',
        body: body.trim(),
      })
      setMessages((prev) => [...prev, msg])
      setDraft('')
    } finally {
      setSending(false)
    }
  }

  if (!profile || loading) return <Spinner />

  if (!partner) {
    return (
      <div className="flex-1 px-4 py-6">
        <PageTitle title="Messages" />
        <EmptyState>Lie ton compte à ton/ta partenaire (onglet Couple) pour pouvoir s'écrire.</EmptyState>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 pt-6 pb-2">
        <PageTitle title={partner.display_name} subtitle="Encouragements et petits mots" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-2">
        {messages.length === 0 ? (
          <EmptyState>Aucun message pour l'instant. Dis-lui un petit mot !</EmptyState>
        ) : (
          messages.map((m) => {
            const mine = m.from_profile_id === profile.id
            return (
              <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    mine
                      ? 'bg-gradient-to-br from-sky-400 to-indigo-500 text-slate-950 shadow-md shadow-sky-500/20'
                      : 'bg-slate-800/90 text-slate-100 border border-slate-700/50'
                  }`}
                >
                  <p>{m.body}</p>
                  <p className={`text-[10px] mt-1 ${mine ? 'text-slate-950/60' : 'text-slate-400'}`}>{formatTime(m.created_at)}</p>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 border-t border-slate-800 space-y-2">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {QUICK_MESSAGES.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              disabled={sending}
              className="shrink-0 rounded-full bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
            >
              {q}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend(draft)
          }}
          className="flex gap-2"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Écrire un message…"
            className="flex-1 rounded-xl bg-slate-800/80 border border-slate-700 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-sky-500"
          />
          <Button type="submit" disabled={sending || !draft.trim()}>
            Envoyer
          </Button>
        </form>
      </div>
    </div>
  )
}
