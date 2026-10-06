import { useState } from 'react';
import { SeoHead } from '../components/SeoHead';
import { ToolIcon } from '../components/ToolIcon';
import { Link } from '../lib/router';
import { NextStepCard } from '../components/NextStepCard';
import { getRecommendedTest, SelectorDecision } from '../lib/research/testSelectorData';
import { ArrowRight, CheckCircle2, AlertTriangle, BookOpen } from 'lucide-react';

export function TestSelectorPage() {
  const [decision, setDecision] = useState<SelectorDecision>({
    goal: 'compare_means',
    variableType: 'continuous',
    groups: 'two_independent',
    distribution: 'normal',
  });

  const recommendation = getRecommendedTest(decision);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <SeoHead
        title="Statistical Test Selector - Which Statistical Test Should I Use? | StatMetric"
        description="Interactive statistical test selection wizard. Answer 4 simple questions about your data type, groups, and research design to find the right statistical test."
        path="/calculators/test-selector"
        schemaType="WebApplication"
      />

      {/* Hero Header with ToolIcon */}
      <div className="mb-6 flex items-start gap-4">
        <ToolIcon toolId="test-selector" size="lg" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              Research & Inferential
            </span>
            <span className="text-xs text-slate-500">Methodology Guidance · Decision Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Statistical Test Selector
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Unsure which statistical test fits your dataset and hypothesis? Answer four methodological questions to find the appropriate test, its assumptions, and direct calculators.
          </p>
        </div>
      </div>

      {/* Guided Questionnaire */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs mb-8 space-y-6">
        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
          Step 1: Define Your Study Design
        </h2>

        {/* Question 1: Goal */}
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-2">
            1. What is your primary research goal?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              { id: 'compare_means', label: 'Compare group averages or treatments' },
              { id: 'relationship', label: 'Examine correlation / linear association' },
              { id: 'proportions', label: 'Compare frequencies or categorical proportions' },
              { id: 'prediction', label: 'Predict continuous outcome from an independent variable' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setDecision((d) => ({ ...d, goal: opt.id as SelectorDecision['goal'] }))}
                className={`p-3 rounded-lg border text-left font-medium transition-colors ${
                  decision.goal === opt.id
                    ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question 2: Variable Type */}
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-2">
            2. What scale of measurement is your outcome variable?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {[
              { id: 'continuous', label: 'Continuous (Interval or Ratio: e.g. score, weight, time)' },
              { id: 'categorical', label: 'Categorical (Nominal or Binary: e.g. yes/no, pass/fail)' },
              { id: 'mixed', label: 'Ordinal (Ranked: e.g. Likert scale 1–5)' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setDecision((d) => ({ ...d, variableType: opt.id as SelectorDecision['variableType'] }))}
                className={`p-3 rounded-lg border text-left font-medium transition-colors ${
                  decision.variableType === opt.id
                    ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question 3: Groups */}
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-2">
            3. How many groups or conditions are you comparing?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {[
              { id: 'two_independent', label: '2 Independent Groups (e.g. Treatment vs Control)' },
              { id: 'two_paired', label: '2 Paired / Repeated Conditions (e.g. Pre vs Post)' },
              { id: 'three_plus', label: '3 or More Groups (e.g. Low, Med, High dose)' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setDecision((d) => ({ ...d, groups: opt.id as SelectorDecision['groups'] }))}
                className={`p-3 rounded-lg border text-left font-medium transition-colors ${
                  decision.groups === opt.id
                    ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question 4: Distribution Normality */}
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-2">
            4. Does the data meet the assumption of a normal distribution?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {[
              { id: 'normal', label: 'Yes, approximately normal or N > 30 per group' },
              { id: 'non_normal', label: 'No, heavily skewed or small sample with outliers' },
              { id: 'unknown', label: 'Unchecked / Not sure' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setDecision((d) => ({ ...d, distribution: opt.id as SelectorDecision['distribution'] }))}
                className={`p-3 rounded-lg border text-left font-medium transition-colors ${
                  decision.distribution === opt.id
                    ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendation Results Card */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md mb-8 space-y-4">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4" />
          <span>Recommended Primary Statistical Test</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {recommendation.recommended.name}
            </h2>
            <span className="text-xs text-slate-400 mt-0.5 block">
              Classification: {recommendation.recommended.category} Inferential Test
            </span>
          </div>

          {recommendation.recommended.calculatorPath && (
            <Link
              to={recommendation.recommended.calculatorPath}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shrink-0"
            >
              <span>Launch Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {recommendation.guidanceText}
        </p>

        {/* Assumptions List */}
        <div className="pt-2">
          <span className="text-xs font-semibold text-slate-300 block mb-2">
            Mandatory Assumptions to Check:
          </span>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
            {recommendation.recommended.keyAssumptions.map((assump, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{assump}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Non-parametric or Alternative Option */}
        {recommendation.recommended.alternativeTest && (
          <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-lg text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Alternative Test: {recommendation.recommended.alternativeTest}</span>
            </div>
            <p className="text-slate-300">
              {recommendation.recommended.alternativeReason}
            </p>
          </div>
        )}
      </div>

      {/* Next Steps */}
      <NextStepCard
        options={[
          {
            prompt: 'Test differences between 2 independent groups?',
            toolName: 'Two-Sample T-Test',
            path: '/calculators/t-test',
            description: 'Independent Welch and Student t-test with Cohen’s d effect magnitude.',
          },
          {
            prompt: 'Test differences between 3+ groups?',
            toolName: 'One-Way ANOVA',
            path: '/calculators/anova',
            description: 'Omnibus F-test comparing 3 or more treatment conditions.',
          },
          {
            prompt: 'Need exact p-values for distribution statistics?',
            toolName: 'P-Value Calculator',
            path: '/calculators/p-value',
            description: 'Tail area probabilities for Z, t, Chi-Square, and F statistics.',
          },
        ]}
      />
    </div>
  );
}
