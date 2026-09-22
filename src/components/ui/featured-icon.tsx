import React from 'react';
import { cn } from '../../lib/utils';
import { Icon } from './icon';

export interface FeaturedIconProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'brand' | 'gray' | 'success' | 'warning' | 'error';
  theme?: 'light' | 'outline' | 'glass';
}

export const FeaturedIcon: React.FC<FeaturedIconProps> = ({
  name,
  size = 'md',
  variant = 'brand',
  theme = 'light',
  className,
  ...props
}) => {
  const sizeMap = {
    sm: { container: 'h-8 w-8 ring-4', icon: 16 },
    md: { container: 'h-10 w-10 ring-6', icon: 20 },
    lg: { container: 'h-12 w-12 ring-8', icon: 24 },
    xl: { container: 'h-14 w-14 ring-10', icon: 28 },
  };

  const variantStyles = {
    brand: {
      light: 'bg-neutral-900 text-white ring-neutral-100',
      outline: 'bg-white border border-neutral-300 text-neutral-900 ring-neutral-50',
      glass: 'bg-black/10 backdrop-blur-md text-black ring-black/5',
    },
    gray: {
      light: 'bg-neutral-100 text-neutral-700 ring-neutral-50',
      outline: 'bg-white border border-neutral-200 text-neutral-700 ring-neutral-50',
      glass: 'bg-white/80 backdrop-blur-md text-neutral-700 ring-neutral-200/50',
    },
    success: {
      light: 'bg-emerald-50 text-emerald-700 ring-emerald-50/50',
      outline: 'bg-white border border-emerald-300 text-emerald-700 ring-emerald-50',
      glass: 'bg-emerald-500/10 backdrop-blur-md text-emerald-700 ring-emerald-500/5',
    },
    warning: {
      light: 'bg-amber-50 text-amber-700 ring-amber-50/50',
      outline: 'bg-white border border-amber-300 text-amber-700 ring-amber-50',
      glass: 'bg-amber-500/10 backdrop-blur-md text-amber-700 ring-amber-500/5',
    },
    error: {
      light: 'bg-rose-50 text-rose-700 ring-rose-50/50',
      outline: 'bg-white border border-rose-300 text-rose-700 ring-rose-50',
      glass: 'bg-rose-500/10 backdrop-blur-md text-rose-700 ring-rose-500/5',
    },
  };

  const currentSize = sizeMap[size];
  const currentVariant = variantStyles[variant][theme];

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center shrink-0 transition-all",
        currentSize.container,
        currentVariant,
        className
      )}
      {...props}
    >
      <Icon name={name} size={currentSize.icon} />
    </div>
  );
};
