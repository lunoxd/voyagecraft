import React from 'react';

export interface BrandLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 24,
  className = '',
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="currentColor"
      aria-label="VoyageCraft Logo"
      className={`shrink-0 ${className}`}
      {...props}
    >
      {/* Aerodynamic Aircraft Silhouette */}
      <path d="M79.5 28.2 C77.5 26.5 73.8 28.5 69.2 32.5 L60.8 39.8 C56.5 38.2 50.8 35.6 45.8 33.6 C42.2 32.2 40.5 33.2 41.8 35.0 C43.8 37.8 48.8 40.8 52.5 43.0 C53.0 45.2 50.2 51.5 42.5 58.5 C46.8 53.0 54.8 45.2 60.5 43.2 L74.5 31.8 C78.2 28.8 81.2 29.5 79.5 28.2 Z" />
      {/* Contrail Orbit Crescent Arc */}
      <path d="M41.5 41.5 C33.0 46.0 22.5 53.2 22.4 61.8 C22.3 70.0 32.0 76.0 45.8 75.2 C56.5 74.6 64.6 68.6 68.5 56.5 C62.5 66.2 52.5 70.8 42.0 70.0 C31.5 69.4 28.0 63.4 31.0 57.4 C33.2 52.6 37.4 46.6 41.5 41.5 Z" />
    </svg>
  );
};

export default BrandLogo;
