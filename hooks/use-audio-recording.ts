import { useState, useEffect, useRef, useCallback } from 'react'
import { AudioEngine, type AudioEngineOptions, type AudioLevelData } from '@/lib/audio-engine'

interface UseAudioRecordingOptions extends AudioEngineOptions {
  onRecordingComplete?: (audioBlob: Blob) => void
  onError?: (error: Error) => void
}

interface AudioRecordingState {
  isInitialized: boolean
  isRecording: boolean
  isPaused: boolean
  audioLevel: number
  duration: number
  error: string | null
  isSupported: boolean
}

export function useAudioRecording(options: UseAudioRecordingOptions = {}) {
  const audioEngineRef = useRef<AudioEngine | null>(null)
  const startTimeRef = useRef<number>(0)
  const pausedTimeRef = useRef<number>(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const [state, setState] = useState<AudioRecordingState>({
    isInitialized: false,
    isRecording: false,
    isPaused: false,
    audioLevel: 0,
    duration: 0,
    error: null,
    isSupported: AudioEngine.isSupported()
  })

  // Initialize audio engine
  const initialize = useCallback(async () => {
    if (!state.isSupported) {
      setState(prev => ({ ...prev, error: 'Audio recording not supported in this browser' }))
      return false
    }

    try {
      audioEngineRef.current = new AudioEngine(options)
      
      // Set up audio level monitoring
      audioEngineRef.current.setAudioLevelCallback((levelData: AudioLevelData) => {
        setState(prev => ({ ...prev, audioLevel: levelData.instant * 100 }))
      })

      await audioEngineRef.current.initialize()
      
      setState(prev => ({ 
        ...prev, 
        isInitialized: true, 
        error: null 
      }))
      
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize audio recording'
      setState(prev => ({ ...prev, error: errorMessage }))
      options.onError?.(error instanceof Error ? error : new Error(errorMessage))
      return false
    }
  }, [options, state.isSupported])

  // Start recording
  const startRecording = useCallback(async () => {
    if (!audioEngineRef.current) {
      const initialized = await initialize()
      if (!initialized) return false
    }

    try {
      await audioEngineRef.current!.startRecording()
      startTimeRef.current = Date.now()
      pausedTimeRef.current = 0
      
      setState(prev => ({ 
        ...prev, 
        isRecording: true, 
        isPaused: false, 
        duration: 0,
        error: null 
      }))

      // Start duration timer
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current > 0) {
          const now = Date.now()
          const elapsed = (now - startTimeRef.current - pausedTimeRef.current) / 1000
          setState(prev => ({ ...prev, duration: Math.max(0, elapsed) }))
        }
      }, 100)

      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start recording'
      setState(prev => ({ ...prev, error: errorMessage }))
      options.onError?.(error instanceof Error ? error : new Error(errorMessage))
      return false
    }
  }, [initialize, options])

  // Pause recording
  const pauseRecording = useCallback(() => {
    if (!audioEngineRef.current) return

    try {
      audioEngineRef.current.pauseRecording()
      pausedTimeRef.current = Date.now() - startTimeRef.current - pausedTimeRef.current
      
      setState(prev => ({ ...prev, isPaused: true }))
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to pause recording'
      setState(prev => ({ ...prev, error: errorMessage }))
      options.onError?.(error instanceof Error ? error : new Error(errorMessage))
    }
  }, [options])

  // Resume recording
  const resumeRecording = useCallback(() => {
    if (!audioEngineRef.current) return

    try {
      audioEngineRef.current.resumeRecording()
      startTimeRef.current = Date.now() - pausedTimeRef.current
      
      setState(prev => ({ ...prev, isPaused: false }))

      // Resume duration timer
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current > 0) {
          const now = Date.now()
          const elapsed = (now - startTimeRef.current) / 1000
          setState(prev => ({ ...prev, duration: Math.max(0, elapsed) }))
        }
      }, 100)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resume recording'
      setState(prev => ({ ...prev, error: errorMessage }))
      options.onError?.(error instanceof Error ? error : new Error(errorMessage))
    }
  }, [options])

  // Stop recording
  const stopRecording = useCallback(async () => {
    if (!audioEngineRef.current) return null

    try {
      const audioBlob = await audioEngineRef.current.stopRecording()
      
      setState(prev => ({ 
        ...prev, 
        isRecording: false, 
        isPaused: false,
        audioLevel: 0
      }))

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }

      options.onRecordingComplete?.(audioBlob)
      return audioBlob
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to stop recording'
      setState(prev => ({ ...prev, error: errorMessage }))
      options.onError?.(error instanceof Error ? error : new Error(errorMessage))
      return null
    }
  }, [options])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      
      if (audioEngineRef.current) {
        audioEngineRef.current.dispose()
      }
    }
  }, [])

  // Get available audio devices
  const getAudioDevices = useCallback(async () => {
    try {
      return await AudioEngine.getAudioInputDevices()
    } catch (error) {
      console.error('Failed to get audio devices:', error)
      return []
    }
  }, [])

  // Get current media stream
  const getMediaStream = useCallback((): MediaStream | null => {
    return audioEngineRef.current?.getMediaStream() || null
  }, [])

  return {
    ...state,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    initialize,
    getAudioDevices,
    getMediaStream
  }
}