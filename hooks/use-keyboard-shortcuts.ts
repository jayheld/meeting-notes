'use client'

import { useEffect, useCallback } from 'react'

type KeyboardShortcut = {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  callback: () => void
  description: string
  category?: string
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const matchingShortcut = shortcuts.find(shortcut => {
      const keyMatches = shortcut.key.toLowerCase() === event.key.toLowerCase()
      const ctrlMatches = (shortcut.ctrlKey ?? false) === event.ctrlKey
      const metaMatches = (shortcut.metaKey ?? false) === event.metaKey
      const shiftMatches = (shortcut.shiftKey ?? false) === event.shiftKey
      const altMatches = (shortcut.altKey ?? false) === event.altKey
      
      return keyMatches && ctrlMatches && metaMatches && shiftMatches && altMatches
    })

    if (matchingShortcut) {
      event.preventDefault()
      matchingShortcut.callback()
    }
  }, [shortcuts])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return shortcuts
}

// Predefined common shortcuts
export const commonShortcuts = {
  // Navigation
  newMeeting: (callback: () => void): KeyboardShortcut => ({
    key: 'n',
    metaKey: true,
    callback,
    description: 'Start new meeting',
    category: 'Navigation'
  }),
  
  search: (callback: () => void): KeyboardShortcut => ({
    key: 'k',
    metaKey: true,
    callback,
    description: 'Open search',
    category: 'Navigation'
  }),
  
  dashboard: (callback: () => void): KeyboardShortcut => ({
    key: 'd',
    metaKey: true,
    callback,
    description: 'Go to dashboard',
    category: 'Navigation'
  }),
  
  settings: (callback: () => void): KeyboardShortcut => ({
    key: ',',
    metaKey: true,
    callback,
    description: 'Open settings',
    category: 'Navigation'
  }),

  // Recording controls
  startRecording: (callback: () => void): KeyboardShortcut => ({
    key: 'r',
    metaKey: true,
    shiftKey: true,
    callback,
    description: 'Start recording',
    category: 'Recording'
  }),
  
  stopRecording: (callback: () => void): KeyboardShortcut => ({
    key: 's',
    metaKey: true,
    shiftKey: true,
    callback,
    description: 'Stop recording',
    category: 'Recording'
  }),
  
  pauseRecording: (callback: () => void): KeyboardShortcut => ({
    key: 'p',
    metaKey: true,
    shiftKey: true,
    callback,
    description: 'Pause/Resume recording',
    category: 'Recording'
  }),

  // Actions
  exportMeeting: (callback: () => void): KeyboardShortcut => ({
    key: 'e',
    metaKey: true,
    callback,
    description: 'Export current meeting',
    category: 'Actions'
  }),
  
  deleteMeeting: (callback: () => void): KeyboardShortcut => ({
    key: 'Backspace',
    metaKey: true,
    callback,
    description: 'Delete current meeting',
    category: 'Actions'
  }),

  // UI
  toggleSidebar: (callback: () => void): KeyboardShortcut => ({
    key: 'b',
    metaKey: true,
    callback,
    description: 'Toggle sidebar',
    category: 'UI'
  }),
  
  focusSearch: (callback: () => void): KeyboardShortcut => ({
    key: '/',
    callback,
    description: 'Focus search input',
    category: 'UI'
  })
}

// Format shortcut for display
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = []
  
  if (shortcut.metaKey) parts.push('⌘')
  if (shortcut.ctrlKey) parts.push('Ctrl')
  if (shortcut.altKey) parts.push('⌥')
  if (shortcut.shiftKey) parts.push('⇧')
  
  // Special key mappings for display
  const keyMappings: Record<string, string> = {
    'Backspace': '⌫',
    'Enter': '↵',
    'Escape': '⎋',
    'ArrowUp': '↑',
    'ArrowDown': '↓',
    'ArrowLeft': '←',
    'ArrowRight': '→',
    ' ': 'Space',
    ',': ','
  }
  
  const displayKey = keyMappings[shortcut.key] || shortcut.key.toUpperCase()
  parts.push(displayKey)
  
  return parts.join('')
}

// Hook for managing global app shortcuts
export function useAppShortcuts({
  onNewMeeting,
  onSearch,
  onDashboard,
  onSettings,
  onToggleSidebar
}: {
  onNewMeeting?: () => void
  onSearch?: () => void
  onDashboard?: () => void
  onSettings?: () => void
  onToggleSidebar?: () => void
}) {
  const shortcuts: KeyboardShortcut[] = []
  
  if (onNewMeeting) shortcuts.push(commonShortcuts.newMeeting(onNewMeeting))
  if (onSearch) shortcuts.push(commonShortcuts.search(onSearch))
  if (onDashboard) shortcuts.push(commonShortcuts.dashboard(onDashboard))
  if (onSettings) shortcuts.push(commonShortcuts.settings(onSettings))
  if (onToggleSidebar) shortcuts.push(commonShortcuts.toggleSidebar(onToggleSidebar))
  
  return useKeyboardShortcuts(shortcuts)
}

// Hook for recording shortcuts
export function useRecordingShortcuts({
  onStart,
  onStop,
  onPause,
  isRecording,
  isPaused
}: {
  onStart?: () => void
  onStop?: () => void
  onPause?: () => void
  isRecording?: boolean
  isPaused?: boolean
}) {
  const shortcuts: KeyboardShortcut[] = []
  
  if (onStart && !isRecording) {
    shortcuts.push(commonShortcuts.startRecording(onStart))
  }
  
  if (onStop && isRecording) {
    shortcuts.push(commonShortcuts.stopRecording(onStop))
  }
  
  if (onPause && isRecording) {
    shortcuts.push(commonShortcuts.pauseRecording(onPause))
  }
  
  return useKeyboardShortcuts(shortcuts)
}
