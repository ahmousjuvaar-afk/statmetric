import { useState, useEffect } from 'react';
import { useRouter } from '../lib/router';
import { Search, Compass, BookOpen, Sparkles, X, ArrowRight } from 'lucide-react';

interface SearchItem {
  title: string;
  category: string;
  path: string;
  description: string;
  keywords: string[];
  isAvailable: boolean;
}

const SEARCH_DATABASE: SearchItem[] = [
  {
    title: 'P-Value Calculator',
    category: 'Research',
    path: '/calculators/p-value',
    description: 'Calculate p-values for Z, Student t, Chi-Square, and F distributions with tail interpretations.',
    keywords: ['p value', 'hypothesis', 't test', 'z score', 'chi square', 'f test', 'significance', 'alpha', 'null hypothesis', 'i need to find a p value'],
    isAvailable: true,
  },
  {
    title: 'Two-Sample T-Test Calculator',
    category: 'Research',
    path: '/calculators/t-test',
    description: 'Compare means between two independent groups using Student’s or Welch’s t-test with Cohen’s d effect size.',
    keywords: ['t test', 't-test', 'compare two groups', 'compare means', 'welch', 'independent t test', 'cohen d', 'i need to compare two groups'],
    isAvailable: true,
  },
  {
    title: 'Confidence Interval Calculator',
    category: 'Research',
    path: '/calculators/confidence-interval',
    description: 'Calculate 90%, 95%, and 99% confidence intervals for population means (t & Z) and sample proportions.',
    keywords: ['confidence interval', 'margin of error', 'interval estimate', 'ci', 'mean interval', 'proportion interval', 'i need an interval estimate'],
    isAvailable: true,
  },
  {
    title: 'Normal Distribution Calculator',
    category: 'Probability',
    path: '/calculators/normal-distribution',
    description: 'Calculate probabilities, z-scores, percentiles, and shaded areas under the Gaussian bell curve.',
    keywords: ['normal distribution', 'bell curve', 'gaussian', 'z score', 'percentile', 'probability', 'inverse normal', 'mean', 'standard deviation', 'i need to calculate probability'],
    isAvailable: true,
  },
  {
    title: 'Z-Score Calculator',
    category: 'Statistics',
    path: '/calculators/z-score',
    description: 'Convert raw scores to standard deviations from the mean (z = (x - μ) / σ) or find reverse raw scores.',
    keywords: ['z score', 'z-score', 'standard score', 'distance from mean', 'standardize', 'i want to know how far a value is from the mean'],
    isAvailable: true,
  },
  {
    title: 'Standard Deviation Calculator',
    category: 'Statistics',
    path: '/calculators/standard-deviation',
    description: 'Compute sample (n-1) and population (N) standard deviation, variance, mean, and IQR from raw data.',
    keywords: ['standard deviation', 'variance', 'mean', 'sample', 'population', 'spread', 'iqr', 'median', 'bessel correction', 'spread of data', 'i need to calculate standard deviation'],
    isAvailable: true,
  },
  {
    title: 'Descriptive Statistics Suite',
    category: 'Statistics',
    path: '/calculators/descriptive-statistics',
    description: 'Comprehensive exploratory summary metrics: Mean, Median, Mode, Variance, SD, Range, Quartiles, and 5-number summary.',
    keywords: ['descriptive statistics', 'mean', 'median', 'mode', 'summary statistics', 'box plot', '5 number summary', 'skewness', 'quartiles'],
    isAvailable: true,
  },
  {
    title: 'GPA & CGPA Calculator',
    category: 'Education',
    path: '/calculators/gpa',
    description: 'Calculate credit-weighted semester GPA and project cumulative CGPA across 4.0, 5.0, and percentage grading scales.',
    keywords: ['gpa', 'cgpa', 'grade point average', 'calculate gpa', 'cumulative gpa', 'semester gpa', 'grades', 'college gpa', 'i want to calculate my gpa'],
    isAvailable: true,
  },
  {
    title: 'Final Grade Calculator',
    category: 'Education',
    path: '/calculators/grade-calculator',
    description: 'Calculate what score you need on your final exam to achieve your desired target course grade.',
    keywords: ['grade calculator', 'final grade calculator', 'what grade do i need', 'final exam', 'target grade', 'weighted grade', 'exam score'],
    isAvailable: true,
  },
  // Research Guides
  {
    title: 'What Is a P-Value (And What It Isn’t)?',
    category: 'Research Guide',
    path: '/guides/what-is-a-p-value',
    description: 'Clear, accurate guide explaining the true meaning of p-values and how to avoid common misconceptions.',
    keywords: ['guide', 'what is p value', 'interpretation', 'common mistakes', 'null hypothesis'],
    isAvailable: true,
  },
  {
    title: 'Sample vs. Population Standard Deviation',
    category: 'Research Guide',
    path: '/guides/sample-vs-population',
    description: 'Why we divide by n-1 instead of n: understanding Bessel’s correction and bias in variance estimation.',
    keywords: ['guide', 'sample vs population', 'bessel correction', 'degrees of freedom', 'variance bias'],
    isAvailable: true,
  },
  {
    title: 'Understanding the Normal Distribution & Bell Curve',
    category: 'Research Guide',
    path: '/guides/normal-distribution-guide',
    description: 'The 68-95-99.7 empirical rule, z-scores, and how Gaussian models underpin statistical inference.',
    keywords: ['guide', 'bell curve', 'empirical rule', 'z-score formula', 'central limit theorem'],
    isAvailable: true,
  },
  // Future roadmap search items
  {
    title: 'Sample Size & Power Calculator',
    category: 'Research (Roadmap)',
    path: '/calculators',
    description: 'Determine required sample size for statistical power 0.80 at alpha 0.05 (In Development).',
    keywords: ['sample size', 'power analysis', 'effect size', 'cohen d', 'i need to know how many people i need for my survey'],
    isAvailable: false,
  },
  {
    title: 'One-Way ANOVA Calculator',
    category: 'Research (Roadmap)',
    path: '/calculators',
    description: 'Compare means across three or more treatment groups with F-ratio tests (In Development).',
    keywords: ['anova', 'analysis of variance', 'three groups', 'f ratio'],
    isAvailable: false,
  },
  {
    title: 'Pearson Correlation & Regression',
    category: 'Mathematics (Roadmap)',
    path: '/calculators',
    description: 'Bivariate linear relationship and ordinary least squares regression (In Development).',
    keywords: ['correlation', 'regression', 'linear regression', 'pearson r', 'scatter plot'],
    isAvailable: false,
  },
];

