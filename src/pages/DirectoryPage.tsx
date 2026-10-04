import { useState, useEffect } from 'react';
import { Link, useRouter } from '../lib/router';
import { SeoHead } from '../components/SeoHead';
import { Search, ArrowRight, CheckCircle2, Clock, Filter } from 'lucide-react';

export type MainCategory = 'All' | 'Statistics' | 'Research' | 'Probability' | 'Education' | 'Mathematics';

interface ToolItem {
  id: string;
  name: string;
  category: 'Statistics' | 'Research' | 'Probability' | 'Education' | 'Mathematics';
  subCategory: string;
  description: string;
  path: string;
  status: 'active' | 'roadmap';
  phaseLabel: string;
  inputs: string;
  outputs: string;
  formula: string;
}

const TOOLS: ToolItem[] = [
  // --- RESEARCH ---
  {
    id: 'p-value',
    name: 'P-Value Calculator',
    category: 'Research',
    subCategory: 'Hypothesis Testing',
    description: 'Calculate exact p-values for Z, Student’s t, Chi-Square, and Snedecor’s F tests with tail area shading.',
    path: '/calculators/p-value',
    status: 'active',
    phaseLabel: 'Available Now',
    inputs: 'Test statistic, degrees of freedom (df), tail direction, alpha level',
    outputs: 'P-value, significance decision, APA 7 report text, distribution plot',
    formula: 'p = P(T ≥ t | H₀)',
  },
  {
    id: 't-test',
    name: 'Two-Sample T-Test Calculator',
    category: 'Research',
    subCategory: 'Hypothesis Testing',
    description: 'Compare means between two independent groups using Student’s equal variance or Welch’s robust t-test with Cohen’s d effect size.',
    path: '/calculators/t-test',
    status: 'active',
    phaseLabel: 'Available Now',
    inputs: 'Group means, standard deviations, and sample sizes (or raw data)',
    outputs: 't-statistic, df, p-value, Cohen’s d effect magnitude, 95% CI of difference',
    formula: 't = (x̄₁ - x̄₂) / SE_{diff}',
  },
  {
    id: 'confidence-interval',
    name: 'Confidence Interval Calculator',
    category: 'Research',
    subCategory: 'Parameter Estimation',
    description: 'Construct 90%, 95%, and 99% interval estimates for population means (using Student’s t or Z) and proportions.',
    path: '/calculators/confidence-interval',
    status: 'active',
    phaseLabel: 'Available Now',
    inputs: 'Point estimate (mean or successes), SD, sample size, confidence level',
    outputs: 'Margin of Error (ME), lower bound, upper bound, visual error bar',
    formula: '\\text{CI} = \\text{Estimate} \\pm \\text{CritVal} \\times SE',
  },
  // --- PROBABILITY ---
  {
    id: 'normal-dist',
    name: 'Normal Distribution Calculator',
    category: 'Probability',
    subCategory: 'Continuous Distributions',
    description: 'Calculate cumulative probabilities, tail intervals, z-scores, and reverse percentiles under any Gaussian curve.',
    path: '/calculators/normal-distribution',
    status: 'active',
    phaseLabel: 'Available Now',
    inputs: 'Mean (μ), Standard deviation (σ), raw cutoff x or bounds [a, b]',
    outputs: 'Probability %, Z-score, percentile rank, interactive bell curve',
    formula: 'Z = (X - μ) / σ',
  },
  // --- STATISTICS ---
  {
    id: 'z-score',
    name: 'Z-Score Calculator',
    category: 'Statistics',
    subCategory: 'Standardized Scores',
    description: 'Convert raw scores into standard deviations from the mean (z = (x - μ) / σ) or compute reverse raw values from z-scores.',
    path: '/calculators/z-score',
    status: 'active',
    phaseLabel: 'Available Now',
    inputs: 'Raw score x or z-score, distribution mean μ, standard deviation σ',
    outputs: 'Z-score, cumulative percentile, left/right/two-tail areas',
    formula: 'z = (x - \\mu) / \\sigma',
  },
  {
    id: 'standard-dev',
    name: 'Standard Deviation Calculator',
    category: 'Statistics',
    subCategory: 'Descriptive Dispersion',
    description: 'Calculate sample (n - 1 with Bessel correction) and population (N) standard deviation and variance from raw data.',
    path: '/calculators/standard-deviation',
    status: 'active',
    phaseLabel: 'Available Now',
    inputs: 'Raw dataset values (comma, space, or newline separated)',
    outputs: 'Mean, SD, variance, sum of squares, range, IQR, step-by-step table',
    formula: 's = \\sqrt{\\frac{1}{n-1} \\sum(x - \\bar{x})^2}',
  },
  {
    id: 'descriptive-stats',
    name: 'Descriptive Statistics Suite',
    category: 'Statistics',
    subCategory: 'Exploratory Data Analysis',
    description: 'Comprehensive exploratory summary metrics: Mean, Median, Mode, Variance, SD, Range, Quartiles, Skewness, and 5-number summary.',
    path: '/calculators/descriptive-statistics',
    status: 'active',
    phaseLabel: 'Available Now',
    inputs: 'Raw dataset values',
    outputs: 'Mean, median, mode, sample/pop variance, 5-number summary, box plot',
    formula: '\\text{5-Number Summary: [Min, } Q_1, \\text{Med, } Q_3, \\text{Max]}',
  },
  // --- EDUCATION ---
  {
    id: 'gpa',
    name: 'GPA & CGPA Calculator',
    category: 'Education',
    subCategory: 'Academic Standing',
    description: 'Calculate credit-weighted semester Grade Point Average (GPA) and project cumulative CGPA across 4.0, 5.0, and percentage grading scales.',
    path: '/calculators/gpa',
    status: 'active',
    phaseLabel: 'Available Now',
    inputs: 'Course titles, credit hours, letter grades, optional prior CGPA',
    outputs: 'Semester GPA, cumulative CGPA, total credits, academic honors standing',
    formula: '\\text{GPA} = \\frac{\\sum(\\text{Credits}_i \\times \\text{GradePoints}_i)}{\\sum \\text{Credits}_i}',
  },
  {
    id: 'grade-calculator',
    name: 'Final Grade Calculator',
    category: 'Education',
    subCategory: 'Course Grades',
    description: 'Find out exactly what score you need on your final exam to pass or achieve your target course grade, or calculate weighted semester grades.',
    path: '/calculators/grade-calculator',
    status: 'active',
    phaseLabel: 'Available Now',
    inputs: 'Current grade %, target final grade %, final exam weight %',
    outputs: 'Required final exam score %, feasibility assessment, study advice',
    formula: '\\text{Required} = \\frac{\\text{Target} - (\\text{Current} \\times (1 - w))}{w}',
  },
  // --- ROADMAP TOOLS ---
  {
    id: 'sample-size',
    name: 'Sample Size & Power Calculator',
    category: 'Research',
    subCategory: 'Power Analysis',
    description: 'Determine minimum statistical sample size required to detect a target effect size at desired power (1 - β).',
    path: '/calculators',
    status: 'roadmap',
    phaseLabel: 'Roadmap',
    inputs: 'Alpha level, target power (0.80), expected effect size (d or r)',
    outputs: 'Required sample size per arm, total N, power curve',
    formula: 'n = 2 \\times (z_\\alpha/2 + z_\\beta)^2 / d^2',
  },
  {
    id: 'anova',
    name: 'One-Way ANOVA Calculator',
    category: 'Research',
    subCategory: 'Variance Analysis',
    description: 'Omnibus test for difference in means across three or more treatment groups with between/within MS partition.',
    path: '/calculators',
    status: 'roadmap',
    phaseLabel: 'Roadmap',
    inputs: 'Three or more continuous numeric treatment groups',
    outputs: 'ANOVA source table (SS, df, MS, F-ratio), p-value, eta-squared (η²)',
    formula: 'F = MS_{between} / MS_{within}',
  },
  {
    id: 'correlation',
    name: 'Pearson Correlation & Regression',
    category: 'Mathematics',
    subCategory: 'Linear Association',
    description: 'Measure the linear bivariate association between two continuous paired variables with ordinary least squares fit.',
    path: '/calculators',
    status: 'roadmap',
    phaseLabel: 'Roadmap',
    inputs: 'Paired (x, y) coordinates or data columns',
    outputs: 'r coefficient, r², slope β₁, intercept β₀, residual standard error',
    formula: 'r = \\frac{\\sum(x - \\bar{x})(y - \\bar{y})}{\\sqrt{\\sum(x - \\bar{x})^2 \\sum(y - \\bar{y})^2}}',
  },
];

