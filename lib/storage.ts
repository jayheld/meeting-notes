import type { Meeting, TranscriptSegment, MeetingSummary } from '@/types'

const DB_NAME = 'MeetingTranscriptionApp'
const DB_VERSION = 1

interface DatabaseSchema {
  meetings: Meeting
  transcripts: {
    id: string
    meetingId: string
    segments: TranscriptSegment[]
    createdAt: Date
  }
  summaries: {
    id: string
    meetingId: string
    summary: MeetingSummary
    createdAt: Date
  }
  audioFiles: {
    id: string
    meetingId: string
    audioBlob: Blob
    createdAt: Date
  }
}

class MeetingStorage {
  public db: IDBDatabase | null = null

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        reject(new Error('Failed to open database'))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create meetings store
        if (!db.objectStoreNames.contains('meetings')) {
          const meetingsStore = db.createObjectStore('meetings', { keyPath: 'id' })
          meetingsStore.createIndex('date', 'date', { unique: false })
          meetingsStore.createIndex('status', 'status', { unique: false })
          meetingsStore.createIndex('title', 'title', { unique: false })
        }

        // Create transcripts store
        if (!db.objectStoreNames.contains('transcripts')) {
          const transcriptsStore = db.createObjectStore('transcripts', { keyPath: 'id' })
          transcriptsStore.createIndex('meetingId', 'meetingId', { unique: true })
        }

        // Create summaries store
        if (!db.objectStoreNames.contains('summaries')) {
          const summariesStore = db.createObjectStore('summaries', { keyPath: 'id' })
          summariesStore.createIndex('meetingId', 'meetingId', { unique: true })
        }

