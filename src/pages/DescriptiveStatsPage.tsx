import { useState, useMemo } from 'react';
import { SeoHead } from '../components/SeoHead';
import { ReportBox } from '../components/ReportBox';
import { NextStepCard, NextStepOption } from '../components/NextStepCard';
import { LearnVerifyBox } from '../components/LearnVerifyBox';
import { calculateDescriptiveStats } from '../lib/statistics/descriptive';
import { parseDatasetInput } from '../lib/statistics/standardDev';
import { AlertTriangle, RotateCcw, Printer, Copy, Check } from 'lucide-react';

export function DescriptiveStatsPage() {
  const [rawInput, setRawInput] = useState<string>('');
  const [copiedSummary, setCopiedSummary] = useState(false);

  const parsed = useMemo(() => {
    return parseDatasetInput(rawInput);
  }, [rawInput]);

  let inputError: string | null = null;
  if (rawInput.trim() !== '') {
    if (parsed.error) {
      inputError = parsed.error;
    } else if (parsed.values.length < 2) {
      inputError = 'Enter at least 2 numbers to compute descriptive statistics.';
    }
  }

  const result = useMemo(() => {
    if (!rawInput.trim() || inputError || parsed.values.length < 2) return null;
    try {
      return calculateDescriptiveStats(parsed.values);
    } catch (err: unknown) {
      return null;
    }
  }, [rawInput, parsed.values, inputError]);

  const loadExample = (ex: 'grades' | 'skewed' | 'bimodal') => {
    if (ex === 'grades') {
      setRawInput('65, 72, 75, 78, 82, 85, 85, 88, 92, 98');
    } else if (ex === 'skewed') {
      setRawInput('10, 12, 14, 15, 16, 18, 20, 22, 55, 95');
    } else if (ex === 'bimodal') {
      setRawInput('4, 4, 5, 6, 8, 12, 12, 14');
    }
  };

  const handleCopySummary = async () => {
    if (!result) return;
    const txt = `n = ${result.count}, Mean = ${result.mean.toFixed(2)}, Median = ${result.median.toFixed(
      2
    )}, SD = ${result.sampleSd.toFixed(2)}, Range = [${result.min}, ${result.max}], IQR = ${result.iqr.toFixed(2)}`;
    try {
      await navigator.clipboard.writeText(txt);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch {}
  };

  const nextSteps: NextStepOption[] = [
    {
      prompt: 'Need to focus specifically on sample vs population standard deviation?',
      toolName: 'Standard Deviation Calculator',
      path: '/calculators/standard-deviation',
      description: 'Observation-level SS tables and Bessel correction breakdown.',
      isAvailable: true,
    },
    {
      prompt: 'Need to convert these observations into standardized Z-scores?',
      toolName: 'Z-Score Calculator',
      path: '/calculators/z-score',
      description: 'Standardize scores and find percentile ranks.',
      isAvailable: true,
    },
    {
      prompt: 'Need to test if this sample mean differs from a comparison population?',
      toolName: 'Two-Sample T-Test',
      path: '/calculators/t-test',
      description: 'Compare two groups with Student or Welch t-test.',
      isAvailable: true,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SeoHead
        title="Descriptive Statistics Calculator — Mean, Median, Mode, SD & Box Plot"
        description="Calculate complete summary statistics: mean, median, mode, sample variance, standard deviation, quartiles, IQR, and 5-number summary with interactive box plots."
        path="/calculators/descriptive-statistics"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Calculators', path: '/calculators' },
          { name: 'Descriptive Statistics', path: '/calculators/descriptive-statistics' },
        ]}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumbs" className="mb-4 text-xs text-slate-500 flex items-center gap-1.5 no-print">
        <span>Statistics</span>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-medium">Descriptive Statistics</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Descriptive Statistics Calculator
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Comprehensive exploratory summary statistics including measures of central tendency (mean, median, mode), dispersion (variance, SD, IQR), skewness, and 5-number summary.
        </p>

        {/* Classroom Examples */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs no-print">
          <span className="text-slate-500 font-medium">Classroom examples:</span>
          <button
            onClick={() => loadExample('grades')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            Exam Scores (n=10)
          </button>
          <button
            onClick={() => loadExample('skewed')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            Right-Skewed Data with Outliers
          </button>
          <button
            onClick={() => loadExample('bimodal')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            Bimodal Distribution (Two Modes)
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden mb-8">
        <div className="p-5 sm:p-7 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Enter Raw Observation Dataset
            </label>
            <span className="text-xs text-slate-500">
              Valid items: <strong className="font-mono text-slate-900">{parsed.values.length}</strong>
            </span>
          </div>
          <textarea
            rows={4}
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            placeholder="e.g. 10, 12, 15, 18, 21 or enter one per line"
          />
          <span className="text-[11px] text-slate-500 mt-1 block">
            Separators: commas, spaces, tabs, or newlines.
          </span>
        </div>

        {/* Error */}
        {inputError && (
          <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-start gap-2 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{inputError}</span>
          </div>
        )}

        {/* Empty State */}
        {!rawInput.trim() && (
          <div className="p-8 text-center text-slate-500 bg-white">
            <p className="text-sm font-semibold text-slate-800 mb-1">
              Ready when you are
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Enter your dataset observations above to compute sample and population metrics, central tendency, quartiles, and skewness.
            </p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="p-5 sm:p-7 space-y-6">
            {/* Primary Headline Metrics */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Primary Summary Metrics (n = {result.count})
                </span>
                <div className="flex flex-wrap items-baseline gap-4 sm:gap-6">
                  <div>
                    <span className="text-xs text-slate-500 block">Sample Mean (x̄)</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                      {result.mean.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Median</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                      {result.median.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Sample SD (s)</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                      {result.sampleSd.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6 space-y-1">
                <button
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
                >
                  {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSummary ? 'Copied summary!' : 'Copy Summary'}</span>
                </button>
                <div className="text-xs text-slate-500 pt-1">
                  Distribution shape: <strong className="text-slate-800">{result.skewnessLabel}</strong>
                </div>
              </div>
            </div>

            {/* Comprehensive Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-100 px-4 py-2 font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                Complete Descriptive Parameters
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 bg-white">
                <div className="p-3">
                  <span className="text-slate-500 block text-[11px]">Mode</span>
                  <span className="font-mono font-medium text-slate-900">
                    {result.mode.length > 0 ? result.mode.join(', ') : 'No unique mode'}
                  </span>
                </div>
                <div className="p-3">
                  <span className="text-slate-500 block text-[11px]">Sample Variance (s²)</span>
                  <span className="font-mono font-medium text-slate-900">{result.sampleVariance.toFixed(3)}</span>
                </div>
                <div className="p-3">
                  <span className="text-slate-500 block text-[11px]">Pop. Variance (σ²)</span>
                  <span className="font-mono font-medium text-slate-900">{result.popVariance.toFixed(3)}</span>
                </div>
                <div className="p-3">
                  <span className="text-slate-500 block text-[11px]">Pop. SD (σ)</span>
                  <span className="font-mono font-medium text-slate-900">{result.popSd.toFixed(3)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 border-t border-slate-200 bg-white">
                <div className="p-3">
                  <span className="text-slate-500 block text-[11px]">Minimum</span>
                  <span className="font-mono font-medium text-slate-900">{result.min}</span>
                </div>
                <div className="p-3">
                  <span className="text-slate-500 block text-[11px]">First Quartile (Q₁)</span>
                  <span className="font-mono font-medium text-slate-900">{result.q1.toFixed(2)}</span>
                </div>
                <div className="p-3">
                  <span className="text-slate-500 block text-[11px]">Third Quartile (Q₃)</span>
                  <span className="font-mono font-medium text-slate-900">{result.q3.toFixed(2)}</span>
                </div>
                <div className="p-3">
                  <span className="text-slate-500 block text-[11px]">Maximum</span>
                  <span className="font-mono font-medium text-slate-900">{result.max}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 border-t border-slate-200 bg-white">
                <div className="p-3">
                  <span className="text-slate-500 block text-[11px]">Range</span>
                  <span className="font-mono font-medium text-slate-900">{result.range.toFixed(2)}</span>
                </div>
                <div className="p-3">
                  <span className="text-slate-500 block text-[11px]">IQR (Q₃ - Q₁)</span>
                  <span className="font-mono font-medium text-slate-900">{result.iqr.toFixed(2)}</span>
                </div>
                <div className="p-3">
                  <span className="text-slate-500 block text-[11px]">Sum (Σx)</span>
                  <span className="font-mono font-medium text-slate-900">{result.sum.toFixed(2)}</span>
                </div>
                <div className="p-3">
                  <span className="text-slate-500 block text-[11px]">Standard Error (SE)</span>
                  <span className="font-mono font-medium text-slate-900">{result.seMean.toFixed(4)}</span>
                </div>
              </div>
            </div>

            {/* Five-Number Summary Box Plot */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl">
              <div className="text-xs font-semibold text-slate-700 mb-2">
                Five-Number Summary: [{result.min}, {result.q1.toFixed(1)}, {result.median.toFixed(1)}, {result.q3.toFixed(1)}, {result.max}]
              </div>
              <div className="relative h-14 flex items-center justify-center pt-2">
                <div className="w-full bg-slate-100 h-1 relative">
                  {/* Whiskers */}
                  <div className="absolute left-[10%] right-[10%] h-0.5 bg-slate-400" />
                  {/* Box (Q1 to Q3) */}
                  <div
                    className="absolute bg-sky-100 border border-sky-600 h-8 top-[-15px] rounded-xs"
                    style={{ left: '25%', right: '25%' }}
                  />
                  {/* Median Line */}
                  <div
                    className="absolute w-0.5 bg-slate-900 h-8 top-[-15px]"
                    style={{ left: '50%' }}
                  />
                  {/* Min label */}
                  <span className="absolute left-[10%] top-4 -translate-x-1/2 text-[10px] font-mono text-slate-600">
                    Min: {result.min}
                  </span>
                  {/* Q1 label */}
                  <span className="absolute left-[25%] top-[-26px] -translate-x-1/2 text-[10px] font-mono text-slate-600">
                    Q₁: {result.q1.toFixed(1)}
                  </span>
                  {/* Median label */}
                  <span className="absolute left-[50%] top-4 -translate-x-1/2 text-[10px] font-mono font-bold text-slate-900">
                    Med: {result.median.toFixed(1)}
                  </span>
                  {/* Q3 label */}
                  <span className="absolute right-[25%] top-[-26px] translate-x-1/2 text-[10px] font-mono text-slate-600">
                    Q₃: {result.q3.toFixed(1)}
                  </span>
                  {/* Max label */}
                  <span className="absolute right-[10%] top-4 translate-x-1/2 text-[10px] font-mono text-slate-600">
                    Max: {result.max}
                  </span>
                </div>
              </div>
            </div>

            <LearnVerifyBox
              learnNotes={{
                concept:
                  'Descriptive statistics summarize the central location, dispersion, and shape of a sample dataset without making inferences beyond the observed values.',
                intuition:
                  'Mean gives the gravitational center of the numbers, while median is the literal middle rank. When data is skewed by extreme outliers, median and IQR are more resistant and truthful than mean and SD.',
                formulaBreakdown:
                  'Mean = Σx / n. Sample Variance = Σ(x - x̄)² / (n - 1). IQR = Q₃ - Q₁.',
                commonTrap:
                  'Reporting mean and standard deviation for strongly skewed data (like income or reaction times) without checking median and IQR.',
              }}
              manualCheckSteps={[
                'Sort data in ascending order.',
                'Calculate mean by summing values and dividing by count n.',
                'Find median at rank (n + 1) / 2.',
                'Find Q₁ as median of lower half and Q₃ as median of upper half.',
              ]}
            />

            <ReportBox
              apaString={`M = ${result.mean.toFixed(2)}, SD = ${result.sampleSd.toFixed(2)}, Mdn = ${result.median.toFixed(2)}, IQR = ${result.iqr.toFixed(2)}, n = ${result.count}`}
              contextNote="Comprehensive APA 7th Edition descriptive reporting format for academic research."
            />

            <NextStepCard options={nextSteps} />
          </div>
        )}
      </div>
    </div>
  );
}
