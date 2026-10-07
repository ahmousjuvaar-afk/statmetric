import { Link } from '../lib/router';
import { SeoHead } from '../components/SeoHead';
import { Search, ArrowRight } from 'lucide-react';
import { StatMetricLogo } from '../components/StatMetricLogo';

export function NotFoundPage({ onOpenSearch }: { onOpenSearch: () => void }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center">
      <SeoHead
        title="Page Not Found — Quantitative Directory"
        description="The requested page could not be found. Find the statistical calculator you need using our directory or quick links."
        path="/404"
      />

      <div className="flex justify-center mb-5">
        <StatMetricLogo variant="symbol" size="lg" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
        Find a Statistical Calculator
      </h1>
      <p className="text-sm text-slate-600 mb-8 max-w-md mx-auto">
        We couldn&apos;t find the specific URL you requested. Choose one of our core statistical tools below or search the platform.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left mb-8">
        <Link
          to="/calculators/p-value"
          className="p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all shadow-xs block group"
        >
          <div className="text-xs text-slate-500 font-medium mb-1">Inference</div>
          <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            P-Value Calculator
          </div>
          <p className="text-xs text-slate-500 mt-1">Z, t, χ², and F distributions</p>
        </Link>

        <Link
          to="/calculators/normal-distribution"
          className="p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all shadow-xs block group"
        >
          <div className="text-xs text-slate-500 font-medium mb-1">Distributions</div>
          <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            Normal Distribution
          </div>
          <p className="text-xs text-slate-500 mt-1">Bell curve, tails & z-scores</p>
        </Link>

        <Link
          to="/calculators/standard-deviation"
          className="p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all shadow-xs block group"
        >
          <div className="text-xs text-slate-500 font-medium mb-1">Descriptive</div>
          <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            Standard Deviation
          </div>
          <p className="text-xs text-slate-500 mt-1">Sample (n-1) & population (N)</p>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onOpenSearch}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search All Calculators</span>
        </button>
        <Link
          to="/calculators"
          className="px-5 py-2.5 bg-white text-slate-800 border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
        >
          <span>View Complete Directory</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
