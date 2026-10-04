import { useState, useId } from 'react';
import { NormalDistMode } from '../lib/statistics/normalDist';

interface NormalDistChartProps {
  mode: NormalDistMode;
  mean: number;
  sd: number;
  probabilityPercent: string;
  points: { x: number; y: number; inShaded: boolean }[];
  domainMin: number;
  domainMax: number;
  xVal?: number;
  lowerBound?: number;
  upperBound?: number;
  xCalculated?: number;
}

export function NormalDistChart({
  mode,
  mean,
  sd,
  probabilityPercent,
  points,
  domainMin,
  domainMax,
  xVal,
  lowerBound,
  upperBound,
  xCalculated,
}: NormalDistChartProps) {
  const chartId = useId();
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; z: number } | null>(null);

  if (!points || points.length < 2) return null;

  const width = 640;
  const height = 250;
  const padding = { top: 30, right: 35, bottom: 45, left: 35 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const maxY = Math.max(...points.map((p) => p.y)) * 1.15 || 0.1;

  const scaleX = (x: number) =>
    padding.left + ((x - domainMin) / (domainMax - domainMin)) * plotWidth;
  const scaleY = (y: number) =>
    padding.top + plotHeight - (y / maxY) * plotHeight;

  const baseY = scaleY(0);

  // SVG Curve Path
  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.x).toFixed(2)} ${scaleY(p.y).toFixed(2)}`)
    .join(' ');

  // Shaded segments
  const shadedSegments: { x: number; y: number }[][] = [];
  let currentSegment: { x: number; y: number }[] = [];

  points.forEach((p) => {
    if (p.inShaded) {
      currentSegment.push(p);
    } else if (currentSegment.length > 0) {
      shadedSegments.push(currentSegment);
      currentSegment = [];
    }
  });
  if (currentSegment.length > 0) {
    shadedSegments.push(currentSegment);
  }

  // Significant standard deviation tick marks: -3, -2, -1, 0, 1, 2, 3
  const sdMultipliers = [-3, -2, -1, 0, 1, 2, 3];
  const sdTicks = sdMultipliers.map((m) => ({
    multiplier: m,
    x: mean + m * sd,
    z: m,
  }));

  const meanX = scaleX(mean);

  // Active cutoffs to display lines for
  const cutoffLines: { label: string; x: number; color: string }[] = [];
  if ((mode === 'less_than' || mode === 'greater_than' || mode === 'find_z') && xVal !== undefined) {
    cutoffLines.push({ label: `x = ${xVal}`, x: scaleX(xVal), color: '#2563eb' });
  } else if ((mode === 'between' || mode === 'outside') && lowerBound !== undefined && upperBound !== undefined) {
    cutoffLines.push({ label: `a = ${lowerBound}`, x: scaleX(lowerBound), color: '#2563eb' });
    cutoffLines.push({ label: `b = ${upperBound}`, x: scaleX(upperBound), color: '#2563eb' });
  } else if (mode === 'inverse_percentile' && xCalculated !== undefined) {
    cutoffLines.push({ label: `x = ${xCalculated.toFixed(2)}`, x: scaleX(xCalculated), color: '#0d9488' });
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            Gaussian Normal Distribution Bell Curve
          </h4>
          <p className="text-xs text-slate-500">
            μ = {mean}, σ = {sd} · Shaded Area: <strong className="text-slate-900 font-semibold">{probabilityPercent}</strong>
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-sky-500/25 border border-sky-600 rounded-xs inline-block" />
            <span className="text-slate-600">Calculated Probability</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-slate-400 border-t border-dashed border-slate-600 inline-block" />
            <span className="text-slate-600">Mean (μ = {mean})</span>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-64 font-sans select-none"
          role="img"
          aria-label={`Interactive normal bell curve centered at mean ${mean} with standard deviation ${sd}`}
        >
          <defs>
            <linearGradient id={`normGrad-${chartId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.10" />
            </linearGradient>
          </defs>

          {/* Vertical SD reference lines */}
          {sdTicks.map((tick) => (
            <line
              key={tick.multiplier}
              x1={scaleX(tick.x)}
              y1={padding.top}
              x2={scaleX(tick.x)}
              y2={baseY}
              stroke={tick.multiplier === 0 ? '#475569' : '#e2e8f0'}
              strokeWidth={tick.multiplier === 0 ? 1.5 : 1}
              strokeDasharray={tick.multiplier === 0 ? '4 3' : '2 2'}
            />
          ))}

          {/* Shaded Area Paths */}
          {shadedSegments.map((segment, idx) => {
            if (segment.length < 2) return null;
            const firstX = scaleX(segment[0].x);
            const lastX = scaleX(segment[segment.length - 1].x);
            const segPath =
              `M ${firstX.toFixed(2)} ${baseY.toFixed(2)} ` +
              segment
                .map((p) => `L ${scaleX(p.x).toFixed(2)} ${scaleY(p.y).toFixed(2)}`)
                .join(' ') +
              ` L ${lastX.toFixed(2)} ${baseY.toFixed(2)} Z`;

            return (
              <path
                key={idx}
                d={segPath}
                fill={`url(#normGrad-${chartId})`}
                stroke="#0284c7"
                strokeWidth="1.2"
              />
            );
          })}

          {/* Main Bell Curve PDF */}
          <path
            d={linePath}
            fill="none"
            stroke="#0f172a"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Mean Center Marker */}
          <line
            x1={meanX}
            y1={padding.top}
            x2={meanX}
            y2={baseY}
            stroke="#0f172a"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <text
            x={meanX}
            y={padding.top - 6}
            textAnchor="middle"
            className="text-[11px] font-mono font-medium fill-slate-700"
          >
            μ = {mean}
          </text>

          {/* Cutoff Marker Lines (x, a, b) */}
          {cutoffLines.map((line, i) => (
            <g key={i}>
              <line
                x1={line.x}
                y1={padding.top + 8}
                x2={line.x}
                y2={baseY}
                stroke={line.color}
                strokeWidth="2"
              />
              <circle cx={line.x} cy={baseY} r="3.5" fill={line.color} />
              <text
                x={line.x}
                y={padding.top + 5}
                textAnchor="middle"
                className="text-[10px] font-mono font-bold fill-blue-700"
              >
                {line.label}
              </text>
            </g>
          ))}

          {/* X Axis */}
          <line
            x1={padding.left}
            y1={baseY}
            x2={width - padding.right}
            y2={baseY}
            stroke="#64748b"
            strokeWidth="1.5"
          />

          {/* X Axis Ticks (Raw scale & Z-scores) */}
          {sdTicks.map((tick) => (
            <g key={tick.multiplier} transform={`translate(${scaleX(tick.x)}, ${baseY})`}>
              <line y1="0" y2="5" stroke="#64748b" strokeWidth="1" />
              <text
                y="16"
                textAnchor="middle"
                className="text-[10px] font-mono fill-slate-700 font-medium"
              >
                {tick.x.toFixed(tick.x % 1 === 0 ? 0 : 1)}
              </text>
              <text
                y="28"
                textAnchor="middle"
                className="text-[9px] font-mono fill-slate-400"
              >
                {tick.z > 0 ? `+${tick.z}σ` : tick.z === 0 ? '0' : `${tick.z}σ`}
              </text>
            </g>
          ))}

          {/* Interactive Mouse Hover Targets */}
          {points.map((p, i) => (
            <rect
              key={i}
              x={scaleX(p.x) - 2.5}
              y={padding.top}
              width="5"
              height={plotHeight}
              fill="transparent"
              className="cursor-crosshair"
              onMouseEnter={() => setHoveredPoint({ x: p.x, z: (p.x - mean) / sd })}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}

          {/* Hover readout indicator */}
          {hoveredPoint && (
            <g transform={`translate(${scaleX(hoveredPoint.x)}, ${padding.top + 15})`}>
              <rect x="-42" y="-12" width="84" height="22" rx="4" fill="#0f172a" fillOpacity="0.85" />
              <text
                x="0"
                y="2"
                textAnchor="middle"
                className="text-[9px] font-mono fill-white font-medium"
              >
                x={hoveredPoint.x.toFixed(1)} (z={hoveredPoint.z.toFixed(2)})
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
        <span>Upper row: Raw values (x)</span>
        <span>Lower row: Standard units (Z-scores)</span>
      </div>
    </div>
  );
}
