import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'inverse' | 'success' | 'warning' | 'brand' | 'gray';
  showDot?: boolean;
}

export function Badge({ className, variant = 'default', showDot = false, children, ...props }: BadgeProps) {
  const dotColors = {
    default: 'bg-white',
    inverse: 'bg-white',
    secondary: 'bg-neutral-500',
    outline: 'bg-neutral-800',
    destructive: 'bg-rose-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    brand: 'bg-neutral-900',
    gray: 'bg-neutral-500',
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider transition-colors select-none font-mono",
        {
          'bg-black text-white font-bold shadow-2xs': variant === 'inverse' || variant === 'default',
          'bg-neutral-100 text-neutral-800 border border-neutral-200': variant === 'secondary',
          'border border-neutral-300 text-neutral-800 bg-white': variant === 'outline',
          'border border-rose-200 bg-rose-50 text-rose-800 font-bold': variant === 'destructive',
          'border border-emerald-200 bg-emerald-50 text-emerald-800 font-bold': variant === 'success',
          'border border-amber-200 bg-amber-50 text-amber-800 font-bold': variant === 'warning',
          'border border-neutral-200 bg-neutral-900 text-white font-bold': variant === 'brand',
          'border border-neutral-200 bg-neutral-100 text-neutral-700': variant === 'gray',
        },
        className
      )}
      {...props}
    >
      {showDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotColors[variant] || 'bg-current')} />
      )}
      <span>{children}</span>
    </div>
  );
}
