import { useState } from 'react';

interface DataDistributionChartProps {
  observations: number[];
  mean: number;
  sd: number;
  median: number;
  min: number;
  max: number;
  type: 'sample' | 'population';
}

export function DataDistributionChart({
  observations,
  mean,
  sd,
  median,
  min,
  max,
  type,
}: DataDistributionChartProps) {
  const [hoveredVal, setHoveredVal] = useState<number | null>(null);

  if (!observations || observations.length === 0) return null;

  const width = 640;
  const height = 180;
  const padding = { top: 35, right: 35, bottom: 45, left: 35 };
  const plotWidth = width - padding.left - padding.right;

  // Domain range
  const dataRange = max - min || 1;
  const margin = Math.max(sd * 0.8, dataRange * 0.15);
  const domainMin = Math.min(min, mean - 2 * sd) - margin;
  const domainMax = Math.max(max, mean + 2 * sd) + margin;

  const scaleX = (x: number) =>
    padding.left + ((x - domainMin) / (domainMax - domainMin)) * plotWidth;

  const meanX = scaleX(mean);
  const sdLeftX = Math.max(padding.left, scaleX(mean - sd));
  const sdRightX = Math.min(width - padding.right, scaleX(mean + sd));
  const sd2LeftX = Math.max(padding.left, scaleX(mean - 2 * sd));
  const sd2RightX = Math.min(width - padding.right, scaleX(mean + 2 * sd));
  const medianX = scaleX(median);

  const baselineY = 95;

  // Jitter points vertically if multiple share identical or very close values
  const sorted = [...observations].sort((a, b) => a - b);
  const pointPositions = sorted.map((val, idx) => {
    // Check duplicates nearby
    let count = 0;
    for (let j = 0; j < idx; j++) {
      if (Math.abs(sorted[j] - val) < (domainMax - domainMin) * 0.015) {
        count++;
      }
    }
    const yOffset = (count % 3) * 10;
    return { val, x: scaleX(val), y: baselineY - 4 - yOffset };
  });

  const symbol = type === 'sample' ? 's' : 'σ';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            Observation Spread & Dispersion Intervals
          </h4>
          <p className="text-xs text-slate-500">
            Showing all {observations.length} data points with mean and ±1{symbol} dispersion span.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
            <span className="text-slate-600">Observation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-rose-600 inline-block" />
            <span className="text-slate-600">Mean ({mean.toFixed(2)})</span>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto font-sans select-none"
          role="img"
          aria-label={`Strip plot of ${observations.length} data points`}
        >
          {/* ±2 SD Band (lightest) */}
          <rect
            x={sd2LeftX}
            y={35}
            width={Math.max(2, sd2RightX - sd2LeftX)}
            height={70}
            fill="#f8fafc"
            stroke="#e2e8f0"
            strokeDasharray="2 2"
            rx="4"
          />

          {/* ±1 SD Dispersion Band */}
          <rect
            x={sdLeftX}
            y={42}
            width={Math.max(2, sdRightX - sdLeftX)}
            height={56}
            fill="#eff6ff"
            stroke="#bfdbfe"
            rx="4"
          />
          <text
            x={(sdLeftX + sdRightX) / 2}
            y={52}
            textAnchor="middle"
            className="text-[9px] font-mono fill-blue-700 font-semibold uppercase tracking-wider"
          >
            Mean ± 1{symbol} Span (Typical Range)
          </text>

          {/* Baseline axis */}
          <line
            x1={padding.left}
            y1={baselineY}
            x2={width - padding.right}
            y2={baselineY}
            stroke="#94a3b8"
            strokeWidth="1.5"
          />

          {/* Median Line */}
          <line
            x1={medianX}
            y1={55}
            x2={medianX}
            y2={baselineY + 10}
            stroke="#0d9488"
            strokeWidth="1.5"
            strokeDasharray="3 2"
          />
          <text
            x={medianX}
            y={baselineY + 22}
            textAnchor="middle"
            className="text-[9px] font-mono fill-teal-700 font-medium"
          >
            Med: {median.toFixed(1)}
          </text>

          {/* Mean Marker Line */}
          <line
            x1={meanX}
            y1={25}
            x2={meanX}
            y2={baselineY + 12}
            stroke="#e11d48"
            strokeWidth="2"
          />
          <text
            x={meanX}
            y={22}
            textAnchor="middle"
            className="text-[10px] font-mono font-bold fill-rose-600"
          >
            {type === 'sample' ? 'x̄' : 'μ'} = {mean.toFixed(2)}
          </text>

          {/* Plotted Data Dots */}
          {pointPositions.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r="4.5"
              fill="#2563eb"
              stroke="#ffffff"
              strokeWidth="1.2"
              className="cursor-pointer hover:r-6 transition-all"
              onMouseEnter={() => setHoveredVal(pt.val)}
              onMouseLeave={() => setHoveredVal(null)}
            />
          ))}

          {/* Min and Max Markers on Axis */}
          <g transform={`translate(${scaleX(min)}, ${baselineY})`}>
            <line y1="0" y2="6" stroke="#64748b" strokeWidth="1" />
            <text y="18" textAnchor="middle" className="text-[10px] font-mono fill-slate-500">
              Min: {min.toFixed(1)}
            </text>
          </g>
          <g transform={`translate(${scaleX(max)}, ${baselineY})`}>
            <line y1="0" y2="6" stroke="#64748b" strokeWidth="1" />
            <text y="18" textAnchor="middle" className="text-[10px] font-mono fill-slate-500">
              Max: {max.toFixed(1)}
            </text>
          </g>

          {/* Hover tooltip */}
          {hoveredVal !== null && (
            <g transform={`translate(${scaleX(hoveredVal)}, 15)`}>
              <rect x="-30" y="-12" width="60" height="20" rx="3" fill="#0f172a" />
              <text x="0" y="2" textAnchor="middle" className="text-[9px] font-mono fill-white">
                Val: {hoveredVal}
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
        <span>±1{symbol} Interval: [{(mean - sd).toFixed(2)}, {(mean + sd).toFixed(2)}]</span>
        <span>±2{symbol} Interval: [{(mean - 2 * sd).toFixed(2)}, {(mean + 2 * sd).toFixed(2)}]</span>
      </div>
    </div>
  );
}
