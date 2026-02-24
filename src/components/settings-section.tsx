interface SettingsSectionProps {
  children: React.ReactNode;
  description: string;
  title: string;
}

export function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <section className="space-y-4">
      <div className="border-border border-b pb-2">
        <h2 className="font-semibold text-lg">{title}</h2>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
