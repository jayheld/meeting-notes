'use client'

import { useState } from 'react'
import { Search, Plus, Grid3X3, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { JournalCard } from './journal-card'
import { useNotesStore } from '@/stores/notes-store'
import { cn } from '@/lib/utils'

interface HomePageProps {
  onNoteSelect: (noteId: string) => void
}

export function HomePage({ onNoteSelect }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'shared' | 'owned'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { notes, createNote, selectNote } = useNotesStore()

  const handleCreateNote = () => {
    const newNote = createNote()
    selectNote(newNote.id)
    onNoteSelect(newNote.id)
  }

  const handleNoteClick = (noteId: string) => {
    selectNote(noteId)
    onNoteSelect(noteId)
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 1v4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 1v4" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-foreground">Home</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64 bg-background border-border rounded-xl"
              />
            </div>
            
            {/* New Button */}
            <Button
              onClick={handleCreateNote}
              className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 py-2 gap-2 rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-200"
            >
              New
              <Plus className="w-4 h-4" />
            </Button>
            
            {/* View Toggle */}
            <div className="flex items-center bg-accent/50 border border-border rounded-xl p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={cn(
                  "px-3 py-2 rounded-lg transition-all duration-200",
                  viewMode === 'grid' 
                    ? "bg-background shadow-modern" 
                    : "hover:bg-background/50"
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={cn(
                  "px-3 py-2 rounded-lg transition-all duration-200",
                  viewMode === 'list' 
                    ? "bg-background shadow-modern" 
                    : "hover:bg-background/50"
                )}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1">
          <Button
            variant={activeTab === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('all')}
            className={cn(
              "px-4 py-2 text-sm rounded-lg transition-all duration-200",
              activeTab === 'all' 
                ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-modern hover:from-teal-700 hover:to-teal-800" 
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('shared')}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200"
          >
            Shared with me
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('owned')}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200"
          >
            Owned by me
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6">
        {/* Journals Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-foreground">Journals</h2>
            <div className="bg-gradient-to-r from-accent to-accent/50 text-muted-foreground px-3 py-1 rounded-full text-sm font-medium border border-border/50">
              {filteredNotes.length}
            </div>
          </div>

          {/* Notes Grid/List */}
          {filteredNotes.length > 0 ? (
            <div className={cn(
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-3"
            )}>
              {filteredNotes.map((note) => (
                <JournalCard
                  key={note.id}
                  note={note}
                  viewMode={viewMode}
                  onClick={() => handleNoteClick(note.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              {/* Empty State Card */}
              <div className="border-2 border-dashed border-border/60 rounded-2xl p-8 w-64 h-40 flex flex-col items-center justify-center cursor-pointer hover:border-teal-500/50 hover:bg-teal-50/50 transition-all duration-300 group"
                   onClick={handleCreateNote}>
                <div className="text-muted-foreground mb-3 group-hover:text-teal-600 transition-colors duration-300">
                  <Plus className="w-8 h-8" />
                </div>
                <div className="text-sm text-muted-foreground text-center group-hover:text-teal-600 transition-colors duration-300 font-medium">
                  Start writing...
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
