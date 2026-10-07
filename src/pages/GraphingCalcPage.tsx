import { useState, useMemo, useRef } from 'react';
import { SeoHead } from '../components/SeoHead';
import { ToolIcon } from '../components/ToolIcon';
import { NextStepCard } from '../components/NextStepCard';
import { MathExpressionEvaluator } from '../lib/math/calculatorEngine';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export function GraphingCalcPage() {
  const [equationStr, setEquationStr] = useState('');
  const [xMin, setXMin] = useState(-5);
  const [xMax, setXMax] = useState(5);
  const [yMin, setYMin] = useState(-5);
  const [yMax, setYMax] = useState(15);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const presets = [
    { label: 'Parabola: x² − 4', eq: 'x^2 - 4', xRange: [-5, 5], yRange: [-5, 15] },
    { label: 'Sine Wave: sin(x)', eq: 'sin(x)', xRange: [-7, 7], yRange: [-2, 2] },
    { label: 'Cubic: x³ − 3x', eq: 'x^3 - 3*x', xRange: [-3, 3], yRange: [-4, 4] },
    { label: 'Gaussian: exp(-x²)', eq: 'exp(-x^2)', xRange: [-4, 4], yRange: [-0.5, 1.5] },
    { label: 'Linear: 2x + 1', eq: '2*x + 1', xRange: [-5, 5], yRange: [-10, 10] },
  ];

  // Plot generation
  const { points, polylinePoints, error } = useMemo(() => {
    if (!equationStr.trim()) {
      return { points: [], polylinePoints: '', error: null };
    }
    const evaluator = new MathExpressionEvaluator('rad');
    const pts: { x: number; y: number }[] = [];
    const steps = 250;
    const dx = (xMax - xMin) / steps;

    for (let i = 0; i <= steps; i++) {
      const x = xMin + i * dx;
      const expr = equationStr.replace(/x/g, `(${x})`);
      const res = evaluator.evaluate(expr);
      if (!res.error && !isNaN(res.value) && isFinite(res.value)) {
        pts.push({ x, y: res.value });
      }
    }

    if (pts.length < 2) {
      return { points: [], polylinePoints: '', error: 'Cannot plot function: evaluation error or out of range.' };
    }

    // Map to SVG coordinates: viewBox 0 0 600 400
    const w = 600;
    const h = 400;

    const toSvgX = (x: number) => ((x - xMin) / (xMax - xMin)) * w;
    const toSvgY = (y: number) => h - ((y - yMin) / (yMax - yMin)) * h;

    const poly = pts
      .filter((p) => p.y >= yMin - 10 && p.y <= yMax + 10)
      .map((p) => `${toSvgX(p.x).toFixed(1)},${toSvgY(p.y).toFixed(1)}`)
      .join(' ');

    return { points: pts, polylinePoints: poly, error: null };
  }, [equationStr, xMin, xMax, yMin, yMax]);

  const handleZoom = (factor: number) => {
    const cx = (xMin + xMax) / 2;
    const cy = (yMin + yMax) / 2;
    const halfX = ((xMax - xMin) * factor) / 2;
    const halfY = ((yMax - yMin) * factor) / 2;
    setXMin(cx - halfX);
    setXMax(cx + halfX);
    setYMin(cy - halfY);
    setYMax(cy + halfY);
  };

  const handleReset = () => {
    setXMin(-5);
    setXMax(5);
    setYMin(-5);
    setYMax(15);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const ratioX = px / rect.width;
    const xVal = xMin + ratioX * (xMax - xMin);

    const evaluator = new MathExpressionEvaluator('rad');
    const expr = equationStr.replace(/x/g, `(${xVal})`);
    const res = evaluator.evaluate(expr);
    if (!res.error && !isNaN(res.value) && isFinite(res.value)) {
      setHoverCoord({ x: xVal, y: res.value });
    }
  };

  // Zero axis locations
  const zeroX = ((0 - xMin) / (xMax - xMin)) * 600;
  const zeroY = 400 - ((0 - yMin) / (yMax - yMin)) * 400;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <SeoHead
        title="Graphing Calculator - Plot Functions y = f(x) Online | StatMetric"
        description="Free online graphing calculator. Plot functions y = f(x), inspect coordinates, pan, zoom, and visualize mathematical curves interactively."
        path="/calculators/graphing-calculator"
        schemaType="WebApplication"
      />

      {/* Hero Header with ToolIcon */}
      <div className="mb-6 flex items-start gap-4">
        <ToolIcon toolId="graphing-calculator" size="lg" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              Mathematics
            </span>
            <span className="text-xs text-slate-500">Interactive SVG Visualizer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Graphing Calculator
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Plot continuous mathematical functions y = f(x), adjust viewports, and trace curve values interactively with crosshair inspection.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Graph Canvas */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 font-mono">
                f(x) = {equationStr}
              </span>
              {hoverCoord && (
                <span className="text-[11px] font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                  ({hoverCoord.x.toFixed(2)}, {hoverCoord.y.toFixed(2)})
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleZoom(0.8)}
                className="p-1.5 rounded text-slate-600 hover:bg-slate-100 border border-slate-200"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleZoom(1.25)}
                className="p-1.5 rounded text-slate-600 hover:bg-slate-100 border border-slate-200"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 rounded text-slate-600 hover:bg-slate-100 border border-slate-200"
                title="Reset Viewport"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="relative border border-slate-200 rounded-lg overflow-hidden bg-slate-950 aspect-3/2">
            <svg
              ref={svgRef}
              viewBox="0 0 600 400"
              className="w-full h-full cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoverCoord(null)}
            >
              {/* Axes lines */}
              {zeroX >= 0 && zeroX <= 600 && (
                <line x1={zeroX} y1={0} x2={zeroX} y2={400} stroke="#475569" strokeWidth="1.5" />
              )}
              {zeroY >= 0 && zeroY <= 400 && (
                <line x1={0} y1={zeroY} x2={600} y2={zeroY} stroke="#475569" strokeWidth="1.5" />
              )}

              {/* Grid markers */}
              <text x="10" y="20" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                yMax: {yMax.toFixed(1)}
              </text>
              <text x="10" y="390" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                yMin: {yMin.toFixed(1)}
              </text>
              <text x="540" y={Math.max(15, Math.min(385, zeroY - 5))} fill="#94a3b8" fontSize="10" fontFamily="monospace">
                {xMax.toFixed(1)}
              </text>
              <text x="15" y={Math.max(15, Math.min(385, zeroY - 5))} fill="#94a3b8" fontSize="10" fontFamily="monospace">
                {xMin.toFixed(1)}
              </text>

              {/* Plot polyline */}
              {polylinePoints ? (
                <polyline
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={polylinePoints}
                />
              ) : (
                <text x="300" y="200" textAnchor="middle" fill="#64748b" fontSize="13" fontFamily="sans-serif">
                  Enter function f(x) or click a preset below to plot
                </text>
              )}

              {/* Hover indicator dot */}
              {hoverCoord && (
                <circle
                  cx={((hoverCoord.x - xMin) / (xMax - xMin)) * 600}
                  cy={400 - ((hoverCoord.y - yMin) / (yMax - yMin)) * 400}
                  r="5"
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              )}
            </svg>
          </div>

          {error && (
            <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded p-2 mt-2">
              {error}
            </div>
          )}
        </div>

        {/* Function Controls & Presets */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Function Definition
              </h2>
              {equationStr && (
                <button
                  type="button"
                  onClick={() => setEquationStr('')}
                  className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                f(x) Equation (in terms of x)
              </label>
              <input
                type="text"
                value={equationStr}
                onChange={(e) => setEquationStr(e.target.value)}
                placeholder="e.g. x^2 - 4"
                className="w-full px-3 py-2 text-sm font-mono bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
              <div>
                <label className="block text-slate-600 mb-1">x Min</label>
                <input
                  type="number"
                  value={xMin}
                  onChange={(e) => setXMin(parseFloat(e.target.value) || -10)}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded bg-slate-50 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">x Max</label>
                <input
                  type="number"
                  value={xMax}
                  onChange={(e) => setXMax(parseFloat(e.target.value) || 10)}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded bg-slate-50 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">y Min</label>
                <input
                  type="number"
                  value={yMin}
                  onChange={(e) => setYMin(parseFloat(e.target.value) || -10)}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded bg-slate-50 font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">y Max</label>
                <input
                  type="number"
                  value={yMax}
                  onChange={(e) => setYMax(parseFloat(e.target.value) || 10)}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded bg-slate-50 font-mono text-xs"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <span className="text-[11px] font-semibold text-slate-500 block mb-2">Preset Functions</span>
              <div className="space-y-1.5">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setEquationStr(p.eq);
                      setXMin(p.xRange[0]);
                      setXMax(p.xRange[1]);
                      setYMin(p.yRange[0]);
                      setYMax(p.yRange[1]);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-between"
                  >
                    <span>{p.label}</span>
                    <span className="text-[10px] text-blue-600 font-semibold font-mono">Load</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="mt-8">
        <NextStepCard
          options={[
            {
              prompt: 'Evaluate expressions numerically?',
              toolName: 'Scientific Calculator',
              path: '/calculators/scientific-calculator',
              description: 'Scientific calculator with powers, trigonometry, and logarithms.',
            },
            {
              prompt: 'Fit an empirical linear regression line?',
              toolName: 'Correlation & Regression',
              path: '/calculators/correlation-regression',
              description: 'Find Pearson r and the ordinary least squares slope y = mx + b.',
            },
            {
              prompt: 'Analyze standard Gaussian probability density?',
              toolName: 'Normal Distribution Calculator',
              path: '/calculators/normal-distribution',
              description: 'Compute cumulative probability intervals on the Gaussian bell curve.',
            },
          ]}
        />
      </div>
    </div>
  );
}
