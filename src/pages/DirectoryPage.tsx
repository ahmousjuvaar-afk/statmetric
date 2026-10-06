import { useState, useEffect } from 'react';
import { Link, useRouter } from '../lib/router';
import { SeoHead } from '../components/SeoHead';
import { ToolIcon, CategoryIcon } from '../components/ToolIcon';
import { Search, ArrowRight, CheckCircle2 } from 'lucide-react';

export type MainCategory =
  | 'All'
  | 'Mathematics'
  | 'Statistics'
  | 'Research'
  | 'Probability'
  | 'Education'
  | 'Converters'
  | 'Date & Time';

interface ToolItem {
  id: string;
  name: string;
  category: 'Mathematics' | 'Statistics' | 'Research' | 'Probability' | 'Education' | 'Converters' | 'Date & Time';
  subCategory: string;
  description: string;
  path: string;
  status: 'active';
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
  {
    id: 'anova',
    name: 'One-Way ANOVA Calculator',
    category: 'Research',
    subCategory: 'Variance Analysis',
    description: 'Omnibus test for difference in means across three or more treatment groups with between/within MS partition and eta-squared.',
    path: '/calculators/anova',
    status: 'active',
    phaseLabel: 'Available Now',
    inputs: 'Treatment groups with continuous numeric observations',
    outputs: 'ANOVA source table (SS, df, MS, F-ratio), p-value, eta-squared (η²), APA 7',
    formula: 'F = MS_{between} / MS_{within}',
  },
  {
    id: 'chi-square',
    name: 'Chi-Square Test of Independence',
    category: 'Research',
    subCategory: 'Categorical Analysis',
    description: 'Evaluate association between two categorical variables in r × c contingency tables with expected counts and Cramér’s V.',
    path: '/calculators/chi-square',
    status: 'active',
    phaseLabel: 'Available Now',
    inputs: 'Observed contingency table counts (2×2 to 5×5)',
    outputs: 'χ² statistic, degrees of freedom, p-value, expected frequencies matrix, Cramér’s V',
    formula: '\\chi^2 = \\sum \\frac{(O - E)^2}{E}',
  },
  {
    id: 'sample-size',
    name: 'Sample Size & Power Calculator',
    category: 'Research',
    subCategory: 'Power Analysis & Surveys',
    description: 'Determine required sample size for independent two-sample t-tests (at 80% power) and survey populations with margin of error.',
    path: '/calculators/sample-size',
    status: 'active',
    phaseLabel: 'Available Now',
    inputs: 'Target effect size (Cohen’s d) or survey margin of error, confidence level, alpha',
    outputs: 'Required sample size per group, total study N, finite population correction',
    formula: 'n = 2(z_{\\alpha/2} + z_\\beta)^2 / d^2',
  },
  {
    id: 'test-selector',
    name: 'Statistical Test Selector',
    category: 'Research',
    subCategory: 'Methodology Guidance',
    description: 'Interactive diagnostic decision wizard matching research design questions and variable scales to appropriate statistical tests.',
    path: '/calculators/test-selector',
    status: 'active',
    phaseLabel: 'Available Now',
    inputs: 'Research goal, measurement scale, number of groups, normality',
    outputs: 'Recommended parametric test, non-parametric alternative, key assumptions checklist',
    formula: '\\text{Decision Tree Matrix}',
  },

