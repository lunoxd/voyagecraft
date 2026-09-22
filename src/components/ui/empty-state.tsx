import React from 'react';
import { cn } from '../../lib/utils';
import { FeaturedIcon } from './featured-icon';
import { Button } from './button';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  secondaryText?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'search_off',
  title,
  description,
  actionText,
  onAction,
  secondaryText,
  onSecondaryAction,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "p-12 text-center rounded-3xl border border-dashed border-neutral-300 bg-neutral-50/60 flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto",
        className
      )}
      {...props}
    >
      <FeaturedIcon name={icon} size="lg" variant="gray" theme="outline" />

      <div className="space-y-1.5 max-w-sm">
        <h3 className="text-base font-bold text-neutral-900 tracking-tight">{title}</h3>
        <p className="text-xs text-neutral-500 leading-relaxed">{description}</p>
      </div>

      {(actionText || secondaryText) && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {secondaryText && onSecondaryAction && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSecondaryAction}
              className="rounded-full text-xs font-semibold h-9 px-4 border-neutral-300"
            >
              {secondaryText}
            </Button>
          )}

          {actionText && onAction && (
            <Button
              variant="default"
              size="sm"
              onClick={onAction}
              className="rounded-full text-xs font-bold h-9 px-5 bg-black text-white hover:bg-neutral-800"
            >
              {actionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
