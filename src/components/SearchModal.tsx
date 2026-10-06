import { useState, useEffect } from 'react';
import { useRouter } from '../lib/router';
import { ToolIcon, ToolId } from './ToolIcon';
import { Search, X, ArrowRight } from 'lucide-react';

interface SearchItem {
  id: ToolId;
  title: string;
  category: string;
  path: string;
  description: string;
  keywords: string[];
  isAvailable: boolean;
}

const SEARCH_DATABASE: SearchItem[] = [
  // --- RESEARCH ---
  {
    id: 'p-value',
    title: 'P-Value Calculator',
    category: 'Research',
    path: '/calculators/p-value',
    description: 'Calculate exact p-values for Z, Student t, Chi-Square, and F distributions with tail interpretations.',
    keywords: ['p value', 'hypothesis', 't test', 'z score', 'chi square', 'f test', 'significance', 'alpha', 'null hypothesis', 'i need to find a p value'],
    isAvailable: true,
  },
  {
    id: 't-test',
    title: 'Two-Sample T-Test Calculator',
    category: 'Research',
    path: '/calculators/t-test',
    description: 'Compare means between two independent groups using Student’s or Welch’s t-test with Cohen’s d effect size.',
    keywords: ['t test', 't-test', 'compare two groups', 'compare means', 'welch', 'independent t test', 'cohen d', 'i need to compare two groups'],
    isAvailable: true,
  },
  {
    id: 'confidence-interval',
    title: 'Confidence Interval Calculator',
    category: 'Research',
    path: '/calculators/confidence-interval',
    description: 'Calculate 90%, 95%, and 99% confidence intervals for population means (t & Z) and sample proportions.',
    keywords: ['confidence interval', 'margin of error', 'interval estimate', 'ci', 'mean interval', 'proportion interval', 'i need an interval estimate'],
    isAvailable: true,
  },
  {
    id: 'anova',
    title: 'One-Way ANOVA Calculator',
    category: 'Research',
    path: '/calculators/anova',
    description: 'Compare means across three or more treatment groups with omnibus F-test and eta-squared effect size.',
    keywords: ['anova', 'analysis of variance', 'three groups', 'f ratio', 'f test', 'compare 3 groups'],
    isAvailable: true,
  },
  {
    id: 'chi-square',
    title: 'Chi-Square Test Calculator',
    category: 'Research',
    path: '/calculators/chi-square',
    description: 'Chi-Square test of independence for r × c contingency tables with expected frequencies and Cramér’s V.',
    keywords: ['chi square', 'contingency table', 'independence', 'cramer v', 'frequencies', 'categorical test'],
    isAvailable: true,
  },
  {
    id: 'sample-size',
    title: 'Sample Size & Power Calculator',
    category: 'Research',
    path: '/calculators/sample-size',
    description: 'Determine required sample size for statistical power 0.80 and survey populations with margin of error.',
    keywords: ['sample size', 'power analysis', 'how many subjects', 'margin of error', 'survey sample', 'cohen d'],
    isAvailable: true,
  },
  {
    id: 'test-selector',
    title: 'Statistical Test Selector',
    category: 'Research',
    path: '/calculators/test-selector',
    description: 'Interactive guided methodology wizard matching research variables and study designs to proper tests.',
    keywords: ['which test to use', 'test selector', 'statistical test', 'decision tree', 'parametric vs non parametric'],
    isAvailable: true,
  },

  // --- PROBABILITY ---
  {
    id: 'normal-distribution',
    title: 'Normal Distribution Calculator',
    category: 'Probability',
    path: '/calculators/normal-distribution',
    description: 'Calculate probabilities, z-scores, percentiles, and shaded areas under the Gaussian bell curve.',
    keywords: ['normal distribution', 'bell curve', 'gaussian', 'z score', 'percentile', 'probability', 'inverse normal', 'mean', 'standard deviation', 'i need to calculate probability'],
    isAvailable: true,
  },
  {
    id: 'binomial-distribution',
    title: 'Binomial & Poisson Probability',
    category: 'Probability',
    path: '/calculators/binomial-distribution',
    description: 'Compute exact discrete probabilities for Binomial trials, Poisson arrival rates, and Bayes’ theorem.',
    keywords: ['binomial', 'poisson', 'bayes theorem', 'discrete probability', 'bernoulli', 'trials', 'prior probability'],
    isAvailable: true,
  },

  // --- STATISTICS ---
  {
    id: 'standard-deviation',
    title: 'Standard Deviation Calculator',
    category: 'Statistics',
    path: '/calculators/standard-deviation',
    description: 'Compute sample (n-1) and population (N) standard deviation, variance, mean, and IQR from raw data.',
    keywords: ['standard deviation', 'variance', 'mean', 'sample', 'population', 'spread', 'iqr', 'median', 'bessel correction', 'spread of data', 'i need to calculate standard deviation'],
    isAvailable: true,
  },
  {
    id: 'z-score',
    title: 'Z-Score Calculator',
    category: 'Statistics',
    path: '/calculators/z-score',
    description: 'Convert raw scores to standard deviations from the mean (z = (x - μ) / σ) or find reverse raw scores.',
    keywords: ['z score', 'z-score', 'standard score', 'distance from mean', 'standardize', 'i want to know how far a value is from the mean'],
    isAvailable: true,
  },
  {
    id: 'descriptive-statistics',
    title: 'Descriptive Statistics Suite',
    category: 'Statistics',
    path: '/calculators/descriptive-statistics',
    description: 'Comprehensive exploratory summary metrics: Mean, Median, Mode, Variance, SD, Range, Quartiles, and 5-number summary.',
    keywords: ['descriptive statistics', 'mean', 'median', 'mode', 'summary statistics', 'box plot', '5 number summary', 'skewness', 'quartiles'],
    isAvailable: true,
  },
  {
    id: 'correlation-regression',
    title: 'Pearson Correlation & Linear Regression',
    category: 'Statistics',
    path: '/calculators/correlation-regression',
    description: 'Measure linear association with Pearson r, R² variance explained, and fit ordinary least squares regression line.',
    keywords: ['correlation', 'regression', 'linear regression', 'pearson r', 'scatter plot', 'slope', 'intercept', 'ols'],
    isAvailable: true,
  },

  // --- MATHEMATICS ---
  {
    id: 'scientific-calculator',
    title: 'Scientific & Standard Calculator',
    category: 'Mathematics',
    path: '/calculators/scientific-calculator',
    description: 'Safe, high-precision expression evaluator with powers, roots, trigonometry, logs, factorial, and degree/radian modes.',
    keywords: ['calculator', 'scientific calculator', 'arithmetic', 'trigonometry', 'sin', 'cos', 'tan', 'square root', 'log', 'factorial'],
    isAvailable: true,
  },
  {
    id: 'fraction-calculator',
    title: 'Fraction Calculator',
    category: 'Mathematics',
    path: '/calculators/fraction-calculator',
    description: 'Add, subtract, multiply, and divide fractions with greatest common divisor (GCD) simplification and mixed numbers.',
    keywords: ['fraction', 'fractions', 'divide fractions', 'simplify fraction', 'mixed numbers', 'improper fraction', 'lcd', 'gcd'],
    isAvailable: true,
  },
  {
    id: 'percentage-calculator',
    title: 'Percentage Calculator',
    category: 'Mathematics',
    path: '/calculators/percentage-calculator',
    description: 'Calculate percent of a number, percentage increase/decrease, percentage difference, and reverse original values.',
    keywords: ['percentage', 'percent', 'percent change', 'percent increase', 'percent decrease', 'discount', 'markup', 'reverse percent'],
    isAvailable: true,
  },
  {
    id: 'ratio-calculator',
    title: 'Ratio & Proportion Calculator',
    category: 'Mathematics',
    path: '/calculators/ratio-calculator',
    description: 'Simplify ratios A:B:C to lowest terms and solve for missing terms in proportional fractions (A/B = C/D).',
    keywords: ['ratio', 'proportion', 'simplify ratio', 'cross multiplication', 'equivalent ratio', 'solve proportion'],
    isAvailable: true,
  },
  {
    id: 'graphing-calculator',
    title: 'Graphing Calculator',
    category: 'Mathematics',
    path: '/calculators/graphing-calculator',
    description: 'Interactive SVG function grapher for y = f(x) with live coordinate inspection, zoom, pan, and preset curves.',
    keywords: ['graph', 'graphing calculator', 'plot function', 'curve', 'parabola', 'sine wave', 'coordinates'],
    isAvailable: true,
  },

  // --- CONVERTERS ---
  {
    id: 'unit-converter',
    title: 'Unit Converter Suite',
    category: 'Converters',
    path: '/calculators/unit-converter',
    description: 'Convert across 8 physical domains: Length, Mass, Temperature, Area, Volume, Speed, Time, and Digital Storage.',
    keywords: ['converter', 'unit converter', 'metric to imperial', 'celsius to fahrenheit', 'kg to lbs', 'meters to feet', 'bytes to mb'],
    isAvailable: true,
  },

  // --- DATE & TIME ---
  {
    id: 'date-calculator',
    title: 'Date & Time Calculator',
    category: 'Date & Time',
    path: '/calculators/date-calculator',
    description: 'Calculate exact calendar age, business days excluding weekends, calendar differences, and elapsed time durations.',
    keywords: ['date calculator', 'age calculator', 'how old am i', 'business days', 'date difference', 'time duration', 'hours between times'],
    isAvailable: true,
  },

  // --- EDUCATION ---
  {
    id: 'gpa',
    title: 'GPA & CGPA Calculator',
    category: 'Education',
    path: '/calculators/gpa',
    description: 'Calculate credit-weighted semester GPA and project cumulative CGPA across 4.0, 5.0, and percentage grading scales.',
    keywords: ['gpa', 'cgpa', 'grade point average', 'calculate gpa', 'cumulative gpa', 'semester gpa', 'grades', 'college gpa', 'i want to calculate my gpa'],
    isAvailable: true,
  },
  {
    id: 'grade-calculator',
    title: 'Final Grade Calculator',
    category: 'Education',
    path: '/calculators/grade-calculator',
    description: 'Calculate what score you need on your final exam to achieve your desired target course grade.',
    keywords: ['grade calculator', 'final grade calculator', 'what grade do i need', 'final exam', 'target grade', 'weighted grade', 'exam score'],
    isAvailable: true,
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
        onClose();
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
    : SEARCH_DATABASE.slice(0, 7);

  const handleSelect = (item: SearchItem) => {
    navigate(item.path);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search quantitative tools and calculators"
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
            placeholder="Search by tool, task (e.g. 'p-value', 'bell curve', 'fractions', 'anova')..."
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
              No tools found matching &ldquo;{query}&rdquo;.
            </div>
          ) : (
            results.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  {/* ToolIcon for search result */}
                  <ToolIcon toolId={item.id} size="sm" />

                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-0.5">
                      <span>{item.category}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {item.title}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 shrink-0 transition-colors" />
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Tip: Try searching math & research goals like &ldquo;variance&rdquo;, &ldquo;anova&rdquo;, or &ldquo;converters&rdquo;</span>
          <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">
            ESC to close
          </kbd>
        </div>
      </div>
    </div>
  );
}
