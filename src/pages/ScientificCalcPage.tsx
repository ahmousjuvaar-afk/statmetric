import { useState } from 'react';
import { SeoHead } from '../components/SeoHead';
import { ToolIcon } from '../components/ToolIcon';
import { NextStepCard } from '../components/NextStepCard';
import { StepsExplanation } from '../components/StepsExplanation';
import { MathExpressionEvaluator, AngleMode } from '../lib/math/calculatorEngine';
import { Delete, RotateCcw, Copy, Check } from 'lucide-react';

export function ScientificCalcPage() {
  const [expression, setExpression] = useState('');
  const [angleMode, setAngleMode] = useState<AngleMode>('deg');
  const [history, setHistory] = useState<{ expr: string; result: string }[]>([]);
  const [copied, setCopied] = useState(false);

  const evaluator = new MathExpressionEvaluator(angleMode);
  const evalResult = evaluator.evaluate(expression);

  const handleBtn = (val: string) => {
    setExpression((prev) => prev + val);
  };

  const handleClear = () => {
    setExpression('');
  };

  const handleDelete = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleEquals = () => {
    if (!expression.trim()) return;
    if (!evalResult.error && !isNaN(evalResult.value)) {
      setHistory((prev) => [
        { expr: expression, result: evalResult.formatted },
        ...prev.slice(0, 9),
      ]);
      setExpression(evalResult.formatted);
    }
  };

  const handleCopy = () => {
    if (evalResult.formatted && evalResult.formatted !== 'Error') {
      navigator.clipboard.writeText(evalResult.formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const scientificKeypad = [
    ['deg_rad', '(', ')', 'C', 'DEL'],
    ['sin(', 'cos(', 'tan(', '^', 'sqrt('],
    ['asin(', 'acos(', 'atan(', 'log10(', 'ln('],
    ['7', '8', '9', '÷', '!'],
    ['4', '5', '6', '×', 'pi'],
    ['1', '2', '3', '−', 'e'],
    ['0', '.', '%', '+', '='],
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <SeoHead
        title="Scientific & Standard Calculator - Free Precise Math Tool | StatMetric"
        description="Free online scientific calculator with arithmetic, powers, roots, trigonometry, logs, factorial, and constants. Supports Degree and Radian modes."
        path="/calculators/scientific-calculator"
        schemaType="WebApplication"
      />

      {/* Hero Header with ToolIcon */}
      <div className="mb-6 flex items-start gap-4">
        <ToolIcon toolId="scientific-calculator" size="lg" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              Mathematics
            </span>
            <span className="text-xs text-slate-500">No eval() · Precision Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Scientific & Standard Calculator
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Evaluate algebraic, trigonometric, logarithmic, and exponential expressions with full operator precedence and real-time verification.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Calculator Display & Keypad */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-xs p-5">
          {/* Angle mode and status */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md text-xs font-medium">
              <button
                onClick={() => setAngleMode('deg')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  angleMode === 'deg' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'
                }`}
              >
                DEG
              </button>
              <button
                onClick={() => setAngleMode('rad')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  angleMode === 'rad' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'
                }`}
              >
                RAD
              </button>
            </div>
            <span className="text-xs text-slate-600 font-mono">
              Mode: {angleMode.toUpperCase()}
            </span>
          </div>

          {/* Interactive Screen Display */}
          <div className="bg-slate-900 text-white rounded-lg p-4 mb-4 font-mono shadow-inner">
            <div className="text-xs text-slate-400 min-h-[1.25rem] truncate text-right">
              {expression || '0'}
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-right tracking-tight text-emerald-400 flex items-center justify-between mt-1">
              <button
                onClick={handleCopy}
                title="Copy result"
                className="text-slate-400 hover:text-white transition-colors p-1"
                aria-label="Copy result"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <span>{expression ? evalResult.formatted : '0'}</span>
            </div>
          </div>

          {evalResult.error && expression && (
            <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-md p-2 mb-3">
              {evalResult.error}
            </div>
          )}

          {/* Buttons Matrix */}
          <div className="space-y-2">
            {scientificKeypad.map((row, rIdx) => (
              <div key={rIdx} className="grid grid-cols-5 gap-2">
                {row.map((btn, bIdx) => {
                  if (btn === 'deg_rad') {
                    return (
                      <button
                        key={bIdx}
                        onClick={() => setAngleMode(angleMode === 'deg' ? 'rad' : 'deg')}
                        className="py-2.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                      >
                        {angleMode.toUpperCase()}
                      </button>
                    );
                  }
                  if (btn === 'C') {
                    return (
                      <button
                        key={bIdx}
                        onClick={handleClear}
                        className="py-2.5 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 rounded-md transition-colors"
                      >
                        AC
                      </button>
                    );
                  }
                  if (btn === 'DEL') {
                    return (
                      <button
                        key={bIdx}
                        onClick={handleDelete}
                        className="py-2.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md flex items-center justify-center transition-colors"
                        aria-label="Backspace"
                      >
                        <Delete className="w-4 h-4" />
                      </button>
                    );
                  }
                  if (btn === '=') {
                    return (
                      <button
                        key={bIdx}
                        onClick={handleEquals}
                        className="py-2.5 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-xs transition-colors"
                      >
                        =
                      </button>
                    );
                  }

                  const isOperator = ['+', '−', '×', '÷', '^', '%'].includes(btn);
                  const isDigit = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].includes(btn);
                  const isFn = btn.includes('(') || btn === '!' || btn === 'pi' || btn === 'e';

                  return (
                    <button
                      key={bIdx}
                      onClick={() => handleBtn(btn)}
                      className={`py-2.5 text-xs sm:text-sm font-semibold rounded-md transition-colors active:scale-95 ${
                        isOperator
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/70'
                          : isDigit
                          ? 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 shadow-2xs font-bold'
                          : isFn
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {btn}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Calculation History & Reference */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Calculation History
              </span>
              {history.length > 0 && (
                <button
                  onClick={() => setHistory([])}
                  className="text-xs text-slate-600 hover:text-slate-800 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <p className="text-xs text-slate-600 py-6 text-center">
                Your recent calculations will appear here. Press &ldquo;=&rdquo; to save an entry.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setExpression(item.result)}
                    className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors border border-slate-100 text-right"
                  >
                    <div className="text-[11px] text-slate-600 font-mono truncate">{item.expr}</div>
                    <div className="text-xs font-bold text-slate-900 font-mono">= {item.result}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-2">
            <span className="font-semibold text-slate-900 block">Supported Operations</span>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong className="text-slate-900">Trig:</strong> sin, cos, tan, asin, acos, atan</li>
              <li><strong className="text-slate-900">Logs:</strong> log10(x), ln(x), exp(x)</li>
              <li><strong className="text-slate-900">Powers & Roots:</strong> x^y, sqrt(x), cbrt(x)</li>
              <li><strong className="text-slate-900">Factorial:</strong> 5! = 120</li>
              <li><strong className="text-slate-900">Constants:</strong> π (3.14159...), e (2.71828...)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Understand & Verify Steps */}
      <StepsExplanation
        title="Order of Operations & Precision"
        formula="P \\rightarrow E \\rightarrow MD \\rightarrow AS"
        steps={[
          {
            title: '1. Parentheses (P)',
            content: 'Expressions enclosed in brackets ( ) are resolved first, innermost to outermost.',
          },
          {
            title: '2. Exponents and Functions (E)',
            content: 'Powers (x^y), square roots sqrt(x), factorials (!), and trigonometric functions are computed right-associatively.',
          },
          {
            title: '3. Multiplication & Division (MD)',
            content: 'Multiplications and divisions are evaluated from left to right.',
          },
          {
            title: '4. Addition & Subtraction (AS)',
            content: 'Final additions and subtractions are evaluated from left to right.',
          },
        ]}
      />

      {/* Next Steps */}
      <div className="mt-8">
        <NextStepCard
          options={[
            {
              prompt: 'Need to compute fraction arithmetic?',
              toolName: 'Fraction Calculator',
              path: '/calculators/fraction-calculator',
              description: 'Simplify fractions, mixed numbers, and step-by-step LCD denominators.',
            },
            {
              prompt: 'Working with percentages & changes?',
              toolName: 'Percentage Calculator',
              path: '/calculators/percentage-calculator',
              description: 'Calculate percent of a number, percentage increase, and reverse percentage.',
            },
            {
              prompt: 'Plot continuous functions?',
              toolName: 'Graphing Calculator',
              path: '/calculators/graphing-calculator',
              description: 'Visual SVG plot for y = f(x) with interactive coordinate inspection.',
            },
          ]}
        />
      </div>
    </div>
  );
}
