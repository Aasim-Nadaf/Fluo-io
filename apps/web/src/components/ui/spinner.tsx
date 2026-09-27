import { cn } from "cn"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"

function Spinner({ className, strokeWidth, ...props }: React.ComponentProps<"svg">) {
  const sw = typeof strokeWidth === "number" ? strokeWidth : 2
  return (
    <HugeiconsIcon
      icon={Loading03Icon}
      strokeWidth={sw}
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...(props as Omit<React.ComponentProps<typeof HugeiconsIcon>, "icon">)}
    />
  )
}

export { Spinner }
