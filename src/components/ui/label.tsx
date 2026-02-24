import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type LabelProps = ComponentProps<"label">;

export function Label({ className, children, htmlFor, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      htmlFor={htmlFor}
      {...props}
    >
      {children}
    </label>
  );
}
