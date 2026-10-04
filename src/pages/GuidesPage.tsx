import { Link, useRouter } from '../lib/router';
import { SeoHead } from '../components/SeoHead';
import { BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';

export function GuidesPage() {
  const { currentPath } = useRouter();

  // If viewing specific sub-guide
  if (currentPath === '/guides/what-is-a-p-value') {
    return <PValueGuide />;
  }
  if (currentPath === '/guides/sample-vs-population') {
    return <StandardDevGuide />;
  }
  if (currentPath === '/guides/normal-distribution-guide') {
    return <NormalDistGuide />;
  }

  // Index of all guides
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SeoHead
        title="Statistical Research Guides & Reference Articles"
        description="Clear, authoritative statistical guides explaining p-values, degrees of freedom, Bessel's correction, and Gaussian bell curves without unnecessary jargon."
        path="/guides"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides' },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Statistical Research Guides
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Rigorous, clear educational guides written to help students, academics, and data analysts understand the core mathematical logic behind experimental statistics.
        </p>
      </div>

      <div className="space-y-6">
        <article className="p-6 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all shadow-xs">
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-2">
            <span>Hypothesis Testing</span>
            <span aria-hidden="true">·</span>
            <span>6 min read</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            <Link to="/guides/what-is-a-p-value" className="hover:text-blue-600 transition-colors">
              What Is a P-Value (And What It Isn’t)?
            </Link>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
            Demystifying the most misunderstood metric in empirical science. Why p-values do not represent the probability that the null hypothesis is true, how alpha thresholds work, and APA reporting best practices.
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <Link
              to="/calculators/p-value"
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              Related Tool: P-Value Calculator →
            </Link>
            <Link
              to="/guides/what-is-a-p-value"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              <span>Read Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </article>

        <article className="p-6 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all shadow-xs">
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-2">
            <span>Descriptive Statistics</span>
            <span aria-hidden="true">·</span>
            <span>5 min read</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            <Link to="/guides/sample-vs-population" className="hover:text-blue-600 transition-colors">
              Sample vs. Population Standard Deviation: Why Bessel’s Correction Matters
            </Link>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
            Why do we divide by n - 1 for samples and N for populations? A conceptual and mathematical breakdown of variance bias and degrees of freedom in estimation.
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <Link
              to="/calculators/standard-deviation"
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              Related Tool: Standard Deviation Calculator →
            </Link>
            <Link
              to="/guides/sample-vs-population"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              <span>Read Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </article>

        <article className="p-6 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all shadow-xs">
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-2">
            <span>Probability & Distributions</span>
            <span aria-hidden="true">·</span>
            <span>7 min read</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            <Link to="/guides/normal-distribution-guide" className="hover:text-blue-600 transition-colors">
              Understanding the Gaussian Normal Distribution & The Empirical Rule
            </Link>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
            How the bell curve arises from the Central Limit Theorem. Learn how to standardize raw observations into z-scores and apply the 68-95-99.7% rule to real-world datasets.
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <Link
              to="/calculators/normal-distribution"
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              Related Tool: Normal Distribution Calculator →
            </Link>
            <Link
              to="/guides/normal-distribution-guide"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              <span>Read Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}

function PValueGuide() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SeoHead
        title="What Is a P-Value (And What It Isn’t)? — Complete Guide"
        description="A clear, mathematically sound guide explaining what p-values mean in hypothesis testing, common statistical fallacies, and APA reporting rules."
        path="/guides/what-is-a-p-value"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides' },
          { name: 'What Is a P-Value?', path: '/guides/what-is-a-p-value' },
        ]}
      />

      <Link
        to="/guides"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to all guides</span>
      </Link>

      <article className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed space-y-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight not-prose">
          What Is a P-Value (And What It Isn&apos;t)?
        </h1>
        <div className="text-xs text-slate-500 not-prose pb-4 border-b border-slate-200">
          Published by StatMetric Research Editorial · Reference for Experimental Statistics
        </div>

        <p>
          The p-value is one of the most widely used—and widely misinterpreted—statistical metrics in academic research, clinical trials, and data analytics.
        </p>

        <h2 className="text-lg font-bold text-slate-900 not-prose pt-2">
          The Formal Definition
        </h2>
        <p>
          A <strong>p-value</strong> is defined as the probability of obtaining test results at least as extreme as the results actually observed during the experiment, <em>assuming that the null hypothesis (H₀) is true</em>.
        </p>

        <div className="p-4 bg-slate-100 rounded-lg font-mono text-xs text-slate-900">
          p = P(Data as extreme or more extreme | H₀ is true)
        </div>

        <h2 className="text-lg font-bold text-slate-900 not-prose pt-2">
          The Three Cardinal Misconceptions
        </h2>
        <ul className="space-y-2 list-disc list-inside">
          <li>
            <strong>Myth 1: &quot;The p-value is the probability that the null hypothesis is true.&quot;</strong>
            <br />
            <em>Correction:</em> In frequentist inference, hypotheses are fixed parameters, not random variables. The p-value conditions on H₀ being true; it does not calculate P(H₀ | Data).
          </li>
          <li>
            <strong>Myth 2: &quot;A non-significant p-value (p &gt; 0.05) proves the null hypothesis.&quot;</strong>
            <br />
            <em>Correction:</em> Absence of evidence is not evidence of absence. A non-significant result means the sample size or effect was insufficient to reject H₀.
          </li>
          <li>
            <strong>Myth 3: &quot;A very small p-value means the effect is large and important.&quot;</strong>
            <br />
            <em>Correction:</em> P-values depend heavily on sample size (n). In huge datasets, a tiny, practically meaningless difference of 0.01% can yield p &lt; 0.0001. Always report effect sizes (such as Cohen’s d or Pearson’s r) alongside p-values.
          </li>
        </ul>

        <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-xl not-prose flex items-center justify-between">
          <div>
            <div className="font-semibold text-slate-900 text-sm">Compute Your Test P-Value</div>
            <div className="text-xs text-slate-600">Test statistics for Z, t, Chi-Square, and F distributions.</div>
          </div>
          <Link
            to="/calculators/p-value"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Open Calculator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </article>
    </div>
  );
}

