import { useState, useMemo } from 'react';
import { SeoHead } from '../components/SeoHead';
import { ToolIcon } from '../components/ToolIcon';
import { NextStepCard } from '../components/NextStepCard';
import { ReportBox } from '../components/ReportBox';
import { StepsExplanation } from '../components/StepsExplanation';
import { calculateChiSquareIndependence } from '../lib/statistics/chisquare';
import { RotateCcw } from 'lucide-react';

export function ChiSquarePage() {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [grid, setGrid] = useState<number[][]>([
    [25, 15],
    [10, 30],
  ]);
  const [rowLabels, setRowLabels] = useState(['Group A', 'Group B']);
  const [colLabels, setColLabels] = useState(['Success', 'Failure']);
  const [alpha, setAlpha] = useState(0.05);

  const handleCellChange = (r: number, c: number, val: string) => {
    const num = parseFloat(val);
    setGrid((prev) => {
      const copy = prev.map((row) => [...row]);
      copy[r][c] = isNaN(num) ? 0 : num;
      return copy;
    });
  };

  const handleResize = (newRows: number, newCols: number) => {
    setRows(newRows);
    setCols(newCols);
    setGrid((prev) => {
      const next: number[][] = [];
      for (let r = 0; r < newRows; r++) {
        next[r] = [];
        for (let c = 0; c < newCols; c++) {
          next[r][c] = prev[r] && prev[r][c] !== undefined ? prev[r][c] : 10;
        }
      }
      return next;
    });
    setRowLabels(Array.from({ length: newRows }, (_, i) => `Row ${i + 1}`));
    setColLabels(Array.from({ length: newCols }, (_, i) => `Col ${i + 1}`));
  };

  const result = useMemo(() => {
    try {
      const res = calculateChiSquareIndependence(grid, alpha);
      return { data: res, error: null };
    } catch (e: unknown) {
      return { error: e instanceof Error ? e.message : 'Invalid contingency table.' };
    }
  }, [grid, alpha]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <SeoHead
        title="Chi-Square Test Calculator - Independence & Contingency Tables | StatMetric"
        description="Free Chi-Square test calculator. Compute χ² test of independence for 2x2 and rx c contingency tables with expected counts, p-value, Cramér's V, and APA 7 report."
        path="/calculators/chi-square"
        schemaType="WebApplication"
      />

      {/* Hero Header with ToolIcon */}
      <div className="mb-6 flex items-start gap-4">
        <ToolIcon toolId="chi-square" size="lg" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              Research & Inferential
            </span>
            <span className="text-xs text-slate-500">Contingency Tables · Cramér’s V</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Chi-Square Test of Independence
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Evaluate whether an association exists between two categorical variables by comparing observed frequencies against expected frequencies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Contingency Table Editor */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Contingency Table Editor ({rows} × {cols})
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Dimensions:</span>
              <button
                onClick={() => handleResize(2, 2)}
                className={`px-2 py-1 text-xs rounded border ${
                  rows === 2 && cols === 2 ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold' : 'border-slate-200 text-slate-600'
                }`}
              >
                2 × 2
              </button>
              <button
                onClick={() => handleResize(3, 3)}
                className={`px-2 py-1 text-xs rounded border ${
                  rows === 3 && cols === 3 ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold' : 'border-slate-200 text-slate-600'
                }`}
              >
                3 × 3
              </button>
            </div>
          </div>

          {/* Grid Inputs */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr>
                  <th className="p-2"></th>
                  {colLabels.map((lbl, c) => (
                    <th key={c} className="p-2 text-center">
                      <input
                        type="text"
                        value={lbl}
                        onChange={(e) => {
                          const copy = [...colLabels];
                          copy[c] = e.target.value;
                          setColLabels(copy);
                        }}
                        className="text-xs font-bold text-center text-slate-800 bg-slate-50 border border-slate-200 rounded px-1.5 py-1 w-20"
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grid.map((row, r) => (
                  <tr key={r}>
                    <td className="p-2 font-bold text-slate-800">
                      <input
                        type="text"
                        value={rowLabels[r]}
                        onChange={(e) => {
                          const copy = [...rowLabels];
                          copy[r] = e.target.value;
                          setRowLabels(copy);
                        }}
                        className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded px-1.5 py-1 w-20"
                      />
                    </td>
                    {row.map((val, c) => (
                      <td key={c} className="p-2 text-center">
                        <input
                          type="number"
                          value={val}
                          onChange={(e) => handleCellChange(r, c, e.target.value)}
                          className="w-16 text-center py-1.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        {result.data && (
                          <span className="block text-[10px] text-slate-600 mt-0.5 font-mono">
                            Exp: {result.data.expectedMatrix[r][c].toFixed(1)}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>Cells display: Observed (Input) / Expected (Exp)</span>
            <button
              onClick={() => {
                setGrid([[25, 15], [10, 30]]);
                setRows(2);
                setCols(2);
                setRowLabels(['Group A', 'Group B']);
                setColLabels(['Success', 'Failure']);
              }}
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset 2x2
            </button>
          </div>
        </div>

        {/* Results Overview */}
        <div className="lg:col-span-5 space-y-4">
          {result.error ? (
            <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
              <span className="text-xs text-rose-600 font-medium">{result.error}</span>
            </div>
          ) : result.data ? (
            <>
              <div className="grid grid-cols-2 gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-lg text-center">
                  <span className="text-[11px] text-emerald-800 font-medium block">Chi-Square (χ²)</span>
                  <div className="text-2xl font-black text-emerald-950 mt-0.5 font-mono">
                    {result.data.chiSquare.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-emerald-700">df = {result.data.df}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <span className="text-[11px] text-slate-500 font-medium block">P-Value</span>
                  <div className="text-xl font-bold text-slate-800 mt-0.5 font-mono">
                    {result.data.pValue < 0.001 ? '< .001' : result.data.pValue.toFixed(3)}
                  </div>
                  <span className={`text-[10px] font-semibold ${result.data.isSignificant ? 'text-emerald-700' : 'text-slate-600'}`}>
                    {result.data.isSignificant ? 'Significant' : 'Not Significant'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <span className="text-[11px] text-slate-500 font-medium block">Cramér’s V</span>
                  <div className="text-xl font-bold text-slate-800 mt-0.5 font-mono">
                    {result.data.cramersV.toFixed(3)}
                  </div>
                  <span className="text-[10px] text-slate-600">Effect size magnitude</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <span className="text-[11px] text-slate-500 font-medium block">Total Sample (N)</span>
                  <div className="text-xl font-bold text-slate-800 mt-0.5 font-mono">
                    {result.data.totalN}
                  </div>
                  <span className="text-[10px] text-slate-600">Observations</span>
                </div>
              </div>

              {/* APA Report Box */}
              <ReportBox apaString={result.data.apaReport} contextNote="Formatted according to APA 7th Edition style." />
            </>
          ) : null}
        </div>
      </div>

      {/* Steps & Verification */}
      <StepsExplanation
        title="Chi-Square Formulas & Assumptions"
        formula="\\chi^2 = \\sum \\frac{(O_{ij} - E_{ij})^2}{E_{ij}}, \\quad E_{ij} = \\frac{R_i \\times C_j}{N}"
        steps={[
          {
            title: '1. Expected Cell Frequency (E_ij)',
            content: 'Calculated as row total multiplied by column total divided by overall sample size N.',
          },
          {
            title: '2. Degrees of Freedom (df)',
            content: 'df = (rows - 1) × (cols - 1). For a 2x2 table, df = 1.',
          },
          {
            title: '3. Effect Size (Cramer’s V)',
            content: 'V = sqrt(chi^2 / (N * min(r-1, c-1))) measures the strength of association between categorical variables from 0 to 1.',
          },
        ]}
      />

      {/* Next Steps */}
      <div className="mt-8">
        <NextStepCard
          options={[
            {
              prompt: 'Compare means between 3+ groups?',
              toolName: 'One-Way ANOVA Calculator',
              path: '/calculators/anova',
              description: 'Omnibus test for difference in continuous treatment group averages.',
            },
            {
              prompt: 'Need to compute exact p-values for distribution test stats?',
              toolName: 'P-Value Calculator',
              path: '/calculators/p-value',
              description: 'Exact tail areas for Z, Student t, Chi-Square, and F distributions.',
            },
            {
              prompt: 'Determine test needed for research design?',
              toolName: 'Statistical Test Selector',
              path: '/calculators/test-selector',
              description: 'Guided questionnaire matching data types to appropriate statistical tests.',
            },
          ]}
        />
      </div>
    </div>
  );
}
