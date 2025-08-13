'use client'

import { useState, useEffect } from 'react'
import { Mic, MicOff, Pause, Play, Square, Users, Type, AlertCircle } from 'lucide-react'
import { ClassicMicIcon } from '@/components/ui/classic-icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMeetingStore } from '@/stores/meeting-store'
import { useMeetingStorage } from '@/hooks/use-meeting-storage'
import { useAudioRecording } from '@/hooks/use-audio-recording'
import { useTranscription } from '@/hooks/use-transcription'
import { useRecordingShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { formatDuration } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface RecordingInterfaceProps {
  className?: string
}

export function RecordingInterface({ className }: RecordingInterfaceProps) {
  const [meetingTitle, setMeetingTitle] = useState('')
  const [participants, setParticipants] = useState('')
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  
  const { 
    recordingState, 
    startRecording, 
    stopRecording, 
    pauseRecording, 
    resumeRecording,
    updateRecordingState
  } = useMeetingStore()

  const { saveMeeting, saveAudioFile, saveTranscript } = useMeetingStorage()

  const audioRecording = useAudioRecording({
    onRecordingComplete: (blob) => {
      setAudioBlob(blob)
      console.log('Recording completed, blob size:', blob.size)
    },
    onError: (error) => {
      console.error('Audio recording error:', error)
    }
  })

  const transcription = useTranscription({
    language: 'en-US',
    continuous: true,
    interimResults: true,
    onSegmentAdded: (segment) => {
      console.log('New transcript segment:', segment)
    },
    onError: (error) => {
      console.error('Transcription error:', error)
    }
  })

  // Sync audio recording state with store
  useEffect(() => {
    updateRecordingState({
      audioLevel: audioRecording.audioLevel,
      duration: audioRecording.duration
    })
  }, [audioRecording.audioLevel, audioRecording.duration, updateRecordingState])

  const handleStartRecording = async () => {
    if (!meetingTitle.trim()) {
      return
    }

    const newMeeting = {
      id: Date.now().toString(),
      title: meetingTitle,
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

    // Start recording in both store and audio engine
    startRecording(newMeeting)
    const success = await audioRecording.startRecording()
    
    if (success) {
      // Start transcription with the audio stream
      const stream = audioRecording.getMediaStream()
      if (stream && transcription.isSupported) {
        try {
          await transcription.startTranscription(stream)
        } catch (error) {
          console.error('Failed to start transcription:', error)
        }
      }
    } else {
      stopRecording()
    }
  }

  const handlePauseRecording = () => {
    audioRecording.pauseRecording()
    pauseRecording()
  }

  const handleResumeRecording = () => {
    audioRecording.resumeRecording()
    resumeRecording()
  }

  const handleStopRecording = async () => {
    // Stop transcription first
    transcription.stopTranscription()
    
    const blob = await audioRecording.stopRecording()
    
    if (blob && recordingState.currentMeeting) {
      try {
        // Update meeting with final details
        const finalMeeting = {
          ...recordingState.currentMeeting,
          duration: audioRecording.duration,
          size: blob.size,
          status: 'completed' as const,
          updatedAt: new Date()
        }
        
        // Save meeting to storage
        await saveMeeting(finalMeeting)
        
        // Save audio file to storage
        await saveAudioFile(finalMeeting.id, blob)
        
        // Save transcript if we have segments
        if (transcription.segments.length > 0) {
          await saveTranscript(finalMeeting.id, transcription.segments)
        }
        
        console.log('Meeting and audio saved successfully:', finalMeeting.id)
      } catch (error) {
        console.error('Failed to save meeting:', error)
      }
    }
    
    stopRecording()
    setMeetingTitle('')
    setParticipants('')
    setAudioBlob(blob)
  }

  // Set up keyboard shortcuts for recording (after function definitions)
  useRecordingShortcuts({
    onStart: () => {
      if (meetingTitle.trim()) {
        handleStartRecording()
      }
    },
    onStop: handleStopRecording,
    onPause: recordingState.isPaused ? handleResumeRecording : handlePauseRecording,
    isRecording: recordingState.isRecording,
    isPaused: recordingState.isPaused
  })

  return (
    <div className={cn("max-w-2xl mx-auto px-grid-3 md:px-0", className)}>
      <Card className="retro-border retro-shadow mac-window">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            {recordingState.isRecording ? 'Recording in Progress' : 'Start New Meeting'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Meeting Details */}
          {!recordingState.isRecording && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Meeting Title *
                </label>
                <Input
                  placeholder="e.g., Weekly Team Standup"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Participants (optional)
                </label>
                <Input
                  placeholder="e.g., John, Sarah, Mike"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate names with commas
                </p>
              </div>
            </div>
          )}

          {/* Recording Status */}
          {recordingState.isRecording && (
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-24 h-24 mx-auto bg-destructive/10 rounded-full flex items-center justify-center relative">
                  {/* Pulse animation rings */}
                  <div className="absolute inset-0 rounded-full bg-destructive/20 animate-pulse-ring" />
                  <div className="absolute inset-2 rounded-full bg-destructive/30 animate-pulse-ring animation-delay-300" />
                  
                  <Mic className="w-8 h-8 text-destructive" />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {recordingState.currentMeeting?.title}
                </h3>
                <p className="text-2xl font-bold text-foreground">
                  {formatDuration(recordingState.duration)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {recordingState.isPaused ? 'Paused' : 'Recording...'}
                </p>
              </div>

              {/* Audio Level Indicator */}
              <div className="w-full max-w-xs mx-auto">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-destructive transition-all duration-75"
                    style={{ width: `${recordingState.audioLevel}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Audio Level</p>
              </div>
            </div>
          )}

          {/* Audio Support Warning */}
          {!audioRecording.isSupported && (
            <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">Audio recording is not supported in this browser.</p>
            </div>
          )}

          {/* Error Display */}
          {audioRecording.error && (
            <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">{audioRecording.error}</p>
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            {!recordingState.isRecording ? (
              <Button 
                onClick={handleStartRecording}
                disabled={!meetingTitle.trim() || !audioRecording.isSupported}
                className="gap-2 px-8"
                size="lg"
              >
                <Mic className="w-4 h-4" />
                Start Recording
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={recordingState.isPaused ? handleResumeRecording : handlePauseRecording}
                  className="gap-2"
                >
                  {recordingState.isPaused ? (
                    <>
                      <Play className="w-4 h-4" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4" />
                      Pause
                    </>
                  )}
                </Button>
                
                <Button
                  variant="destructive"
                  onClick={handleStopRecording}
                  className="gap-2"
                >
                  <Square className="w-4 h-4" />
                  Stop & Save
                </Button>
              </>
            )}
          </div>

          {/* Live Transcript Preview */}
          {recordingState.isRecording && (
            <div className="border border-border rounded-lg p-4">
              <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Type className="w-4 h-4" />
                Live Transcript
              </h4>
              <div className="max-h-32 overflow-y-auto text-sm">
                {transcription.segments.length > 0 ? (
                  <div className="space-y-2">
                    {transcription.segments.slice(-3).map((segment) => (
                      <div key={segment.id} className="border-l-2 border-primary/30 pl-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <span>{formatDuration(segment.startTime)}</span>
                          {segment.speaker && (
                            <span className="font-medium text-primary">{segment.speaker}</span>
                          )}
                        </div>
                        <p className="text-foreground">{segment.text}</p>
                      </div>
                    ))}
                  </div>
                ) : transcription.isSupported ? (
                  <p className="text-muted-foreground italic">
                    {transcription.isActive 
                      ? 'Listening for speech...' 
                      : 'Transcription will appear here in real-time...'
                    }
                  </p>
                ) : (
                  <p className="text-muted-foreground italic">
                    Transcription not supported in this browser
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}