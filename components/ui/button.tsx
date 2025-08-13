import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles - Sharp corners, precise spacing, classic Mac button feel
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-body font-body font-medium transition-all duration-150 ease-apple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 select-none border",
  {
    variants: {
      variant: {
        // Default - Classic Mac primary button with precise borders
        default: "bg-primary text-primary-foreground border-primary hover:bg-primary/90 active:bg-primary/80 active:shadow-inset active:transform active:translate-y-px",
        
        // Destructive - Apple red with clean styling
        destructive: "bg-destructive text-destructive-foreground border-destructive hover:bg-destructive/90 active:bg-destructive/80 active:shadow-inset active:transform active:translate-y-px",
        
        // Success - Apple green
        success: "bg-success text-success-foreground border-success hover:bg-success/90 active:bg-success/80 active:shadow-inset active:transform active:translate-y-px",
        
        // Warning - Apple yellow  
        warning: "bg-warning text-warning-foreground border-warning hover:bg-warning/90 active:bg-warning/80 active:shadow-inset active:transform active:translate-y-px",
        
        // Outline - Classic Mac outlined button
        outline: "border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground active:bg-muted active:shadow-inset active:transform active:translate-y-px",
        
        // Secondary - Light gray background like classic Mac buttons
        secondary: "bg-secondary text-secondary-foreground border-border hover:bg-accent active:bg-muted active:shadow-inset active:transform active:translate-y-px",
        
        // Ghost - Minimal button for subtle actions
        ghost: "border-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:border-border active:bg-muted active:shadow-inset",
        
        // Link - Text-only button
        link: "border-transparent text-primary underline-offset-4 hover:underline active:text-primary/80",
      },
      size: {
        // Sizes using 8pt grid system
        default: "h-grid-4 px-grid-2 py-0", // 32px height, 16px horizontal padding
        sm: "h-7 px-grid-1 py-0 text-caption",  // 28px height, 8px horizontal padding  
        lg: "h-grid-5 px-grid-3 py-0 text-title-3", // 40px height, 24px horizontal padding
        icon: "h-grid-4 w-grid-4 p-0", // 32x32px square
        "icon-sm": "h-7 w-7 p-0", // 28x28px square
        "icon-lg": "h-grid-5 w-grid-5 p-0", // 40x40px square
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }