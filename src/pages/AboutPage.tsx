import { Link } from '../lib/router';
import { SeoHead } from '../components/SeoHead';
import { ShieldCheck, Cpu, Code2, GraduationCap, CheckCircle2, ArrowRight } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SeoHead
        title="About StatMetric — Mathematical Rigor & Platform Principles"
        description="Learn about StatMetric's mission to provide free, mathematically verified, client-side statistical utilities for researchers, students, and analysts."
        path="/about"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
          About StatMetric
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          StatMetric is an open, client-side statistical computing platform built around a single philosophy:
          <em className="font-semibold text-slate-900"> Calculate → Understand → Verify → Report → Continue.</em>
        </p>
      </div>

      <div className="space-y-8 text-slate-800 text-sm leading-relaxed">
        {/* Core Mission */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-sky-600" />
            <span>Why We Built StatMetric</span>
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Most online statistical calculators fall into two extremes: either opaque &ldquo;black-box&rdquo; calculators surrounded by aggressive advertisements and confusing interfaces, or complex command-line programming libraries (like R or Python&apos;s SciPy) that require coding expertise for simple verification checks.
          </p>
          <p className="text-slate-600 leading-relaxed">
            StatMetric bridges this gap. When you calculate a test statistic, p-value, or distribution cutoff, you receive not just a number, but what that number means in plain English, the step-by-step arithmetic derivation, underlying test assumptions, common mistakes to avoid, and APA 7th edition report-ready wording.
          </p>
        </section>

        {/* Mathematical Integrity */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-sky-600" />
            <span>Mathematical Rigor & Numerical Implementations</span>
          </h2>
          <p className="text-slate-600">
            Accuracy is non-negotiable. Rather than relying on naive lookup tables or coarse approximations, StatMetric implements peer-reviewed numerical algorithms:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="block text-slate-900 font-semibold mb-1">Inverse Normal Quantiles:</strong>
              <span>Peter John Acklam’s rational Chebyshev approximation algorithm (relative precision &lt; 1.15 × 10⁻⁹).</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="block text-slate-900 font-semibold mb-1">Lanczos Gamma & Log-Gamma:</strong>
              <span>9-coefficient Lanczos series providing 15 decimal digits of precision for factorial and gamma functions.</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="block text-slate-900 font-semibold mb-1">Incomplete Beta & Student’s t:</strong>
              <span>Continued fraction evaluation via modified Lentz’s method for exact cumulative t and F distributions.</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="block text-slate-900 font-semibold mb-1">Variance & Standard Deviation:</strong>
              <span>Two-pass compensated summation to eliminate catastrophic floating-point cancellation on large numbers.</span>
            </div>
          </div>
        </section>

        {/* 100% Client-Side Privacy */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Privacy-Preserving Local Computation</span>
          </h2>
          <p className="text-slate-600 leading-relaxed">
            All calculations are executed entirely within your browser&apos;s JavaScript engine. Your dataset inputs, sample measurements, and experimental numbers are never transmitted across the network, stored in a database, or shared with third parties.
          </p>
        </section>

        {/* Open Roadmap Callout */}
        <section className="p-6 bg-slate-900 text-white rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
              Connected Research Toolkit
            </div>
            <div className="text-lg font-bold text-slate-100">
              Explore Our Calculators Directory
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Start with P-Values, Normal Distributions, or Standard Deviations.
            </p>
          </div>
          <Link
            to="/calculators"
            className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs rounded-lg inline-flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0"
          >
            <span>Browse All Calculators</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>
      </div>
    </div>
  );
}
