import React from 'react';
import { cn } from '../../lib/utils';
import { Icon } from './icon';

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  subtext?: string;
  icon?: string;
  badgeText?: string;
  progressPercent?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  trend = 'up',
  subtext,
  icon,
  badgeText,
  progressPercent,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "p-6 rounded-3xl bg-white border border-neutral-200/90 shadow-xs hover:shadow-md hover:border-neutral-300 transition-all duration-300 space-y-4",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="h-8 w-8 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
              <Icon name={icon} size={16} />
            </div>
          )}
          <span className="text-xs font-semibold text-neutral-600 font-sans tracking-tight">
            {label}
          </span>
        </div>

        {badgeText && (
          <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-[10px] font-mono font-bold text-neutral-700">
            {badgeText}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-3">
          <div className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-950 font-mono">
            {value}
          </div>

          {change && (
            <div
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold shrink-0",
                trend === 'up' && "bg-emerald-50 text-emerald-700 border border-emerald-200",
                trend === 'down' && "bg-rose-50 text-rose-700 border border-rose-200",
                trend === 'neutral' && "bg-neutral-100 text-neutral-700 border border-neutral-200"
              )}
            >
              <Icon
                name={trend === 'up' ? 'trending_up' : trend === 'down' ? 'trending_down' : 'remove'}
                size={14}
              />
              <span>{change}</span>
            </div>
          )}
        </div>

        {typeof progressPercent === 'number' && (
          <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-neutral-900 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
        )}

        {subtext && (
          <p className="text-[11px] text-neutral-500 font-sans flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"></span>
            <span>{subtext}</span>
          </p>
        )}
      </div>
    </div>
  );
};
