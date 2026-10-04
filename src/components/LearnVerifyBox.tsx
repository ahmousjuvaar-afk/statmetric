import { useState } from 'react';
import { BookOpen, CheckSquare, GraduationCap, ChevronDown } from 'lucide-react';

interface LearnVerifyBoxProps {
  learnNotes: {
    concept: string;
    intuition: string;
    formulaBreakdown: string;
    commonTrap: string;
  };
  manualCheckSteps: string[];
  classroomExampleTitle?: string;
  onLoadExample?: () => void;
}

export function LearnVerifyBox({
  learnNotes,
  manualCheckSteps,
  classroomExampleTitle,
  onLoadExample,
}: LearnVerifyBoxProps) {
  const [activeTab, setActiveTab] = useState<'learn' | 'verify'>('learn');
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-xs">
      <div className="flex flex-wrap items-center justify-between p-3.5 sm:p-4 bg-slate-50/70 border-b border-slate-200 gap-2">
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-lg text-xs font-medium">
          <button
            onClick={() => {
              setActiveTab('learn');
              setIsExpanded(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'learn' && isExpanded
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Learn How This Works</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('verify');
              setIsExpanded(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'verify' && isExpanded
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Check Your Manual Work</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {onLoadExample && (
            <button
              onClick={onLoadExample}
              className="text-xs text-sky-700 hover:text-sky-900 font-medium inline-flex items-center gap-1 px-2.5 py-1 bg-sky-50 border border-sky-200 rounded-md transition-colors"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{classroomExampleTitle || 'Load Classroom Example'}</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-transform"
            aria-label="Toggle section"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 text-xs sm:text-sm text-slate-700 space-y-4">
          {activeTab === 'learn' ? (
            <div className="space-y-3">
              <div>
                <strong className="text-slate-900 font-semibold block mb-0.5">
                  Core Concept:
                </strong>
                <p className="text-slate-600 leading-relaxed">{learnNotes.concept}</p>
              </div>
              <div>
                <strong className="text-slate-900 font-semibold block mb-0.5">
                  Intuitive Picture:
                </strong>
                <p className="text-slate-600 leading-relaxed">{learnNotes.intuition}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <strong className="text-slate-900 font-semibold block mb-1">
                  Formula Breakdown:
                </strong>
                <p className="font-mono text-xs text-slate-800 leading-relaxed">
                  {learnNotes.formulaBreakdown}
                </p>
              </div>
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-amber-950">
                <strong className="font-semibold block mb-0.5">Common Trap to Avoid:</strong>
                <p className="leading-relaxed">{learnNotes.commonTrap}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-slate-600">
                Doing this calculation with a hand calculator or on paper? Follow these verification checkpoints step-by-step:
              </p>
              <ol className="space-y-2 list-decimal list-inside leading-relaxed text-slate-700">
                {manualCheckSteps.map((step, i) => (
                  <li key={i} className="pl-1">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
