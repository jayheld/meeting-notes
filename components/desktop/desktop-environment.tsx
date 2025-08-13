'use client'

import { useEffect, useRef } from 'react'
import { DraggableWindow } from '@/components/ui/draggable-window'
import { Taskbar } from './taskbar'
import { WindowPattern } from '@/components/ui/window-chrome'
import { useWindowManager } from '@/hooks/use-window-manager'
import { cn } from '@/lib/utils'

interface DesktopEnvironmentProps {
  children?: React.ReactNode
  className?: string
}

export function DesktopEnvironment({ children, className }: DesktopEnvironmentProps) {
  const { windows, setDesktopSize } = useWindowManager()
  const desktopRef = useRef<HTMLDivElement>(null)

  // Update desktop size on resize
  useEffect(() => {
    const updateDesktopSize = () => {
      if (desktopRef.current) {
        const { width, height } = desktopRef.current.getBoundingClientRect()
        setDesktopSize({ width, height: height - 48 }) // Account for taskbar
      }
    }

    updateDesktopSize()
    window.addEventListener('resize', updateDesktopSize)
    
    return () => window.removeEventListener('resize', updateDesktopSize)
  }, [setDesktopSize])

  return (
    <div 
      ref={desktopRef}
      className={cn(
        "relative h-screen overflow-hidden bg-muted select-none",
        className
      )}
    >
      {/* Desktop Background Pattern */}
      <WindowPattern pattern="dots" className="opacity-10" />
      
      {/* Desktop Icons Area (optional future feature) */}
      <div className="absolute inset-0 p-4">
        {children}
      </div>

      {/* Windows Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {windows.map((window) => (
          <div key={window.id} className="pointer-events-auto">
            <DraggableWindow window={window}>
              <window.content {...(window.props || {})} />
            </DraggableWindow>
          </div>
        ))}
      </div>

      {/* Taskbar */}
      <Taskbar />
    </div>
  )
}
