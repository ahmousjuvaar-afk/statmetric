import { useState } from 'react';
import { useRouter, Link } from '../lib/router';
import { Search, Menu, X, BarChart3 } from 'lucide-react';
import { SearchModal } from './SearchModal';
import { ToolIcon } from './ToolIcon';

export function Header() {
  const { currentPath } = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Calculators', path: '/calculators' },
    { label: 'Mathematics', path: '/calculators?cat=Mathematics' },
    { label: 'Statistics', path: '/calculators?cat=Statistics' },
    { label: 'Research', path: '/calculators?cat=Research' },
    { label: 'Education', path: '/calculators?cat=Education' },
    { label: 'Converters', path: '/calculators?cat=Converters' },
    { label: 'Guides', path: '/guides' },
    { label: 'About', path: '/about' },
  ];

  const isActive = (path: string) => {
    if (path.includes('?')) {
      return currentPath === path;
    }
    if (path === '/calculators') {
      return (currentPath === '/calculators' || currentPath === '/calculators/');
    }
    if (path === '/guides') {
      return currentPath.startsWith('/guides');
    }
    return currentPath === path;
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center text-sky-400 group-hover:bg-slate-800 transition-colors shadow-xs">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 group-hover:text-slate-800 transition-colors">
                StatMetric
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-slate-500 font-normal border-l border-slate-200 pl-2">
                Research & Statistical Utility
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors py-1 ${
                  isActive(link.path)
                    ? 'text-slate-950 font-semibold border-b-2 border-slate-900'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search Trigger & Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 bg-slate-100 hover:bg-slate-200/80 rounded-md border border-slate-200/80 transition-colors"
              aria-label="Search calculators and guides"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Search calculators...</span>
              <span className="sm:hidden">Search</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-300 rounded text-slate-600">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(link.path)
                    ? 'bg-slate-100 text-slate-950 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-100">
              <span className="block px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Popular Tools
              </span>
              <Link
                to="/calculators/p-value"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-1.5 text-sm text-slate-700 hover:text-slate-900"
              >
                P-Value Calculator (Z, t, χ², F)
              </Link>
              <Link
                to="/calculators/t-test"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-1.5 text-sm text-slate-700 hover:text-slate-900"
              >
                Two-Sample T-Test Calculator
              </Link>
              <Link
                to="/calculators/confidence-interval"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-1.5 text-sm text-slate-700 hover:text-slate-900"
              >
                Confidence Interval Calculator
              </Link>
              <Link
                to="/calculators/normal-distribution"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-1.5 text-sm text-slate-700 hover:text-slate-900"
              >
                Normal Distribution (Bell Curve)
              </Link>
              <Link
                to="/calculators/standard-deviation"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-1.5 text-sm text-slate-700 hover:text-slate-900"
              >
                Standard Deviation Calculator
              </Link>
              <Link
                to="/calculators/gpa"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-1.5 text-sm text-slate-700 hover:text-slate-900"
              >
                GPA & CGPA Calculator
              </Link>
              <Link
                to="/calculators/grade-calculator"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-1.5 text-sm text-slate-700 hover:text-slate-900"
              >
                Final Grade Calculator
              </Link>
              <Link
                to="/calculators/descriptive-statistics"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-1.5 text-sm text-slate-700 hover:text-slate-900"
              >
                Descriptive Statistics Suite
              </Link>
            </div>
          </div>
        )}
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
