'use client'

import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Note } from '@/stores/notes-store'

interface JournalCardProps {
  note: Note
  viewMode: 'grid' | 'list'
  onClick: () => void
}

export function JournalCard({ note, viewMode, onClick }: JournalCardProps) {
  // Generate a random emoji for the note (or use a default)
  const noteEmoji = note.title ? '📝' : '📄'
  
  const getPreviewText = (content: string) => {
    return content.slice(0, 100) + (content.length > 100 ? '...' : '')
  }

  if (viewMode === 'list') {
    return (
      <div
        onClick={onClick}
        className="flex items-center gap-4 p-4 bg-background border border-border rounded-xl hover:shadow-modern-lg hover:border-border/60 cursor-pointer transition-all duration-200"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-modern">
          <span className="text-lg">{noteEmoji}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate">
            {note.title || 'Untitled'}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {formatDate(note.updatedAt)}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className="group bg-background border border-border rounded-2xl p-6 hover:shadow-modern-lg hover:border-border/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Header with emoji */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-modern">
          <span className="text-xl">{noteEmoji}</span>
        </div>
        
        {/* Copy icon (like in Opennote) */}
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 hover:bg-accent rounded-lg">
          <svg className="w-4 h-4 text-muted-foreground hover:text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-foreground mb-3 line-clamp-2 text-lg">
        {note.title || 'Untitled'}
      </h3>

      {/* Preview content */}
      {note.content && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
          {getPreviewText(note.content)}
        </p>
      )}

      {/* Date */}
      <div className="text-xs text-muted-foreground font-medium">
        {formatDate(note.updatedAt)}
      </div>
    </div>
  )
}
