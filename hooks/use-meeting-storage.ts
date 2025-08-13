import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { meetingStorage } from '@/lib/storage'
import type { Meeting, TranscriptSegment, MeetingSummary } from '@/types'

export function useMeetingStorage() {
  const queryClient = useQueryClient()

  // Query for all meetings
  const {
    data: meetings = [],
    isLoading: isLoadingMeetings,
    error: meetingsError
  } = useQuery({
    queryKey: ['meetings'],
    queryFn: async () => {
      try {
        // Check if IndexedDB is available
        if (typeof window === 'undefined' || !window.indexedDB) {
          console.warn('IndexedDB not available, returning empty meetings array')
          return []
        }

        console.log('Initializing storage...')
        
        // Ensure storage is initialized before trying to get meetings
        if (!meetingStorage.db) {
          await meetingStorage.initialize()
          console.log('Storage initialized successfully')
        }
        
        const result = await meetingStorage.getAllMeetings()
        console.log('Got meetings:', result.length)
        return result
      } catch (error) {
        console.error('Failed to get meetings:', error)
        // Return empty array as fallback but still complete successfully
        return []
      }
    },
    staleTime: 30000, // 30 seconds
    retry: 1, // Retry failed requests once
    retryDelay: 500, // Wait 500ms between retries
    refetchOnWindowFocus: false, // Don't refetch on window focus
  })

  // Mutation for saving a meeting
  const saveMeetingMutation = useMutation({
    mutationFn: (meeting: Meeting) => meetingStorage.saveMeeting(meeting),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] })
    },
  })

  // Mutation for deleting a meeting
  const deleteMeetingMutation = useMutation({
    mutationFn: (meetingId: string) => meetingStorage.deleteMeeting(meetingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] })
    },
  })

  // Function to get a specific meeting
  const getMeeting = async (id: string): Promise<Meeting | null> => {
    return await meetingStorage.getMeeting(id)
  }

  // Function to save audio file
  const saveAudioFile = async (meetingId: string, audioBlob: Blob): Promise<void> => {
    return await meetingStorage.saveAudioFile(meetingId, audioBlob)
  }

  // Function to get audio file
  const getAudioFile = async (meetingId: string): Promise<Blob | null> => {
    return await meetingStorage.getAudioFile(meetingId)
  }

  // Function to save transcript
  const saveTranscript = async (meetingId: string, segments: TranscriptSegment[]): Promise<void> => {
    return await meetingStorage.saveTranscript(meetingId, segments)
  }

  // Function to get transcript
  const getTranscript = async (meetingId: string): Promise<TranscriptSegment[] | null> => {
    return await meetingStorage.getTranscript(meetingId)
  }

  // Function to save summary
  const saveSummary = async (meetingId: string, summary: MeetingSummary): Promise<void> => {
    return await meetingStorage.saveSummary(meetingId, summary)
  }

  // Function to get summary
  const getSummary = async (meetingId: string): Promise<MeetingSummary | null> => {
    return await meetingStorage.getSummary(meetingId)
  }

  // Search functionality
  const searchMeetings = async (query: string): Promise<Meeting[]> => {
    return await meetingStorage.searchMeetings(query)
  }

  // Export data
  const exportData = async () => {
    return await meetingStorage.exportAllData()
  }

  // Get database size
  const [databaseSize, setDatabaseSize] = useState<number>(0)

  useEffect(() => {
    meetingStorage.getDatabaseSize().then(setDatabaseSize)
  }, [meetings])

  return {
    // Data
    meetings,
    isLoadingMeetings,
    meetingsError,
    databaseSize,

    // Mutations
    saveMeeting: saveMeetingMutation.mutateAsync,
    deleteMeeting: deleteMeetingMutation.mutateAsync,
    isSavingMeeting: saveMeetingMutation.isPending,
    isDeletingMeeting: deleteMeetingMutation.isPending,

    // Functions
    getMeeting,
    saveAudioFile,
    getAudioFile,
    saveTranscript,
    getTranscript,
    saveSummary,
    getSummary,
    searchMeetings,
    exportData,
  }
}

// Hook for a specific meeting's data
export function useMeetingData(meetingId: string) {
  const { data: meeting, isLoading: isLoadingMeeting } = useQuery({
    queryKey: ['meeting', meetingId],
    queryFn: () => meetingStorage.getMeeting(meetingId),
    enabled: !!meetingId,
  })

  const { data: transcript, isLoading: isLoadingTranscript } = useQuery({
    queryKey: ['transcript', meetingId],
    queryFn: () => meetingStorage.getTranscript(meetingId),
    enabled: !!meetingId,
  })

  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['summary', meetingId],
    queryFn: () => meetingStorage.getSummary(meetingId),
    enabled: !!meetingId,
  })

  const { data: audioBlob, isLoading: isLoadingAudio } = useQuery({
    queryKey: ['audio', meetingId],
    queryFn: () => meetingStorage.getAudioFile(meetingId),
    enabled: !!meetingId,
  })

  return {
    meeting,
    transcript,
    summary,
    audioBlob,
    isLoading: isLoadingMeeting || isLoadingTranscript || isLoadingSummary || isLoadingAudio,
    isLoadingMeeting,
    isLoadingTranscript,
    isLoadingSummary,
    isLoadingAudio,
  }
}