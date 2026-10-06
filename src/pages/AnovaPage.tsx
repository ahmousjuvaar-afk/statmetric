import { useState, useMemo } from 'react';
import { SeoHead } from '../components/SeoHead';
import { ToolIcon } from '../components/ToolIcon';
import { NextStepCard } from '../components/NextStepCard';
import { ReportBox } from '../components/ReportBox';
import { StepsExplanation } from '../components/StepsExplanation';
import { calculateOneWayAnova } from '../lib/statistics/anova';
import { Plus, Trash2, RotateCcw } from 'lucide-react';

export function AnovaPage() {
  const [groups, setGroups] = useState([
    { name: 'Placebo', input: '12, 14, 15, 11, 13' },
    { name: 'Low Dose', input: '16, 18, 19, 15, 17' },
    { name: 'High Dose', input: '22, 25, 24, 21, 23' },
  ]);
  const [alpha, setAlpha] = useState(0.05);

  const handleAddGroup = () => {
    setGroups((prev) => [
      ...prev,
      { name: `Group ${String.fromCharCode(65 + prev.length)}`, input: '10, 12, 14' },
    ]);
  };

  const handleRemoveGroup = (idx: number) => {
    if (groups.length <= 2) return;
    setGroups((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleGroupChange = (idx: number, field: 'name' | 'input', val: string) => {
    setGroups((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const anovaResult = useMemo(() => {
    try {
      const parsed = groups.map((g) => ({
        name: g.name,
        values: g.input
          .split(/[\s,;\n\t]+/)
          .map((v) => parseFloat(v))
          .filter((v) => !isNaN(v)),
      }));
      const res = calculateOneWayAnova(parsed, alpha);
      return { data: res, error: null };
    } catch (e: unknown) {
      return { error: e instanceof Error ? e.message : 'Invalid group data format.' };
    }
  }, [groups, alpha]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <SeoHead
        title="One-Way ANOVA Calculator - Analysis of Variance & F-Test | StatMetric"
        description="Free One-Way ANOVA calculator. Compare treatment group means with omnibus F-test, sum of squares source table, eta-squared effect size, and APA 7 reporting."
        path="/calculators/anova"
        schemaType="WebApplication"
      />

      {/* Hero Header with ToolIcon */}
      <div className="mb-6 flex items-start gap-4">
        <ToolIcon toolId="anova" size="lg" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              Research & Inferential
            </span>
            <span className="text-xs text-slate-500">Omnibus F-Test · Partitioned Variance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            One-Way Analysis of Variance (ANOVA)
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Test for statistically significant differences among the means of three or more independent groups using the omnibus F-distribution test.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Treatment Groups Input */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Treatment Groups ({groups.length})
            </span>
            <button
              onClick={() =>
                setGroups([
                  { name: 'Placebo', input: '12, 14, 15, 11, 13' },
                  { name: 'Low Dose', input: '16, 18, 19, 15, 17' },
                  { name: 'High Dose', input: '22, 25, 24, 21, 23' },
                ])
              }
              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset Sample
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {groups.map((group, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={group.name}
                    onChange={(e) => handleGroupChange(idx, 'name', e.target.value)}
                    className="text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded px-2 py-1 w-32"
                  />
                  {groups.length > 2 && (
                    <button
                      onClick={() => handleRemoveGroup(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remove group"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={group.input}
                  onChange={(e) => handleGroupChange(idx, 'input', e.target.value)}
                  placeholder="Values separated by commas: e.g. 12, 14, 15"
                  className="w-full text-xs font-mono bg-white border border-slate-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleAddGroup}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
          >
            <Plus className="w-3.5 h-3.5" /> Add Treatment Group
          </button>
        </div>

        {/* Results & ANOVA Table */}
        <div className="lg:col-span-7 space-y-4">
          {anovaResult.error ? (
            <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
              <span className="text-xs text-rose-600 font-medium">{anovaResult.error}</span>
            </div>
          ) : anovaResult.data ? (
            <>
              {/* Primary Stats Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-lg text-center">
                  <span className="text-[11px] text-emerald-800 font-medium block">F-Ratio</span>
                  <div className="text-2xl font-black text-emerald-950 mt-0.5 font-mono">
                    {anovaResult.data.fStatistic.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-emerald-700">MS_between / MS_within</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <span className="text-[11px] text-slate-500 font-medium block">P-Value</span>
                  <div className="text-xl font-bold text-slate-800 mt-0.5 font-mono">
                    {anovaResult.data.pValue < 0.001 ? '< .001' : anovaResult.data.pValue.toFixed(3)}
                  </div>
                  <span className={`text-[10px] font-semibold ${anovaResult.data.isSignificant ? 'text-emerald-700' : 'text-slate-600'}`}>
                    {anovaResult.data.isSignificant ? 'Statistically Significant' : 'Not Significant'}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <span className="text-[11px] text-slate-500 font-medium block">Eta-Squared (η²)</span>
                  <div className="text-xl font-bold text-slate-800 mt-0.5 font-mono">
                    {anovaResult.data.etaSquared.toFixed(3)}
                  </div>
                  <span className="text-[10px] text-slate-600">
                    {(anovaResult.data.etaSquared * 100).toFixed(1)}% variance explained
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <span className="text-[11px] text-slate-500 font-medium block">Total N</span>
                  <div className="text-xl font-bold text-slate-800 mt-0.5 font-mono">
                    {anovaResult.data.totalN}
                  </div>
                  <span className="text-[10px] text-slate-600">Across {anovaResult.data.k} groups</span>
                </div>
              </div>

              {/* ANOVA Source Table */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs overflow-x-auto">
                <span className="text-xs font-semibold text-slate-900 block mb-2 uppercase tracking-wider">
                  ANOVA Source Table
                </span>
                <table className="w-full text-xs text-left border-collapse font-mono">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-sans">
                      <th className="py-2 px-2">Source</th>
                      <th className="py-2 px-2 text-right">SS</th>
                      <th className="py-2 px-2 text-right">df</th>
                      <th className="py-2 px-2 text-right">MS</th>
                      <th className="py-2 px-2 text-right">F</th>
                      <th className="py-2 px-2 text-right">p</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2 px-2 font-sans font-semibold text-slate-900">Between Groups</td>
                      <td className="py-2 px-2 text-right">{anovaResult.data.ssBetween.toFixed(2)}</td>
                      <td className="py-2 px-2 text-right">{anovaResult.data.dfBetween}</td>
                      <td className="py-2 px-2 text-right">{anovaResult.data.msBetween.toFixed(2)}</td>
                      <td className="py-2 px-2 text-right font-bold text-emerald-700">{anovaResult.data.fStatistic.toFixed(2)}</td>
                      <td className="py-2 px-2 text-right font-bold">{anovaResult.data.pValue < 0.001 ? '< .001' : anovaResult.data.pValue.toFixed(3)}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 font-sans font-semibold text-slate-900">Within Groups</td>
                      <td className="py-2 px-2 text-right">{anovaResult.data.ssWithin.toFixed(2)}</td>
                      <td className="py-2 px-2 text-right">{anovaResult.data.dfWithin}</td>
                      <td className="py-2 px-2 text-right">{anovaResult.data.msWithin.toFixed(2)}</td>
                      <td className="py-2 px-2 text-right text-slate-400">—</td>
                      <td className="py-2 px-2 text-right text-slate-400">—</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="py-2 px-2 font-sans text-slate-900">Total</td>
                      <td className="py-2 px-2 text-right">{anovaResult.data.ssTotal.toFixed(2)}</td>
                      <td className="py-2 px-2 text-right">{anovaResult.data.dfTotal}</td>
                      <td className="py-2 px-2 text-right text-slate-400">—</td>
                      <td className="py-2 px-2 text-right text-slate-400">—</td>
                      <td className="py-2 px-2 text-right text-slate-400">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* APA 7 Report Box */}
              <ReportBox apaString={anovaResult.data.apaReport} contextNote="Formatted according to APA 7th Edition reporting guidelines." />
            </>
          ) : null}
        </div>
      </div>

      {/* Steps & Verification */}
      <StepsExplanation
        title="ANOVA Calculations & Assumptions"
        formula="F = \\frac{MS_{\\text{between}}}{MS_{\\text{within}}} = \\frac{SS_b / (k - 1)}{SS_w / (N - k)}"
        steps={[
          {
            title: '1. Partition of Sum of Squares (SS)',
            content: 'Total variance is divided into variance between group means (treatment effect + error) and variance within individual groups (individual differences / random noise).',
          },
          {
            title: '2. Omnibus F-Test',
            content: 'Under the null hypothesis H0 (all group means are equal), F is expected to equal ~1.0. A significantly large F indicates that at least two group means differ.',
          },
          {
            title: '3. Effect Size (Eta-Squared η²)',
            content: 'η² = SS_between / SS_total indicates the proportion of total variance explained by the treatment groups (Small: 0.01, Medium: 0.06, Large: 0.14).',
          },
        ]}
      />

      {/* Next Steps */}
      <div className="mt-8">
        <NextStepCard
          options={[
            {
              prompt: 'Compare exactly two independent groups?',
              toolName: 'Two-Sample T-Test Calculator',
              path: '/calculators/t-test',
              description: 'Welch and Student t-tests with Cohen’s d effect magnitude.',
            },
            {
              prompt: 'Find required sample size per treatment arm?',
              toolName: 'Sample Size & Power Calculator',
              path: '/calculators/sample-size',
              description: 'Determine required sample size for target statistical power.',
            },
            {
              prompt: 'Not sure which test to run?',
              toolName: 'Statistical Test Selector',
              path: '/calculators/test-selector',
              description: 'Guided diagnostic wizard matching research questions to verified statistical tests.',
            },
          ]}
        />
      </div>
    </div>
  );
}
