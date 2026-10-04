import { useState, useMemo } from 'react';
import { SeoHead } from '../components/SeoHead';
import { ReportBox } from '../components/ReportBox';
import { StepsExplanation } from '../components/StepsExplanation';
import { NextStepCard, NextStepOption } from '../components/NextStepCard';
import { LearnVerifyBox } from '../components/LearnVerifyBox';
import { calculateConfidenceInterval, CiType } from '../lib/statistics/confidenceInterval';
import { AlertTriangle, RotateCcw, Printer } from 'lucide-react';

export function ConfidenceIntervalPage() {
  const [ciType, setCiType] = useState<CiType>('mean_t');
  const [confidenceLevel, setConfidenceLevel] = useState<number>(0.95);

  // Mean inputs
  const [meanStr, setMeanStr] = useState<string>('50');
  const [sdStr, setSdStr] = useState<string>('10');
  const [nStr, setNStr] = useState<string>('36');

  // Proportion inputs
  const [kStr, setKStr] = useState<string>('60');
  const [sampleSizeStr, setSampleSizeStr] = useState<string>('100');

  const mean = parseFloat(meanStr) || 0;
  const sd = parseFloat(sdStr) || 0;
  const n = parseFloat(nStr) || 0;
  const k = parseFloat(kStr) || 0;
  const sampleSize = parseFloat(sampleSizeStr) || 0;

  let inputError: string | null = null;
  if (ciType === 'mean_t' || ciType === 'mean_z') {
    if (sd <= 0) inputError = 'Standard deviation must be strictly greater than 0.';
    else if (n < 2) inputError = 'Sample size n must be at least 2.';
  } else {
    if (sampleSize <= 0) inputError = 'Sample size must be greater than 0.';
    else if (k < 0 || k > sampleSize) inputError = 'Success count must be between 0 and total sample size.';
  }

  const result = useMemo(() => {
    if (inputError) return null;
    try {
      return calculateConfidenceInterval({
        type: ciType,
        confidenceLevel,
        mean,
        sd,
        n,
        successes: k,
        sampleSize,
      });
    } catch (err: unknown) {
      if (err instanceof Error) inputError = err.message;
      return null;
    }
  }, [ciType, confidenceLevel, mean, sd, n, k, sampleSize, inputError]);

  const nextSteps: NextStepOption[] = [
    {
      prompt: 'Need to test if this mean differs significantly from a target null value?',
      toolName: 'P-Value Calculator',
      path: '/calculators/p-value',
      description: 'Calculate exact p-values for hypothesis tests with shaded tail areas.',
      isAvailable: true,
    },
    {
      prompt: 'Need to compare two independent groups?',
      toolName: 'Two-Sample T-Test',
      path: '/calculators/t-test',
      description: 'Evaluate mean differences between two groups using Student or Welch t-test.',
      isAvailable: true,
    },
    {
      prompt: 'Need to compute raw sample standard deviation and variance first?',
      toolName: 'Standard Deviation Calculator',
      path: '/calculators/standard-deviation',
      description: 'Calculate sample (n-1) or population (N) dispersion from raw datasets.',
      isAvailable: true,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SeoHead
        title="Confidence Interval Calculator — Means (t & Z) & Proportions"
        description="Calculate 90%, 95%, and 99% confidence intervals for sample means and proportions. Includes margin of error breakdown, interactive error bars, and APA format text."
        path="/calculators/confidence-interval"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Calculators', path: '/calculators' },
          { name: 'Confidence Interval', path: '/calculators/confidence-interval' },
        ]}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumbs" className="mb-4 text-xs text-slate-500 flex items-center gap-1.5 no-print">
        <span>Research</span>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-medium">Confidence Interval</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Confidence Interval Calculator
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Compute accurate interval estimates and margins of error for population means (using Student&apos;s t or normal Z) and sample proportions.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden mb-8">
        <div className="p-5 sm:p-7 border-b border-slate-200 bg-slate-50/50">
          {/* Target Parameter Type */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              1. Parameter Being Estimated
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCiType('mean_t')}
                className={`p-3 rounded-lg text-left border transition-all ${
                  ciType === 'mean_t'
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold text-sm">Mean (Sample s, t-dist)</div>
                <div className={`text-xs mt-0.5 ${ciType === 'mean_t' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Standard research case: unknown σ
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCiType('mean_z')}
                className={`p-3 rounded-lg text-left border transition-all ${
                  ciType === 'mean_z'
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold text-sm">Mean (Known σ, Z-dist)</div>
                <div className={`text-xs mt-0.5 ${ciType === 'mean_z' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Known population σ or huge n
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCiType('proportion')}
                className={`p-3 rounded-lg text-left border transition-all ${
                  ciType === 'proportion'
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold text-sm">Proportion (p̂)</div>
                <div className={`text-xs mt-0.5 ${ciType === 'proportion' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Survey percentages & rates
                </div>
              </button>
            </div>
          </div>

          {/* Numeric Parameters */}
          {ciType !== 'proportion' ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sample Mean (x̄)
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
                  Standard Deviation ({ciType === 'mean_t' ? 's' : 'σ'})
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
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sample Size (n)
                </label>
                <input
                  type="number"
                  min="2"
                  step="1"
                  value={nStr}
                  onChange={(e) => setNStr(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Success Count (x)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={kStr}
                  onChange={(e) => setKStr(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Sample Size (n)
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={sampleSizeStr}
                  onChange={(e) => setSampleSizeStr(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          )}

          {/* Confidence Level */}
          <div className="pt-4 border-t border-slate-200">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              2. Confidence Level
            </label>
            <div className="flex items-center gap-2">
              {[0.90, 0.95, 0.99].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setConfidenceLevel(lvl)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                    confidenceLevel === lvl
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {(lvl * 100).toFixed(0)}% Confidence
                </button>
              ))}
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

        {/* Result */}
        {result && (
          <div className="p-5 sm:p-7 space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  {result.confidencePercent} Confidence Interval
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                  [{result.lowerBound.toFixed(3)}, {result.upperBound.toFixed(3)}]
                </div>
                <div className="mt-1 text-xs text-slate-600 font-mono">
                  Point Estimate = {result.pointEstimate.toFixed(3)} ± {result.marginOfError.toFixed(3)} (Margin of Error)
                </div>
              </div>

              <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6 space-y-1">
                <div className="text-xs font-mono text-slate-700">
                  Critical Value: {result.criticalValueName} = {result.criticalValue.toFixed(3)}
                </div>
                <div className="text-xs font-mono text-slate-600">
                  Margin of Error: ±{result.marginOfError.toFixed(3)}
                </div>
              </div>
            </div>

            {/* Error Bar Visualizer */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl">
              <div className="text-xs font-semibold text-slate-700 mb-3">
                Visual Interval Span
              </div>
              <div className="relative h-12 flex items-center justify-center">
                <div className="w-full bg-slate-100 h-1.5 rounded-full relative">
                  <div
                    className="absolute bg-blue-600 h-1.5 rounded-full"
                    style={{ left: '20%', right: '20%' }}
                  />
                  {/* Lower Whisker */}
                  <div className="absolute left-[20%] top-[-8px] bottom-[-8px] w-0.5 bg-blue-600" />
                  <span className="absolute left-[20%] top-4 -translate-x-1/2 text-[10px] font-mono font-medium text-slate-600">
                    {result.lowerBound.toFixed(2)}
                  </span>
                  {/* Point Estimate */}
                  <div className="absolute left-[50%] top-[-6px] -translate-x-1/2 w-3 h-3 bg-slate-900 rounded-full border-2 border-white shadow-xs" />
                  <span className="absolute left-[50%] top-4 -translate-x-1/2 text-[10px] font-mono font-bold text-slate-900">
                    {result.pointEstimate.toFixed(2)}
                  </span>
                  {/* Upper Whisker */}
                  <div className="absolute right-[20%] top-[-8px] bottom-[-8px] w-0.5 bg-blue-600" />
                  <span className="absolute right-[20%] top-4 translate-x-1/2 text-[10px] font-mono font-medium text-slate-600">
                    {result.upperBound.toFixed(2)}
                  </span>
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
              title="Step-by-Step Margin of Error Calculation"
            />

            <LearnVerifyBox
              learnNotes={{
                concept:
                  'A confidence interval gives an estimated range of values which is likely to include an unknown population parameter with a chosen degree of certainty.',
                intuition:
                  'Confidence describes the long-run capture rate of the statistical procedure. A 95% confidence interval means that if you took 100 random samples, about 95 of the resulting intervals would successfully contain the true population parameter.',
                formulaBreakdown:
                  'Point Estimate ± (Critical Value × Standard Error). For a sample mean with unknown σ, Critical Value is t* from Student’s t-distribution with n - 1 degrees of freedom.',
                commonTrap:
                  'Never say: "There is a 95% probability that the true mean is between A and B." The true mean is a fixed constant, not a random variable. The 95% refers to the reliability of the sampling process.',
              }}
              manualCheckSteps={[
                'Find standard error: SE = s / √n for means, or √[p̂(1-p̂)/n] for proportions.',
                'Look up critical value (z* or t*) corresponding to your confidence level.',
                'Multiply critical value by SE to calculate the Margin of Error (ME).',
                'Subtract and add ME to the point estimate to get the lower and upper bounds.',
              ]}
            />

            <ReportBox
              apaString={result.apaReport}
              contextNote="Standard APA 7th Edition bracket notation for empirical manuscripts."
            />

            <NextStepCard options={nextSteps} />
          </div>
        )}
      </div>
    </div>
  );
}
