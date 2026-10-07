import { useState, useMemo } from 'react';
import { SeoHead } from '../components/SeoHead';
import { ToolIcon } from '../components/ToolIcon';
import { NextStepCard } from '../components/NextStepCard';
import { StepsExplanation } from '../components/StepsExplanation';
import { calculateFractions, FractionOperation } from '../lib/math/fractions';
import { RotateCcw } from 'lucide-react';

export function FractionCalcPage() {
  const [num1, setNum1] = useState('');
  const [den1, setDen1] = useState('');
  const [num2, setNum2] = useState('');
  const [den2, setDen2] = useState('');
  const [operation, setOperation] = useState<FractionOperation>('add');

  const hasInputs =
    num1.trim() !== '' && den1.trim() !== '' && num2.trim() !== '' && den2.trim() !== '';

  const result = useMemo(() => {
    if (!hasInputs) return { data: null, error: null };
    const n1 = parseInt(num1, 10);
    const d1 = parseInt(den1, 10);
    const n2 = parseInt(num2, 10);
    const d2 = parseInt(den2, 10);

    if (isNaN(n1) || isNaN(d1) || isNaN(n2) || isNaN(d2)) {
      return { data: null, error: 'Please enter valid integer numerators and denominators.' };
    }
    if (d1 === 0 || d2 === 0) {
      return { data: null, error: 'Denominator cannot be zero.' };
    }
    if (operation === 'divide' && n2 === 0) {
      return { data: null, error: 'Cannot divide by a fraction with numerator 0.' };
    }

    try {
      const res = calculateFractions(
        { numerator: n1, denominator: d1 },
        { numerator: n2, denominator: d2 },
        operation
      );
      return { data: res, error: null };
    } catch (e: unknown) {
      return { data: null, error: e instanceof Error ? e.message : 'Invalid fraction calculation.' };
    }
  }, [num1, den1, num2, den2, operation, hasInputs]);

  const opSymbols: Record<FractionOperation, string> = {
    add: '+',
    subtract: '−',
    multiply: '×',
    divide: '÷',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <SeoHead
        title="Fraction Calculator - Add, Subtract, Multiply & Divide Fractions | StatMetric"
        description="Free fraction calculator with step-by-step solutions. Add, subtract, multiply, divide, simplify improper fractions, and convert to mixed numbers."
        path="/calculators/fraction-calculator"
        schemaType="WebApplication"
      />

      {/* Hero Header with ToolIcon */}
      <div className="mb-6 flex items-start gap-4">
        <ToolIcon toolId="fraction-calculator" size="lg" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              Mathematics
            </span>
            <span className="text-xs text-slate-500">Exact Arithmetic · Step-by-Step</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Fraction Calculator
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Perform fraction arithmetic, reduce to lowest terms via greatest common divisor, and convert between improper fractions and mixed numbers.
          </p>
        </div>
      </div>

      {/* Main Calculator Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 sm:p-6 mb-8">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-4">
          {/* Fraction 1 */}
          <div className="flex flex-col items-center w-20">
            <label htmlFor="num1" className="sr-only">Numerator 1</label>
            <input
              id="num1"
              type="number"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              className="w-full text-center py-2 text-base font-bold bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Num"
            />
            <div className="w-full h-0.5 bg-slate-900 my-1.5" />
            <label htmlFor="den1" className="sr-only">Denominator 1</label>
            <input
              id="den1"
              type="number"
              value={den1}
              onChange={(e) => setDen1(e.target.value)}
              className="w-full text-center py-2 text-base font-bold bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Den"
            />
          </div>

          {/* Operation Selector */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-600 mb-1 font-medium">Operation</span>
            <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg">
              {(['add', 'subtract', 'multiply', 'divide'] as FractionOperation[]).map((op) => (
                <button
                  key={op}
                  onClick={() => setOperation(op)}
                  className={`w-9 h-9 rounded text-base font-bold transition-colors ${
                    operation === op
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                  title={op}
                >
                  {opSymbols[op]}
                </button>
              ))}
            </div>
          </div>

          {/* Fraction 2 */}
          <div className="flex flex-col items-center w-20">
            <label htmlFor="num2" className="sr-only">Numerator 2</label>
            <input
              id="num2"
              type="number"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              className="w-full text-center py-2 text-base font-bold bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Num"
            />
            <div className="w-full h-0.5 bg-slate-900 my-1.5" />
            <label htmlFor="den2" className="sr-only">Denominator 2</label>
            <input
              id="den2"
              type="number"
              value={den2}
              onChange={(e) => setDen2(e.target.value)}
              className="w-full text-center py-2 text-base font-bold bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Den"
            />
          </div>

          {/* Equals Sign */}
          <div className="text-2xl font-bold text-slate-400">=</div>

          {/* Result Card Box */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-xl min-w-[140px] min-h-[90px]">
            {result.error ? (
              <span className="text-xs text-rose-600 text-center font-medium">{result.error}</span>
            ) : result.data ? (
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-extrabold text-blue-600 font-mono">
                  {result.data.simplifiedString}
                </div>
                {result.data.isMixed && (
                  <div className="text-xs text-slate-600 mt-1 font-medium">
                    Mixed: <strong className="text-slate-900">{result.data.mixedString}</strong>
                  </div>
                )}
                <div className="text-xs text-slate-600 mt-0.5 font-mono">
                  ≈ {result.data.decimal.toFixed(4)}
                </div>
              </div>
            ) : (
              <div className="text-center text-xs text-slate-400">
                <span>Result</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 mt-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>Worked Examples:</span>
            <button
              type="button"
              onClick={() => { setNum1('1'); setDen1('2'); setNum2('1'); setDen2('4'); setOperation('add'); }}
              className="text-blue-600 hover:underline"
            >
              1/2 + 1/4
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => { setNum1('3'); setDen1('5'); setNum2('2'); setDen2('3'); setOperation('multiply'); }}
              className="text-blue-600 hover:underline"
            >
              3/5 × 2/3
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => { setNum1('7'); setDen1('8'); setNum2('1'); setDen2('2'); setOperation('subtract'); }}
              className="text-blue-600 hover:underline"
            >
              7/8 − 1/2
            </button>
          </div>
          <button
            type="button"
            onClick={() => { setNum1(''); setDen1(''); setNum2(''); setDen2(''); setOperation('add'); }}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Clear
          </button>
        </div>
      </div>

      {/* Step by Step Explanation */}
      {result.data && (
        <StepsExplanation
          title="Step-by-Step Calculation"
          steps={result.data.steps}
        />
      )}

      {/* What should I do next */}
      <div className="mt-8">
        <NextStepCard
          options={[
            {
              prompt: 'Solve ratios or cross-multiplication?',
              toolName: 'Ratio & Proportion Calculator',
              path: '/calculators/ratio-calculator',
              description: 'Simplify ratios and solve A/B = C/D proportions.',
            },
            {
              prompt: 'Convert fraction to percentage?',
              toolName: 'Percentage Calculator',
              path: '/calculators/percentage-calculator',
              description: 'Find percentage equivalents, increases, and differences.',
            },
            {
              prompt: 'Need full scientific evaluation?',
              toolName: 'Scientific Calculator',
              path: '/calculators/scientific-calculator',
              description: 'Powers, roots, logarithms, trigonometric functions, and parentheses.',
            },
          ]}
        />
      </div>
    </div>
  );
}
