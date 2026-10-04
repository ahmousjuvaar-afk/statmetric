import { useState, useMemo } from 'react';
import { SeoHead } from '../components/SeoHead';
import { DataDistributionChart } from '../components/DataDistributionChart';
import { ReportBox } from '../components/ReportBox';
import { StepsExplanation } from '../components/StepsExplanation';
import { NextStepCard, NextStepOption } from '../components/NextStepCard';
import { LearnVerifyBox } from '../components/LearnVerifyBox';
import {
  StandardDevType,
  parseDatasetInput,
  calculateStandardDeviation,
  StandardDevResult,
} from '../lib/statistics/standardDev';
import {
  AlertTriangle,
  RotateCcw,
  Printer,
  Copy,
  Check,
  Table,
} from 'lucide-react';

export function StandardDevPage() {
  const [rawInput, setRawInput] = useState<string>('10, 12, 15, 18, 21, 24, 28');
  const [calcType, setCalcType] = useState<StandardDevType>('sample');
  const [showTable, setShowTable] = useState(false);
  const [copiedValue, setCopiedValue] = useState(false);

  // Parse input
  const parseResult = useMemo(() => {
    return parseDatasetInput(rawInput);
  }, [rawInput]);

  // Validation
  let validationError: string | null = parseResult.error || null;
  if (!validationError && parseResult.values.length === 0) {
    validationError = 'Enter at least 2 numbers separated by commas, spaces, or line breaks.';
  } else if (!validationError && calcType === 'sample' && parseResult.values.length < 2) {
    validationError = 'Enter at least 2 observations for sample standard deviation (n ≥ 2) to compute degrees of freedom (n - 1).';
  } else if (!validationError && calcType === 'population' && parseResult.values.length < 1) {
    validationError = 'Enter at least 1 observation for population standard deviation.';
  }

  // Calculate
  const result: StandardDevResult | null = useMemo(() => {
    if (validationError || parseResult.values.length === 0) return null;
    try {
      return calculateStandardDeviation(parseResult.values, calcType);
    } catch (err: unknown) {
      if (err instanceof Error) {
        validationError = err.message;
      }
      return null;
    }
  }, [parseResult.values, calcType, validationError]);

  const loadExample = (preset: 'grades' | 'lab' | 'small' | 'symmetric') => {
    if (preset === 'grades') {
      setRawInput('78, 85, 92, 65, 88, 74, 95, 82, 90, 71');
      setCalcType('sample');
    } else if (preset === 'lab') {
      setRawInput('12.4, 12.6, 12.3, 12.5, 12.8, 12.4, 12.5');
      setCalcType('sample');
    } else if (preset === 'small') {
      setRawInput('10, 12, 15, 18, 21');
      setCalcType('sample');
    } else if (preset === 'symmetric') {
      setRawInput('2, 4, 4, 4, 5, 5, 7, 9');
      setCalcType('population');
    }
  };

  const handleCopyNumeric = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.standardDeviation.toFixed(4));
      setCopiedValue(true);
      setTimeout(() => setCopiedValue(false), 2000);
    } catch {}
  };

  const nextSteps: NextStepOption[] = [
    {
      prompt: 'Need to convert observations to standardized units?',
      toolName: 'Z-Score / Normal Distribution',
      path: '/calculators/normal-distribution',
      description: 'Standardize values into Z-scores using mean and standard deviation to find percentile ranks.',
      isAvailable: true,
    },
    {
      prompt: 'Need to test if your sample mean differs from a null value?',
      toolName: 'P-Value Calculator',
      path: '/calculators/p-value',
      description: 'Compute p-values for one-sample or two-sample hypothesis tests with your calculated statistics.',
      isAvailable: true,
    },
    {
      prompt: 'Need full skewness, kurtosis, and distribution shapes?',
      toolName: 'Descriptive Statistics',
      path: '/calculators',
      description: 'Comprehensive exploratory data analysis suite with summary metrics (Roadmap Phase 2).',
      isAvailable: false,
    },
  ];

  const faqItems = [
    {
      question: 'What is the difference between sample and population standard deviation?',
      answer:
        'Population standard deviation (σ) is used when you have measured the entire census population, dividing by N. Sample standard deviation (s) is used when your data represents a subset or sample of a larger population, dividing by n - 1 (Bessel’s correction) to prevent systematically underestimating the true population spread.',
    },
    {
      question: 'Why does sample standard deviation use n - 1 instead of n?',
      answer:
        'Because the true population mean μ is unknown and replaced by the sample mean x̄, the sample observations cluster closer to x̄ than to μ. Dividing by n - 1 mathematically corrects this downward bias, producing an unbiased estimator of population variance.',
    },
    {
      question: 'What is the relationship between standard deviation and variance?',
      answer:
        'Variance is the average of squared deviations from the mean (measured in squared units). Standard deviation is the square root of variance, returning the dispersion measure back to the original units of your measurement.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SeoHead
        title="Standard Deviation Calculator — Sample (n-1) & Population (N)"
        description="Calculate sample and population standard deviation, variance, mean, and IQR from raw data. Includes step-by-step observation tables and APA report citations."
        path="/calculators/standard-deviation"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Calculators', path: '/calculators' },
          { name: 'Standard Deviation Calculator', path: '/calculators/standard-deviation' },
        ]}
        faqItems={faqItems}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumbs" className="mb-4 text-xs text-slate-500 flex items-center gap-1.5 no-print">
        <span>Calculators</span>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-medium">Standard Deviation</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Standard Deviation Calculator
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Compute sample (n − 1) and population (N) standard deviation, variance, and dispersion metrics from raw data with step-by-step arithmetic verification.
        </p>

        {/* Quick Example Presets */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs no-print">
          <span className="text-slate-500 font-medium">Quick datasets:</span>
          <button
            onClick={() => loadExample('small')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            5 Numbers [10, 12, 15, 18, 21]
          </button>
          <button
            onClick={() => loadExample('grades')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            Exam Scores (n=10)
          </button>
          <button
            onClick={() => loadExample('lab')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            Lab Measurements (cm)
          </button>
          <button
            onClick={() => loadExample('symmetric')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            Textbook Pop [2, 4, 4, 4, 5, 5, 7, 9]
          </button>
        </div>
      </div>

      {/* Main Calculator Box */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden mb-8">
        <div className="p-5 sm:p-7 border-b border-slate-200 bg-slate-50/50">
          {/* 1. Sample vs Population Selector */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              1. Calculation Mode (Sample vs. Population)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCalcType('sample')}
                className={`p-3.5 rounded-xl text-left border transition-all ${
                  calcType === 'sample'
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">Sample Standard Deviation (s)</span>
                  <span
                    className={`font-mono text-xs px-1.5 py-0.5 rounded ${
                      calcType === 'sample' ? 'bg-slate-800 text-sky-300' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    ÷ (n - 1)
                  </span>
                </div>
                <p
                  className={`text-xs mt-1.5 leading-relaxed ${
                    calcType === 'sample' ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  Standard for research experiments, samples, and surveys. Applies Bessel&apos;s correction to eliminate downward estimation bias.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setCalcType('population')}
                className={`p-3.5 rounded-xl text-left border transition-all ${
                  calcType === 'population'
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">Population Standard Deviation (σ)</span>
                  <span
                    className={`font-mono text-xs px-1.5 py-0.5 rounded ${
                      calcType === 'population' ? 'bg-slate-800 text-sky-300' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    ÷ N
                  </span>
                </div>
                <p
                  className={`text-xs mt-1.5 leading-relaxed ${
                    calcType === 'population' ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  Use only when you have recorded all members of the entire population (complete census), not an estimate.
                </p>
              </button>
            </div>
          </div>

          {/* 2. Raw Data Entry */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="raw-dataset-input"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
              >
                2. Enter Raw Observations
              </label>
              <span className="text-xs text-slate-500">
                Count: <strong className="font-mono text-slate-800">{parseResult.values.length}</strong> valid items
              </span>
            </div>
            <textarea
              id="raw-dataset-input"
              rows={4}
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="e.g. 10, 12, 15, 18, 21 or enter one number per line"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Accepts values separated by commas, spaces, tabs, or newlines.
            </span>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 no-print">
            <button
              onClick={() => setRawInput('')}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear data</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print view</span>
            </button>
          </div>
        </div>

        {/* Input Validation Error */}
        {validationError && (
          <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Input Error: </strong>
              {validationError}
            </div>
          </div>
        )}

        {/* Calculation Results */}
        {result && (
          <div className="p-5 sm:p-7 space-y-6">
            {/* Primary Headline Result */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  {calcType === 'sample' ? 'Sample Standard Deviation (s)' : 'Population Standard Deviation (σ)'}
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                    {result.standardDeviation.toFixed(4)}
                  </span>
                  <button
                    onClick={handleCopyNumeric}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors no-print"
                    title="Copy standard deviation"
                    aria-label="Copy standard deviation"
                  >
                    {copiedValue ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="mt-1.5 text-xs text-slate-500 font-mono">
                  Variance ({calcType === 'sample' ? 's²' : 'σ²'}): {result.variance.toFixed(4)}
                </div>
              </div>

              {/* Secondary Quick Metrics */}
              <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6 space-y-1">
                <div className="text-sm font-semibold text-slate-900 font-mono">
                  Mean ({calcType === 'sample' ? 'x̄' : 'μ'}) = {result.mean.toFixed(3)}
                </div>
                <div className="text-xs font-mono text-slate-600">
                  Standard Error (SE) = {result.standardError.toFixed(4)}
                </div>
                <div className="text-xs text-slate-500">
                  n = {result.count} observations · divisor: {calcType === 'sample' ? `n - 1 = ${result.count - 1}` : `N = ${result.count}`}
                </div>
              </div>
            </div>

            {/* Plain English Meaning */}
            <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed">
              <strong className="font-semibold text-slate-900 block mb-1">
                Plain English Interpretation:
              </strong>
              {result.interpretation}
            </div>

            {/* Progressive Disclosure: Secondary Statistics Summary */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-100/70 px-4 py-2 font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                Complete Descriptive Summary
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 bg-white">
                <div className="p-3">
                  <span className="text-slate-500 block text-[11px]">Count (n)</span>
                  <span className="font-mono font-medium text-slate-900">{result.count}</span>
                </div>
                <div className="p-3">
                  <span className="text-slate-500 block text-[11px]">Mean</span>
                  <span className="font-mono font-medium text-slate-900">{result.mean.toFixed(3)}</span>
                </div>
                <div className="p-3">
                  <span className="text-slate-500 block text-[11px]">Sum (Σx)</span>
                  <span className="font-mono font-medium text-slate-900">{result.sum.toFixed(2)}</span>
                </div>
                <div className="p-3">
                  <span className="text-slate-500 block text-[11px]">Sum of Squares (SS)</span>
                  <span className="font-mono font-medium text-slate-900">{result.sumSquaredDeviations.toFixed(3)}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 border-t border-slate-200 bg-white">
                <div className="p-3">
                  <span className="text-slate-500 block text-[11px]">Median</span>
                  <span className="font-mono font-medium text-slate-900">{result.median.toFixed(2)}</span>
                </div>
                <div className="p-3">
                  <span className="text-slate-500 block text-[11px]">Min / Max</span>
                  <span className="font-mono font-medium text-slate-900">{result.min} / {result.max}</span>
                </div>
                <div className="p-3">
                  <span className="text-slate-500 block text-[11px]">Range</span>
                  <span className="font-mono font-medium text-slate-900">{result.range.toFixed(2)}</span>
                </div>
                <div className="p-3">
                  <span className="text-slate-500 block text-[11px]">IQR (Q3 - Q1)</span>
                  <span className="font-mono font-medium text-slate-900">{result.iqr.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Interactive Data Distribution Strip Plot */}
            <DataDistributionChart
              observations={result.observations}
              mean={result.mean}
              sd={result.standardDeviation}
              median={result.median}
              min={result.min}
              max={result.max}
              type={calcType}
            />

            {/* Step-by-Step Observation Arithmetic Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
              <button
                onClick={() => setShowTable(!showTable)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                aria-expanded={showTable}
              >
                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-slate-500" />
                  <span className="font-semibold text-slate-900 text-sm">
                    Observation-by-Observation Calculation Table (SS Table)
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {showTable ? 'Hide calculation table' : 'Show full calculation table'}
                </span>
              </button>

              {showTable && (
                <div className="border-t border-slate-100 p-4">
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    Formula: Sum of squared deviations <code className="font-mono text-slate-900">SS = Σ(x - x̄)² = {result.sumSquaredDeviations.toFixed(4)}</code>. Then divided by <code className="font-mono text-slate-900">{calcType === 'sample' ? `n - 1 = ${result.count - 1}` : `N = ${result.count}`}</code> = <code className="font-mono text-slate-900">{result.variance.toFixed(4)}</code>, and square-rooted to yield <code className="font-mono text-slate-900">{result.standardDeviation.toFixed(4)}</code>.
                  </p>
                  <div className="max-h-72 overflow-y-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-100/90 text-slate-700 sticky top-0 border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">i</th>
                          <th className="p-2.5">Value (x)</th>
                          <th className="p-2.5">Deviation (x - x̄)</th>
                          <th className="p-2.5">Squared Dev (x - x̄)²</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {result.steps.map((row) => (
                          <tr key={row.index} className="hover:bg-slate-50/80">
                            <td className="p-2.5 text-slate-400 font-sans">{row.index}</td>
                            <td className="p-2.5 text-slate-900 font-semibold">{row.value}</td>
                            <td className="p-2.5 text-slate-600">{row.deviation.toFixed(3)}</td>
                            <td className="p-2.5 text-slate-900">{row.squaredDeviation.toFixed(4)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-slate-900">
                        <tr>
                          <td className="p-2.5 font-sans">Total</td>
                          <td className="p-2.5">Σx = {result.sum.toFixed(2)}</td>
                          <td className="p-2.5 text-slate-500">Σ = 0.000</td>
                          <td className="p-2.5 text-blue-700">SS = {result.sumSquaredDeviations.toFixed(4)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Assumptions & Common Mistakes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <div className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  Assumptions & Data Scale
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                  {result.assumptions.map((assump, i) => (
                    <li key={i} className="leading-relaxed">
                      {assump}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-amber-200 rounded-xl p-4 bg-amber-50/40">
                <div className="font-semibold text-amber-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Frequent Errors</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                  {result.commonMistakes.map((mistake, i) => (
                    <li key={i} className="leading-relaxed">
                      {mistake}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Learn & Verify Box */}
            <LearnVerifyBox
              learnNotes={{
                concept:
                  'Standard deviation quantifies the typical distance that individual observations scatter away from their sample mean.',
                intuition:
                  'Variance measures dispersion in squared units (like cm²), which is difficult to visualize. Taking the square root gives standard deviation, bringing the units back to the original measurement scale (like cm).',
                formulaBreakdown:
                  'Sample variance divides the sum of squared deviations by n - 1 (Bessel’s correction), while population variance divides by N.',
                commonTrap:
                  'Dividing by n on a sample dataset. Doing so creates downward bias and underestimates the true population dispersion.',
              }}
              manualCheckSteps={[
                'Compute the arithmetic mean: sum all observations and divide by count n.',
                'For each data point, subtract the mean: (x_i - x̄).',
                'Square each individual deviation: (x_i - x̄)².',
                'Sum all squared deviations to obtain SS.',
                'Divide SS by (n - 1) for sample variance, then take the square root for sample standard deviation s.',
              ]}
              classroomExampleTitle="Load Classroom Exam Scores (n=10)"
              onLoadExample={() => loadExample('grades')}
            />

            {/* Report-Ready Result */}
            <ReportBox
              apaString={result.apaReport}
              contextNote="Standard APA descriptive report format for sample or population dispersion."
            />

            {/* What should I do next? */}
            <NextStepCard options={nextSteps} />
          </div>
        )}
      </div>

      {/* Editorial Content */}
      <section className="border-t border-slate-200 pt-10 text-slate-800 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Why Sample Standard Deviation Uses Bessel&apos;s Correction (n − 1)
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            When estimating variability from a random sample, the sample mean (x̄) naturally lies closer to the sample data points than the true population mean (μ) does. If you were to divide the sum of squared deviations by n, the resulting variance estimate would systematically underestimate the true population variance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-2">
            <h3 className="font-semibold text-slate-900 text-base">
              The Sample Formula with Bessel&apos;s Correction
            </h3>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 font-mono text-xs text-slate-900 text-center">
              s = √[ (1 / (n - 1)) × Σ (x_i - x̄)² ]
            </div>
            <p className="text-slate-600 leading-relaxed">
              By reducing the denominator by 1 degree of freedom, Bessel&apos;s correction increases the quotient slightly, ensuring an mathematically unbiased estimate of population variance.
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-2">
            <h3 className="font-semibold text-slate-900 text-base">
              Standard Deviation vs. Standard Error (SE)
            </h3>
            <p className="text-slate-600 leading-relaxed">
              <strong>Standard Deviation (s):</strong> Quantifies how much individual data points vary from the mean within your sample.
            </p>
            <p className="text-slate-600 leading-relaxed">
              <strong>Standard Error (SE = s / √n):</strong> Quantifies the sampling precision of the sample mean itself across repeated samples from the population.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-8 border border-slate-200 rounded-xl bg-white p-5">
          <h3 className="font-semibold text-base text-slate-900 mb-4">
            Frequently Asked Questions
          </h3>
          <div className="divide-y divide-slate-100 space-y-3">
            {faqItems.map((item, i) => (
              <div key={i} className="pt-3">
                <h4 className="font-medium text-sm text-slate-900 mb-1">
                  {item.question}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
