'use client'

import { useState } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MeetingCard } from '@/components/meeting/meeting-card'
import { useMeetingStorage } from '@/hooks/use-meeting-storage'
import { useMeetingStore } from '@/stores/meeting-store'
import { useWindowManager } from '@/hooks/use-window-manager'
import { RecordingWindowContent } from './recording-window'
import { cn } from '@/lib/utils'

export function MeetingDashboardWindow() {
  const { meetings, isLoadingMeetings } = useMeetingStorage()
  const { searchQuery, setSearchQuery } = useMeetingStore()
  const { openWindow } = useWindowManager()
  
  const [localSearch, setLocalSearch] = useState('')

  const filteredMeetings = meetings.filter(meeting =>
    meeting.title.toLowerCase().includes(localSearch.toLowerCase()) ||
    meeting.participants.some(p => p.toLowerCase().includes(localSearch.toLowerCase()))
  )

  const openRecordingWindow = () => {
    openWindow({
      title: 'New Recording',
      content: RecordingWindowContent,
      position: { x: 150, y: 120 },
      size: { width: 500, height: 400 },
      isMinimized: false,
      isMaximized: false,
      isFocused: true,
      isClosable: true,
      isResizable: true,
      isDraggable: true,
      minSize: { width: 400, height: 300 }
    })
  }

  const openMeetingDetail = (meetingId: string) => {
    const meeting = meetings.find(m => m.id === meetingId)
    if (meeting) {
      openWindow({
        title: `Meeting: ${meeting.title}`,
        content: ({ meeting: meetingProp }) => (
          <div className="h-full p-4 bg-background overflow-auto">
            <h2 className="text-title-2 font-display mb-4">{meetingProp.title}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-title-3 font-display mb-2">Participants</h3>
                <p className="text-body font-body">{meetingProp.participants.join(', ') || 'No participants'}</p>
              </div>
              <div>
                <h3 className="text-title-3 font-display mb-2">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {meetingProp.topics.map((topic, index) => (
                    <span key={index} className="px-2 py-1 bg-secondary border-2 border-border text-caption font-body">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-title-3 font-display mb-2">Transcript</h3>
                <div className="border-2 border-border p-4 bg-input min-h-32 text-body font-body">
                  {meetingProp.transcript?.segments?.length > 0 
                    ? meetingProp.transcript.segments.map(segment => segment.text).join(' ')
                    : 'No transcript available'
                  }
                </div>
              </div>
            </div>
          </div>
        ),
        props: { meeting },
        position: { x: 200, y: 100 },
        size: { width: 600, height: 500 },
        isMinimized: false,
        isMaximized: false,
        isFocused: true,
        isClosable: true,
        isResizable: true,
        isDraggable: true,
        minSize: { width: 400, height: 300 }
      })
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b-2 border-border p-4 bg-secondary">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-title-1 font-display font-semibold">Meeting Dashboard</h1>
          <Button 
            onClick={openRecordingWindow}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            New Recording
          </Button>
        </div>
        
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search meetings..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {isLoadingMeetings ? (
          <div className="text-center py-8">
            <div className="text-body font-body text-muted-foreground">Loading meetings...</div>
          </div>
        ) : filteredMeetings.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-body font-body text-muted-foreground mb-4">
              {localSearch ? 'No meetings found matching your search.' : 'No meetings found.'}
            </div>
            <Button onClick={openRecordingWindow}>
              Start your first recording
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredMeetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                onClick={() => openMeetingDetail(meeting.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
