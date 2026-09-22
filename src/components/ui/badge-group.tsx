import React from 'react';
import { cn } from '../../lib/utils';
import { Icon } from './icon';

export interface BadgeGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  badge: string;
  message: string;
  href?: string;
  variant?: 'brand' | 'gray' | 'success' | 'warning';
  showArrow?: boolean;
}

export const BadgeGroup: React.FC<BadgeGroupProps> = ({
  badge,
  message,
  href,
  variant = 'brand',
  showArrow = true,
  className,
  ...props
}) => {
  const content = (
    <div
      className={cn(
        "inline-flex items-center gap-2 p-1 pr-3.5 rounded-full border text-xs font-sans transition-all group select-none shadow-2xs",
        variant === 'brand' && "bg-neutral-50/90 border-neutral-200 text-neutral-800 hover:border-neutral-400",
        variant === 'gray' && "bg-neutral-100 border-neutral-200 text-neutral-800 hover:bg-neutral-200/80",
        variant === 'success' && "bg-emerald-50/80 border-emerald-200 text-emerald-900 hover:bg-emerald-100/80",
        variant === 'warning' && "bg-amber-50/80 border-amber-200 text-amber-900 hover:bg-amber-100/80",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-tight shadow-2xs",
          variant === 'brand' && "bg-black text-white",
          variant === 'gray' && "bg-neutral-800 text-white",
          variant === 'success' && "bg-emerald-600 text-white",
          variant === 'warning' && "bg-amber-600 text-white"
        )}
      >
        {badge}
      </span>
      <span className="font-semibold text-neutral-700 group-hover:text-black transition-colors">
        {message}
      </span>
      {showArrow && (
        <Icon
          name="arrow_forward"
          size={14}
          className="text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 transition-all ml-0.5"
        />
      )}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="inline-block">
        {content}
      </a>
    );
  }

  return content;
};
