import axios from 'axios'
import { db } from './db'

export async function listMessages(q?: string) {
  const params: any = {}
  if (q) params.q = q
  try {
    const { data } = await axios.get('/gmail/messages', { params })
    const messages = data?.messages ?? []
    await db.messages.bulkPut(messages.map((m: any) => ({ id: m.id, threadId: m.threadId, updatedAt: Date.now() })))
    return data
  } catch (e) {
    const cached = await db.messages.orderBy('updatedAt').reverse().limit(50).toArray()
    return { messages: cached }
  }
}

export async function getThread(id: string) {
  try {
    const { data } = await axios.get(`/gmail/threads/${id}`)
    await db.threads.put({ id, payload: data, updatedAt: Date.now() })
    return data
  } catch (e) {
    const cached = await db.threads.get(id)
    if (cached) return cached.payload
    throw e
  }
}

export async function sendEmail(payload: { to: string; subject: string; body: string; cc?: string[] }) {
  const { data } = await axios.post('/gmail/send', payload)
  return data
}

export async function deleteMessage(id: string) {
  const { data } = await axios.delete(`/gmail/messages/${id}`)
  await db.messages.delete(id)
  return data
}

export async function archiveMessage(id: string) {
  const { data } = await axios.post(`/gmail/messages/${id}/archive`)
  await db.messages.delete(id)
  return data
}

export async function listLabels() {
  const { data } = await axios.get('/gmail/labels')
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
