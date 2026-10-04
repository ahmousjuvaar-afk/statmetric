import { Link } from '../lib/router';
import { SeoHead } from '../components/SeoHead';
import {
  ArrowRight,
  Calculator,
  Compass,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  BarChart2,
  TrendingUp,
  FileCheck,
  Search,
  GraduationCap,
  Scale,
  Percent,
} from 'lucide-react';

export function HomePage({ onOpenSearch }: { onOpenSearch: () => void }) {
  const featuredTools = [
    {
      title: 'P-Value Calculator',
      description: 'Compute exact p-values for Z, Student’s t, Chi-Square, and F distributions with shaded tail rejection areas.',
      path: '/calculators/p-value',
      category: 'Research',
      meta: '4 distributions · APA 7 reporting',
    },
    {
      title: 'Two-Sample T-Test',
      description: 'Evaluate differences between two independent groups using Student’s or Welch’s t-test with Cohen’s d effect size.',
      path: '/calculators/t-test',
      category: 'Research',
      meta: 'Welch unequal variances · Cohen’s d',
    },
    {
      title: 'Confidence Interval',
      description: 'Construct 90%, 95%, and 99% interval estimates and margins of error for population means and proportions.',
      path: '/calculators/confidence-interval',
      category: 'Research',
      meta: 'Means (t & Z) · Proportions · Error bars',
    },
    {
      title: 'GPA & CGPA Calculator',
      description: 'Calculate credit-weighted semester GPA and project cumulative CGPA across US 4.0, 5.0, and percentage scales.',
      path: '/calculators/gpa',
      category: 'Education',
      meta: '4.0 & 5.0 scales · Cumulative projection',
    },
    {
      title: 'Final Grade Calculator',
      description: 'Determine the exact percentage score required on your final exam to pass or achieve your target course grade.',
      path: '/calculators/grade-calculator',
      category: 'Education',
      meta: 'Target score solver · Weighted grade mode',
    },
    {
      title: 'Normal Distribution (Bell Curve)',
      description: 'Calculate cumulative probabilities, tail intervals, z-scores, and reverse percentiles under any Gaussian curve.',
      path: '/calculators/normal-distribution',
      category: 'Probability',
      meta: 'Interactive curve · Z-scores · Percentiles',
    },
    {
      title: 'Standard Deviation Calculator',
      description: 'Calculate sample (n - 1 with Bessel correction) and population (N) standard deviation and variance from raw data.',
      path: '/calculators/standard-deviation',
      category: 'Statistics',
      meta: 'Bessel correction · Observation-level table',
    },
    {
      title: 'Descriptive Statistics Suite',
      description: 'Comprehensive exploratory summary metrics: Mean, Median, Mode, Variance, SD, Range, Quartiles, and 5-number summary.',
      path: '/calculators/descriptive-statistics',
      category: 'Statistics',
      meta: 'Mean, Median, Mode, IQR · Box plot',
    },
  ];

  const categoryCards = [
    {
      name: 'Statistics',
      desc: 'Descriptive and summary tools for data dispersion, central tendency, and variance.',
      tools: 'Standard Deviation, Z-Score, Descriptive Stats',
      path: '/calculators?cat=Statistics',
    },
    {
      name: 'Research',
      desc: 'Peer-reviewed inferential testing, p-values, confidence intervals, and effect sizes.',
      tools: 'P-Value, Two-Sample T-Test, Confidence Interval',
      path: '/calculators?cat=Research',
    },
    {
      name: 'Probability',
      desc: 'Gaussian normal distribution, tail intervals, and probability modeling.',
      tools: 'Normal Distribution (Bell Curve), Tail Probabilities',
      path: '/calculators?cat=Probability',
    },
    {
      name: 'Education',
      desc: 'Practical quantitative academic tools designed specifically for students and teachers.',
      tools: 'GPA & CGPA Calculator, Final Grade Calculator',
      path: '/calculators?cat=Education',
    },
    {
      name: 'Mathematics',
      desc: 'Foundational quantitative calculators supporting the statistics and research toolkit.',
      tools: 'Ratios, Percentages, Ordinary Least Squares',
      path: '/calculators?cat=Mathematics',
    },
  ];

  const taskList = [
    {
      query: 'I need to calculate my GPA.',
      target: 'GPA & CGPA Calculator',
      path: '/calculators/gpa',
      category: 'Education',
    },
    {
      query: 'I need to know what grade I need on my final exam.',
      target: 'Final Grade Calculator',
      path: '/calculators/grade-calculator',
      category: 'Education',
    },
    {
      query: 'I need to compare two groups to see if the difference is significant.',
      target: 'Two-Sample T-Test Calculator',
      path: '/calculators/t-test',
      category: 'Research',
    },
    {
      query: 'I need to find an exact p-value from a test statistic.',
      target: 'P-Value Calculator',
      path: '/calculators/p-value',
      category: 'Research',
    },
    {
      query: 'I need an interval estimate for a population mean or proportion.',
      target: 'Confidence Interval Calculator',
      path: '/calculators/confidence-interval',
      category: 'Research',
    },
    {
      query: 'I need to calculate standard deviation and variance from raw data.',
      target: 'Standard Deviation Calculator',
      path: '/calculators/standard-deviation',
      category: 'Statistics',
    },
    {
      query: 'I need to calculate probability or percentile under a normal bell curve.',
      target: 'Normal Distribution Calculator',
      path: '/calculators/normal-distribution',
      category: 'Probability',
    },
    {
      query: 'I want to know how far a value is from the mean in standard units.',
      target: 'Z-Score Calculator',
      path: '/calculators/z-score',
      category: 'Statistics',
    },
    {
      query: 'I need a full exploratory summary (mean, median, mode, IQR, box plot).',
      target: 'Descriptive Statistics Suite',
      path: '/calculators/descriptive-statistics',
      category: 'Statistics',
    },
  ];

  const benefits = [
    {
      title: 'Calculate → Understand → Learn → Report',
      desc: 'We never just dump an isolated number. Receive plain-English interpretations, step-by-step arithmetic, underlying assumptions, and APA 7th edition report text.',
    },
    {
      title: 'Peer-Reviewed Accuracy',
      desc: 'All algorithms utilize peer-reviewed numerical implementations (Lanczos Gamma, Acklam inverse normal, Lentz continued fractions) tested against textbook datasets.',
    },
    {
      title: '100% Client-Side Privacy',
      desc: 'All computations execute entirely inside your web browser. Your grades, student numbers, and experimental records are never sent over the network.',
    },
    {
      title: 'Built for Students, Teachers & Researchers',
      desc: 'Includes Learn Mode, Check Your Work verification checkpoints, and teacher-friendly classroom examples formatted for screen sharing.',
    },
  ];

  return (
    <div>
      <SeoHead
        title="StatMetric — Free Calculators for Statistics, Research, Mathematics & Education"
        description="Calculate accurately, understand the result, and learn how it works. Free, mathematically verified calculators for p-values, t-tests, confidence intervals, normal distributions, standard deviations, and GPA."
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
                <span className="text-slate-600">What do you need to calculate? (e.g. &lsquo;gpa&rsquo;, &lsquo;compare two groups&rsquo;)</span>
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

      {/* Browse by 5 Core Categories */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Browse by Quantitative Category
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organized around statistics, empirical research, probability, and education.
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
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-1.5 flex items-center justify-between">
                  <span>{cat.name}</span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {cat.desc}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                {cat.tools}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Primary Tools */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Featured Tools
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Accurate, interactive calculators with visual models and report-ready outputs.
              </p>
            </div>
            <Link
              to="/calculators"
              className="text-xs font-semibold text-sky-700 hover:text-sky-900 transition-colors inline-flex items-center gap-1"
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
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    {calc.category}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                    {calc.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-3">
                    {calc.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">
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
                <span className="font-semibold text-slate-900">{item.target}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
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
