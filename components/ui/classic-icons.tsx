'use client'

import { cn } from '@/lib/utils'

interface IconProps {
  className?: string
  size?: number
}

export function ClassicFolderIcon({ className, size = 16 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      className={cn("fill-current", className)}
    >
      <path d="M2 2h5l2 2h5a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
    </svg>
  )
}

export function ClassicDocumentIcon({ className, size = 16 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      className={cn("fill-current", className)}
    >
      <path d="M3 1h8l2 2v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
      <path d="M11 1v2h2" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M5 6h6M5 8h6M5 10h4" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

export function ClassicMicIcon({ className, size = 16 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      className={cn("fill-current", className)}
    >
      <rect x="6" y="2" width="4" height="6" rx="2" />
      <path d="M4 8s0 2 4 2 4-2 4-2" fill="none" stroke="currentColor" strokeWidth="1" />
      <line x1="8" y1="12" x2="8" y2="14" stroke="currentColor" strokeWidth="1" />
      <line x1="6" y1="14" x2="10" y2="14" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

export function ClassicComputerIcon({ className, size = 16 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      className={cn("fill-current", className)}
    >
      <rect x="2" y="2" width="12" height="8" rx="1" fill="currentColor" />
      <rect x="3" y="3" width="10" height="6" fill="white" />
      <rect x="4" y="4" width="8" height="4" fill="currentColor" />
      <rect x="6" y="10" width="4" height="1" fill="currentColor" />
      <rect x="4" y="11" width="8" height="1" fill="currentColor" />
    </svg>
  )
}

export function ClassicClockIcon({ className, size = 16 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      className={cn("fill-current", className)}
    >
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 4v4l2 2" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

export function ClassicAppleIcon({ className, size = 16 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      className={cn("fill-current", className)}
    >
      <path d="M11.5 6c-.5 0-1.5-.5-2.5-.5s-2 .5-2.5.5C5.5 6 4 7 4 9s1.5 4 2.5 4c.5 0 1-.5 1.5-.5s1 .5 1.5.5c1 0 2.5-2 2.5-4s-1.5-3-2.5-3z" />
      <path d="M9 3c0-1 .5-2 1.5-2S12 2 12 3s-.5 1-1.5 1S9 4 9 3z" />
      <ellipse cx="7" cy="2" rx="0.5" ry="1" fill="currentColor" transform="rotate(-45 7 2)" />
    </svg>
  )
}

export function ClassicMenuIcon({ className, size = 16 }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      className={cn("fill-current", className)}
    >
      <rect x="2" y="3" width="12" height="2" />
      <rect x="2" y="7" width="12" height="2" />
      <rect x="2" y="11" width="12" height="2" />
    </svg>
  )
}
