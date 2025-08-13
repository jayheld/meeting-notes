import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Classic Mac input styling - Sharp corners, clean borders, precise focus states
          "flex w-full bg-input border border-border text-body font-body text-foreground",
          "px-grid-2 py-grid-1", // Consistent 8pt grid spacing
          "placeholder:text-muted-foreground placeholder:font-body",
          // Sharp focus ring - no rounded corners, precise blue outline
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          // Clean disabled state
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
          // File input styling
          "file:border-0 file:bg-transparent file:text-caption file:font-body file:font-medium file:text-foreground",
          // Transition for smooth interactions
          "transition-all duration-150 ease-apple",
          // Hover state for better interactivity
          "hover:border-ring/50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }