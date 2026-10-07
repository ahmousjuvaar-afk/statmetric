import React from 'react';

export interface StatMetricLogoProps {
  variant?: 'full' | 'symbol' | 'monochrome';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  inverted?: boolean;
}

/**
 * Official StatMetric Logo Component.
 *
 * Visual Concept:
 * A precision metric symbol merging an empirical Gaussian distribution (bell curve)
 * with an orthogonal measurement axis, calibration focal node (μ), and standard
 * deviation boundary markers (±1σ).
 *
 * Represents: Statistics + Measurement + Mathematics + Intelligence + Precision.
 * Fully responsive, accessible, and supports full wordmark, symbol-only, and monochrome modes.
 */
export function StatMetricLogo({
  variant = 'full',
  size = 'md',
  className = '',
  inverted = false,
}: StatMetricLogoProps) {
  // Dimension tokens
  const symbolSizeMap = {
    xs: 18,
    sm: 24,
    md: 32,
    lg: 40,
    xl: 52,
  };

  const symbolPx = symbolSizeMap[size];

  // Symbol element
  const SymbolSvg = (
    <svg
      width={symbolPx}
      height={symbolPx}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sm-gradient-primary" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor={inverted ? '#38bdf8' : '#2563eb'} />
          <stop stopColor={inverted ? '#818cf8' : '#1d4ed8'} />
        </linearGradient>
        <linearGradient id="sm-gradient-plate" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor={inverted ? '#1e293b' : '#0f172a'} />
          <stop stopColor={inverted ? '#0f172a' : '#020617'} />
        </linearGradient>
      </defs>

      {/* Outer Rounded Squircle Base */}
      <rect
        x="3"
        y="3"
        width="42"
        height="42"
        rx="10"
        fill={variant === 'monochrome' ? (inverted ? '#ffffff' : '#0f172a') : 'url(#sm-gradient-plate)'}
        stroke={inverted ? 'rgba(255,255,255,0.15)' : 'rgba(15,23,42,0.1)'}
        strokeWidth="1.5"
      />

      {/* Subtle Coordinate Grid / Baseline */}
      <line
        x1="10"
        y1="34"
        x2="38"
        y2="34"
        stroke={inverted ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.2)'}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Vertical Measurement / Mean Axis (μ) */}
      <line
        x1="24"
        y1="11"
        x2="24"
        y2="34"
        stroke={inverted ? 'rgba(56,189,248,0.45)' : 'rgba(96,165,250,0.5)'}
        strokeWidth="1.25"
        strokeDasharray="2 2"
      />

      {/* Symmetric Sigma Boundary Ticks (-1σ, +1σ) */}
      <line
        x1="17"
        y1="32"
        x2="17"
        y2="36"
        stroke={inverted ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.3)'}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="31"
        y1="32"
        x2="31"
        y2="36"
        stroke={inverted ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.3)'}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* The Gaussian Distribution / Empirical Curve */}
      <path
        d="M 10 34 C 15 34, 18 31, 20 22 C 22 13, 23 12, 24 12 C 25 12, 26 13, 28 22 C 30 31, 33 34, 38 34"
        stroke={variant === 'monochrome' ? (inverted ? '#0f172a' : '#ffffff') : '#38bdf8'}
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Precision Focal Observation / Peak Parameter Node (μ) */}
      <circle
        cx="24"
        cy="12"
        r="3"
        fill={variant === 'monochrome' ? (inverted ? '#0f172a' : '#ffffff') : '#60a5fa'}
        stroke={inverted ? '#0f172a' : '#020617'}
        strokeWidth="1.5"
      />
    </svg>
  );

  if (variant === 'symbol') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {SymbolSvg}
      </div>
    );
  }

  // Wordmark typography sizing
  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  const subtitleClasses = {
    xs: 'text-[9px]',
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {SymbolSvg}
      <div className="flex flex-col leading-tight">
        <div className="flex items-baseline">
          <span
            className={`font-extrabold tracking-tight ${textSizeClasses[size]} ${
              inverted ? 'text-white' : 'text-slate-900'
            }`}
          >
            Stat
          </span>
          <span
            className={`font-semibold tracking-tight ${textSizeClasses[size]} ${
              inverted ? 'text-sky-400' : 'text-blue-600'
            }`}
          >
            Metric
          </span>
        </div>
        {size !== 'xs' && (
          <span
            className={`${subtitleClasses[size]} font-normal tracking-wide uppercase text-slate-400 dark:text-slate-500`}
          >
            Quantitative Platform
          </span>
        )}
      </div>
    </div>
  );
}
