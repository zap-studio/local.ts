import { Switch as BaseSwitch } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";

interface SwitchProps {
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  id?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export function Switch({
  id,
  checked,
  onCheckedChange,
  disabled,
  className,
}: SwitchProps) {
  return (
    <BaseSwitch.Root
      checked={checked}
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-checked:bg-primary data-unchecked:bg-input",
        className
      )}
      disabled={disabled}
      id={id}
      onCheckedChange={onCheckedChange}
    >
      <BaseSwitch.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
          "data-checked:translate-x-5 data-unchecked:translate-x-0"
        )}
      />
    </BaseSwitch.Root>
  );
}
