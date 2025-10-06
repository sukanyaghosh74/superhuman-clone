import axios from 'axios'

export async function listMessages(q?: string) {
  const params: any = {}
  if (q) params.q = q
  const { data } = await axios.get('/gmail/messages', { params })
  return data
}

export async function getThread(id: string) {
  const { data } = await axios.get(`/gmail/threads/${id}`)
  return data
}

export async function sendEmail(payload: { to: string; subject: string; body: string; cc?: string[] }) {
  const { data } = await axios.post('/gmail/send', payload)
  return data
}

export async function aiDraft(thread_snippet: string, tone?: string) {
  const { data } = await axios.post('/ai/draft', { thread_snippet, tone })
  return data
}

export async function aiSummarize(thread_text: string) {
  const { data } = await axios.post('/ai/summarize', { thread_text })
  return data
}