function StandardDevGuide() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SeoHead
        title="Sample vs. Population Standard Deviation & Bessel's Correction"
        description="Comprehensive guide explaining why sample standard deviation divides by n - 1 (Bessel's correction) instead of N, and how degrees of freedom prevent bias."
        path="/guides/sample-vs-population"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides' },
          { name: 'Sample vs Population', path: '/guides/sample-vs-population' },
        ]}
      />

      <Link
        to="/guides"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to all guides</span>
      </Link>

      <article className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed space-y-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight not-prose">
          Sample vs. Population Standard Deviation: Understanding Bessel&apos;s Correction
        </h1>
        <div className="text-xs text-slate-500 not-prose pb-4 border-b border-slate-200">
          Published by StatMetric Research Editorial · Statistical Theory & Practice
        </div>

        <p>
          One of the first puzzles students encounter in introductory statistics is why the formula for sample variance divides by <code className="font-mono">n - 1</code> while population variance divides by <code className="font-mono">N</code>.
        </p>

        <h2 className="text-lg font-bold text-slate-900 not-prose pt-2">
          The Problem of Estimation Bias
        </h2>
        <p>
          When you compute the variance of a sample, you rarely know the true population mean (μ). Instead, you compute the sample mean (x̄) from the exact same observations. By mathematical definition, the sum of squared deviations from the sample mean is always smaller than the sum of squared deviations from any other number—including the true population mean μ.
        </p>

        <div className="p-3 bg-slate-100 rounded border border-slate-200 font-mono text-xs">
          Σ (x_i - x̄)² ≤ Σ (x_i - μ)²
        </div>

        <p>
          Because of this clustering effect, dividing by <code className="font-mono">n</code> systematically underestimates the true population dispersion. German astronomer Friedrich Bessel demonstrated that multiplying the naive sample variance by <code className="font-mono">n / (n - 1)</code> yields an unbiased estimator whose expected value equals the true population variance σ².
        </p>

        <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-xl not-prose flex items-center justify-between">
          <div>
            <div className="font-semibold text-slate-900 text-sm">Calculate Standard Deviation Now</div>
            <div className="text-xs text-slate-600">Sample (n-1) or Population (N) with full SS table.</div>
          </div>
          <Link
            to="/calculators/standard-deviation"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Open Calculator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </article>
    </div>
  );
}

function NormalDistGuide() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SeoHead
        title="Understanding the Gaussian Normal Distribution & The Empirical Rule"
        description="Learn how the normal distribution bell curve works, how to standardize raw scores into z-scores, and how the 68-95-99.7 empirical rule applies."
        path="/guides/normal-distribution-guide"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides' },
          { name: 'Normal Distribution Guide', path: '/guides/normal-distribution-guide' },
        ]}
      />

      <Link
        to="/guides"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to all guides</span>
      </Link>

      <article className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed space-y-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight not-prose">
          Understanding the Gaussian Normal Distribution
        </h1>
        <div className="text-xs text-slate-500 not-prose pb-4 border-b border-slate-200">
          Published by StatMetric Research Editorial · Distributions & Inference
        </div>

        <p>
          The normal distribution (commonly called the bell curve or Gaussian distribution) is the cornerstone of statistical inference. Its symmetrical bell shape describes natural phenomena ranging from measurement errors in astronomy to biological traits like human height.
        </p>

        <h2 className="text-lg font-bold text-slate-900 not-prose pt-2">
          The 68–95–99.7 Empirical Rule
        </h2>
        <p>
          For any variable that is normally distributed with mean μ and standard deviation σ:
        </p>
        <ul className="space-y-1.5 list-disc list-inside">
          <li><strong>68.27%</strong> of data falls within 1 standard deviation of the mean (μ ± 1σ).</li>
          <li><strong>95.45%</strong> of data falls within 2 standard deviations of the mean (μ ± 2σ).</li>
          <li><strong>99.73%</strong> of data falls within 3 standard deviations of the mean (μ ± 3σ).</li>
        </ul>

        <h2 className="text-lg font-bold text-slate-900 not-prose pt-2">
          The Z-Score Transformation
        </h2>
        <p>
          To compute probabilities for any normal distribution, we convert the raw value <code className="font-mono">x</code> into a standard unit called a <code className="font-mono">Z-score</code>:
        </p>
        <div className="p-3 bg-slate-100 rounded border border-slate-200 font-mono text-xs">
          Z = (x - μ) / σ
        </div>
        <p>
          The z-score tells you exactly how many standard deviations the observation is above (positive) or below (negative) the population mean.
        </p>

        <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-xl not-prose flex items-center justify-between">
          <div>
            <div className="font-semibold text-slate-900 text-sm">Interactive Bell Curve Calculator</div>
            <div className="text-xs text-slate-600">Calculate tail areas, between-intervals, and percentiles.</div>
          </div>
          <Link
            to="/calculators/normal-distribution"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Open Calculator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </article>
    </div>
  );
}
