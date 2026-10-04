import { useState, useId } from 'react';
import { DistributionType, TailType } from '../lib/statistics/pvalue';

interface PValueChartProps {
  distribution: DistributionType;
  statistic: number;
  tail: TailType;
  df?: number;
  df2?: number;
  points: { x: number; y: number; inTail: boolean }[];
}

export function PValueChart({
  distribution,
  statistic,
  tail,
  points,
}: PValueChartProps) {
  const chartId = useId();
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number } | null>(null);

  if (!points || points.length < 2) return null;

  const width = 640;
  const height = 240;
  const padding = { top: 25, right: 30, bottom: 40, left: 35 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const minX = points[0].x;
  const maxX = points[points.length - 1].x;
  const maxY = Math.max(...points.map((p) => p.y)) * 1.15 || 0.5;

  const scaleX = (x: number) => padding.left + ((x - minX) / (maxX - minX)) * plotWidth;
  const scaleY = (y: number) => padding.top + plotHeight - (y / maxY) * plotHeight;

  // Generate SVG path for line
  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.x).toFixed(2)} ${scaleY(p.y).toFixed(2)}`)
    .join(' ');

  // Generate Shaded Tail Polygons
  // Find continuous segments of inTail points
  const tailSegments: { x: number; y: number }[][] = [];
  let currentSegment: { x: number; y: number }[] = [];

  points.forEach((p) => {
    if (p.inTail) {
      currentSegment.push(p);
    } else if (currentSegment.length > 0) {
      tailSegments.push(currentSegment);
      currentSegment = [];
    }
  });
  if (currentSegment.length > 0) {
    tailSegments.push(currentSegment);
  }

  // Base Y position (X-axis)
  const baseY = scaleY(0);

  // Statistic line X
  const statX = Math.max(padding.left, Math.min(width - padding.right, scaleX(statistic)));

  // Generate ticks for X-axis
  const numTicks = 6;
  const ticks: number[] = [];
  const tickStep = (maxX - minX) / numTicks;
  for (let i = 0; i <= numTicks; i++) {
    ticks.push(minX + i * tickStep);
  }

  const distLabel =
    distribution === 'z'
      ? 'Z'
      : distribution === 't'
      ? 't'
      : distribution === 'chisquare'
      ? 'χ²'
      : 'F';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            Probability Distribution & Rejection Area
          </h4>
          <p className="text-xs text-slate-500">
            Shaded region represents p-value probability ({tail.replace('_', ' ')} test).
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-rose-500/30 border border-rose-600 rounded-xs inline-block" />
            <span className="text-slate-600">p-value tail area</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-slate-900 inline-block" />
            <span className="text-slate-600">Statistic ({distLabel} = {statistic.toFixed(2)})</span>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-64 font-sans select-none"
          role="img"
          aria-label={`Statistical distribution curve showing test statistic ${statistic.toFixed(3)} and shaded p-value tails`}
        >
          <defs>
            <linearGradient id={`tailGrad-${chartId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.10" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {ticks.map((val, i) => (
            <line
              key={i}
              x1={scaleX(val)}
              y1={padding.top}
              x2={scaleX(val)}
              y2={baseY}
              stroke="#f1f5f9"
              strokeDasharray="3 3"
            />
          ))}

          {/* Shaded Tail Regions */}
          {tailSegments.map((segment, segIdx) => {
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
                key={segIdx}
                d={segPath}
                fill={`url(#tailGrad-${chartId})`}
                stroke="#f43f5e"
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />
            );
          })}

          {/* PDF Curve Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#0f172a"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Test Statistic Line */}
          <line
            x1={statX}
            y1={padding.top}
            x2={statX}
            y2={baseY}
            stroke="#0f172a"
            strokeWidth="2"
            strokeDasharray="4 3"
          />

          {/* Statistic label on top */}
          <circle cx={statX} cy={scaleY(points.find((p) => Math.abs(p.x - statistic) < 0.2)?.y || 0)} r="4" fill="#0f172a" />
          <text
            x={statX}
            y={padding.top - 6}
            textAnchor="middle"
            className="text-[11px] font-mono font-semibold fill-slate-900"
          >
            {distLabel} = {statistic.toFixed(2)}
          </text>

          {/* X Axis */}
          <line
            x1={padding.left}
            y1={baseY}
            x2={width - padding.right}
            y2={baseY}
            stroke="#64748b"
            strokeWidth="1.5"
          />

          {/* X Axis Ticks & Labels */}
          {ticks.map((val, idx) => (
            <g key={idx} transform={`translate(${scaleX(val)}, ${baseY})`}>
              <line y1="0" y2="5" stroke="#64748b" strokeWidth="1" />
              <text
                y="18"
                textAnchor="middle"
                className="text-[10px] font-mono fill-slate-500"
              >
                {val.toFixed(val % 1 === 0 ? 0 : 1)}
              </text>
            </g>
          ))}

          {/* Hover interactive overlay */}
          {points.map((p, i) => (
            <rect
              key={i}
              x={scaleX(p.x) - 3}
              y={padding.top}
              width="6"
              height={plotHeight}
              fill="transparent"
              className="cursor-crosshair"
              onMouseEnter={() => setHoveredPoint({ x: p.x, y: p.y })}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}

          {/* Hover indicator */}
          {hoveredPoint && (
            <g transform={`translate(${scaleX(hoveredPoint.x)}, ${scaleY(hoveredPoint.y)})`}>
              <circle r="4" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
              <text
                x="0"
                y="-10"
                textAnchor="middle"
                className="text-[10px] font-mono fill-blue-700 font-semibold"
              >
                x={hoveredPoint.x.toFixed(2)}
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
        <span>X-Axis: Test Statistic Metric ({distLabel})</span>
        <span>Y-Axis: Density f({distLabel})</span>
      </div>
    </div>
  );
}
