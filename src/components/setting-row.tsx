import { Label } from "@/components/ui/label";

interface SettingRowProps {
  label: string;
  description: string;
  htmlFor?: string;
  children: React.ReactNode;
}

export function SettingRow({
  label,
  description,
  htmlFor,
  children,
}: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4">
      <div className="space-y-0.5">
        <Label htmlFor={htmlFor} className="text-base font-medium">
          {label}
        </Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
