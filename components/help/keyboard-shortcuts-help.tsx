'use client'

import React, { useState } from 'react'
import { Keyboard, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { commonShortcuts, formatShortcut } from '@/hooks/use-keyboard-shortcuts'
import { cn } from '@/lib/utils'

interface KeyboardShortcutsHelpProps {
  children?: React.ReactNode
}

const shortcuts = [
  commonShortcuts.newMeeting(() => {}),
  commonShortcuts.search(() => {}),
  commonShortcuts.dashboard(() => {}),
  commonShortcuts.settings(() => {}),
  commonShortcuts.startRecording(() => {}),
  commonShortcuts.stopRecording(() => {}),
  commonShortcuts.pauseRecording(() => {}),
  commonShortcuts.exportMeeting(() => {}),
  commonShortcuts.toggleSidebar(() => {}),
  commonShortcuts.focusSearch(() => {}),
]

export function KeyboardShortcutsHelp({ children }: KeyboardShortcutsHelpProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Group shortcuts by category
  const groupedShortcuts = shortcuts.reduce((groups, shortcut) => {
    const category = shortcut.category || 'General'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(shortcut)
    return groups
  }, {} as Record<string, typeof shortcuts>)

  const triggerElement = children || (
    <Button variant="ghost" size="icon-sm" title="Keyboard shortcuts">
      <Keyboard className="w-4 h-4" />
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerElement}
      </DialogTrigger>
      <DialogContent className="max-w-2xl retro-border retro-shadow mac-window">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-grid-2">
            <div className="w-grid-3 h-grid-3 bg-primary retro-border flex items-center justify-center">
              <Keyboard className="w-4 h-4 text-primary-foreground" />
            </div>
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-grid-4 max-h-96 overflow-y-auto">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-title-3">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-grid-2">
                  {categoryShortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-body font-body text-foreground">
                        {shortcut.description}
                      </span>
                      <kbd className="px-grid-1 py-0.5 bg-muted border border-border text-caption font-mono text-muted-foreground">
                        {formatShortcut(shortcut)}
                      </kbd>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-center pt-grid-3 border-t border-border">
          <div className="flex items-center gap-grid-1 text-caption font-body text-muted-foreground">
            <HelpCircle className="w-3 h-3" />
            Press <kbd className="px-1 bg-muted border border-border font-mono">?</kbd> to open this dialog
          </div>
          <Button onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Global keyboard shortcut to open help
export function useKeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false)

  // Listen for '?' key to open help
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '?' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        // Only trigger if not in an input field
        const target = event.target as HTMLElement
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.contentEditable) {
          event.preventDefault()
          setIsOpen(true)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return { isOpen, setIsOpen }
}
