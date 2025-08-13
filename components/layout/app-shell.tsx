'use client'

import { useState } from 'react'
import { Search, Settings, Plus, Mic, MicOff, Menu, Keyboard, Monitor } from 'lucide-react'
import { ClassicComputerIcon, ClassicAppleIcon, ClassicMenuIcon } from '@/components/ui/classic-icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SettingsDialog } from '@/components/settings/settings-dialog'
import { KeyboardShortcutsHelp } from '@/components/help/keyboard-shortcuts-help'
import { WindowChrome, WindowPattern } from '@/components/ui/window-chrome'
import { useAppShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { useMeetingStore } from '@/stores/meeting-store'
import { cn } from '@/lib/utils'

interface AppShellProps {
  children: React.ReactNode
  onNewMeeting?: () => void
  onNavigateToDashboard?: () => void
  currentView?: 'dashboard' | 'recording'
}

export function AppShell({ children, onNewMeeting, onNavigateToDashboard, currentView }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { recordingState, searchQuery, setSearchQuery } = useMeetingStore()

  // Set up keyboard shortcuts
  useAppShortcuts({
    onNewMeeting,
    onDashboard: onNavigateToDashboard,
    onToggleSidebar: () => setSidebarOpen(!sidebarOpen)
  })

  return (
    <div className="h-screen bg-muted p-grid-2 relative overflow-hidden">
      {/* Classic Mac Desktop Pattern */}
      <WindowPattern pattern="dots" className="opacity-10" />
      
      {/* Main Application Window */}
      <WindowChrome 
        title="Meeting Notes" 
        className="h-full flex"
        showControls={true}
      >
        <div className="flex h-full">
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-background/95 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          {/* Sidebar - Classic Mac left panel */}
          <aside className={cn(
            // Sharp-edged sidebar with precise border and clean styling
            "bg-secondary border-r-2 border-border transition-all duration-150 ease-apple flex-shrink-0",
            // Responsive sidebar - full screen on mobile, sidebar on desktop
            "absolute inset-y-0 left-0 z-50 md:relative md:z-auto",
            sidebarOpen ? "w-72" : "w-0 overflow-hidden"
          )}>
        <div className="h-full flex flex-col">
          {/* App Title Section - Classic Mac style */}
          <div className="p-grid-3 border-b border-border/50">
            <div className="flex items-center gap-grid-2">
              {/* Classic Apple-style app icon */}
              <div className="w-grid-4 h-grid-4 bg-background border-2 border-border shadow-medium flex items-center justify-center">
                <ClassicAppleIcon className="w-4 h-4 text-foreground" />
              </div>
              <h1 className="text-title-2 font-display font-semibold text-foreground">
                Meeting Notes
              </h1>
            </div>
          </div>

          {/* Quick Stats Section */}
          <div className="p-grid-3 border-b border-border/50">
            <div className="text-caption font-body font-medium text-muted-foreground uppercase tracking-wide mb-grid-1">
              Quick Access
            </div>
            <div className="space-y-1">
              <button className="w-full text-left text-body font-body text-muted-foreground hover:text-foreground transition-colors duration-150 py-1">
                Recent Meetings
              </button>
              <button className="w-full text-left text-body font-body text-muted-foreground hover:text-foreground transition-colors duration-150 py-1">
                Today's Recordings
              </button>
              <button className="w-full text-left text-body font-body text-muted-foreground hover:text-foreground transition-colors duration-150 py-1">
                Favorites
              </button>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="p-grid-3 border-b border-border/50">
            <Button 
              className="w-full justify-start gap-grid-2 text-body font-body" 
              variant={recordingState.isRecording ? "destructive" : "default"}
              size="default"
              onClick={recordingState.isRecording ? undefined : onNewMeeting}
            >
              {recordingState.isRecording ? (
                <>
                  <MicOff className="w-4 h-4" />
                  Recording...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  New Meeting
                </>
              )}
            </Button>
          </div>

          {/* Navigation Menu - Classic Mac list styling */}
          <nav className="flex-1 p-grid-3 space-y-1">
            <div className="text-caption font-body font-medium text-muted-foreground uppercase tracking-wide mb-grid-2">
              Navigation
            </div>
            
            <button 
              onClick={onNavigateToDashboard}
              className={cn(
                // Classic Mac menu item styling - precise spacing, clean hover states
                "flex items-center gap-grid-2 px-grid-2 py-grid-1 text-body font-body w-full text-left transition-all duration-150 ease-apple",
                "hover:bg-accent hover:text-accent-foreground",
                currentView === 'dashboard' 
                  ? "bg-primary text-primary-foreground font-medium" 
                  : "text-foreground"
              )}
            >
              All Meetings
            </button>
            
            <button 
              onClick={onNewMeeting}
              className={cn(
                "flex items-center gap-grid-2 px-grid-2 py-grid-1 text-body font-body w-full text-left transition-all duration-150 ease-apple",
                "hover:bg-accent hover:text-accent-foreground",
                currentView === 'recording' 
                  ? "bg-primary text-primary-foreground font-medium" 
                  : "text-foreground"
              )}
            >
              New Recording
            </button>
            
            <button 
              className="flex items-center gap-grid-2 px-grid-2 py-grid-1 text-body font-body text-muted-foreground w-full text-left hover:bg-accent hover:text-accent-foreground transition-all duration-150 ease-apple"
            >
              Recent
            </button>
            
            <button 
              className="flex items-center gap-grid-2 px-grid-2 py-grid-1 text-body font-body text-muted-foreground w-full text-left hover:bg-accent hover:text-accent-foreground transition-all duration-150 ease-apple"
            >
              Favorites
            </button>
          </nav>
        </div>
      </aside>

                {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Classic Mac Menu Bar */}
            <header className="bg-secondary border-b-2 border-border flex-shrink-0">
              <div className="flex items-center justify-between px-grid-2 py-grid-1 min-h-[28px]">
                {/* Left Section - Menu items (classic Mac style) */}
                <div className="flex items-center gap-grid-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="md:hidden text-body font-body"
                  >
                    <ClassicMenuIcon className="w-4 h-4 mr-1" />
                    Menu
                  </Button>
                  
                  {/* Classic Mac menu items */}
                  <div className="hidden md:flex items-center gap-grid-3 text-body font-body">
                    <button className="hover:bg-accent hover:text-accent-foreground px-2 py-1 transition-colors">
                      File
                    </button>
                    <button className="hover:bg-accent hover:text-accent-foreground px-2 py-1 transition-colors">
                      Edit
                    </button>
                    <button className="hover:bg-accent hover:text-accent-foreground px-2 py-1 transition-colors">
                      View
                    </button>
                    <button className="hover:bg-accent hover:text-accent-foreground px-2 py-1 transition-colors">
                      Special
                    </button>
                  </div>
                </div>

                {/* Right Section - Status and controls */}
                <div className="flex items-center gap-grid-1">
                  {recordingState.isRecording && (
                    <div className="flex items-center gap-grid-1 px-grid-2 py-1 bg-destructive/20 text-destructive border border-destructive/40">
                      <div className="w-2 h-2 bg-destructive animate-pulse" />
                      <span className="text-caption font-body font-medium">REC</span>
                    </div>
                  )}
                  <div className="hidden md:flex items-center gap-grid-1">
                    <KeyboardShortcutsHelp>
                      <Button variant="ghost" size="icon-sm" title="Keyboard shortcuts">
                        <Keyboard className="w-3 h-3" />
                      </Button>
                    </KeyboardShortcutsHelp>
                  </div>
                  <SettingsDialog>
                    <Button variant="ghost" size="icon-sm" title="Settings">
                      <Settings className="w-3 h-3" />
                    </Button>
                  </SettingsDialog>
                </div>
              </div>
            </header>

            {/* Main Content with classic inset styling */}
            <main className="flex-1 overflow-auto bg-background border-2 border-inset border-border/50 m-1">
              <div className="relative h-full">
                <WindowPattern pattern="dots" className="opacity-5" />
                <div className="relative z-10 h-full">
                  {children}
                </div>
              </div>
            </main>
          </div>
        </div>
      </WindowChrome>
    </div>
  )
}