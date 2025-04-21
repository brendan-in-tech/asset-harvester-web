
import { cn } from "@/lib/utils"

interface PageContainerProps {
  className?: string
  children: React.ReactNode
}

export function PageContainer({ className, children }: PageContainerProps) {
  return (
    <div className={cn(
      "w-full min-h-screen bg-gradient-to-b from-harvester-900 via-harvester-800 to-harvester-950 text-white", 
      className
    )}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </div>
    </div>
  )
}
