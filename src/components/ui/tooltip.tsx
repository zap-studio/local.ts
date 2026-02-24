import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  delayDuration?: number;
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
}

export function Tooltip({
  content,
  children,
  side = "right",
  sideOffset = 8,
  delayDuration = 300,
}: TooltipProps) {
  return (
    <BaseTooltip.Provider>
      <BaseTooltip.Root>
        <BaseTooltip.Trigger
          delay={delayDuration}
          render={(props) => (
            <span {...props} className="inline-flex">
              {children}
            </span>
          )}
        />
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner side={side} sideOffset={sideOffset}>
            <TooltipPopup>{content}</TooltipPopup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
}

interface TooltipPopupProps extends ComponentProps<typeof BaseTooltip.Popup> {
  children: ReactNode;
}

function TooltipPopup({ children, className, ...props }: TooltipPopupProps) {
  return (
    <BaseTooltip.Popup
      className={cn(
        "z-50 rounded-md bg-primary px-3 py-1.5 text-primary-foreground text-sm shadow-md",
        "fade-in-0 zoom-in-95 animate-in",
        "data-ending-style:fade-out-0 data-ending-style:zoom-out-95 data-ending-style:animate-out",
        className
      )}
      {...props}
    >
      {children}
    </BaseTooltip.Popup>
  );
}
