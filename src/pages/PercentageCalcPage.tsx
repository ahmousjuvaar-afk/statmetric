import { useState, useMemo } from 'react';
import { SeoHead } from '../components/SeoHead';
import { ToolIcon } from '../components/ToolIcon';
import { NextStepCard } from '../components/NextStepCard';
import { StepsExplanation } from '../components/StepsExplanation';
import { calculatePercentage, PercentageMode } from '../lib/math/percentages';

export function PercentageCalcPage() {
  const [mode, setMode] = useState<PercentageMode>('percent_of');
  const [val1, setVal1] = useState('15');
  const [val2, setVal2] = useState('200');
  const [direction, setDirection] = useState<'increase' | 'decrease'>('increase');

  const result = useMemo(() => {
    const v1 = parseFloat(val1);
    const v2 = parseFloat(val2);
    if (isNaN(v1) || isNaN(v2)) {
      return { error: 'Please enter valid numerical values.' };
    }
    try {
      const res = calculatePercentage(mode, v1, v2, direction);
      return { data: res, error: null };
    } catch (e: unknown) {
      return { error: e instanceof Error ? e.message : 'Invalid percentage calculation.' };
    }
  }, [mode, val1, val2, direction]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <SeoHead
        title="Percentage Calculator - Percent Of, Percent Change & Reverse | StatMetric"
        description="Free online percentage calculator. Calculate percentage of a number, percentage increase/decrease, percentage difference, and reverse original values."
        path="/calculators/percentage-calculator"
        schemaType="WebApplication"
      />

      {/* Hero Header with ToolIcon */}
      <div className="mb-6 flex items-start gap-4">
        <ToolIcon toolId="percentage-calculator" size="lg" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              Mathematics
            </span>
            <span className="text-xs text-slate-500">5 Quantitative Modes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Percentage Calculator
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Calculate percentages of quantities, proportional share, rate of change (increase/decrease), and reverse original base values.
          </p>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-lg mb-6 max-w-2xl">
        <button
          onClick={() => { setMode('percent_of'); setVal1('15'); setVal2('200'); }}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            mode === 'percent_of' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          What is X% of Y?
        </button>
        <button
          onClick={() => { setMode('is_what_percent'); setVal1('45'); setVal2('180'); }}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            mode === 'is_what_percent' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          X is what % of Y?
        </button>
        <button
          onClick={() => { setMode('percent_change'); setVal1('50'); setVal2('75'); }}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            mode === 'percent_change' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Percentage Change
        </button>
        <button
          onClick={() => { setMode('percent_difference'); setVal1('80'); setVal2('100'); }}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            mode === 'percent_difference' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Percent Difference
        </button>
        <button
          onClick={() => { setMode('reverse_percent'); setVal1('120'); setVal2('20'); }}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            mode === 'reverse_percent' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Reverse Percentage
        </button>
      </div>

      {/* Main Interactive Form Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          {mode === 'percent_of' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Percentage (P %)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={val1}
                    onChange={(e) => setVal1(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3 top-2 text-sm text-slate-400 font-bold">%</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Of Total Number (Y)</label>
                <input
                  type="number"
                  value={val2}
                  onChange={(e) => setVal2(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {mode === 'is_what_percent' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Part Value (X)</label>
                <input
                  type="number"
                  value={val1}
                  onChange={(e) => setVal1(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Total Whole (Y)</label>
                <input
                  type="number"
                  value={val2}
                  onChange={(e) => setVal2(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {mode === 'percent_change' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Value (V1)</label>
                <input
                  type="number"
                  value={val1}
                  onChange={(e) => setVal1(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Final Value (V2)</label>
                <input
                  type="number"
                  value={val2}
                  onChange={(e) => setVal2(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {mode === 'percent_difference' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">First Value (V1)</label>
                <input
                  type="number"
                  value={val1}
                  onChange={(e) => setVal1(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Second Value (V2)</label>
                <input
                  type="number"
                  value={val2}
                  onChange={(e) => setVal2(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {mode === 'reverse_percent' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Final Value</label>
                <input
                  type="number"
                  value={val1}
                  onChange={(e) => setVal1(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Percentage Change</label>
                  <select
                    value={direction}
                    onChange={(e) => setDirection(e.target.value as 'increase' | 'decrease')}
                    className="text-[11px] font-medium border border-slate-200 rounded px-1.5 py-0.5 bg-white text-slate-700"
                  >
                    <option value="increase">Increase (+)</option>
                    <option value="decrease">Decrease (−)</option>
                  </select>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={val2}
                    onChange={(e) => setVal2(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3 top-2 text-sm text-slate-400 font-bold">%</span>
                </div>
              </div>
            </>
          )}

          {/* Result Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[11px] font-semibold text-slate-600 block mb-0.5 uppercase tracking-wider">
              Calculated Result
            </span>
            {result.error ? (
              <span className="text-xs text-rose-600 font-medium">{result.error}</span>
            ) : result.data ? (
              <div>
                <div className="text-2xl font-bold text-blue-600 font-mono">
                  {result.data.formattedResult}
                </div>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                  {result.data.explanation}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Steps & Verification */}
      {result.data && (
        <StepsExplanation
          title="Mathematical Derivation & Steps"
          formula={result.data.formula}
          steps={result.data.steps}
        />
      )}

      {/* Next Step Card */}
      <div className="mt-8">
        <NextStepCard
          options={[
            {
              prompt: 'Comparing two proportional quantities?',
              toolName: 'Ratio & Proportion Calculator',
              path: '/calculators/ratio-calculator',
              description: 'Simplify ratios and solve proportions with cross-multiplication.',
            },
            {
              prompt: 'Working with fractions instead of decimals?',
              toolName: 'Fraction Calculator',
              path: '/calculators/fraction-calculator',
              description: 'Add, subtract, and simplify fractions with step-by-step arithmetic.',
            },
            {
              prompt: 'Analyzing statistical test scores?',
              toolName: 'Z-Score Calculator',
              path: '/calculators/z-score',
              description: 'Find percentile ranks and distance from normal distribution means.',
            },
          ]}
        />
      </div>
    </div>
  );
}
