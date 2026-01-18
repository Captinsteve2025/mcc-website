import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7F50] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#FF7F50] text-white shadow-sm hover:bg-[#e56b3e] active:bg-[#d45a2d]",
        destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700",
        outline: "border-2 border-[#061625] bg-transparent text-[#061625] shadow-sm hover:bg-[#061625] hover:text-white",
        secondary: "bg-[#061625] text-white shadow-sm hover:bg-[#0a2540]",
        ghost: "hover:bg-gray-100 text-[#061625]",
        link: "text-[#FF7F50] underline-offset-4 hover:underline",
        gold: "bg-[#FF7F50] text-white shadow-sm hover:bg-[#e56b3e] active:bg-[#d45a2d]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