        // Create audioFiles store
        if (!db.objectStoreNames.contains('audioFiles')) {
          const audioFilesStore = db.createObjectStore('audioFiles', { keyPath: 'id' })
          audioFilesStore.createIndex('meetingId', 'meetingId', { unique: true })
        }
      }
    })
  }

  private ensureDatabase(): void {
    if (!this.db) {
      throw new Error('Database not initialized. Call initialize() first.')
    }
  }

  // Meeting operations
  async saveMeeting(meeting: Meeting): Promise<void> {
    this.ensureDatabase()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['meetings'], 'readwrite')
      const store = transaction.objectStore('meetings')
      const request = store.put(meeting)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to save meeting'))
    })
  }

  async getMeeting(id: string): Promise<Meeting | null> {
    this.ensureDatabase()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['meetings'], 'readonly')
      const store = transaction.objectStore('meetings')
      const request = store.get(id)

      request.onsuccess = () => {
        resolve(request.result || null)
      }
      request.onerror = () => reject(new Error('Failed to get meeting'))
    })
  }

  async getAllMeetings(): Promise<Meeting[]> {
    this.ensureDatabase()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['meetings'], 'readonly')
      const store = transaction.objectStore('meetings')
      const index = store.index('date')
      const request = index.getAll()

      request.onsuccess = () => {
        // Sort by date descending (most recent first)
        const meetings = request.result.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        resolve(meetings)
      }
      request.onerror = () => reject(new Error('Failed to get meetings'))
    })
  }

  async deleteMeeting(id: string): Promise<void> {
    this.ensureDatabase()
    
    const transaction = this.db!.transaction(['meetings', 'transcripts', 'summaries', 'audioFiles'], 'readwrite')
    
    try {
      // Delete meeting
      const meetingsStore = transaction.objectStore('meetings')
      await this.deleteFromStore(meetingsStore, id)

      // Delete related data
      const transcriptsStore = transaction.objectStore('transcripts')
      const summariesStore = transaction.objectStore('summaries')
      const audioFilesStore = transaction.objectStore('audioFiles')

      const transcriptIndex = transcriptsStore.index('meetingId')
      const summaryIndex = summariesStore.index('meetingId')
      const audioIndex = audioFilesStore.index('meetingId')

      // Delete transcript
      const transcriptRequest = transcriptIndex.get(id)
      transcriptRequest.onsuccess = () => {
        if (transcriptRequest.result) {
          transcriptsStore.delete(transcriptRequest.result.id)
        }
      }

      // Delete summary
      const summaryRequest = summaryIndex.get(id)
      summaryRequest.onsuccess = () => {
        if (summaryRequest.result) {
          summariesStore.delete(summaryRequest.result.id)
        }
      }

      // Delete audio file
      const audioRequest = audioIndex.get(id)
      audioRequest.onsuccess = () => {
        if (audioRequest.result) {
          audioFilesStore.delete(audioRequest.result.id)
        }
      }

    } catch (error) {
      throw new Error('Failed to delete meeting and related data')
    }
  }

  // Audio file operations
  async saveAudioFile(meetingId: string, audioBlob: Blob): Promise<void> {
    this.ensureDatabase()
    
    const audioFile = {
      id: `audio_${meetingId}`,
      meetingId,
      audioBlob,
      createdAt: new Date()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['audioFiles'], 'readwrite')
      const store = transaction.objectStore('audioFiles')
      const request = store.put(audioFile)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to save audio file'))
    })
  }

  async getAudioFile(meetingId: string): Promise<Blob | null> {
    this.ensureDatabase()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['audioFiles'], 'readonly')
      const store = transaction.objectStore('audioFiles')
      const index = store.index('meetingId')
      const request = index.get(meetingId)

      request.onsuccess = () => {
        const result = request.result
        resolve(result ? result.audioBlob : null)
      }
      request.onerror = () => reject(new Error('Failed to get audio file'))
    })
  }

  // Transcript operations
  async saveTranscript(meetingId: string, segments: TranscriptSegment[]): Promise<void> {
    this.ensureDatabase()
    
    const transcript = {
      id: `transcript_${meetingId}`,
      meetingId,
      segments,
      createdAt: new Date()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['transcripts'], 'readwrite')
      const store = transaction.objectStore('transcripts')
      const request = store.put(transcript)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to save transcript'))
    })
  }

  async getTranscript(meetingId: string): Promise<TranscriptSegment[] | null> {
    this.ensureDatabase()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['transcripts'], 'readonly')
      const store = transaction.objectStore('transcripts')
      const index = store.index('meetingId')
      const request = index.get(meetingId)

      request.onsuccess = () => {
        const result = request.result
        resolve(result ? result.segments : null)
      }
      request.onerror = () => reject(new Error('Failed to get transcript'))
    })
  }

  // Summary operations
  async saveSummary(meetingId: string, summary: MeetingSummary): Promise<void> {
    this.ensureDatabase()
    
    const summaryRecord = {
      id: `summary_${meetingId}`,
      meetingId,
      summary,
      createdAt: new Date()
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['summaries'], 'readwrite')
      const store = transaction.objectStore('summaries')
      const request = store.put(summaryRecord)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to save summary'))
    })
  }

  async getSummary(meetingId: string): Promise<MeetingSummary | null> {
    this.ensureDatabase()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['summaries'], 'readonly')
      const store = transaction.objectStore('summaries')
      const index = store.index('meetingId')
      const request = index.get(meetingId)

      request.onsuccess = () => {
        const result = request.result
        resolve(result ? result.summary : null)
      }
      request.onerror = () => reject(new Error('Failed to get summary'))
    })
  }

  // Search functionality
  async searchMeetings(query: string): Promise<Meeting[]> {
    const allMeetings = await this.getAllMeetings()
    
    if (!query.trim()) {
      return allMeetings
    }

    const searchTerms = query.toLowerCase().split(' ')
    
    return allMeetings.filter(meeting => {
      const searchableText = [
        meeting.title,
        ...meeting.participants,
        ...meeting.topics
      ].join(' ').toLowerCase()

      return searchTerms.every(term => searchableText.includes(term))
    })
  }

  // Utility method
  private deleteFromStore(store: IDBObjectStore, key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = store.delete(key)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to delete from store'))
    })
  }

  // Database information
  async getDatabaseSize(): Promise<number> {
    try {
      const estimate = await navigator.storage.estimate()
      return estimate.usage || 0
    } catch (error) {
      console.warn('Storage estimate not available:', error)
      return 0
    }
  }

  // Export/Import functionality
  async exportAllData(): Promise<{
    meetings: Meeting[]
    transcripts: any[]
    summaries: any[]
  }> {
    this.ensureDatabase()
    
    const meetings = await this.getAllMeetings()
    
    // Get all transcripts and summaries
    const transcripts: any[] = []
    const summaries: any[] = []
    
    for (const meeting of meetings) {
      const transcript = await this.getTranscript(meeting.id)
      const summary = await this.getSummary(meeting.id)
      
      if (transcript) {
        transcripts.push({
          meetingId: meeting.id,
          segments: transcript
        })
      }
      
      if (summary) {
        summaries.push({
          meetingId: meeting.id,
          summary
        })
      }
    }
    
    return { meetings, transcripts, summaries }
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }
}

// Create singleton instance
export const meetingStorage = new MeetingStorage()

// Initialize on module load
if (typeof window !== 'undefined') {
  // Initialize storage when the window loads to ensure everything is ready
  window.addEventListener('load', () => {
    meetingStorage.initialize().catch(console.error)
  })
  
  // Also try to initialize immediately in case window is already loaded
  if (document.readyState === 'complete') {
    meetingStorage.initialize().catch(console.error)
  }
}