'use client'

import { Clock, Users, Calendar, MoreHorizontal, Mic2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatDuration, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Meeting } from '@/types'

interface MeetingCardProps {
  meeting: Meeting
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export function MeetingCard({ meeting, onClick, onEdit, onDelete }: MeetingCardProps) {
  // Classic Apple status colors - clean, precise, using the Apple palette
  const getStatusStyles = (status: Meeting['status']) => {
    switch (status) {
      case 'recording':
        return {
          color: 'text-destructive',
          bg: 'bg-destructive/10',
          border: 'border-destructive/20',
          icon: <Mic2 className="w-3 h-3" />
        }
      case 'processing':
        return {
          color: 'text-warning',
          bg: 'bg-warning/10', 
          border: 'border-warning/20',
          icon: <Clock className="w-3 h-3" />
        }
      case 'completed':
        return {
          color: 'text-success',
          bg: 'bg-success/10',
          border: 'border-success/20',
          icon: null
        }
      case 'error':
        return {
          color: 'text-destructive',
          bg: 'bg-destructive/10',
          border: 'border-destructive/20',
          icon: null
        }
      default:
        return {
          color: 'text-muted-foreground',
          bg: 'bg-muted',
          border: 'border-border',
          icon: null
        }
    }
  }

  const statusStyles = getStatusStyles(meeting.status)

  return (
    <div 
      className="group cursor-pointer transition-all duration-150 ease-apple mac-window hover:shadow-strong bg-background border-2 border-border p-grid-3"
      onClick={onClick}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-grid-2 mb-grid-2">
        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-grid-1">
          {/* Title */}
          <h3 className="text-title-3 font-display font-semibold text-foreground truncate">
            {meeting.title}
          </h3>
          
          {/* Metadata row - precisely aligned */}
          <div className="flex items-center gap-grid-3 text-caption text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span className="font-body">{formatDate(meeting.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span className="font-body">{formatDuration(meeting.duration)}</span>
            </div>
            {meeting.participants.length > 0 && (
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3 flex-shrink-0" />
                <span className="font-body">{meeting.participants.length}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Status and Actions */}
        <div className="flex items-start gap-grid-1 flex-shrink-0">
          {/* Status Badge - Sharp corners, precise styling */}
          <div className={cn(
            "flex items-center gap-1 px-grid-1 py-0.5 border-2 text-caption font-body font-medium",
            statusStyles.color,
            statusStyles.bg,
            statusStyles.border
          )}>
            {statusStyles.icon}
            <span>{meeting.status}</span>
          </div>
          
          {/* Menu Button */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            onClick={(e) => {
              e.stopPropagation()
              // Handle menu actions
            }}
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Card Content */}
      <div>
        {/* Topics Section */}
        {meeting.topics.length > 0 && (
          <div className="space-y-grid-1">
            <div className="text-caption font-body font-medium text-muted-foreground uppercase tracking-wide">
              Topics
            </div>
            <div className="flex flex-wrap gap-1">
              {meeting.topics.slice(0, 3).map((topic, index) => (
                <span
                  key={index}
                  className="px-grid-1 py-0.5 bg-secondary text-secondary-foreground border-2 border-border text-caption font-body"
                >
                  {topic}
                </span>
              ))}
              {meeting.topics.length > 3 && (
                <span className="px-grid-1 py-0.5 bg-muted text-muted-foreground border-2 border-border text-caption font-body">
                  +{meeting.topics.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Participants Section */}
        {meeting.participants.length > 0 && (
          <div className={cn("space-y-grid-1", meeting.topics.length > 0 && "mt-grid-2")}>
            <div className="text-caption font-body font-medium text-muted-foreground uppercase tracking-wide">
              Participants
            </div>
            <div className="text-body font-body text-foreground">
              {meeting.participants.slice(0, 2).join(', ')}
              {meeting.participants.length > 2 && (
                <span className="text-muted-foreground">
                  {' '}+{meeting.participants.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}