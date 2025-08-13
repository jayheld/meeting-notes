'use client'

import { create } from 'zustand'

export interface WindowState {
  id: string
  title: string
  content: React.ComponentType<any>
  props?: any
  position: { x: number; y: number }
  size: { width: number; height: number }
  isMinimized: boolean
  isMaximized: boolean
  isFocused: boolean
  zIndex: number
  isClosable: boolean
  isResizable: boolean
  isDraggable: boolean
  minSize?: { width: number; height: number }
  maxSize?: { width: number; height: number }
}

interface WindowManagerState {
  windows: WindowState[]
  focusedWindowId: string | null
  nextZIndex: number
  desktop: {
    width: number
    height: number
  }
}

interface WindowManagerActions {
  openWindow: (window: Omit<WindowState, 'id' | 'zIndex' | 'isFocused'>) => string
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  focusWindow: (id: string) => void
  moveWindow: (id: string, position: { x: number; y: number }) => void
  resizeWindow: (id: string, size: { width: number; height: number }) => void
  updateWindow: (id: string, updates: Partial<WindowState>) => void
  setDesktopSize: (size: { width: number; height: number }) => void
  bringToFront: (id: string) => void
  getWindow: (id: string) => WindowState | undefined
}

export const useWindowManager = create<WindowManagerState & WindowManagerActions>((set, get) => ({
  windows: [],
  focusedWindowId: null,
  nextZIndex: 1000,
  desktop: { width: 1200, height: 800 },

  openWindow: (windowData) => {
    const id = `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const state = get()
    
    const newWindow: WindowState = {
      ...windowData,
      id,
      zIndex: state.nextZIndex,
      isFocused: true,
    }
    
    set({
      windows: [
        ...state.windows.map(window => ({ ...window, isFocused: false })),
        newWindow
      ],
      focusedWindowId: id,
      nextZIndex: state.nextZIndex + 1,
      desktop: state.desktop
    })
    
    return id
  },

  closeWindow: (id) => {
    const state = get()
    const filteredWindows = state.windows.filter(w => w.id !== id)
    
    let newFocusedWindowId = state.focusedWindowId
    let updatedWindows = filteredWindows
    
    if (state.focusedWindowId === id) {
      const remainingWindows = filteredWindows.filter(w => !w.isMinimized)
      if (remainingWindows.length > 0) {
        const topWindow = remainingWindows.reduce((prev, current) => 
          prev.zIndex > current.zIndex ? prev : current
        )
        newFocusedWindowId = topWindow.id
        updatedWindows = filteredWindows.map(w => 
          w.id === topWindow.id ? { ...w, isFocused: true } : { ...w, isFocused: false }
        )
      } else {
        newFocusedWindowId = null
      }
    }
    
    set({
      windows: updatedWindows,
      focusedWindowId: newFocusedWindowId,
      nextZIndex: state.nextZIndex,
      desktop: state.desktop
    })
  },

  minimizeWindow: (id) => {
    const state = get()
    const updatedWindows = state.windows.map(window => {
      if (window.id === id) {
        return { ...window, isMinimized: true, isFocused: false }
      }
      return window
    })
    
    let newFocusedWindowId = state.focusedWindowId
    if (state.focusedWindowId === id) {
      const availableWindows = updatedWindows.filter(w => !w.isMinimized && w.id !== id)
      if (availableWindows.length > 0) {
        const topWindow = availableWindows.reduce((prev, current) => 
          prev.zIndex > current.zIndex ? prev : current
        )
        newFocusedWindowId = topWindow.id
        updatedWindows.forEach(w => {
          if (w.id === topWindow.id) w.isFocused = true
        })
      } else {
        newFocusedWindowId = null
      }
    }
    
    set({
      windows: updatedWindows,
      focusedWindowId: newFocusedWindowId,
      nextZIndex: state.nextZIndex,
      desktop: state.desktop
    })
  },

  maximizeWindow: (id) => {
    const state = get()
    const updatedWindows = state.windows.map(window => {
      if (window.id === id) {
        if (window.isMaximized) {
          return { ...window, isMaximized: false, isFocused: true }
        } else {
          return { 
            ...window, 
            isMaximized: true, 
            position: { x: 0, y: 0 },
            size: { width: state.desktop.width, height: state.desktop.height },
            isFocused: true 
          }
        }
      }
      return { ...window, isFocused: false }
    })
    
    set({
      windows: updatedWindows,
      focusedWindowId: id,
      nextZIndex: state.nextZIndex,
      desktop: state.desktop
    })
  },

  restoreWindow: (id) => {
    const state = get()
    const updatedWindows = state.windows.map(window => {
      if (window.id === id) {
        return { 
          ...window, 
          isMinimized: false, 
          isMaximized: false, 
          isFocused: true,
          zIndex: state.nextZIndex
        }
      }
      return { ...window, isFocused: false }
    })
    
    set({
      windows: updatedWindows,
      focusedWindowId: id,
      nextZIndex: state.nextZIndex + 1,
      desktop: state.desktop
    })
  },

  focusWindow: (id) => {
    const state = get()
    const updatedWindows = state.windows.map(window => ({
      ...window,
      isFocused: window.id === id && !window.isMinimized
    }))
    
    const targetWindow = updatedWindows.find(w => w.id === id)
    const newFocusedWindowId = targetWindow && !targetWindow.isMinimized ? id : state.focusedWindowId
    
    set({
      windows: updatedWindows,
      focusedWindowId: newFocusedWindowId,
      nextZIndex: state.nextZIndex,
      desktop: state.desktop
    })
  },

  bringToFront: (id) => {
    const state = get()
    const updatedWindows = state.windows.map(window => {
      if (window.id === id) {
        return { ...window, zIndex: state.nextZIndex }
      }
      return window
    })
    
    set({
      windows: updatedWindows,
      focusedWindowId: state.focusedWindowId,
      nextZIndex: state.nextZIndex + 1,
      desktop: state.desktop
    })
  },

  moveWindow: (id, position) => {
    const state = get()
    const updatedWindows = state.windows.map(window => {
      if (window.id === id && window.isDraggable && !window.isMaximized) {
        const maxX = Math.max(0, state.desktop.width - window.size.width)
        const maxY = Math.max(0, state.desktop.height - window.size.height)
        
        return {
          ...window,
          position: {
            x: Math.max(0, Math.min(maxX, position.x)),
            y: Math.max(0, Math.min(maxY, position.y))
          }
        }
      }
      return window
    })
    
    set({
      windows: updatedWindows,
      focusedWindowId: state.focusedWindowId,
      nextZIndex: state.nextZIndex,
      desktop: state.desktop
    })
  },

  resizeWindow: (id, size) => {
    const state = get()
    const updatedWindows = state.windows.map(window => {
      if (window.id === id && window.isResizable && !window.isMaximized) {
        const minWidth = window.minSize?.width || 200
        const minHeight = window.minSize?.height || 150
        const maxWidth = window.maxSize?.width || state.desktop.width
        const maxHeight = window.maxSize?.height || state.desktop.height
        
        return {
          ...window,
          size: {
            width: Math.max(minWidth, Math.min(maxWidth, size.width)),
            height: Math.max(minHeight, Math.min(maxHeight, size.height))
          }
        }
      }
      return window
    })
    
    set({
      windows: updatedWindows,
      focusedWindowId: state.focusedWindowId,
      nextZIndex: state.nextZIndex,
      desktop: state.desktop
    })
  },

  updateWindow: (id, updates) => {
    const state = get()
    const updatedWindows = state.windows.map(window => {
      if (window.id === id) {
        return { ...window, ...updates }
      }
      return window
    })
    
    set({
      windows: updatedWindows,
      focusedWindowId: state.focusedWindowId,
      nextZIndex: state.nextZIndex,
      desktop: state.desktop
    })
  },

  setDesktopSize: (size) => {
    const state = get()
    set({
      windows: state.windows,
      focusedWindowId: state.focusedWindowId,
      nextZIndex: state.nextZIndex,
      desktop: size
    })
  },

  getWindow: (id) => {
    return get().windows.find(w => w.id === id)
  }
}))