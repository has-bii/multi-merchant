import { cn } from "@/lib/utils"

import type { ComponentProps } from "react"

type Props = ComponentProps<"div">

export function MainPage({ children, className, ...props }: Props) {
  return (
    <div className={cn("@container/main flex min-h-0 flex-1 flex-col", className)} {...props}>
      {children}
    </div>
  )
}

export function MainPageContent({ children, className, ...props }: Props) {
  return (
    <div className={cn("flex flex-1 flex-col gap-4 p-6", className)} {...props}>
      {children}
    </div>
  )
}
