import { useEffect, useMemo, useState } from 'react'
import { aiDraft, sendEmail } from '../../utils/api'
import { db } from '../../utils/db'

export default function Compose() {
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [contacts, setContacts] = useState<string[]>([])

  useEffect(() => {
    const u = new URL(window.location.href)
    const qsSubject = u.searchParams.get('subject')
    const qsBody = u.searchParams.get('body')
    if (qsSubject) setSubject(qsSubject)
    if (qsBody) setBody(qsBody)
  }, [])

  useEffect(() => {
    (async () => {
      const msgs = await db.messages.limit(200).toArray()
      const guesses = new Set<string>()
      msgs.forEach((m) => {
        if (m.snippet) {
          const matches = m.snippet.match(/[\w.-]+@[\w.-]+/g) || []
          matches.forEach((e) => guesses.add(e))
        }
      })
      setContacts(Array.from(guesses).slice(0, 20))
    })()
  }, [])

  const suggestions = useMemo(() => {
    if (!to) return []
    return contacts.filter((c) => c.toLowerCase().includes(to.toLowerCase())).slice(0, 5)
  }, [to, contacts])

  async function draft() {
    const res = await aiDraft('Write a quick follow up on the meeting', 'professional')
    setBody(res.draft)
  }

  async function send() {
    await sendEmail({ to, subject, body })
    alert('Sent')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div>
        <input placeholder="To" value={to} onChange={(e) => setTo(e.target.value)} />
        {suggestions.length > 0 && (
          <div style={{ border: '1px solid #333' }}>
            {suggestions.map((s) => (
              <div key={s} style={{ padding: 6, cursor: 'pointer' }} onClick={() => setTo(s)}>{s}</div>
            ))}
          </div>
        )}
      </div>
      <input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
      <textarea placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} rows={12} />
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={draft}>AI Draft</button>
        <button onClick={send}>Send</button>
      </div>
    </div>
  )
}
