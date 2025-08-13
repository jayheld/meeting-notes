'use client'

import { Mic, FileText, Clock, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-grid-3 h-grid-3 border-2',
    lg: 'w-grid-4 h-grid-4 border-2'
  }

  return (
    <div
      className={cn(
        'border-primary border-t-transparent animate-spin',
        sizeClasses[size],
        className
      )}
      aria-label="Loading"
    />
  )
}

interface LoadingCardProps {
  className?: string
}

export function LoadingCard({ className }: LoadingCardProps) {
  return (
    <div className={cn('bg-card border border-border shadow-medium p-grid-3 animate-pulse', className)}>
      <div className="space-y-grid-2">
        <div className="h-5 bg-muted w-3/4" />
        <div className="space-y-1">
          <div className="h-3 bg-muted w-1/2" />
          <div className="h-3 bg-muted w-1/3" />
        </div>
        <div className="flex gap-1">
          <div className="h-4 bg-muted w-12" />
          <div className="h-4 bg-muted w-16" />
        </div>
      </div>
    </div>
  )
}

interface LoadingPageProps {
  message?: string
  icon?: React.ComponentType<{ className?: string }>
}

export function LoadingPage({ 
  message = 'Loading...', 
  icon: Icon = FileText 
}: LoadingPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 p-grid-6">
      <div className="relative mb-grid-4">
        <div className="w-grid-6 h-grid-6 bg-secondary retro-border flex items-center justify-center">
          <Icon className="w-grid-3 h-grid-3 text-muted-foreground" />
        </div>
        <LoadingSpinner className="absolute -top-1 -right-1" size="sm" />
      </div>
      <p className="text-body font-body text-muted-foreground">{message}</p>
    </div>
  )
}

export function MeetingCardSkeleton() {
  return (
    <div className="bg-card border border-border shadow-medium animate-pulse">
      <div className="p-grid-3">
        <div className="flex items-start justify-between gap-grid-2 mb-grid-3">
          <div className="flex-1 space-y-grid-1">
            <div className="h-5 bg-muted w-3/4" />
            <div className="flex items-center gap-grid-3">
              <div className="h-3 bg-muted w-20" />
              <div className="h-3 bg-muted w-16" />
              <div className="h-3 bg-muted w-12" />
            </div>
          </div>
          <div className="h-5 bg-muted w-16" />
        </div>
        
        <div className="space-y-grid-2">
          <div className="h-3 bg-muted w-12" />
          <div className="flex gap-1">
            <div className="h-4 bg-muted w-16" />
            <div className="h-4 bg-muted w-20" />
          </div>
        </div>
      </div>
    </div>
  )
}

interface RecordingVisualizerProps {
  isActive?: boolean
  audioLevel?: number
}

export function RecordingVisualizer({ isActive = false, audioLevel = 0 }: RecordingVisualizerProps) {
  return (
    <div className="flex items-center justify-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'w-1 bg-muted transition-all duration-150',
            isActive && audioLevel > (i * 20) ? 'bg-destructive' : 'bg-muted'
          )}
          style={{
            height: isActive 
              ? `${Math.max(4, Math.min(24, 4 + (audioLevel * 0.2) + (i * 2)))}px`
              : '4px',
            animationDelay: `${i * 100}ms`
          }}
        />
      ))}
    </div>
  )
}

interface PulseRecordingIndicatorProps {
  className?: string
}

export function PulseRecordingIndicator({ className }: PulseRecordingIndicatorProps) {
  return (
    <div className={cn('relative', className)}>
      <div className="w-3 h-3 bg-destructive animate-pulse" />
      <div className="absolute inset-0 w-3 h-3 bg-destructive/30 animate-ping" />
    </div>
  )
}

export function TranscriptLoadingState() {
  return (
    <div className="space-y-grid-3 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border-l-2 border-muted pl-grid-2">
          <div className="flex items-center gap-grid-1 mb-1">
            <div className="h-3 bg-muted w-12" />
            <div className="h-3 bg-muted w-16" />
          </div>
          <div className="space-y-1">
            <div className="h-4 bg-muted w-full" />
            <div className="h-4 bg-muted w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon = FileText,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn('text-center py-grid-12', className)}>
      <div className="w-grid-8 h-grid-8 bg-muted retro-border flex items-center justify-center mx-auto mb-grid-3">
        <Icon className="w-grid-4 h-grid-4 text-muted-foreground" />
      </div>
      <h3 className="text-title-2 font-display font-semibold text-foreground mb-grid-1">
        {title}
      </h3>
      <p className="text-body font-body text-muted-foreground mb-grid-3 max-w-md mx-auto">
        {description}
      </p>
      {action}
    </div>
  )
}

// Specific empty states for different contexts
export function NoMeetingsState({ onCreateMeeting }: { onCreateMeeting?: () => void }) {
  return (
    <EmptyState
      icon={Mic}
      title="No meetings yet"
      description="Start by creating your first meeting recording to begin building your library"
      action={
        onCreateMeeting && (
          <button
            onClick={onCreateMeeting}
            className="gap-grid-1 text-body font-body bg-primary text-primary-foreground border border-primary px-grid-2 py-grid-1 hover:bg-primary/90 transition-colors duration-150"
          >
            Create Your First Meeting
          </button>
        )
      }
    />
  )
}

export function NoSearchResultsState() {
  return (
    <EmptyState
      title="No meetings found"
      description="Try adjusting your search query or filters to find the meetings you're looking for"
    />
  )
}

export function NoTranscriptState() {
  return (
    <EmptyState
      icon={FileText}
      title="No transcript available"
      description="The transcript will be processed automatically during or after recording"
    />
  )
}
