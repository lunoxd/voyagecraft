import React, { useEffect, useState } from 'react';

export interface FluidAuroraMeshProps {
  className?: string;
  mode?: 'light' | 'dark' | 'monochrome';
  showGrid?: boolean;
}

export const FluidAuroraMesh: React.FC<FluidAuroraMeshProps> = ({
  className = '',
  mode = 'light',
  showGrid = true,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const isLight = mode === 'light';

  return (
    <div
      className={`fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden ${
        isLight ? 'bg-neutral-100' : 'bg-neutral-950'
      } ${className}`}
      aria-hidden="true"
    >
      {/* Base Gradient Canvas */}
      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          isLight
            ? 'bg-gradient-to-b from-white via-neutral-100 to-neutral-200/90'
            : 'bg-gradient-to-b from-neutral-950 via-neutral-900 to-black'
        }`}
      />

      {/* Floating Fluid Organic Aurora Mesh Orbs */}
      <div className="absolute inset-0 overflow-hidden filter blur-[90px] sm:blur-[130px] opacity-90">
        {/* Orb 1: Dramatic Charcoal Wave - Upper Left */}
        <div
          className={`absolute -top-[15%] -left-[10%] w-[60vw] h-[60vw] rounded-full transition-transform duration-1000 ${
            isLight
              ? 'bg-gradient-to-br from-neutral-400/40 via-neutral-300/30 to-neutral-900/15'
              : 'bg-gradient-to-br from-neutral-200/35 via-neutral-500/25 to-transparent'
          }`}
          style={{
            transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 35}px) scale(1.08)`,
            transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {/* Orb 2: Crisp Platinum / White Highlight - Center Top */}
        <div
          className={`absolute top-[5%] right-[5%] w-[55vw] h-[50vw] rounded-full transition-transform duration-1000 ${
            isLight
              ? 'bg-gradient-to-bl from-white via-neutral-200/60 to-neutral-400/20'
              : 'bg-gradient-to-bl from-neutral-700 via-neutral-900 to-transparent'
          }`}
          style={{
            transform: `translate(${-mousePos.x * 45}px, ${-mousePos.y * 30}px) rotate(${mousePos.x * 30}deg)`,
            transition: 'transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {/* Orb 3: Deep Slate Accent - Middle Center */}
        <div
          className={`absolute top-[35%] left-[20%] w-[50vw] h-[45vw] rounded-full transition-transform duration-700 ${
            isLight
              ? 'bg-gradient-to-r from-neutral-900/10 via-neutral-400/25 to-white/60'
              : 'bg-gradient-to-r from-white/20 via-neutral-400/15 to-transparent'
          }`}
          style={{
            transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 25}px)`,
            transition: 'transform 0.9s ease-out',
          }}
        />

        {/* Orb 4: Silvery Mist Drift - Lower Viewport */}
        <div
          className={`absolute -bottom-[20%] right-[10%] w-[65vw] h-[55vw] rounded-full transition-transform duration-1000 ${
            isLight
              ? 'bg-gradient-to-t from-neutral-300/40 via-neutral-200/50 to-transparent'
              : 'bg-gradient-to-t from-neutral-500/20 via-neutral-800/40 to-transparent'
          }`}
          style={{
            transform: `translate(${-mousePos.x * 30}px, ${mousePos.y * 30}px)`,
            transition: 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>

      {/* Subtle Technical Architectural Grid */}
      {showGrid && (
        <div
          className={`absolute inset-0 pointer-events-none ${
            isLight ? 'opacity-[0.04]' : 'opacity-[0.035]'
          }`}
          style={{
            backgroundImage: `
              linear-gradient(to right, ${isLight ? '#000000' : '#ffffff'} 1px, transparent 1px),
              linear-gradient(to bottom, ${isLight ? '#000000' : '#ffffff'} 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      )}

      {/* Fine Film Grain Noise Texture */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none mix-blend-overlay">
        <filter id="aurora-grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#aurora-grain-filter)" />
      </svg>

      {/* Gentle Vignette */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          isLight
            ? 'bg-radial from-transparent via-transparent to-neutral-900/5'
            : 'bg-radial from-transparent via-black/20 to-black/80'
        }`}
      />
    </div>
  );
};

export default FluidAuroraMesh;
