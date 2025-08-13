'use client'

import { useState } from 'react'
import { Download, FileText, File, FileJson, FileAudio, Calendar, Users, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription 
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMeetingData } from '@/hooks/use-meeting-storage'
import { formatDuration, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { ExportFormat, Meeting } from '@/types'

interface ExportDialogProps {
  meetingId: string
  children: React.ReactNode
}

type ExportOption = {
  format: ExportFormat
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  mimeType: string
  extension: string
}

const exportOptions: ExportOption[] = [
  {
    format: 'txt',
    title: 'Plain Text',
    description: 'Simple text file with transcript and meeting details',
    icon: FileText,
    mimeType: 'text/plain',
    extension: 'txt'
  },
  {
    format: 'markdown',
    title: 'Markdown',
    description: 'Formatted markdown file with structured content',
    icon: File,
    mimeType: 'text/markdown',
    extension: 'md'
  },
  {
    format: 'json',
    title: 'JSON Data',
    description: 'Complete meeting data in JSON format',
    icon: FileJson,
    mimeType: 'application/json',
    extension: 'json'
  },
  {
    format: 'pdf',
    title: 'PDF Report',
    description: 'Professional PDF document with transcript and summary',
    icon: FileText,
    mimeType: 'application/pdf',
    extension: 'pdf'
  },
  {
    format: 'audio',
    title: 'Audio File',
    description: 'Original audio recording',
    icon: FileAudio,
    mimeType: 'audio/webm',
    extension: 'webm'
  }
]

export function ExportDialog({ meetingId, children }: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('txt')
  const [isExporting, setIsExporting] = useState(false)
  
  const { meeting, transcript, summary, audioBlob } = useMeetingData(meetingId)

  const generateFileName = (format: ExportFormat): string => {
    if (!meeting) return 'meeting'
    
    const date = formatDate(meeting.date).replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
    const title = meeting.title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
    const option = exportOptions.find(o => o.format === format)
    
    return `${title}-${date}.${option?.extension || 'txt'}`
  }

  const generateContent = (format: ExportFormat): string => {
    if (!meeting) return ''

    const header = `Meeting: ${meeting.title}
Date: ${formatDate(meeting.date)}
Duration: ${formatDuration(meeting.duration)}
Participants: ${meeting.participants.join(', ') || 'None specified'}
Topics: ${meeting.topics.join(', ') || 'None specified'}

`

    switch (format) {
      case 'txt':
        return header + generatePlainTextTranscript()
      
      case 'markdown':
        return generateMarkdownContent()
      
      case 'json':
        return JSON.stringify({
          meeting,
          transcript,
          summary
        }, null, 2)
      
      default:
        return header + generatePlainTextTranscript()
    }
  }

  const generatePlainTextTranscript = (): string => {
    if (!transcript || transcript.length === 0) {
      return 'No transcript available.'
    }

    return transcript
      .sort((a, b) => a.startTime - b.startTime)
      .map(segment => {
        const timestamp = formatDuration(segment.startTime)
        const speaker = segment.speaker ? `[${segment.speaker}] ` : ''
        return `${timestamp} ${speaker}${segment.text}`
      })
      .join('\n')
  }

  const generateMarkdownContent = (): string => {
    if (!meeting) return ''

    let content = `# ${meeting.title}

## Meeting Information
- **Date:** ${formatDate(meeting.date)}
- **Duration:** ${formatDuration(meeting.duration)}
- **Participants:** ${meeting.participants.join(', ') || 'None specified'}
- **Topics:** ${meeting.topics.join(', ') || 'None specified'}

`

    if (summary) {
      content += `## Summary
${summary.summary}

`

      if (summary.keyPoints.length > 0) {
        content += `### Key Points
${summary.keyPoints.map(point => `- ${point}`).join('\n')}

`
      }

      if (summary.actionItems.length > 0) {
        content += `### Action Items
${summary.actionItems.map(item => `- ${item.completed ? '[x]' : '[ ]'} ${item.text}${item.assignee ? ` (${item.assignee})` : ''}`).join('\n')}

`
      }
    }

    if (transcript && transcript.length > 0) {
      content += `## Transcript

`
      content += transcript
        .sort((a, b) => a.startTime - b.startTime)
        .map(segment => {
          const timestamp = formatDuration(segment.startTime)
          const speaker = segment.speaker ? `**${segment.speaker}**` : '**Speaker**'
          return `**${timestamp}** ${speaker}: ${segment.text}`
        })
        .join('\n\n')
    }

    return content
  }

  const handleExport = async () => {
    if (!meeting) return

    setIsExporting(true)
    try {
      const option = exportOptions.find(o => o.format === selectedFormat)
      if (!option) return

      let blob: Blob
      let filename = generateFileName(selectedFormat)

      if (selectedFormat === 'audio' && audioBlob) {
        blob = audioBlob
      } else if (selectedFormat === 'pdf') {
        // For PDF, we'll create a simple text version for now
        // In a real app, you'd use a PDF library like jsPDF
        const content = generateMarkdownContent()
        blob = new Blob([content], { type: 'text/plain' })
        filename = filename.replace('.pdf', '.txt')
      } else {
        const content = generateContent(selectedFormat)
        blob = new Blob([content], { type: option.mimeType })
      }

      // Create download link
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  if (!meeting) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl retro-border retro-shadow mac-window">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-grid-2">
            <div className="w-grid-3 h-grid-3 bg-primary retro-border flex items-center justify-center">
              <Download className="w-4 h-4 text-primary-foreground" />
            </div>
            Export Meeting
          </DialogTitle>
          <DialogDescription>
            Choose a format to export "{meeting.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-grid-4">
          {/* Meeting Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-title-3">{meeting.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-grid-3 text-caption text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(meeting.date)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(meeting.duration)}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {meeting.participants.length} participants
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <div>
            <h3 className="text-body font-body font-medium text-foreground mb-grid-2">
              Export Format
            </h3>
            <div className="grid grid-cols-1 gap-grid-2">
              {exportOptions.map((option) => {
                const Icon = option.icon
                const isDisabled = option.format === 'audio' && !audioBlob
                
                return (
                  <button
                    key={option.format}
                    onClick={() => !isDisabled && setSelectedFormat(option.format)}
                    disabled={isDisabled}
                    className={cn(
                      "flex items-center gap-grid-2 p-grid-2 border text-left transition-all duration-150 ease-apple",
                      "hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed",
                      selectedFormat === option.format 
                        ? "border-primary bg-primary/10 text-primary" 
                        : "border-border bg-card text-card-foreground"
                    )}
                  >
                    <div className={cn(
                      "w-grid-3 h-grid-3 border flex items-center justify-center",
                      selectedFormat === option.format ? "border-primary bg-primary text-primary-foreground" : "border-border bg-muted"
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-body font-body font-medium">
                        {option.title}
                        {isDisabled && ' (Not available)'}
                      </div>
                      <div className="text-caption font-body text-muted-foreground">
                        {option.description}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Export Preview */}
          <div>
            <h3 className="text-body font-body font-medium text-foreground mb-grid-2">
              Preview
            </h3>
            <div className="bg-muted border border-border p-grid-2 max-h-32 overflow-y-auto text-caption font-mono">
              {selectedFormat === 'audio' ? (
                <div className="text-muted-foreground italic">
                  Audio file: {meeting.title}.webm
                </div>
              ) : (
                <pre className="whitespace-pre-wrap text-foreground">
                  {generateContent(selectedFormat).substring(0, 300)}
                  {generateContent(selectedFormat).length > 300 && '...'}
                </pre>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-grid-3 border-t border-border">
          <div className="text-caption font-body text-muted-foreground">
            File: {generateFileName(selectedFormat)}
          </div>
          <Button onClick={handleExport} disabled={isExporting} className="gap-grid-1">
            <Download className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
