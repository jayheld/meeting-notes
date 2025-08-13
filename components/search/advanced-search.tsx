'use client'

import { useState } from 'react'
import { Search, Filter, X, Calendar, Clock, Users, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { useMeetingStore } from '@/stores/meeting-store'
import { useMeetingStorage } from '@/hooks/use-meeting-storage'
import { cn } from '@/lib/utils'
import type { SearchFilters, Meeting } from '@/types'

interface AdvancedSearchProps {
  onFiltersChange?: (filters: SearchFilters) => void
}

export function AdvancedSearch({ onFiltersChange }: AdvancedSearchProps) {
  const { searchQuery, searchFilters, setSearchQuery, setSearchFilters } = useMeetingStore()
  const { meetings } = useMeetingStorage()
  const [localFilters, setLocalFilters] = useState<SearchFilters>(searchFilters)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Extract unique values for filter suggestions
  const uniqueParticipants = Array.from(
    new Set(meetings.flatMap(m => m.participants).filter(Boolean))
  ).sort()
  
  const uniqueTopics = Array.from(
    new Set(meetings.flatMap(m => m.topics).filter(Boolean))
  ).sort()

  const statusOptions: Meeting['status'][] = ['recording', 'processing', 'completed', 'error']

  const updateLocalFilter = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
  }

  const applyFilters = () => {
    setSearchFilters(localFilters)
    onFiltersChange?.(localFilters)
    setShowAdvanced(false)
  }

  const clearFilters = () => {
    const emptyFilters: SearchFilters = {}
    setLocalFilters(emptyFilters)
    setSearchFilters(emptyFilters)
    onFiltersChange?.(emptyFilters)
    setShowAdvanced(false)
  }

  const hasActiveFilters = Object.keys(searchFilters).length > 0

  const addParticipantFilter = (participant: string) => {
    const current = localFilters.participants || []
    if (!current.includes(participant)) {
      updateLocalFilter('participants', [...current, participant])
    }
  }

  const removeParticipantFilter = (participant: string) => {
    const current = localFilters.participants || []
    updateLocalFilter('participants', current.filter(p => p !== participant))
  }

  const addTopicFilter = (topic: string) => {
    const current = localFilters.topics || []
    if (!current.includes(topic)) {
      updateLocalFilter('topics', [...current, topic])
    }
  }

  const removeTopicFilter = (topic: string) => {
    const current = localFilters.topics || []
    updateLocalFilter('topics', current.filter(t => t !== topic))
  }

  const addStatusFilter = (status: Meeting['status']) => {
    const current = localFilters.status || []
    if (!current.includes(status)) {
      updateLocalFilter('status', [...current, status])
    }
  }

  const removeStatusFilter = (status: Meeting['status']) => {
    const current = localFilters.status || []
    updateLocalFilter('status', current.filter(s => s !== status))
  }

  return (
    <div className="space-y-grid-2">
      {/* Main Search Bar */}
      <div className="relative flex items-center gap-grid-2">
        <div className="relative flex-1">
          <Search className="absolute left-grid-1 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search meetings, participants, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-grid-4 pr-grid-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setSearchQuery('')}
              className="absolute right-grid-1 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <Dialog open={showAdvanced} onOpenChange={setShowAdvanced}>
          <DialogTrigger asChild>
            <Button 
              variant={hasActiveFilters ? "default" : "outline"}
              className="gap-grid-1"
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="bg-primary-foreground text-primary text-caption px-1 font-medium">
                  {Object.keys(searchFilters).length}
                </span>
              )}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl retro-border retro-shadow mac-window">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-grid-2">
                <div className="w-grid-3 h-grid-3 bg-primary retro-border flex items-center justify-center">
                  <Filter className="w-4 h-4 text-primary-foreground" />
                </div>
                Advanced Search Filters
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-grid-4">
              {/* Date Range */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-grid-1 text-title-3">
                    <Calendar className="w-4 h-4" />
                    Date Range
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-grid-2">
                  <div className="grid grid-cols-2 gap-grid-2">
                    <div>
                      <label className="text-caption font-body font-medium text-muted-foreground uppercase tracking-wide mb-1 block">
                        From
                      </label>
                      <Input
                        type="date"
                        value={localFilters.dateRange?.start ? localFilters.dateRange.start.toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                          const date = e.target.value ? new Date(e.target.value) : undefined
                          updateLocalFilter('dateRange', {
                            ...localFilters.dateRange,
                            start: date
                          })
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-caption font-body font-medium text-muted-foreground uppercase tracking-wide mb-1 block">
                        To
                      </label>
                      <Input
                        type="date"
                        value={localFilters.dateRange?.end ? localFilters.dateRange.end.toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                          const date = e.target.value ? new Date(e.target.value) : undefined
                          updateLocalFilter('dateRange', {
                            ...localFilters.dateRange,
                            end: date
                          })
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Duration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-grid-1 text-title-3">
                    <Clock className="w-4 h-4" />
                    Duration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-grid-2">
                  <div className="grid grid-cols-2 gap-grid-2">
                    <div>
                      <label className="text-caption font-body font-medium text-muted-foreground uppercase tracking-wide mb-1 block">
                        Min Duration (minutes)
                      </label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={localFilters.minDuration ? Math.floor(localFilters.minDuration / 60) : ''}
                        onChange={(e) => {
                          const minutes = e.target.value ? parseInt(e.target.value) : undefined
                          updateLocalFilter('minDuration', minutes ? minutes * 60 : undefined)
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-caption font-body font-medium text-muted-foreground uppercase tracking-wide mb-1 block">
                        Max Duration (minutes)
                      </label>
                      <Input
                        type="number"
                        placeholder="∞"
                        value={localFilters.maxDuration ? Math.floor(localFilters.maxDuration / 60) : ''}
                        onChange={(e) => {
                          const minutes = e.target.value ? parseInt(e.target.value) : undefined
                          updateLocalFilter('maxDuration', minutes ? minutes * 60 : undefined)
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Participants */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-grid-1 text-title-3">
                    <Users className="w-4 h-4" />
                    Participants
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-grid-2">
                  {/* Selected Participants */}
                  {localFilters.participants && localFilters.participants.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {localFilters.participants.map((participant) => (
                        <span
                          key={participant}
                          className="flex items-center gap-1 px-grid-1 py-0.5 bg-primary text-primary-foreground text-caption border border-primary"
                        >
                          {participant}
                          <button
                            onClick={() => removeParticipantFilter(participant)}
                            className="hover:bg-primary-foreground/20"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Available Participants */}
                  <div className="max-h-24 overflow-y-auto">
                    <div className="flex flex-wrap gap-1">
                      {uniqueParticipants
                        .filter(p => !localFilters.participants?.includes(p))
                        .map((participant) => (
                          <button
                            key={participant}
                            onClick={() => addParticipantFilter(participant)}
                            className="px-grid-1 py-0.5 bg-secondary text-secondary-foreground text-caption border border-border hover:bg-accent hover:text-accent-foreground"
                          >
                            {participant}
                          </button>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-grid-1 text-title-3">
                    <Tag className="w-4 h-4" />
                    Topics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-grid-2">
                  {/* Selected Topics */}
                  {localFilters.topics && localFilters.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {localFilters.topics.map((topic) => (
                        <span
                          key={topic}
                          className="flex items-center gap-1 px-grid-1 py-0.5 bg-primary text-primary-foreground text-caption border border-primary"
                        >
                          {topic}
                          <button
                            onClick={() => removeTopicFilter(topic)}
                            className="hover:bg-primary-foreground/20"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Available Topics */}
                  <div className="max-h-24 overflow-y-auto">
                    <div className="flex flex-wrap gap-1">
                      {uniqueTopics
                        .filter(t => !localFilters.topics?.includes(t))
                        .map((topic) => (
                          <button
                            key={topic}
                            onClick={() => addTopicFilter(topic)}
                            className="px-grid-1 py-0.5 bg-secondary text-secondary-foreground text-caption border border-border hover:bg-accent hover:text-accent-foreground"
                          >
                            {topic}
                          </button>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-title-3">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {statusOptions.map((status) => {
                      const isSelected = localFilters.status?.includes(status)
                      return (
                        <button
                          key={status}
                          onClick={() => {
                            if (isSelected) {
                              removeStatusFilter(status)
                            } else {
                              addStatusFilter(status)
                            }
                          }}
                          className={cn(
                            "px-grid-1 py-0.5 text-caption border transition-all duration-150 ease-apple",
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-secondary text-secondary-foreground border-border hover:bg-accent hover:text-accent-foreground"
                          )}
                        >
                          {status}
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-grid-3 border-t border-border">
              <Button variant="ghost" onClick={clearFilters}>
                Clear All
              </Button>
              <div className="flex gap-grid-2">
                <Button variant="outline" onClick={() => setShowAdvanced(false)}>
                  Cancel
                </Button>
                <Button onClick={applyFilters}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1">
          {searchFilters.dateRange?.start && (
            <span className="flex items-center gap-1 px-grid-1 py-0.5 bg-muted text-muted-foreground text-caption border border-border">
              From: {searchFilters.dateRange.start.toLocaleDateString()}
              <button
                onClick={() => {
                  const newRange = { ...searchFilters.dateRange, start: undefined }
                  if (!newRange.end) {
                    setSearchFilters({ ...searchFilters, dateRange: undefined })
                  } else {
                    setSearchFilters({ ...searchFilters, dateRange: newRange })
                  }
                }}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          
          {searchFilters.participants?.map((participant) => (
            <span
              key={participant}
              className="flex items-center gap-1 px-grid-1 py-0.5 bg-muted text-muted-foreground text-caption border border-border"
            >
              👤 {participant}
              <button onClick={() => removeParticipantFilter(participant)}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          
          {searchFilters.topics?.map((topic) => (
            <span
              key={topic}
              className="flex items-center gap-1 px-grid-1 py-0.5 bg-muted text-muted-foreground text-caption border border-border"
            >
              🏷️ {topic}
              <button onClick={() => removeTopicFilter(topic)}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