export function DirectoryPage() {
  const { currentPath } = useRouter();
  const [filterCategory, setFilterCategory] = useState<MainCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle URL query parameter ?cat=...
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchStr = currentPath.includes('?') ? currentPath.substring(currentPath.indexOf('?')) : window.location.search;
      const params = new URLSearchParams(searchStr);
      const catParam = params.get('cat') as MainCategory;
      if (catParam && ['Statistics', 'Research', 'Probability', 'Education', 'Mathematics'].includes(catParam)) {
        setFilterCategory(catParam);
      } else if (!catParam) {
        setFilterCategory('All');
      }
    }
  }, [currentPath]);

  const categories: MainCategory[] = [
    'All',
    'Statistics',
    'Research',
    'Probability',
    'Education',
    'Mathematics',
  ];

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory = filterCategory === 'All' || tool.category === filterCategory;
    const matchesQuery =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.inputs.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.subCategory.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const activeCount = filteredTools.filter((t) => t.status === 'active').length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SeoHead
        title="Calculators Directory — Statistics, Research, Education & Mathematics"
        description="Comprehensive directory of free calculators for students, researchers, and analysts. Compute p-values, t-tests, confidence intervals, normal distributions, standard deviations, and GPAs."
        path="/calculators"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Calculators', path: '/calculators' },
        ]}
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Calculators Directory
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Explore peer-reviewed calculation utilities organized across Statistics, Research, Probability, Education, and Mathematics. Every tool provides step-by-step mathematical traces and APA 7th edition report wording.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs mb-8 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by tool name, task (e.g. 'compare two groups', 'gpa', 'variance')..."
            className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  filterCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Showing {activeCount} available tool{activeCount === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Tools List */}
      <div className="space-y-4">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className={`border rounded-xl p-5 transition-all ${
              tool.status === 'active'
                ? 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                : 'bg-slate-50/70 border-slate-200/80 opacity-80'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-semibold text-slate-700">{tool.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{tool.subCategory}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-slate-600">{tool.formula}</span>
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  {tool.name}
                </h2>
              </div>

              {/* Status Indicator */}
              <div>
                {tool.status === 'active' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Available</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>{tool.phaseLabel}</span>
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 mb-3 leading-relaxed">
              {tool.description}
            </p>

            {/* Inputs & Outputs Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50/80 p-2.5 rounded-lg border border-slate-100 mb-3">
              <div>
                <strong className="text-slate-700 font-semibold">Inputs: </strong>
                <span className="text-slate-600">{tool.inputs}</span>
              </div>
              <div>
                <strong className="text-slate-700 font-semibold">Outputs: </strong>
                <span className="text-slate-600">{tool.outputs}</span>
              </div>
            </div>

            {/* Action */}
            <div className="flex items-center justify-end">
              {tool.status === 'active' ? (
                <Link
                  to={tool.path}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                >
                  <span>Open {tool.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <span className="text-xs text-slate-500 font-medium">
                  Architected for {tool.phaseLabel} release
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
