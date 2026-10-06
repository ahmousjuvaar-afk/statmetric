import { Link } from '../lib/router';
import { SeoHead } from '../components/SeoHead';
import { ToolIcon, CategoryIcon, ToolId, CategoryName } from '../components/ToolIcon';
import { ArrowRight, Search, CheckCircle2 } from 'lucide-react';

export function HomePage({ onOpenSearch }: { onOpenSearch: () => void }) {
  const featuredTools: {
    id: ToolId;
    title: string;
    description: string;
    path: string;
    category: string;
    meta: string;
  }[] = [
    {
      id: 'p-value',
      title: 'P-Value Calculator',
      description: 'Compute exact p-values for Z, Student’s t, Chi-Square, and F distributions with shaded tail rejection areas.',
      path: '/calculators/p-value',
      category: 'Research',
      meta: '4 distributions · APA 7 reporting',
    },
    {
      id: 't-test',
      title: 'Two-Sample T-Test',
      description: 'Evaluate differences between two independent groups using Student’s or Welch’s t-test with Cohen’s d effect size.',
      path: '/calculators/t-test',
      category: 'Research',
      meta: 'Welch unequal variances · Cohen’s d',
    },
    {
      id: 'confidence-interval',
      title: 'Confidence Interval',
      description: 'Construct 90%, 95%, and 99% interval estimates and margins of error for population means and proportions.',
      path: '/calculators/confidence-interval',
      category: 'Research',
      meta: 'Means (t & Z) · Proportions · Error bars',
    },
    {
      id: 'anova',
      title: 'One-Way ANOVA',
      description: 'Omnibus test for differences in treatment group means with SS source partition and eta-squared effect size.',
      path: '/calculators/anova',
      category: 'Research',
      meta: 'F-ratio · Eta-squared · Source table',
    },
    {
      id: 'normal-distribution',
      title: 'Normal Distribution (Bell Curve)',
      description: 'Calculate cumulative probabilities, tail intervals, z-scores, and reverse percentiles under any Gaussian curve.',
      path: '/calculators/normal-distribution',
      category: 'Probability',
      meta: 'Interactive curve · Z-scores · Percentiles',
    },
    {
      id: 'binomial-distribution',
      title: 'Binomial & Poisson Probability',
      description: 'Compute exact and cumulative probabilities for Bernoulli trials, Poisson arrival rates, and Bayes’ theorem.',
      path: '/calculators/binomial-distribution',
      category: 'Probability',
      meta: 'P(X=k) · Cumulative · Bayes posterior',
    },
    {
      id: 'standard-deviation',
      title: 'Standard Deviation Calculator',
      description: 'Calculate sample (n - 1 with Bessel correction) and population (N) standard deviation and variance from raw data.',
      path: '/calculators/standard-deviation',
      category: 'Statistics',
      meta: 'Bessel correction · Observation-level table',
    },
    {
      id: 'correlation-regression',
      title: 'Correlation & Regression',
      description: 'Measure linear association with Pearson r, R² variance explained, and fit ordinary least squares regression line.',
      path: '/calculators/correlation-regression',
      category: 'Statistics',
      meta: 'Pearson r · OLS slope · Scatter plot',
    },
    {
      id: 'scientific-calculator',
      title: 'Scientific Calculator',
      description: 'High-precision algebraic evaluator with powers, roots, trigonometry, logs, factorial, and degree/radian modes.',
      path: '/calculators/scientific-calculator',
      category: 'Mathematics',
      meta: 'Degree/Rad · Trig · Logs · History',
    },
    {
      id: 'fraction-calculator',
      title: 'Fraction Calculator',
      description: 'Add, subtract, multiply, and divide fractions with greatest common divisor simplification and mixed numbers.',
      path: '/calculators/fraction-calculator',
      category: 'Mathematics',
      meta: 'Step-by-step LCD · Mixed fractions',
    },
    {
      id: 'unit-converter',
      title: 'Unit Converter Suite',
      description: 'Convert between metric and imperial measurements across 8 domains: Length, Mass, Temp, Area, Volume, Speed, Time, Data.',
      path: '/calculators/unit-converter',
      category: 'Converters',
      meta: '8 physical domains · Exact SI factors',
    },
    {
      id: 'gpa',
      title: 'GPA & CGPA Calculator',
      description: 'Calculate credit-weighted semester GPA and project cumulative CGPA across US 4.0, 5.0, and percentage scales.',
      path: '/calculators/gpa',
      category: 'Education',
      meta: '4.0 & 5.0 scales · Cumulative projection',
    },
  ];

  const categoryCards: {
    name: CategoryName;
    desc: string;
    tools: string;
    path: string;
  }[] = [
    {
      name: 'Statistics',
      desc: 'Descriptive metrics, dispersion, standardized z-scores, and correlation regression analysis.',
      tools: 'Standard Deviation, Z-Score, Descriptive Stats, Correlation',
      path: '/calculators?cat=Statistics',
    },
    {
      name: 'Research',
      desc: 'Peer-reviewed inferential tests, p-values, t-tests, ANOVA, Chi-Square, sample size, and test selector.',
      tools: 'P-Value, T-Test, Confidence Interval, ANOVA, Chi-Square',
      path: '/calculators?cat=Research',
    },
    {
      name: 'Probability',
      desc: 'Continuous Gaussian bell curves, Binomial Bernoulli trials, Poisson rates, and Bayes’ theorem.',
      tools: 'Normal Distribution, Binomial, Poisson, Bayes’ Theorem',
      path: '/calculators?cat=Probability',
    },
    {
      name: 'Mathematics',
      desc: 'Foundational quantitative tools: Scientific, Fractions, Percentages, Ratios, and Graphing curves.',
      tools: 'Scientific Calc, Fractions, Percentages, Ratios, Graphing',
      path: '/calculators?cat=Mathematics',
    },
    {
      name: 'Converters',
      desc: 'Unified conversion across length, mass, temperature, area, volume, velocity, time, and data.',
      tools: 'Metric & Imperial, SI Units, Temperature, Data Storage',
      path: '/calculators?cat=Converters',
    },
    {
      name: 'Date & Time',
      desc: 'Calendar mathematics: exact chronological ages, business days (Mon-Fri), and clock durations.',
      tools: 'Age Calculator, Business Days, Duration Across Midnight',
      path: '/calculators?cat=Date+%26+Time',
    },
    {
      name: 'Education',
      desc: 'Practical quantitative academic tools designed specifically for college students and instructors.',
      tools: 'Semester GPA, Cumulative CGPA, Final Exam Target Grade',
      path: '/calculators?cat=Education',
    },
  ];

  const taskList: {
    query: string;
    target: string;
    path: string;
    category: string;
    toolId: ToolId;
  }[] = [
    {
      query: 'I need to calculate my GPA.',
      target: 'GPA & CGPA Calculator',
      path: '/calculators/gpa',
      category: 'Education',
      toolId: 'gpa',
    },
    {
      query: 'I need to know what grade I need on my final exam.',
      target: 'Final Grade Calculator',
      path: '/calculators/grade-calculator',
      category: 'Education',
      toolId: 'grade-calculator',
    },
    {
      query: 'I need to compare two groups to see if difference is significant.',
      target: 'Two-Sample T-Test Calculator',
      path: '/calculators/t-test',
      category: 'Research',
      toolId: 't-test',
    },
    {
      query: 'I need to compare 3 or more treatment groups.',
      target: 'One-Way ANOVA Calculator',
      path: '/calculators/anova',
      category: 'Research',
      toolId: 'anova',
    },
    {
      query: 'I need an exact p-value from a test statistic.',
      target: 'P-Value Calculator',
      path: '/calculators/p-value',
      category: 'Research',
      toolId: 'p-value',
    },
    {
      query: 'I need to convert units between metric and imperial.',
      target: 'Unit Converter Suite',
      path: '/calculators/unit-converter',
      category: 'Converters',
      toolId: 'unit-converter',
    },
    {
      query: 'I need to calculate standard deviation and variance from raw data.',
      target: 'Standard Deviation Calculator',
      path: '/calculators/standard-deviation',
      category: 'Statistics',
      toolId: 'standard-deviation',
    },
    {
      query: 'I need to determine sample size for my study or survey.',
      target: 'Sample Size & Power Calculator',
      path: '/calculators/sample-size',
      category: 'Research',
      toolId: 'sample-size',
    },
    {
      query: 'I am not sure which statistical test to run.',
      target: 'Statistical Test Selector',
      path: '/calculators/test-selector',
      category: 'Research',
      toolId: 'test-selector',
    },
  ];

  const benefits = [
    {
      title: 'Calculate → Understand → Learn → Report',
      desc: 'We never just dump an isolated number. Receive plain-English interpretations, step-by-step arithmetic, underlying assumptions, and APA 7th edition report text.',
    },
    {
      title: 'Peer-Reviewed Accuracy',
      desc: 'All algorithms utilize peer-reviewed numerical implementations (Lanczos Gamma, Acklam inverse normal, Lentz continued fractions) tested against textbook benchmarks.',
    },
    {
      title: '100% Client-Side Privacy',
      desc: 'All computations execute entirely inside your web browser. Your grades, student numbers, and experimental records are never sent over the network.',
    },
    {
      title: 'Consistent Visual Icon Identity',
      desc: 'Every calculator features a unified, accessible SVG icon helping students, teachers, and researchers immediately identify and scan tools.',
    },
  ];

  return (
    <div>
      <SeoHead
        title="StatMetric — Free Calculators for Statistics, Research, Math & Education"
        description="Calculate accurately, understand the result, and learn how it works. Free, mathematically verified calculators for p-values, t-tests, ANOVA, confidence intervals, normal distributions, standard deviations, and GPA."
        path="/"
        schemaType="WebSite"
      />

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Open Quantitative Computing & Educational Platform
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight">
            Free Calculators for Statistics, Research, Math & Education
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Calculate accurately, understand the result, and learn how it works. Free, peer-reviewed tools designed for students, educators, and quantitative researchers.
          </p>

          {/* Natural Language Search Trigger */}
          <div className="mt-8 max-w-xl mx-auto">
            <button
              onClick={onOpenSearch}
              className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200/90 text-slate-500 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between text-sm transition-all text-left"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">What do you need to calculate? (e.g. &lsquo;gpa&rsquo;, &lsquo;anova&rsquo;, &lsquo;fractions&rsquo;)</span>
              </div>
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-mono bg-white border border-slate-300 rounded text-slate-600">
                ⌘K
              </kbd>
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
            <span>Calculate</span>
            <span aria-hidden="true">→</span>
            <span>Understand</span>
            <span aria-hidden="true">→</span>
            <span>Verify</span>
            <span aria-hidden="true">→</span>
            <span>Learn</span>
            <span aria-hidden="true">→</span>
            <span>Report</span>
          </div>
        </div>
      </section>

      {/* Browse by Major Categories with CategoryIcon */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Browse by Quantitative Category
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organized across statistics, empirical research, probability, mathematics, converters, and education.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryCards.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="p-5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <CategoryIcon category={cat.name} size="md" />
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {cat.desc}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500 truncate">
                {cat.tools}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Primary Tools with ToolIcon */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Featured Tools
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Accurate, interactive calculators with visual models, step-by-step arithmetic, and report-ready outputs.
              </p>
            </div>
            <Link
              to="/calculators"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
            >
              <span>View all directory tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredTools.map((calc) => (
              <div
                key={calc.title}
                className="bg-white border border-slate-200 rounded-xl p-4.5 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <ToolIcon toolId={calc.id} size="sm" />
                    <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                      {calc.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                    {calc.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-3">
                    {calc.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-600 truncate max-w-[120px]">
                    {calc.meta}
                  </span>
                  <Link
                    to={calc.path}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Task-Based Navigation ("What do you want to accomplish?") */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="max-w-2xl mb-8">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Find by Research or Student Task
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Skip formula hunting. Select the problem you are currently trying to solve:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {taskList.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className="p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  {item.category}
                </span>
                <p className="text-xs font-medium text-slate-700 group-hover:text-blue-700 transition-colors mb-2">
                  &ldquo;{item.query}&rdquo;
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <ToolIcon toolId={item.toolId} size="xs" />
                  <span className="font-semibold text-slate-900 truncate">{item.target}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Core Product Principles */}
      <section className="bg-slate-900 text-white py-14 sm:py-18">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
              A Serious Quantitative Utility Platform
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Engineered for genuine comprehension rather than black-box guesswork.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <h3 className="font-bold text-sm text-slate-100 mb-2">
                  {b.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
