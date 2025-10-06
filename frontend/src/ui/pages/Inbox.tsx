import { useEffect, useState } from 'react'
import { listMessages } from '../../utils/api'
import { useHotkeys } from 'react-hotkeys-hook'
import { Link } from 'react-router-dom'

export default function Inbox() {
  const [q, setQ] = useState('')
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    const id = setTimeout(async () => {
      const data = await listMessages(q)
      setMessages(data?.messages ?? [])
    }, 200)
    return () => clearTimeout(id)
  }, [q])

  useHotkeys('c', () => (window.location.href = '/compose'))

  return (
    <div>
      <input
        placeholder="Search..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 16 }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {messages.map((m) => (
          <Link key={m.id} to={`/thread/${m.threadId}`}>
            {m.id}
          </Link>
        ))}
      </div>
    </div>
  )
}
