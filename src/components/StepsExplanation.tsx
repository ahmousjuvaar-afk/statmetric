import { useState } from 'react';
import { ChevronDown, Calculator, BookOpen } from 'lucide-react';

interface Step {
  title: string;
  content: string;
}

interface StepsExplanationProps {
  steps: Step[];
  formula?: string;
  title?: string;
  defaultExpanded?: boolean;
}

export function StepsExplanation({
  steps,
  formula,
  title = 'How was this calculated? (Step-by-Step)',
  defaultExpanded = false,
}: StepsExplanationProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2.5">
          <Calculator className="w-4 h-4 text-slate-500" />
          <span className="font-semibold text-slate-900 text-sm">{title}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>{isExpanded ? 'Hide steps' : 'Show steps'}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isExpanded ? 'rotate-180 text-slate-900' : 'text-slate-400'
            }`}
          />
        </div>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4">
          {formula && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-slate-700">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5 font-sans">
                <BookOpen className="w-3.5 h-3.5" /> Mathematical Reference Formula
              </div>
              <div className="text-slate-900 text-sm overflow-x-auto py-1 font-mono">
                {formula}
              </div>
            </div>
          )}

          <div className="space-y-3">
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-3 text-xs leading-relaxed">
                <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-semibold flex items-center justify-center shrink-0 text-xs border border-slate-200">
                  {idx + 1}
                </div>
                <div className="pt-0.5">
                  <div className="font-semibold text-slate-900 text-sm mb-0.5">
                    {step.title}
                  </div>
                  <p className="text-slate-600">{step.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
