import React from 'react';
import { cn } from '../../lib/utils';

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: number | string;
  fill?: boolean;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  fill = false,
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        "material-symbols-outlined select-none inline-flex items-center justify-center shrink-0 text-current",
        fill && "fill",
        className
      )}
      style={{
        fontSize: typeof size === 'number' ? `${size}px` : size,
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
      }}
      aria-hidden="true"
      {...props}
    >
      {name}
    </span>
  );
};

export default Icon;
