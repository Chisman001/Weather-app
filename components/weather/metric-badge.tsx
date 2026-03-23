import { cn } from '@/lib/ui/utils';

interface MetricBadgeProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  className?: string;
}

export function MetricBadge({ icon, label, value, subValue, className }: MetricBadgeProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 rounded-xl bg-muted/50 p-3 border border-border/50',
        className
      )}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="text-sm">{icon}</span>
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-lg font-bold text-foreground">{value}</p>
      {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
    </div>
  );
}
