'use client'

import { useState } from 'react'
import { Plus, Search, FileText, Star, Trash2, Menu, Settings, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNotesStore } from '@/stores/notes-store'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  onNavigateHome: () => void
}

export function Sidebar({ collapsed, onToggleCollapse, onNavigateHome }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const { notes, selectedNote, createNote, selectNote, deleteNote, favoriteNote } = useNotesStore()

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateNote = () => {
    const newNote = createNote()
    selectNote(newNote.id)
  }

  return (
    <aside
      className={cn(
        "h-full bg-gradient-to-b from-secondary/30 to-secondary/10 border-r border-border/60 flex flex-col transition-all duration-300 ease-out backdrop-blur-sm",
        collapsed ? "w-16" : "w-80"
      )}
    >
      {/* User Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-modern">
                J
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">Hi, James</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCreateNote}
                className="ml-auto transition-smooth hover:bg-accent/50 rounded-lg p-2"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="transition-smooth hover:bg-accent"
            >
              <Menu className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {!collapsed && (
        <>
          {/* Search */}
          <div className="p-4 animate-slide-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background/50 border-border/50 transition-smooth focus:border-border rounded-xl backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="px-4 pb-4 animate-slide-in">
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 transition-smooth hover:bg-accent/50 text-teal-600 rounded-xl"
                onClick={onNavigateHome}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
                Home
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 transition-smooth hover:bg-accent/50 rounded-xl"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Video Vault
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 transition-smooth hover:bg-accent/50 rounded-xl"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                View Spaces
              </Button>
            </div>
          </div>

          {/* Your Journals Section */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-foreground">Your Journals</div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="pl-2">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 transition-smooth hover:bg-accent/50 text-sm rounded-lg"
              >
                Software Engineering
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        {!collapsed && (
          <div className="px-2 pb-4">
            <div className="text-caption font-medium text-muted-foreground mb-3 px-2">
              Recent Notes
            </div>
            <div className="space-y-1">
              {filteredNotes.map((note, index) => (
                <div
                  key={note.id}
                  className={cn(
                    "group relative p-3 rounded-lg cursor-pointer transition-smooth animate-fade-in hover:bg-accent/50",
                    selectedNote?.id === note.id && "bg-accent",
                    "animation-delay-" + (index * 50)
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => selectNote(note.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <h3 className="text-sm font-medium truncate">
                          {note.title || 'Untitled'}
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {note.content || 'No content'}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(note.updatedAt)}
                        </span>
                        {note.isFavorite && (
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="opacity-0 group-hover:opacity-100 transition-smooth flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          favoriteNote(note.id)
                        }}
                      >
                        <Star className={cn(
                          "w-3 h-3",
                          note.isFavorite ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                        )} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNote(note.id)
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredNotes.length === 0 && searchQuery && (
                <div className="text-center py-8 animate-fade-in">
                  <div className="text-muted-foreground mb-2">No notes found</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCreateNote}
                    className="transition-smooth"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Note
                  </Button>
                </div>
              )}
              
              {filteredNotes.length === 0 && !searchQuery && (
                <div className="text-center py-8 animate-fade-in">
                  <div className="text-muted-foreground mb-2">No notes yet</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCreateNote}
                    className="transition-smooth"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create your first note
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Settings */}
      {!collapsed && (
        <div className="p-4 border-t border-border/50 animate-slide-in">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 transition-smooth hover:bg-accent"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      )}
    </aside>
  )
}
