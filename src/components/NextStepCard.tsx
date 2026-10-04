import { Link } from '../lib/router';
import { ArrowRight, Compass } from 'lucide-react';

export interface NextStepOption {
  prompt: string;
  toolName: string;
  path: string;
  description: string;
  isAvailable?: boolean;
}

interface NextStepCardProps {
  options: NextStepOption[];
}

export function NextStepCard({ options }: NextStepCardProps) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex items-center gap-2 mb-3 text-slate-900">
        <Compass className="w-4 h-4 text-sky-600" />
        <h3 className="font-semibold text-sm tracking-tight">What Should I Do Next?</h3>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        Statistical calculations rarely end with one metric. Choose your next analytical step:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {options.map((opt, i) => (
          <div
            key={i}
            className="flex flex-col justify-between p-3.5 bg-white border border-slate-200/90 rounded-lg hover:border-slate-300 hover:shadow-xs transition-all"
          >
            <div>
              <span className="text-[11px] font-medium text-slate-600 block mb-1">
                {opt.prompt}
              </span>
              <div className="text-sm font-semibold text-slate-900 mb-1 flex items-center justify-between">
                <span>{opt.toolName}</span>
                {opt.isAvailable === false && (
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-medium border border-amber-200/60">
                    Roadmap
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                {opt.description}
              </p>
            </div>

            {opt.isAvailable === false ? (
              <Link
                to="/calculators"
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors pt-2 border-t border-slate-100"
              >
                <span>View Roadmap Details</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            ) : (
              <Link
                to={opt.path}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors pt-2 border-t border-slate-100"
              >
                <span>Open {opt.toolName}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
