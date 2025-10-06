import { useState } from 'react'
import { aiDraft, sendEmail } from '../../utils/api'

export default function Compose() {
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

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
      <input placeholder="To" value={to} onChange={(e) => setTo(e.target.value)} />
      <input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
      <textarea placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} rows={12} />
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={draft}>AI Draft</button>
        <button onClick={send}>Send</button>
      </div>
    </div>
  )
}
