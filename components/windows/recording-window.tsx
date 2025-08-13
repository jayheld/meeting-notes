'use client'

import { useState } from 'react'
import { Mic, MicOff, Pause, Play, Square, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ClassicMicIcon } from '@/components/ui/classic-icons'
import { useMeetingStore } from '@/stores/meeting-store'
import { useMeetingStorage } from '@/hooks/use-meeting-storage'
import { useAudioRecording } from '@/hooks/use-audio-recording'
import { useTranscription } from '@/hooks/use-transcription'
import { formatDuration } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function RecordingWindowContent() {
  const [meetingTitle, setMeetingTitle] = useState('')
  const [participants, setParticipants] = useState('')
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  
  const { 
    recordingState, 
    startRecording, 
    stopRecording, 
    pauseRecording, 
    resumeRecording 
  } = useMeetingStore()

  const { saveMeeting } = useMeetingStorage()

  const audioRecording = useAudioRecording({
    onRecordingComplete: (blob) => {
      setAudioBlob(blob)
    },
    onError: (error) => {
      console.error('Recording error:', error)
    }
  })

  const transcription = useTranscription({
    language: 'en-US',
    continuous: true,
    interimResults: true,
    onSegmentAdded: (segment) => {
      console.log('New transcript segment:', segment)
    }
  })

  const handleStartRecording = async () => {
    try {
      const stream = await audioRecording.startRecording()
      if (stream instanceof MediaStream) {
        await transcription.startTranscription(stream)
      }
      
      const meeting = {
        id: `meeting-${Date.now()}`,
        title: meetingTitle || 'Untitled Meeting',
        date: new Date(),
        duration: 0,
        filePath: '',
        audioPath: '',
        transcriptPath: '',
        participants: participants.split(',').map(p => p.trim()).filter(Boolean),
        topics: [],
        status: 'recording' as const,
        size: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      startRecording(meeting)
    } catch (error) {
      console.error('Failed to start recording:', error)
    }
  }

  const handleStopRecording = async () => {
    audioRecording.stopRecording()
    transcription.stopTranscription()
    stopRecording()

    // Save the meeting
    if (meetingTitle) {
      const meeting = await saveMeeting({
        id: `meeting-${Date.now()}`,
        title: meetingTitle || 'Untitled Meeting',
        date: new Date(),
        participants: participants.split(',').map(p => p.trim()).filter(Boolean),
        duration: recordingState.duration,
        filePath: '',
        audioPath: '',
        transcriptPath: '',
        status: 'completed' as const,
        topics: [],
        size: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        transcript: {
          segments: transcription.segments,
          fullText: transcription.finalTranscript
        }
      })

      if (audioBlob) {
        // Save audio file (simplified for demo)
        console.log('Would save audio blob:', audioBlob.size, 'bytes')
      }
    }
  }

  const handlePauseRecording = () => {
    audioRecording.pauseRecording()
    transcription.pauseTranscription()
    pauseRecording()
  }

  const handleResumeRecording = () => {
    audioRecording.resumeRecording()
    transcription.resumeTranscription()
    resumeRecording()
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b-2 border-border p-4 bg-secondary">
        <div className="flex items-center gap-2 mb-4">
          <ClassicMicIcon className="w-6 h-6" />
          <h2 className="text-title-2 font-display font-semibold">New Recording</h2>
        </div>
        
        {/* Meeting Info */}
        <div className="space-y-3">
          <Input
            placeholder="Meeting title..."
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            className="font-body"
          />
          <Input
            placeholder="Participants (comma separated)..."
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            className="font-body"
          />
        </div>
      </div>

      {/* Recording Status */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {recordingState.isRecording && (
              <div className="w-3 h-3 bg-destructive animate-pulse" />
            )}
            <span className="text-body font-body font-medium">
              Status: {recordingState.isRecording ? (recordingState.isPaused ? 'Paused' : 'Recording') : 'Ready'}
            </span>
          </div>
          <div className="text-body font-body font-mono">
            {formatDuration(recordingState.duration)}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-b border-border/50">
        <div className="flex justify-center gap-2">
          {!recordingState.isRecording ? (
            <Button
              onClick={handleStartRecording}
              disabled={!meetingTitle.trim()}
              className="gap-2"
              variant="default"
            >
              <Mic className="w-4 h-4" />
              Start Recording
            </Button>
          ) : (
            <>
              {recordingState.isPaused ? (
                <Button onClick={handleResumeRecording} className="gap-2" variant="default">
                  <Play className="w-4 h-4" />
                  Resume
                </Button>
              ) : (
                <Button onClick={handlePauseRecording} className="gap-2" variant="outline">
                  <Pause className="w-4 h-4" />
                  Pause
                </Button>
              )}
              <Button onClick={handleStopRecording} className="gap-2" variant="destructive">
                <Square className="w-4 h-4" />
                Stop
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Live Transcript */}
      <div className="flex-1 p-4 overflow-auto">
        <h3 className="text-title-3 font-display mb-3">Live Transcript</h3>
        <div className="border-2 border-border p-4 bg-input min-h-32 font-body text-body">
          {transcription.finalTranscript && (
            <div className="mb-2">{transcription.finalTranscript}</div>
          )}
          {transcription.interimTranscript && (
            <div className="text-muted-foreground italic">
              {transcription.interimTranscript}
            </div>
          )}
          {!transcription.finalTranscript && !transcription.interimTranscript && (
            <div className="text-muted-foreground">
              {recordingState.isRecording 
                ? 'Listening for speech...' 
                : 'Start recording to see live transcript'
              }
            </div>
          )}
        </div>
      </div>

      {/* Audio Level Meter */}
      {recordingState.isRecording && (
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <span className="text-caption font-body">Audio Level:</span>
            <div className="flex-1 h-2 bg-muted border border-border">
              <div 
                className="h-full bg-success transition-all duration-100"
                style={{ width: `${(audioRecording.audioLevel || 0) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
