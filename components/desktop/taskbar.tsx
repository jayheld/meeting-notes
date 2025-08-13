'use client'

import React, { useState } from 'react'
import { Clock, Monitor, Settings, Search, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ClassicAppleIcon, ClassicComputerIcon } from '@/components/ui/classic-icons'
import { useWindowManager } from '@/hooks/use-window-manager'
import { cn } from '@/lib/utils'

export function Taskbar() {
  const { windows, focusWindow, restoreWindow, openWindow } = useWindowManager()
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update clock
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleWindowClick = (windowId: string) => {
    const window = windows.find(w => w.id === windowId)
    if (window?.isMinimized) {
      restoreWindow(windowId)
    } else {
      focusWindow(windowId)
    }
  }

  const openMeetingApp = () => {
    openWindow({
      title: 'Meeting Notes',
      content: ({ onClose }: { onClose?: () => void }) => (
        <div className="h-full p-4 bg-background">
          <h2 className="text-title-2 font-display mb-4">Meeting Notes Application</h2>
          <p className="text-body font-body mb-4">Your meeting notes app is running in a detachable window!</p>
          <Button onClick={onClose}>Close Window</Button>
        </div>
      ),
      position: { x: 100, y: 100 },
      size: { width: 600, height: 400 },
      isMinimized: false,
      isMaximized: false,

      isClosable: true,
      isResizable: true,
      isDraggable: true,
      minSize: { width: 400, height: 300 }
    })
  }

  const openSystemPrefs = () => {
    openWindow({
      title: 'System Preferences',
      content: () => (
        <div className="h-full p-4 bg-background">
          <h2 className="text-title-2 font-display mb-4">System Preferences</h2>
          <div className="grid grid-cols-3 gap-4">
            {['General', 'Desktop', 'Sound', 'Network', 'Security', 'Users'].map((pref) => (
              <div key={pref} className="p-4 border-2 border-border bg-secondary text-center hover:bg-accent cursor-pointer transition-colors">
                <div className="w-8 h-8 bg-primary mx-auto mb-2"></div>
                <div className="text-caption font-body">{pref}</div>
              </div>
            ))}
          </div>
        </div>
      ),
      position: { x: 200, y: 150 },
      size: { width: 500, height: 350 },
      isMinimized: false,
      isMaximized: false,

      isClosable: true,
      isResizable: true,
      isDraggable: true,
      minSize: { width: 400, height: 250 }
    })
  }

  const openFinder = () => {
    openWindow({
      title: 'Finder',
      content: () => (
        <div className="h-full flex">
          {/* Sidebar */}
          <div className="w-48 bg-secondary border-r-2 border-border p-2">
            <div className="text-caption font-body font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Places
            </div>
            <div className="space-y-1">
              {['Desktop', 'Documents', 'Applications', 'Downloads'].map((item) => (
                <div key={item} className="text-body font-body p-1 hover:bg-accent cursor-pointer transition-colors">
                  {item}
                </div>
              ))}
            </div>
          </div>
          
          {/* Main area */}
          <div className="flex-1 p-4 bg-background">
            <div className="grid grid-cols-4 gap-4">
              {['Meeting Notes.app', 'TextEdit.app', 'Calculator.app', 'Stickies.app'].map((app) => (
                <div key={app} className="text-center cursor-pointer hover:bg-accent p-2 transition-colors">
                  <div className="w-12 h-12 bg-primary border-2 border-border mx-auto mb-2 flex items-center justify-center">
                    <ClassicComputerIcon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="text-caption font-body">{app}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      position: { x: 50, y: 50 },
      size: { width: 700, height: 500 },
      isMinimized: false,
      isMaximized: false,

      isClosable: true,
      isResizable: true,
      isDraggable: true,
      minSize: { width: 500, height: 300 }
    })
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-secondary border-t-2 border-border flex items-center px-2 z-50">
      {/* Left side - Apple menu and running apps */}
      <div className="flex items-center gap-1">
        {/* Apple Menu */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 hover:bg-accent"
          title="Apple Menu"
        >
          <ClassicAppleIcon className="w-4 h-4" />
        </Button>

        {/* Running Applications */}
        <div className="flex items-center gap-1 ml-2">
          {windows.map((window) => (
            <Button
              key={window.id}
              variant={window.isFocused ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-8 px-3 text-caption font-body max-w-32 truncate",
                window.isMinimized && "opacity-50"
              )}
              onClick={() => handleWindowClick(window.id)}
              title={window.title}
            >
              {window.title}
            </Button>
          ))}
        </div>
      </div>

      {/* Center - Quick Launch Icons */}
      <div className="flex-1 flex justify-center items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 hover:bg-accent"
          onClick={openFinder}
          title="Finder"
        >
          <Search className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 hover:bg-accent"
          onClick={openMeetingApp}
          title="Meeting Notes"
        >
          <ClassicComputerIcon className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 hover:bg-accent"
          onClick={openSystemPrefs}
          title="System Preferences"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Right side - System status */}
      <div className="flex items-center gap-2">
        {/* Clock */}
        <div className="text-body font-body text-foreground">
          {currentTime.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })}
        </div>
      </div>
    </div>
  )
}
