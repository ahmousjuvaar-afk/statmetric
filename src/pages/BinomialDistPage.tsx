import { useState, useMemo } from 'react';
import { SeoHead } from '../components/SeoHead';
import { ToolIcon } from '../components/ToolIcon';
import { NextStepCard } from '../components/NextStepCard';
import { StepsExplanation } from '../components/StepsExplanation';
import { calculateBinomial, calculatePoisson, calculateBayes } from '../lib/statistics/binomial';

export function BinomialDistPage() {
  const [probType, setProbType] = useState<'binomial' | 'poisson' | 'bayes'>('binomial');

  // Binomial state
  const [trialsN, setTrialsN] = useState('10');
  const [probP, setProbP] = useState('0.5');
  const [successesK, setSuccessesK] = useState('5');

  // Poisson state
  const [lambda, setLambda] = useState('4');
  const [poissonK, setPoissonK] = useState('4');

  // Bayes state
  const [priorA, setPriorA] = useState('0.01');
  const [probBGivenA, setProbBGivenA] = useState('0.95');
  const [probBGivenNotA, setProbBGivenNotA] = useState('0.05');

  const binomialResult = useMemo(() => {
    const n = parseInt(trialsN, 10);
    const p = parseFloat(probP);
    const k = parseInt(successesK, 10);
    if (isNaN(n) || isNaN(p) || isNaN(k)) return { error: 'Please enter valid numbers.' };
    try {
      const res = calculateBinomial(n, p, k);
      return { data: res, error: null };
    } catch (e: unknown) {
      return { error: e instanceof Error ? e.message : 'Invalid parameters.' };
    }
  }, [trialsN, probP, successesK]);

  const poissonResult = useMemo(() => {
    const l = parseFloat(lambda);
    const k = parseInt(poissonK, 10);
    if (isNaN(l) || isNaN(k)) return { error: 'Please enter valid numbers.' };
    try {
      const res = calculatePoisson(l, k);
      return { data: res, error: null };
    } catch (e: unknown) {
      return { error: e instanceof Error ? e.message : 'Invalid parameters.' };
    }
  }, [lambda, poissonK]);

  const bayesResult = useMemo(() => {
    const pA = parseFloat(priorA);
    const pBA = parseFloat(probBGivenA);
    const pBNotA = parseFloat(probBGivenNotA);
    if (isNaN(pA) || isNaN(pBA) || isNaN(pBNotA)) return { error: 'Please enter valid numbers.' };
    try {
      const res = calculateBayes(pA, pBA, pBNotA);
      return { data: res, error: null };
    } catch (e: unknown) {
      return { error: e instanceof Error ? e.message : 'Invalid parameters.' };
    }
  }, [priorA, probBGivenA, probBGivenNotA]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <SeoHead
        title="Binomial & Discrete Probability Calculator - Binomial, Poisson & Bayes | StatMetric"
        description="Free online discrete probability calculator. Compute Binomial P(X=k) & cumulative probabilities, Poisson rates, and Bayes' theorem posterior odds."
        path="/calculators/binomial-distribution"
        schemaType="WebApplication"
      />

      {/* Hero Header with ToolIcon */}
      <div className="mb-6 flex items-start gap-4">
        <ToolIcon toolId="binomial-distribution" size="lg" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200/60">
              Probability
            </span>
            <span className="text-xs text-slate-500">Discrete Distributions & Conditional Probability</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Probability & Binomial Calculator
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Calculate exact and cumulative discrete probabilities for Bernoulli trials (Binomial), arrival rates (Poisson), and conditional posterior probabilities (Bayes&apos; Theorem).
          </p>
        </div>
      </div>

      {/* Probability Type Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-lg mb-6 w-fit">
        <button
          onClick={() => setProbType('binomial')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            probType === 'binomial' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Binomial Distribution
        </button>
        <button
          onClick={() => setProbType('poisson')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            probType === 'poisson' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Poisson Distribution
        </button>
        <button
          onClick={() => setProbType('bayes')}
          className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            probType === 'bayes' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Bayes&apos; Theorem (Conditional)
        </button>
      </div>

      {/* 1. Binomial Distribution */}
      {probType === 'binomial' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Trials (n)
                </label>
                <input
                  type="number"
                  value={trialsN}
                  onChange={(e) => setTrialsN(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Probability of Success (p)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={probP}
                  onChange={(e) => setProbP(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Number of Successes (k)
                </label>
                <input
                  type="number"
                  value={successesK}
                  onChange={(e) => setSuccessesK(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            {binomialResult.error ? (
              <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded p-2">
                {binomialResult.error}
              </div>
            ) : binomialResult.data ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
                <div className="p-3 bg-sky-50/60 border border-sky-100 rounded-lg text-center">
                  <span className="text-[11px] text-sky-800 font-medium block">P(X = k)</span>
                  <div className="text-xl font-black text-sky-900 mt-0.5 font-mono">
                    {binomialResult.data.exactProbability.toFixed(5)}
                  </div>
                  <span className="text-[10px] text-sky-600">
                    {(binomialResult.data.exactProbability * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <span className="text-[11px] text-slate-600 font-medium block">P(X ≤ k)</span>
                  <div className="text-xl font-bold text-slate-800 mt-0.5 font-mono">
                    {binomialResult.data.cumulativeLessEqual.toFixed(5)}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {(binomialResult.data.cumulativeLessEqual * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <span className="text-[11px] text-slate-600 font-medium block">P(X ≥ k)</span>
                  <div className="text-xl font-bold text-slate-800 mt-0.5 font-mono">
                    {binomialResult.data.cumulativeGreaterEqual.toFixed(5)}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {(binomialResult.data.cumulativeGreaterEqual * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <span className="text-[11px] text-slate-600 font-medium block">Mean (μ = np)</span>
                  <div className="text-xl font-bold text-slate-800 mt-0.5 font-mono">
                    {binomialResult.data.mean.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    SD = {binomialResult.data.sd.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          <StepsExplanation
            title="Binomial Formula & Parameters"
            formula="P(X = k) = \\binom{n}{k} p^k (1 - p)^{n - k}"
            steps={[
              {
                title: 'Combinations Formula',
                content: `\\binom{n}{k} = \\frac{n!}{k!(n-k)!} calculates the total number of distinct combinations in which k successes can occur across n trials.`,
              },
              {
                title: 'Assumptions for Binomial Model',
                content: '1. Fixed number of n identical trials. 2. Each trial results in binary outcome (success or failure). 3. Probability of success p is constant. 4. Trials are independent.',
              },
            ]}
          />
        </div>
      )}

      {/* 2. Poisson Distribution */}
      {probType === 'poisson' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Average Rate (λ)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={lambda}
                  onChange={(e) => setLambda(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Occurrences (k)
                </label>
                <input
                  type="number"
                  value={poissonK}
                  onChange={(e) => setPoissonK(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            {poissonResult.error ? (
              <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded p-2">
                {poissonResult.error}
              </div>
            ) : poissonResult.data ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
                <div className="p-3 bg-sky-50/60 border border-sky-100 rounded-lg text-center">
                  <span className="text-[11px] text-sky-800 font-medium block">P(X = k)</span>
                  <div className="text-xl font-black text-sky-900 mt-0.5 font-mono">
                    {poissonResult.data.exactProbability.toFixed(5)}
                  </div>
                  <span className="text-[10px] text-sky-600">
                    {(poissonResult.data.exactProbability * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <span className="text-[11px] text-slate-600 font-medium block">P(X ≤ k)</span>
                  <div className="text-xl font-bold text-slate-800 mt-0.5 font-mono">
                    {poissonResult.data.cumulativeLessEqual.toFixed(5)}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <span className="text-[11px] text-slate-600 font-medium block">Mean (λ)</span>
                  <div className="text-xl font-bold text-slate-800 mt-0.5 font-mono">
                    {poissonResult.data.mean.toFixed(2)}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <span className="text-[11px] text-slate-600 font-medium block">Variance</span>
                  <div className="text-xl font-bold text-slate-800 mt-0.5 font-mono">
                    {poissonResult.data.variance.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-slate-500">Var = Mean</span>
                </div>
              </div>
            ) : null}
          </div>

          <StepsExplanation
            title="Poisson Distribution Formula"
            formula="P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}"
            steps={[
              {
                title: 'When to Use Poisson',
                content: 'Use the Poisson distribution for counts of rare events occurring randomly in a fixed interval of time or space (e.g. customer arrivals per hour, website defects per page).',
              },
            ]}
          />
        </div>
      )}

      {/* 3. Bayes Theorem */}
      {probType === 'bayes' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Prior Probability P(A)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={priorA}
                  onChange={(e) => setPriorA(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <span className="text-[10px] text-slate-600 mt-0.5 block">e.g. Base disease prevalence (1%)</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sensitivity P(B | A)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={probBGivenA}
                  onChange={(e) => setProbBGivenA(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <span className="text-[10px] text-slate-600 mt-0.5 block">True positive test rate (95%)</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  False Positive P(B | ¬A)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={probBGivenNotA}
                  onChange={(e) => setProbBGivenNotA(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <span className="text-[10px] text-slate-600 mt-0.5 block">Positive test when healthy (5%)</span>
              </div>
            </div>

            {bayesResult.error ? (
              <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded p-2">
                {bayesResult.error}
              </div>
            ) : bayesResult.data ? (
              <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-lg text-center mt-3">
                <span className="text-xs font-semibold text-sky-800 uppercase tracking-wider block">
                  Posterior Probability P(A | B)
                </span>
                <div className="text-3xl font-black text-sky-950 mt-1 font-mono">
                  {(bayesResult.data.posteriorAGivenB * 100).toFixed(2)}%
                </div>
                <p className="text-xs text-sky-800 mt-1">
                  Given a positive test result B, the probability of truly having condition A is {bayesResult.data.posteriorAGivenB.toFixed(4)}.
                </p>
              </div>
            ) : null}
          </div>

          {bayesResult.data && (
            <StepsExplanation
              title="Bayes' Theorem Derivation"
              formula="P(A | B) = \\frac{P(B | A) P(A)}{P(B | A) P(A) + P(B | \\neg A) P(\\neg A)}"
              steps={bayesResult.data.steps}
            />
          )}
        </div>
      )}

      {/* Next Steps */}
      <div className="mt-8">
        <NextStepCard
          options={[
            {
              prompt: 'Examine continuous Gaussian bell curve?',
              toolName: 'Normal Distribution Calculator',
              path: '/calculators/normal-distribution',
              description: 'Calculate cumulative probabilities and z-scores for continuous variables.',
            },
            {
              prompt: 'Perform hypothesis significance test?',
              toolName: 'P-Value Calculator',
              path: '/calculators/p-value',
              description: 'Calculate exact p-values for Z, Student t, Chi-Square, and F statistics.',
            },
            {
              prompt: 'Estimate survey sample size?',
              toolName: 'Sample Size & Power',
              path: '/calculators/sample-size',
              description: 'Determine required sample size for proportions with margin of error.',
            },
          ]}
        />
      </div>
    </div>
  );
}
