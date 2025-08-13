import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { Meeting, RecordingState, AppSettings, SearchFilters } from '@/types'

interface MeetingStore {
  // State
  currentMeeting: Meeting | null
  recordingState: RecordingState
  searchQuery: string
  searchFilters: SearchFilters
  settings: AppSettings
  
  // Actions
  setCurrentMeeting: (meeting: Meeting | null) => void
  
  // Recording actions
  startRecording: (meeting: Meeting) => void
  stopRecording: () => void
  pauseRecording: () => void
  resumeRecording: () => void
  updateRecordingState: (updates: Partial<RecordingState>) => void
  
  // Search actions
  setSearchQuery: (query: string) => void
  setSearchFilters: (filters: SearchFilters) => void
  
  // Settings actions
  updateSettings: (updates: Partial<AppSettings>) => void
}

const defaultSettings: AppSettings = {
  theme: 'system',
  audio: {
    sampleRate: 44100,
    channelCount: 1,
    noiseReduction: true,
    autoGain: true,
    quality: 'high'
  },
  transcription: {
    language: 'en-US',
    enableSpeakerDetection: true,
    enablePunctuation: true,
    confidence: 0.8
  },
  storage: {
    maxStorageSize: 10 * 1024 * 1024 * 1024, // 10GB
    autoDeleteOldMeetings: false,
    retentionDays: 365
  },
  privacy: {
    enableLocalProcessing: true,
    enableCloudSync: false,
    encryptStorage: true
  }
}

const defaultRecordingState: RecordingState = {
  isRecording: false,
  isPaused: false,
  duration: 0,
  audioLevel: 0,
  currentMeeting: undefined
}

export const useMeetingStore = create<MeetingStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentMeeting: null,
        recordingState: defaultRecordingState,
        searchQuery: '',
        searchFilters: {},
        settings: defaultSettings,

        setCurrentMeeting: (meeting) =>
          set({ currentMeeting: meeting }),

        // Recording actions
        startRecording: (meeting) =>
          set({
            recordingState: {
              ...defaultRecordingState,
              isRecording: true,
              currentMeeting: meeting
            },
            currentMeeting: meeting
          }),

        stopRecording: () =>
          set((state) => ({
            recordingState: {
              ...state.recordingState,
              isRecording: false,
              isPaused: false,
              currentMeeting: undefined
            }
          })),

        pauseRecording: () =>
          set((state) => ({
            recordingState: {
              ...state.recordingState,
              isPaused: true
            }
          })),

        resumeRecording: () =>
          set((state) => ({
            recordingState: {
              ...state.recordingState,
              isPaused: false
            }
          })),

        updateRecordingState: (updates) =>
          set((state) => ({
            recordingState: {
              ...state.recordingState,
              ...updates
            }
          })),

        // Search actions
        setSearchQuery: (query) =>
          set({ searchQuery: query }),

        setSearchFilters: (filters) =>
          set({ searchFilters: filters }),

        // Settings actions
        updateSettings: (updates) =>
          set((state) => ({
            settings: {
              ...state.settings,
              ...updates
            }
          }))
      }),
      {
        name: 'meeting-store',
        partialize: (state) => ({
          settings: state.settings
        })
      }
    ),
    {
      name: 'meeting-store'
    }
  )
)