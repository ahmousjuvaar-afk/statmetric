import { useState, useMemo } from 'react';
import { SeoHead } from '../components/SeoHead';
import { ReportBox } from '../components/ReportBox';
import { StepsExplanation } from '../components/StepsExplanation';
import { NextStepCard, NextStepOption } from '../components/NextStepCard';
import { LearnVerifyBox } from '../components/LearnVerifyBox';
import { calculateTTest, TTestType, TTestTail } from '../lib/statistics/ttest';
import { CheckCircle2, AlertTriangle, RotateCcw, Printer, Copy, Check } from 'lucide-react';

export function TTestPage() {
  const [testType, setTestType] = useState<TTestType>('independent_welch');
  const [tail, setTail] = useState<TTestTail>('two_tailed');
  const [alpha, setAlpha] = useState<number>(0.05);

  const [m1Str, setM1Str] = useState<string>('');
  const [sd1Str, setSd1Str] = useState<string>('');
  const [n1Str, setN1Str] = useState<string>('');

  const [m2Str, setM2Str] = useState<string>('');
  const [sd2Str, setSd2Str] = useState<string>('');
  const [n2Str, setN2Str] = useState<string>('');

  const [copiedValue, setCopiedValue] = useState(false);

  const hasInputs =
    m1Str.trim() !== '' &&
    sd1Str.trim() !== '' &&
    n1Str.trim() !== '' &&
    m2Str.trim() !== '' &&
    sd2Str.trim() !== '' &&
    n2Str.trim() !== '';

  const m1 = parseFloat(m1Str);
  const sd1 = parseFloat(sd1Str);
  const n1 = parseFloat(n1Str);
  const m2 = parseFloat(m2Str);
  const sd2 = parseFloat(sd2Str);
  const n2 = parseFloat(n2Str);

  let inputError: string | null = null;
  if (hasInputs) {
    if (isNaN(m1) || isNaN(m2)) inputError = 'Enter valid mean values for both groups.';
    else if (isNaN(sd1) || isNaN(sd2) || sd1 <= 0 || sd2 <= 0)
      inputError = 'Standard deviations must be strictly greater than 0.';
    else if (isNaN(n1) || isNaN(n2) || n1 < 2 || n2 < 2)
      inputError = 'Sample sizes must each be at least 2 observations (n ≥ 2).';
  }

  const result = useMemo(() => {
    if (!hasInputs || inputError) return null;
    try {
      return calculateTTest({
        type: testType,
        tail,
        alpha,
        m1,
        sd1,
        n1,
        m2,
        sd2,
        n2,
      });
    } catch (err: unknown) {
      if (err instanceof Error) inputError = err.message;
      return null;
    }
  }, [hasInputs, testType, tail, alpha, m1, sd1, n1, m2, sd2, n2, inputError]);

  const loadExample = (ex: 'clinical' | 'education' | 'equal') => {
    if (ex === 'clinical') {
      setTestType('independent_welch');
      setM1Str('128.5');
      setSd1Str('14.2');
      setN1Str('30');
      setM2Str('136.2');
      setSd2Str('18.5');
      setN2Str('28');
      setTail('two_tailed');
    } else if (ex === 'education') {
      setTestType('independent_equal');
      setM1Str('84.0');
      setSd1Str('7.5');
      setN1Str('20');
      setM2Str('78.5');
      setSd2Str('7.2');
      setN2Str('20');
      setTail('two_tailed');
    } else if (ex === 'equal') {
      setTestType('independent_equal');
      setM1Str('10.0');
      setSd1Str('2.0');
      setN1Str('15');
      setM2Str('8.0');
      setSd2Str('2.0');
      setN2Str('15');
      setTail('two_tailed');
    }
  };

  const nextSteps: NextStepOption[] = [
    {
      prompt: 'Need to look up exact critical values and tail probabilities?',
      toolName: 'P-Value Calculator',
      path: '/calculators/p-value',
      description: 'Calculate p-values across Z, t, Chi-Square, and F distributions with shaded tail areas.',
      isAvailable: true,
    },
    {
      prompt: 'Need an interval estimate for the population difference?',
      toolName: 'Confidence Interval Calculator',
      path: '/calculators/confidence-interval',
      description: 'Compute 95% and 99% confidence intervals for means and proportions.',
      isAvailable: true,
    },
    {
      prompt: 'Need to model individual score distributions under a Gaussian bell curve?',
      toolName: 'Normal Distribution Calculator',
      path: '/calculators/normal-distribution',
      description: 'Interactive bell curve probability and percentile rank calculator.',
      isAvailable: true,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SeoHead
        title="Two-Sample T-Test Calculator — Independent & Welch's T-Test"
        description="Free online two-sample t-test calculator. Compare means between two independent groups using Student's or Welch's t-test with Cohen's d effect size and APA 7 report text."
        path="/calculators/t-test"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Calculators', path: '/calculators' },
          { name: 'T-Test Calculator', path: '/calculators/t-test' },
        ]}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumbs" className="mb-4 text-xs text-slate-500 flex items-center gap-1.5 no-print">
        <span>Research</span>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-medium">Two-Sample T-Test</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Two-Sample T-Test Calculator
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Test whether the difference between two group means is statistically significant. Features modern Welch&apos;s t-test for unequal variances, Cohen&apos;s d effect size, and APA 7th edition manuscript citations.
        </p>

        {/* Classroom Examples */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs no-print">
          <span className="text-slate-500 font-medium">Classroom examples:</span>
          <button
            onClick={() => loadExample('education')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            Teaching Methods A vs B (Equal σ)
          </button>
          <button
            onClick={() => loadExample('clinical')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            Clinical Trial (Welch Unequal σ)
          </button>
          <button
            onClick={() => loadExample('equal')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            Textbook Benchmark (df=28)
          </button>
        </div>
      </div>

      {/* Calculator Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden mb-8">
        <div className="p-5 sm:p-7 border-b border-slate-200 bg-slate-50/50">
          {/* Test Type Selector */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              1. T-Test Variant
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTestType('independent_welch')}
                className={`p-3 rounded-xl text-left border transition-all ${
                  testType === 'independent_welch'
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold text-sm">Welch&apos;s T-Test (Unequal Variances)</div>
                <div
                  className={`text-xs mt-1 leading-relaxed ${
                    testType === 'independent_welch' ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  Recommended modern standard. Robust against variance differences and unequal group sizes.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTestType('independent_equal')}
                className={`p-3 rounded-xl text-left border transition-all ${
                  testType === 'independent_equal'
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold text-sm">Student&apos;s T-Test (Equal Variances)</div>
                <div
                  className={`text-xs mt-1 leading-relaxed ${
                    testType === 'independent_equal' ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  Traditional pooled variance method. Assumes both populations share identical variance.
                </div>
              </button>
            </div>
          </div>

          {/* Group 1 & Group 2 Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-3">
                Group 1 (Treatment / Sample A)
              </span>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Sample Mean (x̄₁)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={m1Str}
                    onChange={(e) => setM1Str(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Standard Deviation (s₁)
                  </label>
                  <input
                    type="number"
                    min="0.0001"
                    step="any"
                    value={sd1Str}
                    onChange={(e) => setSd1Str(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Sample Size (n₁)
                  </label>
                  <input
                    type="number"
                    min="2"
                    step="1"
                    value={n1Str}
                    onChange={(e) => setN1Str(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-3">
                Group 2 (Control / Sample B)
              </span>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Sample Mean (x̄₂)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={m2Str}
                    onChange={(e) => setM2Str(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Standard Deviation (s₂)
                  </label>
                  <input
                    type="number"
                    min="0.0001"
                    step="any"
                    value={sd2Str}
                    onChange={(e) => setSd2Str(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Sample Size (n₂)
                  </label>
                  <input
                    type="number"
                    min="2"
                    step="1"
                    value={n2Str}
                    onChange={(e) => setN2Str(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Direction & Alpha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                2. Test Direction (Alternative Hypothesis)
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/60 rounded-lg">
                <button
                  type="button"
                  onClick={() => setTail('two_tailed')}
                  className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors ${
                    tail === 'two_tailed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Two-Tailed (μ₁ ≠ μ₂)
                </button>
                <button
                  type="button"
                  onClick={() => setTail('greater')}
                  className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors ${
                    tail === 'greater' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Right (μ₁ &gt; μ₂)
                </button>
                <button
                  type="button"
                  onClick={() => setTail('less')}
                  className={`py-1.5 px-2 text-xs font-medium rounded-md transition-colors ${
                    tail === 'less' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Left (μ₁ &lt; μ₂)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                3. Significance Threshold (α)
              </label>
              <div className="flex items-center gap-2">
                {[0.05, 0.01, 0.10].map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAlpha(a)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      alpha === a
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    α = {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Validation Error */}
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
              Enter sample means, standard deviations, and sizes for Group 1 and Group 2 above, or load a classroom example to calculate the t-statistic and p-value.
            </p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="p-5 sm:p-7 space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Test Statistic & P-Value
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                    t = {result.tStatistic.toFixed(3)}
                  </span>
                  <span className="text-lg font-mono text-slate-600">
                    p = {result.pValueFormatted}
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-500 font-mono">
                  Mean Difference: {(m1 - m2).toFixed(3)} · Degrees of freedom: {result.df.toFixed(1)}
                </div>
              </div>

              <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6 space-y-1">
                <div className="flex items-center sm:justify-end gap-1.5">
                  {result.isSignificant ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-bold text-emerald-700">
                        Statistically Significant
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-semibold text-slate-600">
                      Not Significant (p ≥ α)
                    </span>
                  )}
                </div>
                <div className="text-xs font-mono text-slate-700">
                  Cohen&apos;s d = {result.cohensD.toFixed(2)} ({result.effectSizeInterpretation})
                </div>
                <div className="text-[11px] text-slate-500">
                  95% CI Diff: [{result.ciLower.toFixed(2)}, {result.ciUpper.toFixed(2)}]
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed">
              <strong className="font-semibold text-blue-900 block mb-1">
                Formal Scientific Interpretation:
              </strong>
              {result.interpretation}
            </div>

            <StepsExplanation
              steps={result.steps}
              formula={result.formula}
              title="Mathematical Derivation & Step-by-Step Variance Pooling"
            />

            <LearnVerifyBox
              learnNotes={{
                concept:
                  'A two-sample t-test compares the observed difference between two group sample means against the standard error of that difference expected under random sampling.',
                intuition:
                  'Think of the t-statistic as a signal-to-noise ratio: the signal is the difference between group averages (x̄₁ - x̄₂), and the noise is the sampling uncertainty (SE).',
                formulaBreakdown:
                  't = (x̄₁ - x̄₂) / SE_diff. If |t| is large enough to exceed the critical t value for your degrees of freedom, the difference is unlikely to be due to chance.',
                commonTrap:
                  'Assuming equal variances when sample sizes are unbalanced. Always check Welch’s t-test or inspect group standard deviations.',
              }}
              manualCheckSteps={[
                'Calculate the mean difference: x̄₁ - x̄₂.',
                'Compute standard error: for Welch’s, SE = √[s₁²/n₁ + s₂²/n₂].',
                'Divide the mean difference by the standard error to obtain the t-statistic.',
                'Determine degrees of freedom and look up the p-value in a Student’s t distribution table.',
              ]}
            />

            <ReportBox
              apaString={result.apaReport}
              contextNote="Standard APA 7th Edition reporting format for experimental journal articles."
            />

            <NextStepCard options={nextSteps} />
          </div>
        )}
      </div>
    </div>
  );
}
