'use client'

import { cn } from '@/lib/utils'

interface WindowChromeProps {
  title?: string
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'modal' | 'floating'
  showControls?: boolean
  onClose?: () => void
  onMinimize?: () => void
  onMaximize?: () => void
  onTitleBarMouseDown?: (e: React.MouseEvent) => void
  isDragging?: boolean
}

export function WindowChrome({ 
  title, 
  children, 
  className,
  variant = 'default',
  showControls = true,
  onClose,
  onMinimize,
  onMaximize,
  onTitleBarMouseDown,
  isDragging = false
}: WindowChromeProps) {
  return (
    <div className={cn(
      // Classic Mac window styling - sharp edges, clean borders
      "bg-background border-2 border-border shadow-strong",
      // Different window variants
      {
        'border-border': variant === 'default',
        'border-border shadow-strong': variant === 'modal',
        'border-border shadow-medium': variant === 'floating'
      },
      className
    )}>
      {/* Classic Mac Title Bar */}
      <div 
        className={cn(
          "bg-secondary border-b-2 border-border flex items-center justify-between px-grid-2 py-grid-1 min-h-[32px]",
          "cursor-move select-none",
          isDragging && "cursor-grabbing"
        )}
        onMouseDown={onTitleBarMouseDown}
      >
        {/* Left: Window Controls */}
        {showControls && (
          <div className="flex items-center gap-grid-1">
            {/* Close Button - Classic Mac red */}
            <button
              onClick={onClose}
              className="w-4 h-4 bg-red-500 border border-red-600 hover:bg-red-400 transition-colors duration-150 flex items-center justify-center group"
              title="Close"
            >
              <div className="w-2 h-0.5 bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            
            {/* Minimize Button - Classic Mac yellow */}
            <button
              onClick={onMinimize}
              className="w-4 h-4 bg-yellow-500 border border-yellow-600 hover:bg-yellow-400 transition-colors duration-150 flex items-center justify-center group"
              title="Minimize"
            >
              <div className="w-2 h-0.5 bg-black opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            
            {/* Maximize Button - Classic Mac green */}
            <button
              onClick={onMaximize}
              className="w-4 h-4 bg-green-500 border border-green-600 hover:bg-green-400 transition-colors duration-150 flex items-center justify-center group"
              title="Maximize"
            >
              <div className="w-1.5 h-1.5 border border-black opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        )}

        {/* Center: Window Title */}
        {title && (
          <div className="flex-1 text-center">
            <h2 className="text-body font-body font-medium text-foreground truncate px-grid-2">
              {title}
            </h2>
          </div>
        )}

        {/* Right: Optional controls placeholder */}
        <div className="w-12" />
      </div>

      {/* Window Content */}
      <div className="bg-background">
        {children}
      </div>
    </div>
  )
}

export function WindowPattern({ 
  pattern = 'dots',
  className 
}: { 
  pattern?: 'dots' | 'checkerboard' | 'lines'
  className?: string 
}) {
  const patternClass = {
    dots: 'bg-[radial-gradient(circle_at_1px_1px,_#000_1px,_transparent_0)] bg-[length:8px_8px]',
    checkerboard: 'bg-[linear-gradient(45deg,_#000_25%,_transparent_25%),_linear-gradient(-45deg,_#000_25%,_transparent_25%),_linear-gradient(45deg,_transparent_75%,_#000_75%),_linear-gradient(-45deg,_transparent_75%,_#000_75%)] bg-[length:8px_8px] bg-[position:0_0,_0_0,_4px_4px,_4px_4px]',
    lines: 'bg-[repeating-linear-gradient(0deg,_#000,_#000_1px,_transparent_1px,_transparent_8px)]'
  }

  return (
    <div 
      className={cn(
        "absolute inset-0 opacity-5 pointer-events-none",
        patternClass[pattern],
        className
      )}
    />
  )
}
