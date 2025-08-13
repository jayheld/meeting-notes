'use client'

import { useState, useRef, useEffect } from 'react'
import { WindowChrome } from './window-chrome'
import { useWindowManager, type WindowState } from '@/hooks/use-window-manager'
import { cn } from '@/lib/utils'

interface DraggableWindowProps {
  window: WindowState
  children: React.ReactNode
}

export function DraggableWindow({ window, children }: DraggableWindowProps) {
  const { 
    closeWindow, 
    minimizeWindow, 
    maximizeWindow, 
    focusWindow, 
    bringToFront,
    moveWindow, 
    resizeWindow 
  } = useWindowManager()
  
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  // Handle window focus on click
  const handleWindowClick = (e: React.MouseEvent) => {
    // Don't focus window if clicking on an input, textarea, or button
    const target = e.target as HTMLElement
    const isInteractiveElement = target.tagName === 'INPUT' || 
                                 target.tagName === 'TEXTAREA' || 
                                 target.tagName === 'BUTTON' ||
                                 target.closest('button') ||
                                 target.closest('input') ||
                                 target.closest('textarea')
    
    if (!isInteractiveElement && !window.isFocused) {
      focusWindow(window.id)
      bringToFront(window.id)
    }
  }

  // Dragging logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!window.isDraggable || window.isMaximized) return
    
    e.preventDefault()
    setIsDragging(true)
    setDragStart({
      x: e.clientX - window.position.x,
      y: e.clientY - window.position.y
    })
    
    focusWindow(window.id)
    bringToFront(window.id)
  }

  // Resizing logic
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (!window.isResizable || window.isMaximized) return
    
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: window.size.width,
      height: window.size.height
    })
  }

  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        moveWindow(window.id, {
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        })
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x
        const deltaY = e.clientY - resizeStart.y
        
        resizeWindow(window.id, {
          width: resizeStart.width + deltaX,
          height: resizeStart.height + deltaY
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, isResizing, dragStart, resizeStart, window.id, moveWindow, resizeWindow])

  if (window.isMinimized) {
    return null
  }

  return (
    <div
      ref={windowRef}
      className={cn(
        "absolute",
        window.isFocused ? "z-40" : "z-30"
      )}
      style={{
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
        zIndex: window.zIndex
      }}
      onMouseDown={handleWindowClick}
    >
      <div className="h-full flex flex-col">
        {/* Window Chrome - Only the title bar is draggable */}
        <WindowChrome
          title={window.title}
          showControls={true}
          onClose={window.isClosable ? () => closeWindow(window.id) : undefined}
          onMinimize={() => minimizeWindow(window.id)}
          onMaximize={() => maximizeWindow(window.id)}
          onTitleBarMouseDown={handleMouseDown}
          isDragging={isDragging}
          className={cn(
            "border-2",
            window.isFocused 
              ? "border-border shadow-strong" 
              : "border-border/50 shadow-medium opacity-90"
          )}
        >
          {/* Window Content - No drag interference */}
          <div 
            className="flex-1 overflow-hidden relative"
            style={{ 
              height: window.size.height - 32 // Account for title bar
            }}
          >
            {children}
          </div>
        </WindowChrome>

        {/* Resize Handle */}
        {window.isResizable && !window.isMaximized && (
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            onMouseDown={handleResizeMouseDown}
          >
            <div className="absolute bottom-1 right-1">
              <div className="w-2 h-2 bg-border" />
              <div className="w-1 h-1 bg-border absolute bottom-0 right-0" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