  // --- STATISTICS ---
  {
    id: 'standard-deviation',
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
  {
    id: 'correlation-regression',
    name: 'Pearson Correlation & Linear Regression',
    category: 'Statistics',
    subCategory: 'Bivariate Association',
    description: 'Measure linear association with Pearson r, R² variance explained, and fit ordinary least squares regression line y = mx + b.',
    path: '/calculators/correlation-regression',
    status: 'active',
    phaseLabel: 'Available Now',
    inputs: 'Paired (x, y) coordinates or data columns',
    outputs: 'r coefficient, r², slope β₁, intercept β₀, residual standard error, p-value',
    formula: 'r = \\frac{\\sum(x - \\bar{x})(y - \\bar{y})}{\\sqrt{\\sum(x - \\bar{x})^2 \\sum(y - \\bar{y})^2}}',
  },

  // --- PROBABILITY ---
  {
    id: 'normal-dist',
    name: 'Normal Distribution Calculator',
    category: 'Probability',
    subCategory: 'Continuous Distributions',
    description: 'Calculate cumulative probabilities, tail intervals, z-scores, and reverse percentiles under any Gaussian bell curve.',
    path: '/calculators/normal-distribution',
    status: 'active',
    phaseLabel: 'Available Now',
    inputs: 'Mean (μ), Standard deviation (σ), raw cutoff x or bounds [a, b]',
    outputs: 'Probability %, Z-score, percentile rank, interactive bell curve',
    formula: 'Z = (X - μ) / σ',
  },
  {
    id: 'binomial-distribution',
    name: 'Binomial & Poisson Probability',
    category: 'Probability',
    subCategory: 'Discrete Distributions',
    description: 'Compute exact and cumulative probabilities for Bernoulli trials (Binomial), arrival counts (Poisson), and Bayes’ theorem.',
    path: '/calculators/binomial-distribution',
    status: 'active',
    phaseLabel: 'Available Now',
    inputs: 'Trials n, success probability p, target count k (or Poisson λ)',
    outputs: 'P(X = k), cumulative P(X ≤ k), distribution mean, variance, Bayes posterior',
    formula: 'P(X = k) = \\binom{n}{k} p^k (1 - p)^{n - k}',
  },

  // --- MATHEMATICS ---
  {
    id: 'scientific-calculator',
    name: 'Scientific & Standard Calculator',
    category: 'Mathematics',
    subCategory: 'Arithmetic & Algebraic',
    description: 'Safe, high-precision expression evaluator with powers, roots, trigonometry, logs, factorial, degree/radian modes, and history.',
    path: '/calculators/scientific-calculator',
    status: 'active',
    phaseLabel: 'Available Now',
    inputs: 'Mathematical expressions with full operator precedence (PEMDAS)',
    outputs: 'Exact numerical result, formatted scientific notation, history stack',
    formula: '\\text{Algebraic Syntax Evaluator}',
  },
  {
    id: 'fraction-calculator',
    name: 'Fraction Calculator',
    category: 'Mathematics',
    subCategory: 'Rational Numbers',
    description: 'Add, subtract, multiply, and divide fractions with automatic greatest common divisor (GCD) reduction and mixed numbers.',
    path: '/calculators/fraction-calculator',
    status: 'active',
    phaseLabel: 'Available Now',
    inputs: 'Two fractional numerators and denominators',
    outputs: 'Simplified fraction, mixed number, decimal equivalent, step-by-step LCM/GCD',
    formula: '\\frac{a}{b} \\pm \\frac{c}{d} = \\frac{ad \\pm bc}{bd}',
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    category: 'Mathematics',
    subCategory: 'Proportions & Rates',
    description: 'Calculate percent of a number, percentage increase/decrease, percentage difference, and reverse original values.',
    path: '/calculators/percentage-calculator',
    status: 'active',
    phaseLabel: 'Available Now',
    inputs: 'Base numbers and percentages across 5 distinct quantitative modes',
    outputs: 'Calculated percentage, absolute difference, rate of change %, reverse base',
    formula: '\\text{Result} = (P / 100) \\times X',
  },
  {
    id: 'ratio-calculator',
    name: 'Ratio & Proportion Calculator',
    category: 'Mathematics',
    subCategory: 'Proportions',
    description: 'Simplify ratios A:B:C to lowest whole numbers and solve for unknown terms in proportion equations (A/B = C/D).',
    path: '/calculators/ratio-calculator',
    status: 'active',
    phaseLabel: 'Available Now',
    inputs: 'Ratio terms (A:B or A:B:C) or 3 terms of proportion A/B = C/D',
    outputs: 'Simplified ratio, solved missing term, cross-multiplication steps',
    formula: 'A \\times D = B \\times C',
  },
  {
    id: 'graphing-calculator',
    name: 'Graphing Calculator',
    category: 'Mathematics',
    subCategory: 'Functions & Plots',
    description: 'Interactive SVG function grapher for y = f(x) with live coordinate inspection, zoom, pan, grid lines, and preset functions.',
    path: '/calculators/graphing-calculator',
    status: 'active',
    phaseLabel: 'Available Now',
    inputs: 'Mathematical function f(x), x-domain and y-range boundaries',
    outputs: 'Continuous SVG curve, coordinate trace on mouseover, zero-crossings',
    formula: 'y = f(x)',
  },

  // --- CONVERTERS ---
  {
    id: 'unit-converter',
    name: 'Unit Converter Suite',
    category: 'Converters',
    subCategory: 'Physical & Digital Units',
    description: 'Comprehensive conversion across 8 domains: Length, Mass, Temperature, Area, Volume, Velocity, Time, and Data storage.',
    path: '/calculators/unit-converter',
    status: 'active',
    phaseLabel: 'Available Now',
    inputs: 'Source quantity, source unit, target unit',
    outputs: 'Converted value, exact formula, full domain conversion table',
    formula: '\\text{Value}_{target} = \\text{Value}_{base} \\times \\text{Factor}',
  },

  // --- DATE & TIME ---
  {
    id: 'date-calculator',
    name: 'Date & Time Calculator',
    category: 'Date & Time',
    subCategory: 'Chronometry',
    description: 'Calculate calendar ages, exact business days excluding weekends, calendar breakdowns, and clock durations across midnight.',
    path: '/calculators/date-calculator',
    status: 'active',
    phaseLabel: 'Available Now',
    inputs: 'Calendar dates (YYYY-MM-DD) or clock times (HH:MM)',
    outputs: 'Years/months/days, total days lived, business days (Mon-Fri), elapsed hours/mins',
    formula: '\\Delta t = t_{end} - t_{start}',
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
];

export function DirectoryPage() {
  const { currentPath } = useRouter();
  const [filterCategory, setFilterCategory] = useState<MainCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle URL query parameter ?cat=...
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchStr = currentPath.includes('?')
        ? currentPath.substring(currentPath.indexOf('?'))
        : window.location.search;
      const params = new URLSearchParams(searchStr);
      const catParam = params.get('cat') as MainCategory;
      if (
        catParam &&
        ['Mathematics', 'Statistics', 'Research', 'Probability', 'Education', 'Converters', 'Date & Time'].includes(
          catParam
        )
      ) {
        setFilterCategory(catParam);
      } else if (!catParam) {
        setFilterCategory('All');
      }
    }
  }, [currentPath]);

  const categories: MainCategory[] = [
    'All',
    'Mathematics',
    'Statistics',
    'Research',
    'Probability',
    'Education',
    'Converters',
    'Date & Time',
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SeoHead
        title="Calculators Directory — Mathematics, Statistics, Research & Tools | StatMetric"
        description="Comprehensive directory of free quantitative calculators. Mathematics, Statistics, Inferential Research, Probability, Education, Unit Converters, and Date/Time."
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
          Explore peer-reviewed quantitative tools organized across Mathematics, Statistics, Research, Probability, Education, Unit Converters, and Date/Time. Every tool provides mathematical traces and APA 7th edition report wording.
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
            placeholder="Search by tool name, task (e.g. 'compare two groups', 'p-value', 'fractions', 'anova')..."
            className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        {/* Category Filter Tabs with CategoryIcon */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  filterCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                }`}
              >
                <CategoryIcon category={cat} size="sm" showBackground={false} />
                <span>{cat}</span>
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredTools.length} tool{filteredTools.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Tools List with ToolIcon for Every Tool */}
      <div className="space-y-4">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
              <div className="flex items-start gap-3">
                {/* Visual Tool Icon */}
                <ToolIcon toolId={tool.id} size="md" />

                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                    <span className="font-semibold text-slate-700">{tool.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{tool.subCategory}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-500">{tool.formula}</span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900">
                    {tool.name}
                  </h2>
                </div>
              </div>

              {/* Status Indicator */}
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Available</span>
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 mb-3 leading-relaxed pl-12 sm:pl-12">
              {tool.description}
            </p>

            {/* Inputs & Outputs Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50/80 p-2.5 rounded-lg border border-slate-100 mb-3 ml-0 sm:ml-12">
              <div>
                <strong className="text-slate-700 font-semibold">Inputs: </strong>
                <span className="text-slate-600">{tool.inputs}</span>
              </div>
              <div>
                <strong className="text-slate-700 font-semibold">Outputs: </strong>
                <span className="text-slate-600">{tool.outputs}</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex items-center justify-end">
              <Link
                to={tool.path}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-blue-600 transition-colors"
              >
                <span>Open {tool.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
