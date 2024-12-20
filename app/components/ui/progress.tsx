"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, indicatorClassName }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
    >
      <div
        className={cn("h-full transition-all", indicatorClassName)}
        style={{ width: `${value}%` }}
      />
    </div>
  )
);

Progress.displayName = "Progress";

export { Progress };
