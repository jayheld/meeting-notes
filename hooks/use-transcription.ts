import { useState, useEffect, useRef, useCallback } from 'react'
import { createTranscriptionEngine, type TranscriptionEngine, type TranscriptionOptions } from '@/lib/transcription-engine'
import type { TranscriptSegment } from '@/types'

interface UseTranscriptionOptions extends TranscriptionOptions {
  autoSave?: boolean
  onSegmentAdded?: (segment: TranscriptSegment) => void
  onError?: (error: Error) => void
}

interface TranscriptionState {
  isActive: boolean
  segments: TranscriptSegment[]
  currentText: string
  error: string | null
  isSupported: boolean
}

export function useTranscription(options: UseTranscriptionOptions = {}) {
  const engineRef = useRef<TranscriptionEngine | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [state, setState] = useState<TranscriptionState>({
    isActive: false,
    segments: [],
    currentText: '',
    error: null,
    isSupported: true
  })

  // Initialize transcription engine
  useEffect(() => {
    const engine = createTranscriptionEngine()
    engineRef.current = engine

    setState(prev => ({
      ...prev,
      isSupported: engine.isSupported()
    }))

    // Set up callbacks
    engine.onTranscript = (segment: TranscriptSegment) => {
      setState(prev => ({
        ...prev,
        segments: [...prev.segments, segment],
        currentText: segment.text
      }))
      
      options.onSegmentAdded?.(segment)
    }

    engine.onError = (error: Error) => {
      setState(prev => ({
        ...prev,
        error: error.message,
        isActive: false
      }))
      
      options.onError?.(error)
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.stopTranscription()
      }
    }
  }, [options])

  const startTranscription = useCallback(async (stream: MediaStream) => {
    if (!engineRef.current || !state.isSupported) {
      throw new Error('Transcription engine not available')
    }

    try {
      streamRef.current = stream
      await engineRef.current.startTranscription(stream, options)
      
      setState(prev => ({
        ...prev,
        isActive: true,
        error: null,
        segments: [], // Clear previous segments
        currentText: ''
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start transcription'
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isActive: false
      }))
      throw error
    }
  }, [options, state.isSupported])

  const stopTranscription = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.stopTranscription()
    }
    
    setState(prev => ({
      ...prev,
      isActive: false,
      currentText: ''
    }))

    streamRef.current = null
  }, [])

  const clearTranscript = useCallback(() => {
    setState(prev => ({
      ...prev,
      segments: [],
      currentText: ''
    }))
  }, [])

  const addManualSegment = useCallback((text: string, speaker?: string) => {
    const segment: TranscriptSegment = {
      id: `manual_${Date.now()}`,
      startTime: state.segments.length > 0 
        ? Math.max(...state.segments.map(s => s.endTime))
        : 0,
      endTime: state.segments.length > 0 
        ? Math.max(...state.segments.map(s => s.endTime)) + 2
        : 2,
      text: text.trim(),
      confidence: 1.0, // Manual entries have perfect confidence
      speaker: speaker || 'Manual Entry'
    }

    setState(prev => ({
      ...prev,
      segments: [...prev.segments, segment]
    }))

    options.onSegmentAdded?.(segment)
  }, [state.segments, options])

  const updateSegment = useCallback((segmentId: string, updates: Partial<TranscriptSegment>) => {
    setState(prev => ({
      ...prev,
      segments: prev.segments.map(segment =>
        segment.id === segmentId 
          ? { ...segment, ...updates }
          : segment
      )
    }))
  }, [])

  const deleteSegment = useCallback((segmentId: string) => {
    setState(prev => ({
      ...prev,
      segments: prev.segments.filter(segment => segment.id !== segmentId)
    }))
  }, [])

  const searchSegments = useCallback((query: string): TranscriptSegment[] => {
    if (!query.trim()) return state.segments

    const searchTerms = query.toLowerCase().split(' ')
    
    return state.segments.filter(segment =>
      searchTerms.every(term =>
        segment.text.toLowerCase().includes(term) ||
        segment.speaker?.toLowerCase().includes(term)
      )
    )
  }, [state.segments])

  const exportTranscript = useCallback((format: 'text' | 'json' | 'srt' = 'text'): string => {
    const sortedSegments = [...state.segments].sort((a, b) => a.startTime - b.startTime)

    switch (format) {
      case 'json':
        return JSON.stringify(sortedSegments, null, 2)
      
      case 'srt':
        return sortedSegments.map((segment, index) => {
          const startTime = formatSRTTime(segment.startTime)
          const endTime = formatSRTTime(segment.endTime)
          return `${index + 1}\n${startTime} --> ${endTime}\n${segment.text}\n`
        }).join('\n')
      
      case 'text':
      default:
        return sortedSegments.map(segment => {
          const timestamp = formatTime(segment.startTime)
          const speaker = segment.speaker ? `[${segment.speaker}] ` : ''
          return `${timestamp} ${speaker}${segment.text}`
        }).join('\n')
    }
  }, [state.segments])

  const getStatistics = useCallback(() => {
    const speakers = new Set(state.segments.map(s => s.speaker).filter(Boolean))
    const totalWords = state.segments.reduce((sum, segment) => 
      sum + segment.text.split(' ').length, 0
    )
    const duration = state.segments.length > 0 
      ? Math.max(...state.segments.map(s => s.endTime)) - Math.min(...state.segments.map(s => s.startTime))
      : 0
    const averageConfidence = state.segments.length > 0
      ? state.segments.reduce((sum, s) => sum + s.confidence, 0) / state.segments.length
      : 0

    return {
      speakerCount: speakers.size,
      wordCount: totalWords,
      duration,
      averageConfidence,
      segmentCount: state.segments.length
    }
  }, [state.segments])

  return {
    // State
    ...state,
    
    // Actions
    startTranscription,
    stopTranscription,
    clearTranscript,
    addManualSegment,
    updateSegment,
    deleteSegment,
    
    // Utilities
    searchSegments,
    exportTranscript,
    getStatistics
  }
}

// Helper functions
function formatTime(seconds: number): string {
  const date = new Date(seconds * 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

function formatSRTTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  const milliseconds = Math.floor((remainingSeconds % 1) * 1000)
  const wholeSeconds = Math.floor(remainingSeconds)
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${wholeSeconds.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`
}