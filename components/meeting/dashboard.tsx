'use client'

import { Plus, Grid, List } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MeetingCard } from './meeting-card'
import { AdvancedSearch } from '@/components/search/advanced-search'
import { useMeetingStore } from '@/stores/meeting-store'
import { useMeetingStorage } from '@/hooks/use-meeting-storage'
import { cn } from '@/lib/utils'
import type { SearchFilters, Meeting } from '@/types'

type ViewMode = 'grid' | 'list'

interface DashboardProps {
  onStartNewMeeting?: () => void
  onMeetingClick?: (meetingId: string) => void
}

export function Dashboard({ onStartNewMeeting, onMeetingClick }: DashboardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const { searchQuery, searchFilters } = useMeetingStore()
  const { meetings, isLoadingMeetings } = useMeetingStorage()

  // Debug logging
  console.log('Dashboard render:', { meetings, isLoadingMeetings, searchQuery, searchFilters })

  // Apply search and filter logic
  const applyFilters = (meetings: Meeting[], query: string, filters: SearchFilters): Meeting[] => {
    let filtered = meetings

    // Text search
    if (query.trim()) {
      filtered = filtered.filter(meeting =>
        meeting.title.toLowerCase().includes(query.toLowerCase()) ||
        meeting.participants.some(p => p.toLowerCase().includes(query.toLowerCase())) ||
        meeting.topics.some(t => t.toLowerCase().includes(query.toLowerCase()))
      )
    }

    // Date range filter
    if (filters.dateRange?.start || filters.dateRange?.end) {
      filtered = filtered.filter(meeting => {
        const meetingDate = new Date(meeting.date)
        if (filters.dateRange?.start && meetingDate < filters.dateRange.start) return false
        if (filters.dateRange?.end && meetingDate > filters.dateRange.end) return false
        return true
      })
    }

    // Duration filter
    if (filters.minDuration !== undefined) {
      filtered = filtered.filter(meeting => meeting.duration >= filters.minDuration!)
    }
    if (filters.maxDuration !== undefined) {
      filtered = filtered.filter(meeting => meeting.duration <= filters.maxDuration!)
    }

    // Participants filter
    if (filters.participants && filters.participants.length > 0) {
      filtered = filtered.filter(meeting =>
        filters.participants!.some(p => 
          meeting.participants.some(mp => mp.toLowerCase().includes(p.toLowerCase()))
        )
      )
    }

    // Topics filter
    if (filters.topics && filters.topics.length > 0) {
      filtered = filtered.filter(meeting =>
        filters.topics!.some(t => 
          meeting.topics.some(mt => mt.toLowerCase().includes(t.toLowerCase()))
        )
      )
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(meeting => filters.status!.includes(meeting.status))
    }

    return filtered
  }

  const filteredMeetings = applyFilters(meetings, searchQuery, searchFilters)

  const recentMeetings = filteredMeetings.slice(0, 6)
  const totalMeetings = meetings.length
  const totalDuration = meetings.reduce((sum, meeting) => sum + meeting.duration, 0)

  return (
    <div className="p-grid-3 md:p-grid-6">
      {/* Header - Classic Mac precision */}
      <div className="space-y-grid-4 mb-grid-6 md:mb-grid-8">
        <div className="flex flex-col gap-grid-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-grid-1">
            <h1 className="text-title-1 md:text-display font-display font-semibold text-foreground">
              Dashboard
            </h1>
            <p className="text-body font-body text-muted-foreground">
              Manage and review your meeting recordings
            </p>
          </div>
          
          <div className="flex items-center justify-between md:justify-start gap-grid-2">
            {/* View Mode Toggle - Sharp segmented control */}
            <div className="flex items-center border border-border">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon-sm"
                onClick={() => setViewMode('grid')}
                className="border-0"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon-sm"
                onClick={() => setViewMode('list')}
                className="border-0 border-l border-border"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            
            <Button className="gap-grid-1 text-body font-body" onClick={onStartNewMeeting}>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Meeting</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>

        {/* Advanced Search */}
        <AdvancedSearch />
      </div>

      {/* Stats Cards - Clean Mac-style metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-grid-3 mb-grid-6 md:mb-grid-8">
        <div className="bg-card border border-border shadow-medium p-grid-4">
          <div className="text-display font-display font-semibold text-foreground mb-grid-1">
            {totalMeetings}
          </div>
          <div className="text-caption font-body font-medium text-muted-foreground uppercase tracking-wide">
            Total Meetings
          </div>
        </div>
        <div className="bg-card border border-border shadow-medium p-grid-4">
          <div className="text-display font-display font-semibold text-foreground mb-grid-1">
            {Math.round(totalDuration / 3600)}h
          </div>
          <div className="text-caption font-body font-medium text-muted-foreground uppercase tracking-wide">
            Total Duration
          </div>
        </div>
        <div className="bg-card border border-border shadow-medium p-grid-4">
          <div className="text-display font-display font-semibold text-foreground mb-grid-1">
            {meetings.filter(m => m.status === 'completed').length}
          </div>
          <div className="text-caption font-body font-medium text-muted-foreground uppercase tracking-wide">
            Completed
          </div>
        </div>
      </div>

      {/* Meetings Section */}
      <div className="space-y-grid-4">
        <div className="flex items-center justify-between">
          <h2 className="text-title-1 font-display font-semibold text-foreground">
            {(searchQuery || Object.keys(searchFilters).length > 0) 
              ? `Search Results (${filteredMeetings.length})` 
              : 'Recent Meetings'
            }
          </h2>
          {!(searchQuery || Object.keys(searchFilters).length > 0) && meetings.length > 6 && (
            <Button variant="ghost" className="text-body font-body">View All</Button>
          )}
        </div>

        {isLoadingMeetings ? (
          <div className="text-center py-grid-12">
            <div className="w-grid-4 h-grid-4 border-2 border-primary border-t-transparent animate-spin mx-auto mb-grid-2" />
            <p className="text-body font-body text-muted-foreground">Loading meetings...</p>
          </div>
        ) : filteredMeetings.length === 0 ? (
          <div className="text-center py-grid-12">
            <div className="w-grid-8 h-grid-8 bg-muted flex items-center justify-center mx-auto mb-grid-3">
              <Plus className="w-grid-4 h-grid-4 text-muted-foreground" />
            </div>
            <h3 className="text-title-2 font-display font-semibold text-foreground mb-grid-1">
              {(searchQuery || Object.keys(searchFilters).length > 0) ? 'No meetings found' : 'No meetings yet'}
            </h3>
            <p className="text-body font-body text-muted-foreground mb-grid-3 max-w-md mx-auto">
              {(searchQuery || Object.keys(searchFilters).length > 0) 
                ? 'Try adjusting your search query or filters to find the meetings you\'re looking for'
                : 'Start by creating your first meeting recording to begin building your library'
              }
            </p>
            {!(searchQuery || Object.keys(searchFilters).length > 0) && (
              <Button className="gap-grid-1 text-body font-body" onClick={onStartNewMeeting}>
                <Plus className="w-4 h-4" />
                Create Your First Meeting
              </Button>
            )}
          </div>
        ) : (
          <div className={cn(
            // Precise grid layout using our spacing system
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-grid-4'
              : 'space-y-grid-3'
          )}>
            {((searchQuery || Object.keys(searchFilters).length > 0) ? filteredMeetings : recentMeetings).map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                onClick={() => onMeetingClick?.(meeting.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}