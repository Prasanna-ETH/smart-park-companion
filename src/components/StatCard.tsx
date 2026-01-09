import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  variant = 'default',
}) => {
  const variants = {
    default: 'from-primary/10 to-primary/5 border-primary/20',
    success: 'from-slot-available/10 to-slot-available/5 border-slot-available/20',
    warning: 'from-slot-reserved/10 to-slot-reserved/5 border-slot-reserved/20',
    danger: 'from-slot-occupied/10 to-slot-occupied/5 border-slot-occupied/20',
  };

  const iconVariants = {
    default: 'text-primary bg-primary/10',
    success: 'text-slot-available bg-slot-available/10',
    warning: 'text-slot-reserved bg-slot-reserved/10',
    danger: 'text-slot-occupied bg-slot-occupied/10',
  };

  return (
    <div className={cn(
      'relative overflow-hidden rounded-xl border bg-gradient-to-br p-5 transition-all hover:scale-[1.02]',
      variants[variant]
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          {trend && (
            <p className={cn(
              'mt-1 text-xs font-medium',
              trend.isPositive ? 'text-slot-available' : 'text-slot-occupied'
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from yesterday
            </p>
          )}
        </div>
        <div className={cn('rounded-lg p-2.5', iconVariants[variant])}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
