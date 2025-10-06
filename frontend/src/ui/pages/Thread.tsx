import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getThread } from '../../utils/api'
import { aiSummarize } from '../../utils/api'

export default function Thread() {
  const { id } = useParams()
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

  return (
    <div>
      <button onClick={summarize}>Summarize</button>
      {summary && <pre>{summary}</pre>}
      <pre>{JSON.stringify(thread, null, 2)}</pre>
    </div>
  )
}
