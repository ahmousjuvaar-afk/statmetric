import { useState, useMemo } from 'react';
import { SeoHead } from '../components/SeoHead';
import { ToolIcon } from '../components/ToolIcon';
import { NextStepCard } from '../components/NextStepCard';
import { StepsExplanation } from '../components/StepsExplanation';
import { calculateSampleSizeTwoMeans, calculateSurveySampleSize } from '../lib/statistics/samplesize';

export function SampleSizePage() {
  const [mode, setMode] = useState<'means' | 'survey'>('means');

  // Means state
  const [effectSizeD, setEffectSizeD] = useState('0.5'); // medium effect
  const [alphaMeans, setAlphaMeans] = useState('0.05');
  const [powerMeans, setPowerMeans] = useState('0.80');

  // Survey state
  const [confidenceLevel, setConfidenceLevel] = useState('0.95');
  const [marginOfError, setMarginOfError] = useState('0.05');
  const [popProportion, setPopProportion] = useState('0.50');
  const [populationSize, setPopulationSize] = useState('');

  const meansResult = useMemo(() => {
    const d = parseFloat(effectSizeD);
    const a = parseFloat(alphaMeans);
    const p = parseFloat(powerMeans);
    if (isNaN(d) || isNaN(a) || isNaN(p)) return { error: 'Please enter valid parameters.' };
    try {
      const res = calculateSampleSizeTwoMeans(d, a, p);
      return { data: res, error: null };
    } catch (e: unknown) {
      return { error: e instanceof Error ? e.message : 'Invalid parameters.' };
    }
  }, [effectSizeD, alphaMeans, powerMeans]);

  const surveyResult = useMemo(() => {
    const c = parseFloat(confidenceLevel);
    const e = parseFloat(marginOfError);
    const p = parseFloat(popProportion);
    const pop = populationSize.trim() ? parseInt(populationSize, 10) : undefined;
    if (isNaN(c) || isNaN(e) || isNaN(p)) return { error: 'Please enter valid parameters.' };
    try {
      const res = calculateSurveySampleSize(c, e, p, pop);
      return { data: res, error: null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err.message : 'Invalid parameters.' };
    }
  }, [confidenceLevel, marginOfError, popProportion, populationSize]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <SeoHead
        title="Sample Size & Power Calculator - Research Studies & Surveys | StatMetric"
        description="Free statistical sample size calculator. Calculate minimum sample size for two-sample t-tests, power analysis (1 - β), and population surveys with margin of error."
        path="/calculators/sample-size"
        schemaType="WebApplication"
      />

      {/* Hero Header with ToolIcon */}
      <div className="mb-6 flex items-start gap-4">
        <ToolIcon toolId="sample-size" size="lg" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              Research & Inferential
            </span>
            <span className="text-xs text-slate-500">Power Analysis · Survey Sampling</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Sample Size & Power Calculator
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Determine the minimum sample size required to detect meaningful effect sizes with desired statistical power (1 − β) or achieve a target survey margin of error.
          </p>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-lg mb-6 w-fit">
        <button
          onClick={() => setMode('means')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            mode === 'means' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Two-Sample Means (T-Test)
        </button>
        <button
          onClick={() => setMode('survey')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            mode === 'survey' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Survey Proportion & Margin of Error
        </button>
      </div>

      {/* Mode 1: Means Sample Size */}
      {mode === 'means' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Effect Size (Cohen’s d)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={effectSizeD}
                  onChange={(e) => setEffectSizeD(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <span className="text-[10px] text-slate-600 mt-1 block">
                  Small: 0.2, Medium: 0.5, Large: 0.8
                </span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Significance Level (α)
                </label>
                <select
                  value={alphaMeans}
                  onChange={(e) => setAlphaMeans(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md"
                >
                  <option value="0.05">α = 0.05 (Standard)</option>
                  <option value="0.01">α = 0.01 (Strict)</option>
                  <option value="0.10">α = 0.10 (Exploratory)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Statistical Power (1 − β)
                </label>
                <select
                  value={powerMeans}
                  onChange={(e) => setPowerMeans(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md"
                >
                  <option value="0.80">0.80 (80% Standard)</option>
                  <option value="0.90">0.90 (90% High Power)</option>
                  <option value="0.95">0.95 (95% Very High Power)</option>
                </select>
              </div>
            </div>

            {meansResult.error ? (
              <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded p-2">
                {meansResult.error}
              </div>
            ) : meansResult.data ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-center">
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
                    Required Sample Size Per Group
                  </span>
                  <div className="text-3xl font-black text-emerald-950 mt-1 font-mono">
                    n = {meansResult.data.nPerGroup}
                  </div>
                  <span className="text-xs text-emerald-700 mt-1 block">
                    Participants per treatment arm
                  </span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">
                    Total Study Sample Size (N)
                  </span>
                  <div className="text-3xl font-black text-slate-900 mt-1 font-mono">
                    N = {meansResult.data.totalN}
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Total combined participants across both groups
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          <StepsExplanation
            title="Sample Size Formula for Two Independent Means"
            formula="n = \\frac{2(z_{\\alpha/2} + z_{\\beta})^2}{d^2}"
            steps={[
              {
                title: 'Critical Values',
                content: `At alpha = ${alphaMeans} (two-tailed), z_{alpha/2} = 1.96. At power = ${powerMeans}, z_beta is the standard normal quantile.`,
              },
              {
                title: 'Effect Size Sensitivity',
                content: 'Sample size is inversely proportional to the square of effect size (d^2). Halving the expected effect size quadruples the required sample size.',
              },
            ]}
          />
        </div>
      )}

      {/* Mode 2: Survey Sample Size */}
      {mode === 'survey' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confidence Level
                </label>
                <select
                  value={confidenceLevel}
                  onChange={(e) => setConfidenceLevel(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md"
                >
                  <option value="0.95">95% (Standard)</option>
                  <option value="0.99">99% (High Precision)</option>
                  <option value="0.90">90% (Exploratory)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Margin of Error (± %)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={marginOfError}
                  onChange={(e) => setMarginOfError(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <span className="text-[10px] text-slate-600 mt-1 block">e.g. 0.05 for ±5%</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expected Proportion (p)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={popProportion}
                  onChange={(e) => setPopProportion(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <span className="text-[10px] text-slate-600 mt-1 block">0.50 gives max conservative sample</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Population Size <span className="text-slate-600 font-normal">(Optional)</span>
                </label>
                <input
                  type="number"
                  value={populationSize}
                  onChange={(e) => setPopulationSize(e.target.value)}
                  placeholder="Infinite / Blank"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <span className="text-[10px] text-slate-600 mt-1 block">Finite population correction</span>
              </div>
            </div>

            {surveyResult.error ? (
              <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded p-2">
                {surveyResult.error}
              </div>
            ) : surveyResult.data ? (
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-center mt-3">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
                  Required Completed Survey Responses
                </span>
                <div className="text-3xl font-black text-emerald-950 mt-1 font-mono">
                  n = {surveyResult.data.requiredSample.toLocaleString()}
                </div>
                <span className="text-xs text-emerald-700 mt-1 block">
                  For {(surveyResult.data.confidenceLevel * 100).toFixed(0)}% confidence at ±{(surveyResult.data.marginOfError * 100).toFixed(1)}% margin of error
                </span>
              </div>
            ) : null}
          </div>

          <StepsExplanation
            title="Survey Sampling Formula"
            formula="n = \\frac{z^2 p (1 - p)}{E^2}"
            steps={[
              {
                title: "Cochran's Sample Size Formula",
                content: 'Calculates the necessary sample size for a large or infinite population assuming normal distribution approximation of sample proportions.',
              },
            ]}
          />
        </div>
      )}

      {/* Next Steps */}
      <div className="mt-8">
        <NextStepCard
          options={[
            {
              prompt: 'Run an independent t-test on gathered data?',
              toolName: 'Two-Sample T-Test Calculator',
              path: '/calculators/t-test',
              description: 'Welch robust t-test and Student t-test with Cohen’s d effect magnitude.',
            },
            {
              prompt: 'Construct confidence interval with margin of error?',
              toolName: 'Confidence Interval Calculator',
              path: '/calculators/confidence-interval',
              description: 'Interval estimates for population means and sample proportions.',
            },
            {
              prompt: 'Not sure which test to choose?',
              toolName: 'Statistical Test Selector',
              path: '/calculators/test-selector',
              description: 'Guided research wizard matching design variables to proper tests.',
            },
          ]}
        />
      </div>
    </div>
  );
}
