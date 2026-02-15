import { useEffect } from 'react'
import { create } from 'zustand'

interface SyncItem {
  id: string
  type: 'image_upload' | 'analysis_result' | 'patient_record'
  data: any
  timestamp: number
}

interface SyncStore {
  queue: SyncItem[]
  addToQueue: (item: Omit<SyncItem, 'id' | 'timestamp'>) => void
  processQueue: () => Promise<void>
  isSyncing: boolean
}

export const useSyncQueueStore = create<SyncStore>((set, get) => ({
  queue: [],
  isSyncing: false,
  addToQueue: (item) => {
    const newItem = { ...item, id: crypto.randomUUID(), timestamp: Date.now() }
    set((state) => ({ queue: [...state.queue, newItem] }))
    console.log('[Offline Sync] Item added to queue:', newItem)
  },
  processQueue: async () => {
    const { queue } = get()
    if (queue.length === 0) return

    set({ isSyncing: true })
    console.log('[Offline Sync] Processing queue...', queue.length, 'items')
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    set({ queue: [], isSyncing: false })
    console.log('[Offline Sync] Sync complete!')
  }
}))

export function useOfflineSync() {
  const { processQueue } = useSyncQueueStore()

  useEffect(() => {
    const handleOnline = () => {
      console.log('Network restored. Processing sync queue...')
      processQueue()
    }

    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [processQueue])
}
