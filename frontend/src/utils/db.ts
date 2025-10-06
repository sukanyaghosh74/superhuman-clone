import Dexie, { Table } from 'dexie'

export interface CachedMessage {
  id: string
  threadId: string
  snippet?: string
  labelIds?: string[]
  updatedAt: number
}

export interface CachedThread {
  id: string
  payload: any
  updatedAt: number
}

class AppDB extends Dexie {
  messages!: Table<CachedMessage, string>
  threads!: Table<CachedThread, string>

  constructor() {
    super('superhuman-db')
    this.version(1).stores({
      messages: 'id, threadId, updatedAt, *labelIds',
      threads: 'id, updatedAt',
    })
  }
}

export const db = new AppDB()
