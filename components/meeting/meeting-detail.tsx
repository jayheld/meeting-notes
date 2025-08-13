'use client'

import { useState } from 'react'
import { 
  Play, 
  Pause, 
  Download, 
  Share, 
  Edit, 
  Trash2, 
  Clock, 
  Calendar, 
  Users, 
  FileText,
  Volume2,
  ChevronLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExportDialog } from '@/components/export/export-dialog'
import { useMeetingData } from '@/hooks/use-meeting-storage'
import { formatDuration, formatDate, formatFileSize } from '@/lib/utils'
import type { Meeting } from '@/types'

interface MeetingDetailProps {
  meetingId: string
  onBack?: () => void
}

export function MeetingDetail({ meetingId, onBack }: MeetingDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'transcript' | 'summary' | 'audio'>('overview')
  const [isPlaying, setIsPlaying] = useState(false)
  
  const { 
    meeting, 
    transcript, 
    summary, 
    audioBlob, 
    isLoading 
  } = useMeetingData(meetingId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!meeting) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-foreground mb-2">Meeting not found</h3>
        <p className="text-muted-foreground mb-4">The meeting you're looking for doesn't exist.</p>
        <Button onClick={onBack} variant="outline">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    )
  }

  const handlePlayAudio = () => {
    if (audioBlob) {
      const audio = new Audio(URL.createObjectURL(audioBlob))
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        audio.play()
        setIsPlaying(true)
        audio.onended = () => setIsPlaying(false)
        audio.onpause = () => setIsPlaying(false)
      }
    }
  }

  const handleDownload = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${meeting.title}-${formatDate(meeting.date)}.webm`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: FileText },
    { id: 'transcript' as const, label: 'Transcript', icon: FileText },
    { id: 'summary' as const, label: 'Summary', icon: FileText },
    { id: 'audio' as const, label: 'Audio', icon: Volume2 },
  ]

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{meeting.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(meeting.date)}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDuration(meeting.duration)}
            </div>
            {meeting.participants.length > 0 && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {meeting.participants.length} participants
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {audioBlob && (
            <Button variant="outline" onClick={handlePlayAudio}>
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
          )}
          <ExportDialog meetingId={meetingId}>
            <Button variant="outline">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </ExportDialog>
          <Button variant="outline">
            <Share className="w-4 h-4" />
            Share
          </Button>
          <Button variant="outline">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button variant="destructive" size="icon">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Meeting Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Meeting Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      meeting.status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : meeting.status === 'recording'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {meeting.status}
                    </div>
                  </div>
                  
                  {meeting.participants.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Participants</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {meeting.participants.map((participant, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                          >
                            {participant}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {meeting.topics.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Topics</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {meeting.topics.map((topic, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-accent text-accent-foreground rounded-md text-sm"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Stats */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recording Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Duration</span>
                    <span className="text-sm font-medium">{formatDuration(meeting.duration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">File Size</span>
                    <span className="text-sm font-medium">{formatFileSize(meeting.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Created</span>
                    <span className="text-sm font-medium">{formatDate(meeting.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Updated</span>
                    <span className="text-sm font-medium">{formatDate(meeting.updatedAt)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'transcript' && (
          <Card>
            <CardHeader>
              <CardTitle>Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              {transcript && transcript.length > 0 ? (
                <div className="space-y-4">
                  {transcript.map((segment) => (
                    <div key={segment.id} className="border-l-2 border-muted pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground">
                          {formatDuration(segment.startTime)}
                        </span>
                        {segment.speaker && (
                          <span className="text-xs font-medium text-primary">
                            {segment.speaker}
                          </span>
                        )}
                      </div>
                      <p className="text-sm">{segment.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No transcript available yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Transcription will be processed automatically.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'summary' && (
          <Card>
            <CardHeader>
              <CardTitle>AI Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {summary ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Overview</h4>
                    <p className="text-sm text-muted-foreground">{summary.summary}</p>
                  </div>
                  
                  {summary.keyPoints.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Key Points</h4>
                      <ul className="space-y-1">
                        {summary.keyPoints.map((point, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1 h-1 bg-current rounded-full mt-2 flex-shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {summary.actionItems.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Action Items</h4>
                      <div className="space-y-2">
                        {summary.actionItems.map((item) => (
                          <div key={item.id} className="flex items-start gap-2">
                            <input type="checkbox" checked={item.completed} className="mt-1" />
                            <div className="flex-1">
                              <p className="text-sm">{item.text}</p>
                              {item.assignee && (
                                <p className="text-xs text-muted-foreground">
                                  Assigned to: {item.assignee}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No summary available yet.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    AI summary will be generated automatically.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'audio' && (
          <Card>
            <CardHeader>
              <CardTitle>Audio Playback</CardTitle>
            </CardHeader>
            <CardContent>
              {audioBlob ? (
                <div className="space-y-4">
                  <audio 
                    controls 
                    className="w-full"
                    src={URL.createObjectURL(audioBlob)}
                  >
                    Your browser does not support the audio element.
                  </audio>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>File size: {formatFileSize(audioBlob.size)}</span>
                    <span>Duration: {formatDuration(meeting.duration)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Audio file not available.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}