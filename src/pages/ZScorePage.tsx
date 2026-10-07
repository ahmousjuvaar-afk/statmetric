import { useState, useMemo } from 'react';
import { SeoHead } from '../components/SeoHead';
import { ReportBox } from '../components/ReportBox';
import { StepsExplanation } from '../components/StepsExplanation';
import { NextStepCard, NextStepOption } from '../components/NextStepCard';
import { LearnVerifyBox } from '../components/LearnVerifyBox';
import { calculateZScore } from '../lib/statistics/zscore';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export function ZScorePage() {
  const [mode, setMode] = useState<'forward' | 'reverse'>('forward');
  const [xStr, setXStr] = useState<string>('');
  const [zStr, setZStr] = useState<string>('');
  const [meanStr, setMeanStr] = useState<string>('');
  const [sdStr, setSdStr] = useState<string>('');

  const hasInputs =
    mode === 'forward'
      ? xStr.trim() !== '' && meanStr.trim() !== '' && sdStr.trim() !== ''
      : zStr.trim() !== '' && meanStr.trim() !== '' && sdStr.trim() !== '';

  const x = parseFloat(xStr) || 0;
  const z = parseFloat(zStr) || 0;
  const mean = parseFloat(meanStr) || 0;
  const sd = parseFloat(sdStr) || 0;

  let inputError: string | null = null;
  if (hasInputs) {
    if (sd <= 0) {
      inputError = 'Standard deviation (σ) must be strictly greater than 0.';
    }
  }

  const result = useMemo(() => {
    if (!hasInputs || inputError) return null;
    try {
      return calculateZScore({
        mode,
        x: mode === 'forward' ? x : undefined,
        z: mode === 'reverse' ? z : undefined,
        mean,
        sd,
      });
    } catch (err: unknown) {
      if (err instanceof Error) inputError = err.message;
      return null;
    }
  }, [hasInputs, mode, x, z, mean, sd, inputError]);

  const loadExample = (type: 'iq' | 'exam' | 'extreme') => {
    if (type === 'iq') {
      setMeanStr('100');
      setSdStr('15');
      setXStr('130');
      setMode('forward');
    } else if (type === 'exam') {
      setMeanStr('75');
      setSdStr('8');
      setXStr('87');
      setMode('forward');
    } else if (type === 'extreme') {
      setMeanStr('500');
      setSdStr('100');
      setZStr('2.5');
      setMode('reverse');
    }
  };

  const nextSteps: NextStepOption[] = [
    {
      prompt: 'Need full shaded areas, between-intervals, and interactive bell curve graphics?',
      toolName: 'Normal Distribution Calculator',
      path: '/calculators/normal-distribution',
      description: 'Calculate cumulative probabilities and visualize shaded areas under Gaussian bell curves.',
      isAvailable: true,
    },
    {
      prompt: 'Need to calculate the mean and standard deviation from raw data first?',
      toolName: 'Standard Deviation Calculator',
      path: '/calculators/standard-deviation',
      description: 'Compute sample or population variance and standard deviation from raw observations.',
      isAvailable: true,
    },
    {
      prompt: 'Need to test hypothesis significance with your z-score?',
      toolName: 'P-Value Calculator',
      path: '/calculators/p-value',
      description: 'Find two-tailed or one-tailed p-values for your calculated test statistic.',
      isAvailable: true,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SeoHead
        title="Z-Score Calculator — Convert Raw Scores & Standard Deviations"
        description="Free online z-score calculator. Compute standard scores (z = (x - μ) / σ), percentile ranks, and reverse raw values from standard deviations."
        path="/calculators/z-score"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Calculators', path: '/calculators' },
          { name: 'Z-Score Calculator', path: '/calculators/z-score' },
        ]}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumbs" className="mb-4 text-xs text-slate-500 flex items-center gap-1.5 no-print">
        <span>Statistics</span>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-medium">Z-Score Calculator</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Z-Score Calculator
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Standardize any raw observation into units of standard deviation from the mean, or calculate the raw score corresponding to a given Z-score.
        </p>

        {/* Classroom Examples */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs no-print">
          <span className="text-slate-500 font-medium">Classroom examples:</span>
          <button
            onClick={() => loadExample('iq')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            Mensa IQ Cutoff (μ=100, σ=15, x=130)
          </button>
          <button
            onClick={() => loadExample('exam')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            Exam Score Standout (μ=75, σ=8)
          </button>
          <button
            onClick={() => loadExample('extreme')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            Reverse Score from z = +2.5
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden mb-8">
        <div className="p-5 sm:p-7 border-b border-slate-200 bg-slate-50/50">
          {/* Mode Switcher */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Calculation Direction
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('forward')}
                className={`p-3 rounded-xl text-left border transition-all ${
                  mode === 'forward'
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold text-sm">Forward: Find Z-Score from Raw x</div>
                <div className={`text-xs mt-1 ${mode === 'forward' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Formula: z = (x - μ) / σ
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('reverse')}
                className={`p-3 rounded-xl text-left border transition-all ${
                  mode === 'reverse'
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold text-sm">Reverse: Find Raw x from Z-Score</div>
                <div className={`text-xs mt-1 ${mode === 'reverse' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Formula: x = μ + z × σ
                </div>
              </button>
            </div>
          </div>

          {/* Numerical Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {mode === 'forward' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Raw Value (x)
                </label>
                <input
                  type="number"
                  step="any"
                  value={xStr}
                  onChange={(e) => setXStr(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Z-Score (z)
                </label>
                <input
                  type="number"
                  step="any"
                  value={zStr}
                  onChange={(e) => setZStr(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mean (μ)
              </label>
              <input
                type="number"
                step="any"
                value={meanStr}
                onChange={(e) => setMeanStr(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Standard Deviation (σ)
              </label>
              <input
                type="number"
                min="0.0001"
                step="any"
                value={sdStr}
                onChange={(e) => setSdStr(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Input Error */}
        {inputError && (
          <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-start gap-2 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{inputError}</span>
          </div>
        )}

        {/* Empty State */}
        {!hasInputs && !inputError && (
          <div className="p-8 text-center text-slate-500 bg-white">
            <p className="text-sm font-semibold text-slate-800 mb-1">
              Ready when you are
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-3">
              Enter your observation score, distribution mean (μ), and standard deviation (σ) above, or load a classroom example to calculate the standardized z-score and percentile.
            </p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="p-5 sm:p-7 space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  {mode === 'forward' ? 'Standardized Score (Z)' : 'Calculated Raw Score (x)'}
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                  {mode === 'forward' ? `z = ${result.z.toFixed(3)}` : `x = ${result.x.toFixed(3)}`}
                </div>
                <div className="mt-1 text-xs text-slate-600 font-mono">
                  Percentile Rank: {result.percentileFormatted} of values fall below this point
                </div>
              </div>

              <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6 space-y-1">
                <div className="text-xs font-mono text-slate-700">
                  Left Tail P(Z ≤ z) = {(result.leftTailArea * 100).toFixed(2)}%
                </div>
                <div className="text-xs font-mono text-slate-700">
                  Right Tail P(Z ≥ z) = {(result.rightTailArea * 100).toFixed(2)}%
                </div>
                <div className="text-xs text-slate-500">
                  Two-Tailed Rejection Area = {(result.twoTailArea * 100).toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed">
              <strong className="font-semibold text-blue-900 block mb-1">
                Interpretation:
              </strong>
              {result.interpretation}
            </div>

            <StepsExplanation
              steps={result.steps}
              formula={result.formula}
              title="Step-by-Step Standardization Math"
            />

            <LearnVerifyBox
              learnNotes={{
                concept:
                  'A Z-score measures how many standard deviations an observation lies above or below the distribution mean.',
                intuition:
                  'A z-score of 0 is dead average. A z-score of +1.0 means you scored higher than roughly 84% of your peers. A z-score of +2.0 is in the top 2.5%.',
                formulaBreakdown:
                  'z = (x - μ) / σ. Subtracting μ shifts the distribution so the mean is 0. Dividing by σ scales the distribution so 1 standard deviation equals 1 unit.',
                commonTrap:
                  'Forgetting that negative z-scores represent values below the mean. If x < μ, the z-score must always be negative.',
              }}
              manualCheckSteps={[
                'Subtract the mean from your raw score: x - μ.',
                'Divide that difference by the standard deviation σ.',
                'Look up the resulting z-score in a standard normal Z table to find the cumulative percentile.',
              ]}
            />

            <ReportBox
              apaString={`x = ${result.x.toFixed(2)}, z = ${result.z.toFixed(2)}, percentile = ${result.percentileFormatted}`}
              contextNote="Standardized statistical notation for individual data points."
            />

            <NextStepCard options={nextSteps} />
          </div>
        )}
      </div>
    </div>
  );
}
