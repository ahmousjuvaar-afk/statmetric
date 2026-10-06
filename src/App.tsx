import { useState } from 'react';
import { RouterProvider, useRouter } from './lib/router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { HomePage } from './pages/HomePage';
import { DirectoryPage } from './pages/DirectoryPage';
import { PValuePage } from './pages/PValuePage';
import { NormalDistPage } from './pages/NormalDistPage';
import { StandardDevPage } from './pages/StandardDevPage';
import { GpaCalculatorPage } from './pages/GpaCalculatorPage';
import { GradeCalculatorPage } from './pages/GradeCalculatorPage';
import { TTestPage } from './pages/TTestPage';
import { ConfidenceIntervalPage } from './pages/ConfidenceIntervalPage';
import { ZScorePage } from './pages/ZScorePage';
import { DescriptiveStatsPage } from './pages/DescriptiveStatsPage';
import { ScientificCalcPage } from './pages/ScientificCalcPage';
import { FractionCalcPage } from './pages/FractionCalcPage';
import { PercentageCalcPage } from './pages/PercentageCalcPage';
import { RatioCalcPage } from './pages/RatioCalcPage';
import { GraphingCalcPage } from './pages/GraphingCalcPage';
import { UnitConverterPage } from './pages/UnitConverterPage';
import { DateCalcPage } from './pages/DateCalcPage';
import { BinomialDistPage } from './pages/BinomialDistPage';
import { CorrelationPage } from './pages/CorrelationPage';
import { AnovaPage } from './pages/AnovaPage';
import { ChiSquarePage } from './pages/ChiSquarePage';
import { SampleSizePage } from './pages/SampleSizePage';
import { TestSelectorPage } from './pages/TestSelectorPage';
import { GuidesPage } from './pages/GuidesPage';
import { AboutPage } from './pages/AboutPage';
import { LegalPage } from './pages/LegalPage';
import { NotFoundPage } from './pages/NotFoundPage';

function AppContent() {
  const { currentPath } = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  // Router dispatcher
  const pathName = currentPath.split('?')[0];
  const renderPage = () => {
    switch (pathName) {
      case '/':
        return <HomePage onOpenSearch={openSearch} />;
      case '/calculators':
        return <DirectoryPage />;
      case '/calculators/p-value':
        return <PValuePage />;
      case '/calculators/normal-distribution':
        return <NormalDistPage />;
      case '/calculators/standard-deviation':
        return <StandardDevPage />;
      case '/calculators/gpa':
        return <GpaCalculatorPage />;
      case '/calculators/grade-calculator':
        return <GradeCalculatorPage />;
      case '/calculators/t-test':
        return <TTestPage />;
      case '/calculators/confidence-interval':
        return <ConfidenceIntervalPage />;
      case '/calculators/z-score':
        return <ZScorePage />;
      case '/calculators/descriptive-statistics':
        return <DescriptiveStatsPage />;
      case '/calculators/scientific-calculator':
        return <ScientificCalcPage />;
      case '/calculators/fraction-calculator':
        return <FractionCalcPage />;
      case '/calculators/percentage-calculator':
        return <PercentageCalcPage />;
      case '/calculators/ratio-calculator':
        return <RatioCalcPage />;
      case '/calculators/graphing-calculator':
        return <GraphingCalcPage />;
      case '/calculators/unit-converter':
        return <UnitConverterPage />;
      case '/calculators/date-calculator':
        return <DateCalcPage />;
      case '/calculators/binomial-distribution':
        return <BinomialDistPage />;
      case '/calculators/correlation-regression':
        return <CorrelationPage />;
      case '/calculators/anova':
        return <AnovaPage />;
      case '/calculators/chi-square':
        return <ChiSquarePage />;
      case '/calculators/sample-size':
        return <SampleSizePage />;
      case '/calculators/test-selector':
        return <TestSelectorPage />;
      case '/about':
        return <AboutPage />;
      case '/privacy':
        return <LegalPage mode="privacy" />;
      case '/terms':
        return <LegalPage mode="terms" />;
      default:
        if (pathName.startsWith('/guides')) {
          return <GuidesPage />;
        }
        return <NotFoundPage onOpenSearch={openSearch} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Skip to Main Content Link for WCAG Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 z-50 px-4 py-2 bg-slate-900 text-white rounded-md text-xs font-semibold focus:outline-none"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content" className="flex-1">
        {renderPage()}
      </main>

      <Footer />

      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}
