import { useState, useMemo } from 'react';
import { SeoHead } from '../components/SeoHead';
import { ToolIcon } from '../components/ToolIcon';
import { NextStepCard } from '../components/NextStepCard';
import { StepsExplanation } from '../components/StepsExplanation';
import { simplifyRatio, solveProportion } from '../lib/math/ratios';

export function RatioCalcPage() {
  const [tab, setTab] = useState<'simplify' | 'proportion'>('simplify');

  // Simplify inputs
  const [termA, setTermA] = useState('');
  const [termB, setTermB] = useState('');
  const [termC, setTermC] = useState('');

  // Proportion inputs: A/B = C/D
  const [propA, setPropA] = useState('');
  const [propB, setPropB] = useState('');
  const [propC, setPropC] = useState('');
  const [propD, setPropD] = useState('');

  const hasSimplifyInputs = termA.trim() !== '' && termB.trim() !== '';
  const proportionFilledCount = [propA, propB, propC, propD].filter((s) => s.trim() !== '').length;

  const loadSimplifyExample = () => {
    setTermA('24');
    setTermB('36');
    setTermC('');
  };

  const loadProportionExample = () => {
    setPropA('4');
    setPropB('5');
    setPropC('20');
    setPropD('');
  };

  const simplifyResult = useMemo(() => {
    if (!hasSimplifyInputs) return { data: null, error: null };
    const a = parseFloat(termA);
    const b = parseFloat(termB);
    const c = termC.trim() ? parseFloat(termC) : undefined;
    if (isNaN(a) || isNaN(b) || (c !== undefined && isNaN(c))) {
      return { data: null, error: 'Please enter valid positive numbers for ratio terms.' };
    }
    try {
      const res = simplifyRatio(a, b, c);
      return { data: res, error: null };
    } catch (e: unknown) {
      return { data: null, error: e instanceof Error ? e.message : 'Invalid ratio.' };
    }
  }, [termA, termB, termC, hasSimplifyInputs]);

  const proportionResult = useMemo(() => {
    if (proportionFilledCount < 3) return { data: null, error: null };
    const a = propA.trim() ? parseFloat(propA) : null;
    const b = propB.trim() ? parseFloat(propB) : null;
    const c = propC.trim() ? parseFloat(propC) : null;
    const d = propD.trim() ? parseFloat(propD) : null;

    try {
      const res = solveProportion(a, b, c, d);
      return { data: res, error: null };
    } catch (e: unknown) {
      return { data: null, error: e instanceof Error ? e.message : 'Invalid proportion.' };
    }
  }, [propA, propB, propC, propD, proportionFilledCount]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <SeoHead
        title="Ratio & Proportion Calculator - Simplify Ratios & Solve Proportions | StatMetric"
        description="Free ratio & proportion calculator. Simplify ratios A:B:C, find equivalent ratios, and solve proportion equations A/B = C/D using cross-multiplication."
        path="/calculators/ratio-calculator"
        schemaType="WebApplication"
      />

      {/* Hero Header with ToolIcon */}
      <div className="mb-6 flex items-start gap-4">
        <ToolIcon toolId="ratio-calculator" size="lg" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              Mathematics
            </span>
            <span className="text-xs text-slate-500">Cross-Multiplication · GCD Reduction</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Ratio & Proportion Calculator
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Simplify two-term or three-term ratios to lowest whole numbers and solve for missing terms in proportional fractions (A/B = C/D).
          </p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-lg mb-6 w-fit">
        <button
          onClick={() => setTab('simplify')}
          className={`px-4 py-2 rounded-md text-xs font-semibold transition-colors ${
            tab === 'simplify' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Simplify Ratio (A : B : C)
        </button>
        <button
          onClick={() => setTab('proportion')}
          className={`px-4 py-2 rounded-md text-xs font-semibold transition-colors ${
            tab === 'proportion' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Solve Proportion (A/B = C/D)
        </button>
      </div>

      {/* Tab 1: Simplify Ratio */}
      {tab === 'simplify' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Term A</label>
                <input
                  type="number"
                  placeholder="e.g. 24"
                  value={termA}
                  onChange={(e) => setTermA(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Term B</label>
                <input
                  type="number"
                  placeholder="e.g. 36"
                  value={termB}
                  onChange={(e) => setTermB(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Term C <span className="text-slate-600 font-normal">(Optional)</span>
                </label>
                <input
                  type="number"
                  value={termC}
                  onChange={(e) => setTermC(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center min-h-[64px] flex flex-col justify-center">
                <span className="text-[11px] font-semibold text-slate-600 block mb-0.5">Simplified</span>
                {simplifyResult.error ? (
                  <span className="text-xs text-rose-600">{simplifyResult.error}</span>
                ) : simplifyResult.data ? (
                  <div className="text-xl font-extrabold text-blue-600 font-mono">
                    {simplifyResult.data.ratioString}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">A : B</span>
                )}
              </div>
            </div>

            {/* Action toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 mt-4 text-xs">
              <span className="text-slate-500">GCD reduction to lowest whole terms</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={loadSimplifyExample}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  Load Example (24 : 36)
                </button>
                <button
                  type="button"
                  onClick={() => { setTermA(''); setTermB(''); setTermC(''); }}
                  className="text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {simplifyResult.data && (
            <StepsExplanation
              title="Simplification Steps"
              steps={simplifyResult.data.steps}
            />
          )}
        </div>
      )}

      {/* Tab 2: Solve Proportion */}
      {tab === 'proportion' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
            <p className="text-xs text-slate-600 mb-4">
              Enter any 3 values and leave <strong>exactly one field blank</strong> to solve for the missing term:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 py-2">
              {/* A / B */}
              <div className="flex flex-col items-center w-24">
                <label htmlFor="propA" className="sr-only">Term A</label>
                <input
                  id="propA"
                  type="number"
                  value={propA}
                  onChange={(e) => setPropA(e.target.value)}
                  placeholder="A"
                  className="w-full text-center py-2 text-sm font-bold bg-slate-50 border border-slate-300 rounded-md"
                />
                <div className="w-full h-0.5 bg-slate-900 my-1" />
                <label htmlFor="propB" className="sr-only">Term B</label>
                <input
                  id="propB"
                  type="number"
                  value={propB}
                  onChange={(e) => setPropB(e.target.value)}
                  placeholder="B"
                  className="w-full text-center py-2 text-sm font-bold bg-slate-50 border border-slate-300 rounded-md"
                />
              </div>

              <div className="text-2xl font-bold text-slate-400">=</div>

              {/* C / D */}
              <div className="flex flex-col items-center w-24">
                <label htmlFor="propC" className="sr-only">Term C</label>
                <input
                  id="propC"
                  type="number"
                  value={propC}
                  onChange={(e) => setPropC(e.target.value)}
                  placeholder="C"
                  className="w-full text-center py-2 text-sm font-bold bg-slate-50 border border-slate-300 rounded-md"
                />
                <div className="w-full h-0.5 bg-slate-900 my-1" />
                <label htmlFor="propD" className="sr-only">Term D</label>
                <input
                  id="propD"
                  type="number"
                  value={propD}
                  onChange={(e) => setPropD(e.target.value)}
                  placeholder="D (solve)"
                  className="w-full text-center py-2 text-sm font-bold bg-slate-50 border border-slate-300 rounded-md"
                />
              </div>

              {/* Solution */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl min-w-[150px] text-center ml-2 min-h-[76px] flex flex-col justify-center">
                <span className="text-[11px] font-semibold text-slate-600 block mb-0.5">Solution</span>
                {proportionResult.error ? (
                  <span className="text-xs text-rose-600">{proportionResult.error}</span>
                ) : proportionResult.data ? (
                  <div>
                    <div className="text-xl font-bold text-blue-600 font-mono">
                      {proportionResult.data.missingTerm} = {Number(proportionResult.data.solvedValue.toFixed(4))}
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">Leave 1 blank</span>
                )}
              </div>
            </div>

            {/* Action toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 mt-4 text-xs">
              <span className="text-slate-500">Cross-multiplication solving</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={loadProportionExample}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  Load Example (4/5 = 20/D)
                </button>
                <button
                  type="button"
                  onClick={() => { setPropA(''); setPropB(''); setPropC(''); setPropD(''); }}
                  className="text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {proportionResult.data && (
            <StepsExplanation
              title="Cross-Multiplication Steps"
              formula={proportionResult.data.formattedFormula}
              steps={proportionResult.data.steps}
            />
          )}
        </div>
      )}

      {/* Next Steps */}
      <div className="mt-8">
        <NextStepCard
          options={[
            {
              prompt: 'Convert ratio into percentage?',
              toolName: 'Percentage Calculator',
              path: '/calculators/percentage-calculator',
              description: 'Convert proportional splits and parts to percentage fractions.',
            },
            {
              prompt: 'Need fraction operations?',
              toolName: 'Fraction Calculator',
              path: '/calculators/fraction-calculator',
              description: 'Add, subtract, and multiply fractional proportions with mixed numbers.',
            },
            {
              prompt: 'Measuring standard data dispersion?',
              toolName: 'Standard Deviation Calculator',
              path: '/calculators/standard-deviation',
              description: 'Measure sample and population variance and spread.',
            },
          ]}
        />
      </div>
    </div>
  );
}
