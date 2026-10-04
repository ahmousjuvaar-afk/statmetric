import { Link } from '../lib/router';
import { BarChart3, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Purpose */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
              <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-sky-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <span>StatMetric</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Free, accurate statistical calculation platform designed for students, researchers, academics, and data analysts.
            </p>
            <div className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Client-side · Zero telemetry on data</span>
            </div>
          </div>

          {/* Primary Calculators */}
          <div>
            <div className="font-semibold text-slate-200 text-sm mb-3">Statistics & Research</div>
            <ul className="space-y-2">
              <li>
                <Link to="/calculators/p-value" className="hover:text-slate-100 transition-colors">
                  P-Value Calculator (Z, t, χ², F)
                </Link>
              </li>
              <li>
                <Link to="/calculators/t-test" className="hover:text-slate-100 transition-colors">
                  Two-Sample T-Test (Welch & Equal)
                </Link>
              </li>
              <li>
                <Link to="/calculators/confidence-interval" className="hover:text-slate-100 transition-colors">
                  Confidence Interval Calculator
                </Link>
              </li>
              <li>
                <Link to="/calculators/normal-distribution" className="hover:text-slate-100 transition-colors">
                  Normal Distribution (Bell Curve)
                </Link>
              </li>
              <li>
                <Link to="/calculators/standard-deviation" className="hover:text-slate-100 transition-colors">
                  Standard Deviation (Sample & Pop)
                </Link>
              </li>
              <li>
                <Link to="/calculators/z-score" className="hover:text-slate-100 transition-colors">
                  Z-Score Calculator
                </Link>
              </li>
              <li>
                <Link to="/calculators/descriptive-statistics" className="hover:text-slate-100 transition-colors">
                  Descriptive Statistics Suite
                </Link>
              </li>
            </ul>
          </div>

          {/* Education & Mathematics */}
          <div>
            <div className="font-semibold text-slate-200 text-sm mb-3">Education & Student Tools</div>
            <ul className="space-y-2">
              <li>
                <Link to="/calculators/gpa" className="hover:text-slate-100 transition-colors">
                  GPA & CGPA Calculator (4.0 & 5.0)
                </Link>
              </li>
              <li>
                <Link to="/calculators/grade-calculator" className="hover:text-slate-100 transition-colors">
                  Final Grade Calculator (Needed Score)
                </Link>
              </li>
              <li>
                <Link to="/calculators" className="text-sky-400 hover:text-sky-300 transition-colors inline-flex items-center gap-1 font-medium pt-2">
                  Browse All 5 Categories →
                </Link>
              </li>
            </ul>
          </div>

          {/* Guides & Educational Content */}
          <div>
            <div className="font-semibold text-slate-200 text-sm mb-3">Research Guides</div>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/guides/what-is-a-p-value"
                  className="hover:text-slate-100 transition-colors"
                >
                  What is a P-Value (and what it isn’t)?
                </Link>
              </li>
              <li>
                <Link
                  to="/guides/sample-vs-population"
                  className="hover:text-slate-100 transition-colors"
                >
                  Sample vs. Population Standard Deviation
                </Link>
              </li>
              <li>
                <Link
                  to="/guides/normal-distribution-guide"
                  className="hover:text-slate-100 transition-colors"
                >
                  Understanding the Normal Bell Curve
                </Link>
              </li>
              <li>
                <Link
                  to="/guides"
                  className="hover:text-slate-100 transition-colors"
                >
                  All Research Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Trust */}
          <div>
            <div className="font-semibold text-slate-200 text-sm mb-3">Platform & Trust</div>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-slate-100 transition-colors">
                  Methodology & Mathematical Verification
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-slate-100 transition-colors">
                  Privacy Policy (No Data Storage)
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-slate-100 transition-colors">
                  Terms of Use & Disclaimer
                </Link>
              </li>
              <li>
                <a
                  href="mailto:research@statmetric.org"
                  className="hover:text-slate-100 transition-colors"
                >
                  Feedback & Academic Inquiries
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-800 text-slate-400 leading-relaxed space-y-2">
          <p>
            <strong className="text-slate-400">Statistical Disclaimer:</strong> StatMetric provides computational mathematics and statistical calculators designed for educational, research validation, and analytical workflows. All formulas implement peer-reviewed numerical approximations (Acklam, Lanczos, Lentz continued fractions). Calculations do not substitute for formal peer review, experimental power audits, or professional statistical consultation.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-slate-400">
            <span>© {new Date().getFullYear()} StatMetric Platform. Free, open, client-side statistical utilities.</span>
            <div className="flex items-center gap-3">
              <span>Calculate</span>
              <span>·</span>
              <span>Understand</span>
              <span>·</span>
              <span>Verify</span>
              <span>·</span>
              <span>Report</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
