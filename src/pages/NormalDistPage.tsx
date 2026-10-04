import { useState, useMemo } from 'react';
import { SeoHead } from '../components/SeoHead';
import { NormalDistChart } from '../components/NormalDistChart';
import { ReportBox } from '../components/ReportBox';
import { StepsExplanation } from '../components/StepsExplanation';
import { NextStepCard, NextStepOption } from '../components/NextStepCard';
import { LearnVerifyBox } from '../components/LearnVerifyBox';
import {
  NormalDistMode,
  calculateNormalDist,
  NormalDistResult,
} from '../lib/statistics/normalDist';
import {
  AlertTriangle,
  RotateCcw,
  Printer,
  Copy,
  Check,
} from 'lucide-react';

export function NormalDistPage() {
  const [mode, setMode] = useState<NormalDistMode>('less_than');
  const [meanStr, setMeanStr] = useState<string>('100');
  const [sdStr, setSdStr] = useState<string>('15');
  const [xStr, setXStr] = useState<string>('115');
  const [lowerBoundStr, setLowerBoundStr] = useState<string>('85');
  const [upperBoundStr, setUpperBoundStr] = useState<string>('115');
  const [percentileStr, setPercentileStr] = useState<string>('95');
  const [copiedValue, setCopiedValue] = useState(false);

  // Numerical parsing
  const mean = parseFloat(meanStr);
  const sd = parseFloat(sdStr);
  const x = parseFloat(xStr);
  const lowerBound = parseFloat(lowerBoundStr);
  const upperBound = parseFloat(upperBoundStr);
  const percentile = parseFloat(percentileStr);

  // Validation
  let inputError: string | null = null;
  if (isNaN(mean)) {
    inputError = 'Mean (μ) must be a valid number.';
  } else if (isNaN(sd) || sd <= 0) {
    inputError = 'Standard deviation (σ) must be strictly greater than 0.';
  } else if ((mode === 'less_than' || mode === 'greater_than' || mode === 'find_z') && isNaN(x)) {
    inputError = 'Enter a valid raw x value.';
  } else if ((mode === 'between' || mode === 'outside') && (isNaN(lowerBound) || isNaN(upperBound))) {
    inputError = 'Both lower (a) and upper (b) bounds must be valid numbers.';
  } else if (mode === 'inverse_percentile' && (isNaN(percentile) || percentile <= 0 || percentile >= 100)) {
    inputError = 'Percentile must be between 0% and 100% exclusive (e.g. 95 or 50).';
  }

  // Calculate result
  const result: NormalDistResult | null = useMemo(() => {
    if (inputError) return null;
    try {
      return calculateNormalDist({
        mode,
        mean,
        sd,
        x,
        lowerBound,
        upperBound,
        percentile,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        inputError = err.message;
      }
      return null;
    }
  }, [mode, mean, sd, x, lowerBound, upperBound, percentile, inputError]);

  const loadPreset = (preset: 'iq' | 'height' | 'standard' | 'sat') => {
    if (preset === 'iq') {
      setMeanStr('100');
      setSdStr('15');
      setXStr('130');
      setMode('greater_than');
    } else if (preset === 'height') {
      setMeanStr('175');
      setSdStr('7');
      setLowerBoundStr('168');
      setUpperBoundStr('182');
      setMode('between');
    } else if (preset === 'standard') {
      setMeanStr('0');
      setSdStr('1');
      setXStr('1.96');
      setMode('less_than');
    } else if (preset === 'sat') {
      setMeanStr('1060');
      setSdStr('210');
      setPercentileStr('90');
      setMode('inverse_percentile');
    }
  };

  const handleCopyProb = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.probabilityPercent);
      setCopiedValue(true);
      setTimeout(() => setCopiedValue(false), 2000);
    } catch {}
  };

  const nextSteps: NextStepOption[] = [
    {
      prompt: 'Need to compute raw sample dispersion?',
      toolName: 'Standard Deviation',
      path: '/calculators/standard-deviation',
      description: 'Compute sample variance, standard deviation (n-1), and mean from raw observation data.',
      isAvailable: true,
    },
    {
      prompt: 'Need to test hypothesis significance?',
      toolName: 'P-Value Calculator',
      path: '/calculators/p-value',
      description: 'Calculate two-tailed or one-tailed p-values for Z, t, Chi-Square, and F test statistics.',
      isAvailable: true,
    },
    {
      prompt: 'Need to compare two groups?',
      toolName: 'Two-Sample T-Test',
      path: '/calculators',
      description: 'Determine whether the difference between two sample means is statistically significant.',
      isAvailable: false,
    },
  ];

  const faqItems = [
    {
      question: 'What is the 68-95-99.7 Empirical Rule?',
      answer:
        'For any normal Gaussian distribution, approximately 68.27% of observations fall within 1 standard deviation of the mean (μ ± 1σ), approximately 95.45% fall within 2 standard deviations (μ ± 2σ), and 99.73% fall within 3 standard deviations (μ ± 3σ).',
    },
    {
      question: 'How do you convert a raw score x into a standard z-score?',
      answer:
        'Subtract the distribution mean from the raw score and divide by the standard deviation: z = (x - μ) / σ. A positive z-score means the value is above the mean; a negative z-score means it is below the mean.',
    },
    {
      question: 'What is the reverse percentile calculation?',
      answer:
        'Reverse calculation takes a known cumulative percentile (e.g. 95th percentile) and computes the exact raw value x that marks that cutoff: x = μ + z_critical × σ. For instance, the 95th percentile is always at z ≈ 1.645.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SeoHead
        title="Normal Distribution Calculator — Bell Curve & Probability"
        description="Compute normal distribution probabilities, z-scores, percentiles, and inverse values. Features an interactive Gaussian bell curve with shaded regions and APA report text."
        path="/calculators/normal-distribution"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Calculators', path: '/calculators' },
          { name: 'Normal Distribution Calculator', path: '/calculators/normal-distribution' },
        ]}
        faqItems={faqItems}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumbs" className="mb-4 text-xs text-slate-500 flex items-center gap-1.5 no-print">
        <span>Calculators</span>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-medium">Normal Distribution</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Normal Distribution Calculator
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Calculate cumulative probabilities, tail intervals, and reverse percentiles under any Gaussian normal distribution. Includes real-time bell curve shading and standardized Z-score conversions.
        </p>

        {/* Example Presets */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs no-print">
          <span className="text-slate-500 font-medium">Quick presets:</span>
          <button
            onClick={() => loadPreset('standard')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            Standard Normal (μ=0, σ=1, z=1.96)
          </button>
          <button
            onClick={() => loadPreset('iq')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            IQ Distribution (μ=100, σ=15, Top scores)
          </button>
          <button
            onClick={() => loadPreset('height')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            Adult Heights (Between 168cm & 182cm)
          </button>
          <button
            onClick={() => loadPreset('sat')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            Find 90th Percentile Score (SAT)
          </button>
        </div>
      </div>

      {/* Main Calculator Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden mb-8">
        <div className="p-5 sm:p-7 border-b border-slate-200 bg-slate-50/50">
          {/* 1. Mode Selection */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              1. Calculation Mode
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'less_than', label: 'P(X ≤ x)', desc: 'Left tail / Cumulative' },
                { id: 'greater_than', label: 'P(X ≥ x)', desc: 'Right tail / Exceedance' },
                { id: 'between', label: 'P(a ≤ X ≤ b)', desc: 'Between two bounds' },
                { id: 'outside', label: 'P(X < a or X > b)', desc: 'Outside two bounds' },
                { id: 'inverse_percentile', label: 'Find x from Percentile', desc: 'Reverse calculation (e.g. 95th)' },
                { id: 'find_z', label: 'Find Z-Score', desc: 'Standardize raw value x' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as NormalDistMode)}
                  className={`p-3 rounded-lg text-left border transition-all ${
                    mode === m.id
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="font-semibold text-sm">{m.label}</div>
                  <div
                    className={`text-[11px] mt-0.5 ${
                      mode === m.id ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {m.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Population Parameters: Mean and SD */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label
                htmlFor="mean-input"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Mean (μ)
              </label>
              <input
                id="mean-input"
                type="number"
                step="any"
                value={meanStr}
                onChange={(e) => setMeanStr(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="e.g. 0 or 100"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Center of the bell curve
              </span>
            </div>

            <div>
              <label
                htmlFor="sd-input"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Standard Deviation (σ)
              </label>
              <input
                id="sd-input"
                type="number"
                min="0.0001"
                step="any"
                value={sdStr}
                onChange={(e) => setSdStr(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="e.g. 1 or 15"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Must be strictly positive (&gt; 0)
              </span>
            </div>
          </div>

          {/* 3. Dynamic Cutoff Inputs depending on mode */}
          <div className="pt-4 border-t border-slate-200">
            {(mode === 'less_than' || mode === 'greater_than' || mode === 'find_z') && (
              <div className="max-w-xs">
                <label
                  htmlFor="raw-x-input"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Raw Value (x)
                </label>
                <input
                  id="raw-x-input"
                  type="number"
                  step="any"
                  value={xStr}
                  onChange={(e) => setXStr(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="e.g. 115"
                />
              </div>
            )}

            {(mode === 'between' || mode === 'outside') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="lower-bound-input"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Lower Bound (a)
                  </label>
                  <input
                    id="lower-bound-input"
                    type="number"
                    step="any"
                    value={lowerBoundStr}
                    onChange={(e) => setLowerBoundStr(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="e.g. 85"
                  />
                </div>
                <div>
                  <label
                    htmlFor="upper-bound-input"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Upper Bound (b)
                  </label>
                  <input
                    id="upper-bound-input"
                    type="number"
                    step="any"
                    value={upperBoundStr}
                    onChange={(e) => setUpperBoundStr(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="e.g. 115"
                  />
                </div>
              </div>
            )}

            {mode === 'inverse_percentile' && (
              <div className="max-w-xs">
                <label
                  htmlFor="percentile-input"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Desired Percentile (%)
                </label>
                <div className="relative">
                  <input
                    id="percentile-input"
                    type="number"
                    min="0.01"
                    max="99.99"
                    step="any"
                    value={percentileStr}
                    onChange={(e) => setPercentileStr(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 pr-8"
                    placeholder="e.g. 95"
                  />
                  <span className="absolute right-3 top-2.5 text-sm text-slate-400 font-medium">
                    %
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Finds raw value x below which {percentileStr || 95}% of data lies
                </span>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-200/80 no-print">
            <button
              onClick={() => {
                setMeanStr('0');
                setSdStr('1');
                setXStr('1.0');
                setMode('less_than');
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to standard normal</span>
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

        {/* Input Error Message */}
        {inputError && (
          <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Input error: </strong>
              {inputError}
            </div>
          </div>
        )}

        {/* Calculation Result */}
        {result && (
          <div className="p-5 sm:p-7 space-y-6">
            {/* Primary Result Headline */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  {mode === 'inverse_percentile' ? 'Calculated Raw Value (x)' : 'Calculated Probability'}
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                    {mode === 'inverse_percentile'
                      ? `x = ${result.xCalculated?.toFixed(3)}`
                      : result.probabilityPercent}
                  </span>
                  <button
                    onClick={handleCopyProb}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors no-print"
                    title="Copy probability"
                    aria-label="Copy probability"
                  >
                    {copiedValue ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="mt-1.5 text-xs text-slate-500 font-mono">
                  {mode === 'inverse_percentile'
                    ? `Z-Score: z = ${result.zScore?.toFixed(4)}`
                    : `Decimal probability: ${result.probability.toFixed(6)}`}
                </div>
              </div>

              {/* Secondary Metric Highlights */}
              <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6 space-y-1">
                {result.zScore !== undefined && (
                  <div className="text-sm font-semibold text-slate-900 font-mono">
                    z = {result.zScore.toFixed(3)}
                  </div>
                )}
                {result.zScoreLower !== undefined && result.zScoreUpper !== undefined && (
                  <div className="text-xs font-mono text-slate-700">
                    z₁ = {result.zScoreLower.toFixed(2)}, z₂ = {result.zScoreUpper.toFixed(2)}
                  </div>
                )}
                <div className="text-xs text-slate-500">
                  Parameters: μ = {mean}, σ = {sd}
                </div>
              </div>
            </div>

            {/* Plain English Meaning */}
            <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed">
              <strong className="font-semibold text-sky-900 block mb-1">
                Interpretation:
              </strong>
              {result.interpretation}
            </div>

            {/* Interactive Bell Curve SVG */}
            <NormalDistChart
              mode={mode}
              mean={mean}
              sd={sd}
              probabilityPercent={result.probabilityPercent}
              points={result.curvePoints}
              domainMin={result.domainMin}
              domainMax={result.domainMax}
              xVal={x}
              lowerBound={lowerBound}
              upperBound={upperBound}
              xCalculated={result.xCalculated}
            />

            {/* Step-by-Step Breakdown */}
            <StepsExplanation
              steps={result.steps}
              title="Mathematical Derivation & Z-Transformation Steps"
            />

            {/* Assumptions & Common Mistakes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <div className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  Distribution Assumptions
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
                  <span>Common Misconceptions</span>
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
                  'The Gaussian Normal Distribution is completely characterized by two parameters: its central location (mean μ) and its scale or spread (standard deviation σ).',
                intuition:
                  'Under the bell curve, probabilities correspond to areas under the curve. The total area equals 1.0 (or 100%). Approximately 68% of area lies within ±1σ of the center, and 95% lies within ±2σ.',
                formulaBreakdown:
                  'To find probabilities for any normal curve, convert the value to standard normal units: z = (x - μ) / σ, then evaluate the cumulative integral Φ(z).',
                commonTrap:
                  'Confusing probability density f(x) with cumulative probability P(X ≤ x). For any continuous distribution, the probability of an exact single point is 0; probabilities only exist over intervals.',
              }}
              manualCheckSteps={[
                'Standardize your value to a z-score: z = (x - μ) / σ.',
                'Look up z in a standard normal distribution table to find Φ(z).',
                'If calculating P(X ≥ x), subtract from 1: 1 - Φ(z).',
                'If calculating between two values, find Φ(z₂) - Φ(z₁).',
              ]}
              classroomExampleTitle="Load Classroom IQ Example (μ=100, σ=15, x=130)"
              onLoadExample={() => loadPreset('iq')}
            />

            {/* Report-Ready Result */}
            <ReportBox
              apaString={result.apaReport}
              contextNote="Standardized statistical notation for distribution intervals and percentile ranks."
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
            The Mathematics of the Gaussian Normal Distribution
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            The normal distribution (often termed the Gaussian distribution or bell curve) is continuous and symmetrical about its mean. Under the Central Limit Theorem, the sum of independent random variables tends toward a normal distribution, making it foundational across natural and social sciences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-2">
            <h3 className="font-semibold text-slate-900 text-base">
              The Standard Normal (Z) Transformation
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Any general normal variable X ~ N(μ, σ²) can be transformed into the standard normal distribution Z ~ N(0, 1) using the formula:
            </p>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 font-mono text-xs text-slate-900 text-center">
              Z = (X - μ) / σ
            </div>
            <p className="text-slate-600 leading-relaxed">
              This converts raw units (such as grams, test scores, or milliseconds) into units of standard deviation distance from the mean.
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-2">
            <h3 className="font-semibold text-slate-900 text-base">
              The 68–95–99.7 Empirical Rule
            </h3>
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside leading-relaxed">
              <li><strong>68.27%</strong> of data falls within 1 standard deviation [μ - σ, μ + σ].</li>
              <li><strong>95.45%</strong> of data falls within 2 standard deviations [μ - 2σ, μ + 2σ].</li>
              <li><strong>99.73%</strong> of data falls within 3 standard deviations [μ - 3σ, μ + 3σ].</li>
              <li>Only ~0.27% of values fall beyond 3 standard deviations in either extreme tail.</li>
            </ul>
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
