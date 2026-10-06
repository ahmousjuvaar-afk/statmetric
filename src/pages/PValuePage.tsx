import { useState, useMemo } from 'react';
import { SeoHead } from '../components/SeoHead';
import { PValueChart } from '../components/PValueChart';
import { ReportBox } from '../components/ReportBox';
import { StepsExplanation } from '../components/StepsExplanation';
import { NextStepCard, NextStepOption } from '../components/NextStepCard';
import { LearnVerifyBox } from '../components/LearnVerifyBox';
import { ToolIcon } from '../components/ToolIcon';
import {
  DistributionType,
  TailType,
  calculatePValue,
  PValueResult,
} from '../lib/statistics/pvalue';
import {
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Printer,
  Copy,
  Check,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export function PValuePage() {
  const [distribution, setDistribution] = useState<DistributionType>('t');
  const [statisticStr, setStatisticStr] = useState<string>('2.14');
  const [dfStr, setDfStr] = useState<string>('28');
  const [df2Str, setDf2Str] = useState<string>('30');
  const [tail, setTail] = useState<TailType>('two_tailed');
  const [alphaMode, setAlphaMode] = useState<'0.10' | '0.05' | '0.01' | 'custom'>('0.05');
  const [customAlphaStr, setCustomAlphaStr] = useState<string>('0.05');
  const [copiedValue, setCopiedValue] = useState(false);

  // Parse numerical values
  const statistic = parseFloat(statisticStr);
  const df = parseFloat(dfStr);
  const df2 = parseFloat(df2Str);
  const alpha = alphaMode === 'custom' ? parseFloat(customAlphaStr) || 0.05 : parseFloat(alphaMode);

  // Validation
  let inputError: string | null = null;
  if (isNaN(statistic)) {
    inputError = 'Enter a valid test statistic number.';
  } else if ((distribution === 'chisquare' || distribution === 'f') && statistic < 0) {
    inputError = `${distribution === 'chisquare' ? 'Chi-Square (χ²)' : 'F'} test statistic must be non-negative (≥ 0).`;
  } else if ((distribution === 't' || distribution === 'chisquare' || distribution === 'f') && (isNaN(df) || df <= 0)) {
    inputError = 'Degrees of freedom (df) must be a positive number greater than 0.';
  } else if (distribution === 'f' && (isNaN(df2) || df2 <= 0)) {
    inputError = 'Denominator degrees of freedom (df₂) must be a positive number greater than 0.';
  } else if (alpha <= 0 || alpha >= 1 || isNaN(alpha)) {
    inputError = 'Significance level (α) must be between 0 and 1 (typically 0.05).';
  }

  // Calculate result if valid
  const result: PValueResult | null = useMemo(() => {
    if (inputError) return null;
    try {
      return calculatePValue({
        distribution,
        statistic,
        df: distribution !== 'z' ? df : undefined,
        df2: distribution === 'f' ? df2 : undefined,
        tail,
        alpha,
      });
    } catch {
      return null;
    }
  }, [distribution, statistic, df, df2, tail, alpha, inputError]);

  const loadExample = (type: 'z' | 't' | 'chisquare' | 'f') => {
    setDistribution(type);
    if (type === 'z') {
      setStatisticStr('1.96');
      setTail('two_tailed');
    } else if (type === 't') {
      setStatisticStr('2.14');
      setDfStr('28');
      setTail('two_tailed');
    } else if (type === 'chisquare') {
      setStatisticStr('7.82');
      setDfStr('3');
      setTail('right_tailed');
    } else if (type === 'f') {
      setStatisticStr('3.45');
      setDfStr('2');
      setDf2Str('27');
      setTail('right_tailed');
    }
  };

  const resetDefaults = () => {
    setDistribution('t');
    setStatisticStr('2.00');
    setDfStr('20');
    setTail('two_tailed');
    setAlphaMode('0.05');
  };

  const handleCopyNumeric = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.pValueFormatted);
      setCopiedValue(true);
      setTimeout(() => setCopiedValue(false), 2000);
    } catch {}
  };

  const nextSteps: NextStepOption[] = [
    {
      prompt: 'Need to compare two group means?',
      toolName: 'Two-Sample T-Test',
      path: '/calculators/t-test',
      description: 'Compute t-statistic from raw experimental groups or sample summary statistics.',
      isAvailable: true,
    },
    {
      prompt: 'Need an interval estimate for your mean?',
      toolName: 'Confidence Interval',
      path: '/calculators/confidence-interval',
      description: 'Estimate the plausible range for the true population parameter at 95% confidence.',
      isAvailable: true,
    },
    {
      prompt: 'Need to examine normal probabilities?',
      toolName: 'Normal Distribution',
      path: '/calculators/normal-distribution',
      description: 'Find probabilities, percentiles, and shaded areas under the standard bell curve.',
      isAvailable: true,
    },
  ];

  const faqItems = [
    {
      question: 'What is a p-value in statistics?',
      answer:
        'A p-value is the probability of obtaining test results at least as extreme as the observed results, assuming that the null hypothesis is completely true. It quantifies how compatible your sample data is with the null hypothesis.',
    },
    {
      question: 'Does p < 0.05 mean the null hypothesis has a 5% chance of being true?',
      answer:
        'No. This is the most common misconception in statistics. The p-value does not calculate the probability that a hypothesis is true or false. In frequentist statistics, hypotheses are not assigned probabilities; rather, the data has a probability given a specific hypothesis.',
    },
    {
      question: 'When should I use a two-tailed vs. one-tailed test?',
      answer:
        'Use a two-tailed test unless you had a strong, pre-registered directional hypothesis before collecting data. Two-tailed tests evaluate differences in either direction and protect against inflated false-positive (Type I) error rates.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SeoHead
        title="P-Value Calculator — Z, t, Chi-Square & F Distributions"
        description="Calculate exact p-values for Z, Student's t, Chi-Square, and F tests. Includes dynamic tail visualizations, APA 7th edition report text, and step-by-step math."
        path="/calculators/p-value"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Calculators', path: '/calculators' },
          { name: 'P-Value Calculator', path: '/calculators/p-value' },
        ]}
        faqItems={faqItems}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumbs" className="mb-4 text-xs text-slate-500 flex items-center gap-1.5 no-print">
        <span>Calculators</span>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-medium">P-Value Calculator</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8 flex items-start gap-4">
        <ToolIcon toolId="p-value" size="lg" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-1">
            P-Value Calculator
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            Compute accurate p-values across standard normal (Z), Student&apos;s t, Chi-Square (χ²), and Snedecor&apos;s F distributions. Includes shaded rejection regions and report-ready interpretations.
          </p>
        </div>
      </div>

        {/* Quick Example Presets */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs no-print">
          <span className="text-slate-500 font-medium">Quick examples:</span>
          <button
            onClick={() => loadExample('t')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            Two-sample t-test (t=2.14, df=28)
          </button>
          <button
            onClick={() => loadExample('z')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            Normal Z-test (z=1.96)
          </button>
          <button
            onClick={() => loadExample('chisquare')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            Chi-Square (χ²=7.82, df=3)
          </button>
          <button
            onClick={() => loadExample('f')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            ANOVA F-test (F=3.45)
          </button>
        </div>

      {/* Calculator Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden mb-8">
        <div className="p-5 sm:p-7 border-b border-slate-200 bg-slate-50/50">
          {/* 1. Distribution Selector */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              1. Statistical Distribution / Test
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 't', label: "Student's t", sub: 'Means with unknown σ' },
                { id: 'z', label: 'Standard Normal (Z)', sub: 'Known σ or large sample' },
                { id: 'chisquare', label: 'Chi-Square (χ²)', sub: 'Independence & goodness' },
                { id: 'f', label: "Snedecor's F", sub: 'ANOVA & variance ratios' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setDistribution(item.id as DistributionType)}
                  className={`p-3 rounded-lg text-left border transition-all ${
                    distribution === item.id
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="font-semibold text-sm">{item.label}</div>
                  <div
                    className={`text-[11px] mt-0.5 ${
                      distribution === item.id ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {item.sub}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Numeric Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label
                htmlFor="test-statistic-input"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Test Statistic ({distribution === 'z' ? 'Z' : distribution === 't' ? 't' : distribution === 'chisquare' ? 'χ²' : 'F'})
              </label>
              <input
                id="test-statistic-input"
                type="number"
                step="any"
                value={statisticStr}
                onChange={(e) => setStatisticStr(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="e.g. 2.14"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                {distribution === 'chisquare' || distribution === 'f'
                  ? 'Must be ≥ 0'
                  : 'Positive or negative value'}
              </span>
            </div>

            {distribution !== 'z' && (
              <div>
                <label
                  htmlFor="df-input"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  {distribution === 'f' ? 'Numerator Degrees of Freedom (df₁)' : 'Degrees of Freedom (df)'}
                </label>
                <input
                  id="df-input"
                  type="number"
                  min="0.1"
                  step="any"
                  value={dfStr}
                  onChange={(e) => setDfStr(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="e.g. 28"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {distribution === 't' ? 'e.g. n - 1 for one sample' : 'k - 1 parameters'}
                </span>
              </div>
            )}

            {distribution === 'f' && (
              <div>
                <label
                  htmlFor="df2-input"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Denominator Degrees of Freedom (df₂)
                </label>
                <input
                  id="df2-input"
                  type="number"
                  min="0.1"
                  step="any"
                  value={df2Str}
                  onChange={(e) => setDf2Str(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="e.g. 30"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Error or within-group df
                </span>
              </div>
            )}
          </div>

          {/* 3. Tail & Alpha Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
            {/* Tail Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                2. Test Direction (Tail)
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/60 rounded-lg">
                <button
                  type="button"
                  onClick={() => setTail('two_tailed')}
                  className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors ${
                    tail === 'two_tailed'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Two-Tailed (≠)
                </button>
                <button
                  type="button"
                  onClick={() => setTail('right_tailed')}
                  className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors ${
                    tail === 'right_tailed'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Right-Tailed (&gt;)
                </button>
                <button
                  type="button"
                  onClick={() => setTail('left_tailed')}
                  className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors ${
                    tail === 'left_tailed'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Left-Tailed (&lt;)
                </button>
              </div>
            </div>

            {/* Significance Level (Alpha) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                3. Significance Threshold (α)
              </label>
              <div className="flex items-center gap-2">
                {(['0.05', '0.01', '0.10'] as const).map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAlphaMode(a)}
                    className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg border transition-colors ${
                      alphaMode === a
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    α = {a}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setAlphaMode('custom')}
                  className={`py-1.5 px-2.5 text-xs font-medium rounded-lg border transition-colors ${
                    alphaMode === 'custom'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Custom
                </button>
                {alphaMode === 'custom' && (
                  <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    max="0.999"
                    value={customAlphaStr}
                    onChange={(e) => setCustomAlphaStr(e.target.value)}
                    className="w-20 px-2 py-1 text-xs border border-slate-300 rounded-md focus:outline-none"
                    placeholder="0.05"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Reset / Actions */}
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-200/80 no-print">
            <button
              onClick={resetDefaults}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset fields</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print result</span>
            </button>
          </div>
        </div>

        {/* Validation Error Banner */}
        {inputError && (
          <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Input error: </strong>
              {inputError}
            </div>
          </div>
        )}

        {/* Calculation Result Display */}
        {result && (
          <div className="p-5 sm:p-7 space-y-6">
            {/* Primary Result Headline */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Calculated P-Value
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                    p = {result.pValueFormatted}
                  </span>
                  <button
                    onClick={handleCopyNumeric}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors no-print"
                    title="Copy numeric p-value"
                    aria-label="Copy numeric p-value"
                  >
                    {copiedValue ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="mt-1.5 text-xs text-slate-500 font-mono">
                  Exact floating-point: {result.pValue.toExponential(4)}
                </div>
              </div>

              {/* Significance Status Badge (Unboxed text with status dot) */}
              <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6">
                <div className="flex items-center sm:justify-end gap-1.5">
                  {result.isSignificant ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-bold text-emerald-700">
                        Statistically Significant
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                      <span className="text-sm font-semibold text-slate-600">
                        Not Significant
                      </span>
                    </>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Threshold: α = {alpha} ({result.isSignificant ? 'p < α' : 'p ≥ α'})
                </div>
              </div>
            </div>

            {/* Plain English Interpretation */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed">
              <strong className="font-semibold text-blue-900 block mb-1">
                Statistical Interpretation:
              </strong>
              {result.interpretation}
            </div>

            {/* Interactive SVG Bell/Distribution Curve */}
            <PValueChart
              distribution={distribution}
              statistic={statistic}
              tail={tail}
              df={df}
              df2={df2}
              points={result.curvePoints}
            />

            {/* Calculation Metadata Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-100/70 px-4 py-2 font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                Calculation Parameters
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 bg-white">
                <div className="p-3">
                  <span className="text-slate-500 block text-[11px]">Distribution</span>
                  <span className="font-medium text-slate-900">{result.distributionName}</span>
                </div>
                <div className="p-3">
                  <span className="text-slate-500 block text-[11px]">Test Statistic</span>
                  <span className="font-mono font-medium text-slate-900">{statistic.toFixed(4)}</span>
                </div>
                <div className="p-3">
                  <span className="text-slate-500 block text-[11px]">Degrees of Freedom</span>
                  <span className="font-mono font-medium text-slate-900">
                    {distribution === 'z' ? 'N/A' : distribution === 'f' ? `${df}, ${df2}` : df}
                  </span>
                </div>
                <div className="p-3">
                  <span className="text-slate-500 block text-[11px]">Directionality</span>
                  <span className="font-medium text-slate-900 capitalize">{tail.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            {/* Progressive Disclosure: How was this calculated? */}
            <StepsExplanation
              steps={result.steps}
              formula={result.formula}
              title={`Step-by-Step Calculation Trace (${result.distributionName})`}
            />

            {/* Key Assumptions & Common Pitfalls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <div className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span>Underlying Assumptions</span>
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
                  <span>Common Pitfalls to Avoid</span>
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
                  'A p-value is the probability of observing sample data at least as extreme as your test statistic, given that the null hypothesis (H₀) is true.',
                intuition:
                  'Imagine flipping a coin 10 times and getting 10 heads. The p-value tells you how rare that result would be if the coin were fair (H₀). It does NOT tell you the probability the coin is fair.',
                formulaBreakdown:
                  'p = P(Test Statistic ≥ Observed | H₀). For two-tailed tests, tail area is doubled: 2 × [1 - CDF(|stat|)].',
                commonTrap:
                  'Never claim: "There is a 3.2% chance the null hypothesis is true." In frequentist statistics, hypotheses are fixed truths, not random variables.',
              }}
              manualCheckSteps={[
                'Look up your test statistic on the horizontal axis of a standard statistical distribution table (Z, t, χ², or F).',
                'If doing a two-tailed test, double the single-tail probability.',
                'Compare the resulting p-value against your pre-selected significance alpha (e.g. α = 0.05).',
                'If p < α, reject H₀; otherwise, fail to reject H₀.',
              ]}
              classroomExampleTitle="Load Classroom t-Test (t=2.14, df=28)"
              onLoadExample={() => loadExample('t')}
            />

            {/* Report-Ready Result (APA 7) */}
            <ReportBox
              apaString={result.apaReport}
              contextNote="Ready to paste into manuscript results sections or experimental lab reports."
            />

            {/* What should I do next? */}
            <NextStepCard options={nextSteps} />
          </div>
        )}
      </div>

      {/* Editorial & Educational Section for High SEO Authority */}
      <section className="border-t border-slate-200 pt-10 text-slate-800 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Understanding the P-Value in Hypothesis Testing
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            In statistical hypothesis testing, the p-value measures the strength of evidence against the null hypothesis (H₀). The null hypothesis typically represents the default assumption of no effect, no difference, or no association between variables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-2">
            <h3 className="font-semibold text-slate-900 text-base">
              The Formal Mathematical Definition
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Formally, if T is the test statistic and t is the observed value computed from sample data, the p-value for a right-tailed test is defined as:
            </p>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 font-mono text-xs text-slate-900 text-center">
              p = P(T ≥ t | H₀ is true)
            </div>
            <p className="text-slate-600 leading-relaxed">
              It is a conditional probability: the probability of your observed data (or more extreme) conditioned on the premise that H₀ holds true in the population.
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-2">
            <h3 className="font-semibold text-slate-900 text-base">
              Choosing the Correct Distribution
            </h3>
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside leading-relaxed">
              <li><strong>Z-Distribution:</strong> When population variance σ² is known or sample size n ≥ 30 with known parameters.</li>
              <li><strong>Student&apos;s t-Distribution:</strong> When population σ is estimated from the sample standard deviation s. Used in independent and paired t-tests.</li>
              <li><strong>Chi-Square Distribution:</strong> For tests of independence in contingency tables or goodness-of-fit with categorical counts.</li>
              <li><strong>F-Distribution:</strong> For comparisons of variances across groups in ANOVA (Analysis of Variance) and linear regression models.</li>
            </ul>
          </div>
        </div>

        {/* FAQ Accordion Section */}
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
