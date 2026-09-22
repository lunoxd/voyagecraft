import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:scale-[0.98]",
          {
            // Pure Black button with crisp White text
            'bg-black text-white hover:bg-neutral-800 font-semibold shadow-sm': variant === 'default',
            'bg-neutral-100 text-black hover:bg-neutral-200 border border-neutral-200 font-semibold': variant === 'secondary',
            'border border-neutral-300 bg-white text-black hover:bg-neutral-50 hover:border-black': variant === 'outline',
            'bg-neutral-900 text-white hover:bg-neutral-800': variant === 'destructive',
            'hover:bg-neutral-100 text-neutral-700 hover:text-black': variant === 'ghost',
            'text-black underline-offset-4 hover:underline p-0 h-auto font-medium': variant === 'link',
          },
          {
            'h-9 px-4 py-2': size === 'default',
            'h-8 rounded-md px-3 text-xs': size === 'sm',
            'h-11 rounded-lg px-6 text-base font-semibold': size === 'lg',
            'h-9 w-9 p-0': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
