import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "btn",
  {
    variants: {
      variant: {
        default: "btn-primary",
        destructive: "border border-destructive bg-background hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "btn-secondary",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "btn-link",
        primary: "btn-primary",
        gradient: "text-foreground shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all gradient-button",
      },
      size: {
        default: "",
        sm: "btn-sm",
        lg: "btn-lg",
        icon: "h-10 w-10 p-0",
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
