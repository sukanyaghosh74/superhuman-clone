import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getThread } from '../../utils/api'
import { aiSummarize } from '../../utils/api'
import { useHotkeys } from 'react-hotkeys-hook'

export default function Thread() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [thread, setThread] = useState<any | null>(null)
  const [summary, setSummary] = useState('')

  useEffect(() => {
    (async () => {
      if (!id) return
      const data = await getThread(id)
      setThread(data)
    })()
  }, [id])

  async function summarize() {
    const text = JSON.stringify(thread)
    const res = await aiSummarize(text)
    setSummary(res.summary)
  }

  useHotkeys('r', () => {
    if (!thread) return
    const subject = 'Re: ' + (thread.snippet || 'Thread')
    const params = new URLSearchParams({ subject })
    navigate(`/compose?${params.toString()}`)
  }, [thread])

  return (
    <div>
      <button onClick={summarize}>Summarize</button>
      {summary && <pre>{summary}</pre>}
      <pre>{JSON.stringify(thread, null, 2)}</pre>
      <div style={{ marginTop: 12, color: '#94a3b8' }}>Hotkeys: r reply</div>
    </div>
  )
}
