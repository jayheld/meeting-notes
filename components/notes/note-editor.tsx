'use client'

import { useState, useEffect, useRef } from 'react'
import { Star, MoreHorizontal, Share, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNotesStore } from '@/stores/notes-store'
import { cn } from '@/lib/utils'
import type { Note } from '@/stores/notes-store'

interface NoteEditorProps {
  note: Note
  onBack?: () => void
}

export function NoteEditor({ note, onBack }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [isEditing, setIsEditing] = useState(false)
  const { updateNote, favoriteNote, deleteNote } = useNotesStore()
  const titleRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title !== note.title || content !== note.content) {
        updateNote(note.id, { title, content })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [title, content, note.id, note.title, note.content, updateNote])

  // Update local state when note changes
  useEffect(() => {
    setTitle(note.title)
    setContent(note.content)
  }, [note.id])

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      contentRef.current?.focus()
    }
  }

  const adjustTextareaHeight = () => {
    if (contentRef.current) {
      contentRef.current.style.height = 'auto'
      contentRef.current.style.height = `${contentRef.current.scrollHeight}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [content])

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-6 border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground transition-smooth"
            >
              ← Back
            </Button>
          )}
          <div className="text-caption text-muted-foreground">
            {new Date(note.updatedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
          {title && (
            <div className="text-caption text-muted-foreground">
              {content.length} characters
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => favoriteNote(note.id)}
            className={cn(
              "transition-smooth",
              note.isFavorite ? "text-yellow-500 hover:text-yellow-600" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Star className={cn("w-4 h-4", note.isFavorite && "fill-yellow-500")} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground transition-smooth"
          >
            <Share className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteNote(note.id)}
            className="text-muted-foreground hover:text-destructive transition-smooth"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground transition-smooth"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Editor */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6 animate-fade-in">
          {/* Title */}
          <div className="mb-8">
            <input
              ref={titleRef}
              type="text"
              placeholder="Untitled"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              onFocus={() => setIsEditing(true)}
              onBlur={() => setIsEditing(false)}
              className={cn(
                "w-full bg-transparent border-none outline-none resize-none",
                "text-display font-bold text-foreground placeholder:text-muted-foreground",
                "transition-smooth focus:placeholder:text-muted-foreground/50"
              )}
            />
          </div>

          {/* Content */}
          <div className="relative">
            <textarea
              ref={contentRef}
              placeholder="Start writing your note..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                adjustTextareaHeight()
              }}
              onFocus={() => setIsEditing(true)}
              onBlur={() => setIsEditing(false)}
              className={cn(
                "w-full bg-transparent border-none outline-none resize-none",
                "text-body text-foreground placeholder:text-muted-foreground leading-relaxed",
                "transition-smooth focus:placeholder:text-muted-foreground/50",
                "min-h-[calc(100vh-300px)]"
              )}
              style={{ height: 'auto' }}
            />
            
            {/* Editing indicator */}
            {isEditing && (
              <div className="absolute -left-4 top-0 w-1 h-6 bg-primary rounded-full animate-scale-in" />
            )}
          </div>

          {/* Empty state */}
          {!title && !content && (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-subtitle text-foreground mb-2">Start writing</h3>
              <p className="text-body text-muted-foreground">
                Click in the title or content area to begin writing your note.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
