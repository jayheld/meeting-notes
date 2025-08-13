export interface Meeting {
  id: string
  title: string
  date: Date
  duration: number
  filePath: string
  audioPath: string
  transcriptPath: string
  summaryPath?: string
  notesPath?: string
  participants: string[]
  topics: string[]
  status: 'recording' | 'processing' | 'completed' | 'error'
  size: number
  createdAt: Date
  updatedAt: Date
  summary?: string
  transcript?: {
    segments: TranscriptSegment[]
    fullText: string
  }
}

export interface TranscriptSegment {
  id: string
  startTime: number
  endTime: number
  text: string
  speaker?: string
  confidence: number
}

export interface MeetingSummary {
  summary: string
  keyPoints: string[]
  actionItems: ActionItem[]
  decisions: Decision[]
  topics: Topic[]
  sentiment: SentimentScore
}

export interface ActionItem {
  id: string
  text: string
  assignee?: string
  dueDate?: Date
  completed: boolean
  priority: 'low' | 'medium' | 'high'
}

export interface Decision {
  id: string
  text: string
  timestamp: number
  participants: string[]
}

export interface Topic {
  name: string
  relevance: number
  mentions: number
  timestamps: number[]
}

export interface SentimentScore {
  overall: 'positive' | 'neutral' | 'negative'
  score: number
  segments: {
    timestamp: number
    sentiment: 'positive' | 'neutral' | 'negative'
    score: number
  }[]
}

export interface AudioSettings {
  sampleRate: number
  channelCount: number
  noiseReduction: boolean
  autoGain: boolean
  quality: 'low' | 'medium' | 'high'
}

export interface TranscriptionSettings {
  language: string
  enableSpeakerDetection: boolean
  enablePunctuation: boolean
  confidence: number
}

export interface RecordingState {
  isRecording: boolean
  isPaused: boolean
  duration: number
  audioLevel: number
  currentMeeting?: Meeting
}

export interface SearchFilters {
  dateRange?: {
    start?: Date
    end?: Date
  }
  participants?: string[]
  topics?: string[]
  minDuration?: number
  maxDuration?: number
  status?: Meeting['status'][]
}

export interface SearchResult {
  meeting: Meeting
  segments: TranscriptSegment[]
  relevanceScore: number
  matchType: 'title' | 'transcript' | 'summary' | 'notes'
}

export type ExportFormat = 'pdf' | 'markdown' | 'txt' | 'json' | 'audio'

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  audio: AudioSettings
  transcription: TranscriptionSettings
  storage: {
    maxStorageSize: number
    autoDeleteOldMeetings: boolean
    retentionDays: number
  }
  privacy: {
    enableLocalProcessing: boolean
    enableCloudSync: boolean
    encryptStorage: boolean
  }
}