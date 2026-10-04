import { useRouter, Link } from '../lib/router';
import { SeoHead } from '../components/SeoHead';
import { ShieldCheck, Scale, ArrowLeft } from 'lucide-react';

export function LegalPage({ mode }: { mode: 'privacy' | 'terms' }) {
  const isPrivacy = mode === 'privacy';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SeoHead
        title={isPrivacy ? 'Privacy Policy — 100% Client-Side Computation' : 'Terms of Use & Statistical Disclaimer'}
        description={
          isPrivacy
            ? 'StatMetric privacy commitments: zero telemetry on user datasets, 100% browser-side execution, no data persistence.'
            : 'Terms of service, educational usage guidelines, and formal statistical calculation disclaimer for StatMetric.'
        }
        path={isPrivacy ? '/privacy' : '/terms'}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: isPrivacy ? 'Privacy Policy' : 'Terms of Use', path: isPrivacy ? '/privacy' : '/terms' },
        ]}
      />

      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Home</span>
      </Link>

      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
        {isPrivacy ? (
          <>
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Privacy Policy
                </h1>
                <p className="text-xs text-slate-500">
                  Last updated: October 2026 · 100% Client-Side Privacy Guarantee
                </p>
              </div>
            </div>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">1. Client-Side Execution</h2>
              <p>
                All statistical computations performed on StatMetric—including raw observation datasets, sample standard deviation calculations, p-value queries, and distribution integrals—occur entirely within your local browser environment.
              </p>
              <p>
                Your numbers, datasets, and calculations are never transmitted to our web servers, saved to cloud databases, or logged in any backend system.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">2. No Account or Registration Required</h2>
              <p>
                StatMetric requires no account creation, passwords, email signups, or subscription profiles. You can perform unlimited calculations completely anonymously.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">3. Analytics & Telemetry</h2>
              <p>
                We do not track, capture, or inspect numeric input fields. Basic, privacy-respecting website usage metrics (such as aggregate page views and HTTP requests) may be analyzed solely to monitor platform availability and uptime.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">4. Third-Party Integrations & Advertising</h2>
              <p>
                We do not sell user data to data brokers or advertising exchanges. Any future contextual display advertising will adhere strictly to privacy guidelines without tracking individual statistical datasets.
              </p>
            </section>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Terms of Use & Statistical Disclaimer
                </h1>
                <p className="text-xs text-slate-500">
                  Last updated: October 2026 · Academic & Practical Guidelines
                </p>
              </div>
            </div>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">1. Statistical & Research Disclaimer</h2>
              <p>
                StatMetric provides mathematical calculation algorithms and educational statistical tools intended to assist students, academics, researchers, and data professionals. While all algorithms are rigorously tested against standard textbook benchmarks and peer-reviewed numerical implementations, mathematical calculations alone do not substitute for rigorous experimental design, appropriate sampling methodology, or formal statistical consultation.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">2. Permitted Use</h2>
              <p>
                You are granted a free, non-exclusive license to use StatMetric for educational coursework, scientific research, manuscript preparation, clinical laboratory verification, and analytical tasks. You may freely copy and cite report-ready wording generated by the platform.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">3. Limitation of Liability</h2>
              <p>
                The platform is provided &ldquo;as is&rdquo; without warranties of any kind. Under no circumstances shall StatMetric or its contributors be held liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the calculations provided.
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
