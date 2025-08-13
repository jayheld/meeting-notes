'use client'

import { useState } from 'react'
import { Sidebar } from './sidebar'
import { NoteEditor } from './note-editor'
import { HomePage } from './home-page'
import { useNotesStore } from '@/stores/notes-store'

export function NotesApp() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { selectedNote } = useNotesStore()
  const [currentView, setCurrentView] = useState<'home' | 'note'>('home')

  const handleNoteSelect = (noteId: string) => {
    setCurrentView('note')
  }

  const handleBackToHome = () => {
    setCurrentView('home')
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onNavigateHome={handleBackToHome}
      />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {selectedNote && currentView === 'note' ? (
          <NoteEditor note={selectedNote} onBack={handleBackToHome} />
        ) : (
          <HomePage onNoteSelect={handleNoteSelect} />
        )}
      </main>
    </div>
  )
}