export function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const { navigate } = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();
  const results = normalizedQuery
    ? SEARCH_DATABASE.filter(
        (item) =>
          item.title.toLowerCase().includes(normalizedQuery) ||
          item.description.toLowerCase().includes(normalizedQuery) ||
          item.keywords.some((k) => k.includes(normalizedQuery))
      )
    : SEARCH_DATABASE.slice(0, 6);

  const handleSelect = (item: SearchItem) => {
    if (item.isAvailable) {
      navigate(item.path);
      onClose();
    } else {
      navigate('/calculators');
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search statistical tools and guides"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-slate-200">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by tool, task (e.g. 'p-value', 'bell curve', 'compare means')..."
            className="w-full px-3 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Close search dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100">
          {results.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              No statistical tools found matching &ldquo;{query}&rdquo;.
            </div>
          ) : (
            results.map((item) => (
              <button
                key={item.title}
                onClick={() => handleSelect(item)}
                className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors flex items-start justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                    <span>{item.category}</span>
                    {!item.isAvailable && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-700 font-medium">Roadmap</span>
                      </>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                    {item.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 shrink-0 mt-1 transition-colors" />
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Tip: Try searching statistical goals like &ldquo;variance&rdquo; or &ldquo;percentile&rdquo;</span>
          <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">
            ESC to close
          </kbd>
        </div>
      </div>
    </div>
  );
}
