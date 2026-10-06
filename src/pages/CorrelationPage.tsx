import { useState, useMemo } from 'react';
import { SeoHead } from '../components/SeoHead';
import { ToolIcon } from '../components/ToolIcon';
import { NextStepCard } from '../components/NextStepCard';
import { ReportBox } from '../components/ReportBox';
import { StepsExplanation } from '../components/StepsExplanation';
import { parsePairedData, calculateCorrelationRegression } from '../lib/statistics/correlation';
import { RotateCcw } from 'lucide-react';

export function CorrelationPage() {
  const [dataInput, setDataInput] = useState(
    '1.5, 2.3\n2.0, 3.1\n2.8, 3.9\n3.5, 4.4\n4.2, 5.8\n5.0, 6.2\n5.8, 7.5\n6.5, 8.1'
  );
  const [alpha, setAlpha] = useState(0.05);

  const result = useMemo(() => {
    try {
      const points = parsePairedData(dataInput);
      const res = calculateCorrelationRegression(points, alpha);
      return { data: res, error: null };
    } catch (e: unknown) {
      return { error: e instanceof Error ? e.message : 'Invalid paired data format.' };
    }
  }, [dataInput, alpha]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <SeoHead
        title="Pearson Correlation & Linear Regression Calculator | StatMetric"
        description="Calculate Pearson correlation coefficient r, coefficient of determination R², regression slope, intercept, and p-value with an interactive scatter plot."
        path="/calculators/correlation-regression"
        schemaType="WebApplication"
      />

      {/* Hero Header with ToolIcon */}
      <div className="mb-6 flex items-start gap-4">
        <ToolIcon toolId="correlation-regression" size="lg" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60">
              Statistics & Research
            </span>
            <span className="text-xs text-slate-500">Ordinary Least Squares · APA 7</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Pearson Correlation & Linear Regression
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Quantify linear association between two paired continuous variables, estimate the Ordinary Least Squares (OLS) regression line, and evaluate statistical significance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Data Input Card */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Paired (X, Y) Observations
              </label>
              <button
                onClick={() =>
                  setDataInput('1.5, 2.3\n2.0, 3.1\n2.8, 3.9\n3.5, 4.4\n4.2, 5.8\n5.0, 6.2\n5.8, 7.5\n6.5, 8.1')
                }
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Sample Data
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-2">
              Enter one paired observation (x, y) per line separated by a comma or space:
            </p>
            <textarea
              rows={8}
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 10, 20&#10;12, 24&#10;15, 28"
            />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <label className="font-medium text-slate-700">Significance Level (α):</label>
            <select
              value={alpha}
              onChange={(e) => setAlpha(parseFloat(e.target.value))}
              className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800"
            >
              <option value="0.05">α = 0.05</option>
              <option value="0.01">α = 0.01</option>
              <option value="0.10">α = 0.10</option>
            </select>
          </div>
        </div>

        {/* Results Card & Scatter Plot */}
        <div className="lg:col-span-7 space-y-4">
          {result.error ? (
            <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
              <span className="text-xs text-rose-600 font-medium">{result.error}</span>
            </div>
          ) : result.data ? (
            <>
              {/* Primary Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-lg text-center">
                  <span className="text-[11px] text-blue-700 font-medium block">Pearson r</span>
                  <div className="text-2xl font-black text-blue-900 mt-0.5 font-mono">
                    {result.data.r.toFixed(3)}
                  </div>
                  <span className="text-[10px] text-blue-600">
                    {result.data.r > 0 ? 'Positive' : 'Negative'} correlation
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <span className="text-[11px] text-slate-500 font-medium block">R² (Variance)</span>
                  <div className="text-xl font-bold text-slate-800 mt-0.5 font-mono">
                    {(result.data.rSquared * 100).toFixed(1)}%
                  </div>
                  <span className="text-[10px] text-slate-600">R² = {result.data.rSquared.toFixed(3)}</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <span className="text-[11px] text-slate-500 font-medium block">P-Value</span>
                  <div className="text-xl font-bold text-slate-800 mt-0.5 font-mono">
                    {result.data.pValue < 0.001 ? '< .001' : result.data.pValue.toFixed(3)}
                  </div>
                  <span className={`text-[10px] font-semibold ${result.data.isSignificant ? 'text-emerald-700' : 'text-slate-600'}`}>
                    {result.data.isSignificant ? 'Significant' : 'Not Significant'}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <span className="text-[11px] text-slate-500 font-medium block">Sample Size</span>
                  <div className="text-xl font-bold text-slate-800 mt-0.5 font-mono">
                    N = {result.data.n}
                  </div>
                  <span className="text-[10px] text-slate-600">df = {result.data.n - 2}</span>
                </div>
              </div>

              {/* Regression Equation Box */}
              <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block mb-0.5">Fitted Regression Equation</span>
                  <div className="text-lg font-bold font-mono text-emerald-400">
                    {result.data.regressionEquation}
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <div>Slope β₁ = {result.data.slope.toFixed(4)}</div>
                  <div>Intercept β₀ = {result.data.intercept.toFixed(4)}</div>
                </div>
              </div>

              {/* APA Reporting Box */}
              <ReportBox apaString={result.data.apaReport} contextNote="Formatted according to APA 7th Edition style." />
            </>
          ) : null}
        </div>
      </div>

      {/* Steps & Verification */}
      <StepsExplanation
        title="Formulas & Derivation"
        formula="r = \\frac{\\sum (x - \\bar{x})(y - \\bar{y})}{\\sqrt{\\sum (x - \\bar{x})^2 \\sum (y - \\bar{y})^2}}"
        steps={[
          {
            title: '1. Pearson Correlation Coefficient (r)',
            content: 'Measures the degree of linear association between -1.0 (perfect negative) and +1.0 (perfect positive). A value near 0 indicates no linear pattern.',
          },
          {
            title: '2. Coefficient of Determination (R²)',
            content: 'R² represents the proportion of variance in the dependent variable Y that is predictable from the independent variable X.',
          },
          {
            title: '3. Regression Slope & Intercept',
            content: '\\beta_1 = \\frac{SS_{xy}}{SS_{xx}}, \\quad \\beta_0 = \\bar{y} - \\beta_1 \\bar{x}',
          },
        ]}
      />

      {/* Next Steps */}
      <div className="mt-8">
        <NextStepCard
          options={[
            {
              prompt: 'Compare means between 3 or more groups?',
              toolName: 'One-Way ANOVA Calculator',
              path: '/calculators/anova',
              description: 'Omnibus test for differences in treatment group means.',
            },
            {
              prompt: 'Examine categorical cross-tabulation?',
              toolName: 'Chi-Square Test',
              path: '/calculators/chi-square',
              description: 'Evaluate independence of frequency distributions in contingency tables.',
            },
            {
              prompt: 'Determine study sample size?',
              toolName: 'Sample Size & Power',
              path: '/calculators/sample-size',
              description: 'Calculate minimum required sample size for target statistical power.',
            },
          ]}
        />
      </div>
    </div>
  );
}
