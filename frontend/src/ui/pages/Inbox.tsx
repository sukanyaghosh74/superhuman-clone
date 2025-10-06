import { useEffect, useMemo, useState } from 'react'
import { listMessages, deleteMessage } from '../../utils/api'
import { useHotkeys } from 'react-hotkeys-hook'
import { Link } from 'react-router-dom'

export default function Inbox() {
  const [q, setQ] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const id = setTimeout(async () => {
      const data = await listMessages(q)
      setMessages(data?.messages ?? [])
      setIdx(0)
    }, 200)
    return () => clearTimeout(id)
  }, [q])

  useHotkeys('c', () => (window.location.href = '/compose'))
  useHotkeys('j', () => setIdx((i) => Math.min(i + 1, Math.max(0, messages.length - 1))), [messages])
  useHotkeys('k', () => setIdx((i) => Math.max(i - 1, 0)), [messages])
  useHotkeys('del,backspace', async () => {
    const m = messages[idx]
    if (!m) return
    await deleteMessage(m.id)
    setMessages((prev) => prev.filter((x) => x.id !== m.id))
    setIdx((i) => Math.max(0, i - 1))
  }, [messages, idx])

  const suggestions = useMemo(() => {
    if (!q) return [] as string[]
    const ids = messages.map((m) => m.id)
    return ids.filter((id) => id.includes(q)).slice(0, 5)
  }, [q, messages])

  return (
    <div>
      <input
        placeholder="Search..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 4 }}
      />
      {suggestions.length > 0 && (
        <div style={{ border: '1px solid #333', marginBottom: 12 }}>
          {suggestions.map((s) => (
            <div key={s} style={{ padding: 6 }}>{s}</div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {messages.map((m, i) => (
          <Link key={m.id} to={`/thread/${m.threadId}`} style={{
            padding: 6,
            background: idx === i ? '#1e293b' : 'transparent',
            textDecoration: 'none', color: 'inherit'
          }}>
            {m.id}
          </Link>
        ))}
      </div>
    </div>
  )
}
