import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppRoute =
  | '/'
  | '/calculators'
  | '/calculators/p-value'
  | '/calculators/normal-distribution'
  | '/calculators/standard-deviation'
  | '/calculators/gpa'
  | '/calculators/grade-calculator'
  | '/calculators/t-test'
  | '/calculators/confidence-interval'
  | '/calculators/z-score'
  | '/calculators/descriptive-statistics'
  | '/guides'
  | '/guides/what-is-a-p-value'
  | '/guides/sample-vs-population'
  | '/guides/normal-distribution-guide'
  | '/about'
  | '/privacy'
  | '/terms'
  | '/404';

interface RouterContextType {
  currentPath: string;
  navigate: (path: string, options?: { replace?: boolean }) => void;
}

const RouterContext = createContext<RouterContextType>({
  currentPath: '/',
  navigate: () => {},
});

export function useRouter() {
  return useContext(RouterContext);
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      return path || '/';
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      window.history.replaceState({}, '', path);
    } else {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function Link({
  to,
  children,
  className = '',
  onClick,
  ...props
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  [key: string]: unknown;
}) {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      navigate(to);
    }
  };

  return (
    <a href={to} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}
