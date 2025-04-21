
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
  return (
    <div className={cn("w-full bg-harvester-800/50 rounded-full h-2.5", className)}>
      <div 
        className="bg-gradient-to-r from-harvester-500 to-harvester-400 h-2.5 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.max(5, Math.min(100, progress))}%` }}
      />
    </div>
  );
}
