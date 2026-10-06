import React from 'react';
import {
  Calculator,
  Divide,
  Percent,
  LineChart,
  ArrowLeftRight,
  CalendarDays,
  CalendarClock,
  Clock,
  GraduationCap,
  Award,
  BarChart3,
  BarChart2,
  Compass,
  Scale,
  TrendingUp,
  GitCompare,
  Target,
  ScatterChart,
  Split,
  Layers,
  Grid,
  Table2,
  Users,
  HelpCircle,
  FlaskConical,
  Shuffle,
  Sliders,
  Pi,
  Binary,
  Maximize2,
  MoveHorizontal,
  FunctionSquare,
  BookOpen,
} from 'lucide-react';

export type ToolId =
  // Research
  | 'p-value'
  | 't-test'
  | 'confidence-interval'
  | 'sample-size'
  | 'anova'
  | 'chi-square'
  | 'test-selector'
  // Probability
  | 'normal-distribution'
  | 'binomial-distribution'
  // Statistics
  | 'standard-deviation'
  | 'z-score'
  | 'descriptive-statistics'
  | 'correlation-regression'
  // Mathematics
  | 'scientific-calculator'
  | 'standard-calculator'
  | 'fraction-calculator'
  | 'percentage-calculator'
  | 'ratio-calculator'
  | 'graphing-calculator'
  // Converters
  | 'unit-converter'
  // Date & Time
  | 'date-calculator'
  // Education
  | 'gpa'
  | 'grade-calculator'
  // Fallback
  | string;

export type CategoryName =
  | 'Mathematics'
  | 'Statistics'
  | 'Research'
  | 'Probability'
  | 'Education'
  | 'Converters'
  | 'Date & Time'
  | 'All';

interface IconConfig {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  label: string;
  category: CategoryName;
  bgClass: string;
  textClass: string;
  borderClass: string;
}

export const TOOL_ICON_MAP: Record<string, IconConfig> = {
  // --- RESEARCH ---
  'p-value': {
    icon: Target,
    label: 'P-Value Calculator',
    category: 'Research',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200/70',
  },
  't-test': {
    icon: GitCompare,
    label: 'Two-Sample T-Test',
    category: 'Research',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200/70',
  },
  'confidence-interval': {
    icon: MoveHorizontal,
    label: 'Confidence Interval',
    category: 'Research',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200/70',
  },
  'sample-size': {
    icon: Users,
    label: 'Sample Size & Power',
    category: 'Research',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200/70',
  },
  'anova': {
    icon: Layers,
    label: 'One-Way ANOVA',
    category: 'Research',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200/70',
  },
  'chi-square': {
    icon: Table2,
    label: 'Chi-Square Test',
    category: 'Research',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200/70',
  },
  'test-selector': {
    icon: Compass,
    label: 'Statistical Test Selector',
    category: 'Research',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200/70',
  },

  // --- PROBABILITY ---
  'normal-distribution': {
    icon: TrendingUp,
    label: 'Normal Distribution (Bell Curve)',
    category: 'Probability',
    bgClass: 'bg-sky-50',
    textClass: 'text-sky-700',
    borderClass: 'border-sky-200/70',
  },
  'binomial-distribution': {
    icon: Shuffle,
    label: 'Binomial & Poisson Distribution',
    category: 'Probability',
    bgClass: 'bg-sky-50',
    textClass: 'text-sky-700',
    borderClass: 'border-sky-200/70',
  },

  // --- STATISTICS ---
  'standard-deviation': {
    icon: ScatterChart,
    label: 'Standard Deviation & Variance',
    category: 'Statistics',
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-700',
    borderClass: 'border-blue-200/70',
  },
  'z-score': {
    icon: Target,
    label: 'Z-Score Calculator',
    category: 'Statistics',
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-700',
    borderClass: 'border-blue-200/70',
  },
  'descriptive-statistics': {
    icon: BarChart3,
    label: 'Descriptive Statistics Suite',
    category: 'Statistics',
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-700',
    borderClass: 'border-blue-200/70',
  },
  'correlation-regression': {
    icon: LineChart,
    label: 'Correlation & Regression',
    category: 'Statistics',
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-700',
    borderClass: 'border-blue-200/70',
  },

  // --- MATHEMATICS ---
  'scientific-calculator': {
    icon: Calculator,
    label: 'Scientific Calculator',
    category: 'Mathematics',
    bgClass: 'bg-indigo-50',
    textClass: 'text-indigo-700',
    borderClass: 'border-indigo-200/70',
  },
  'standard-calculator': {
    icon: Calculator,
    label: 'Standard Calculator',
    category: 'Mathematics',
    bgClass: 'bg-indigo-50',
    textClass: 'text-indigo-700',
    borderClass: 'border-indigo-200/70',
  },
  'fraction-calculator': {
    icon: Divide,
    label: 'Fraction Calculator',
    category: 'Mathematics',
    bgClass: 'bg-indigo-50',
    textClass: 'text-indigo-700',
    borderClass: 'border-indigo-200/70',
  },
  'percentage-calculator': {
    icon: Percent,
    label: 'Percentage Calculator',
    category: 'Mathematics',
    bgClass: 'bg-indigo-50',
    textClass: 'text-indigo-700',
    borderClass: 'border-indigo-200/70',
  },
  'ratio-calculator': {
    icon: Scale,
    label: 'Ratio & Proportion',
    category: 'Mathematics',
    bgClass: 'bg-indigo-50',
    textClass: 'text-indigo-700',
    borderClass: 'border-indigo-200/70',
  },
  'graphing-calculator': {
    icon: FunctionSquare,
    label: 'Graphing Calculator',
    category: 'Mathematics',
    bgClass: 'bg-indigo-50',
    textClass: 'text-indigo-700',
    borderClass: 'border-indigo-200/70',
  },

  // --- CONVERTERS ---
  'unit-converter': {
    icon: ArrowLeftRight,
    label: 'Unit Converter Suite',
    category: 'Converters',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-200/70',
  },

  // --- DATE & TIME ---
  'date-calculator': {
    icon: CalendarClock,
    label: 'Date & Time Calculator',
    category: 'Date & Time',
    bgClass: 'bg-violet-50',
    textClass: 'text-violet-700',
    borderClass: 'border-violet-200/70',
  },

  // --- EDUCATION ---
  'gpa': {
    icon: GraduationCap,
    label: 'GPA & CGPA Calculator',
    category: 'Education',
    bgClass: 'bg-teal-50',
    textClass: 'text-teal-700',
    borderClass: 'border-teal-200/70',
  },
  'grade-calculator': {
    icon: Award,
    label: 'Final Grade Calculator',
    category: 'Education',
    bgClass: 'bg-teal-50',
    textClass: 'text-teal-700',
    borderClass: 'border-teal-200/70',
  },
};

export const CATEGORY_ICON_MAP: Record<CategoryName, {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  bgClass: string;
  textClass: string;
  borderClass: string;
}> = {
  'Mathematics': {
    icon: Calculator,
    bgClass: 'bg-indigo-50',
    textClass: 'text-indigo-700',
    borderClass: 'border-indigo-200',
  },
  'Statistics': {
    icon: BarChart3,
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-700',
    borderClass: 'border-blue-200',
  },
  'Research': {
    icon: FlaskConical,
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200',
  },
  'Probability': {
    icon: Shuffle,
    bgClass: 'bg-sky-50',
    textClass: 'text-sky-700',
    borderClass: 'border-sky-200',
  },
  'Education': {
    icon: GraduationCap,
    bgClass: 'bg-teal-50',
    textClass: 'text-teal-700',
    borderClass: 'border-teal-200',
  },
  'Converters': {
    icon: ArrowLeftRight,
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-200',
  },
  'Date & Time': {
    icon: CalendarClock,
    bgClass: 'bg-violet-50',
    textClass: 'text-violet-700',
    borderClass: 'border-violet-200',
  },
  'All': {
    icon: Grid,
    bgClass: 'bg-slate-100',
    textClass: 'text-slate-800',
    borderClass: 'border-slate-200',
  },
};

interface ToolIconProps {
  toolId: ToolId;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showBackground?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function ToolIcon({
  toolId,
  size = 'md',
  showBackground = true,
  className = '',
  ariaLabel,
}: ToolIconProps) {
  // Normalize tool ID
  const cleanId = toolId.replace(/^\/calculators\//, '').replace(/\/$/, '');
  const config = TOOL_ICON_MAP[cleanId] || {
    icon: Calculator,
    label: cleanId,
    category: 'Mathematics',
    bgClass: 'bg-slate-100',
    textClass: 'text-slate-700',
    borderClass: 'border-slate-200',
  };

  const IconComponent = config.icon;

  const sizeClasses = {
    xs: {
      box: 'w-6 h-6 rounded-md',
      icon: 'w-3.5 h-3.5',
    },
    sm: {
      box: 'w-7 h-7 rounded-md',
      icon: 'w-4 h-4',
    },
    md: {
      box: 'w-9 h-9 rounded-lg',
      icon: 'w-5 h-5',
    },
    lg: {
      box: 'w-11 h-11 rounded-xl',
      icon: 'w-6 h-6',
    },
    xl: {
      box: 'w-14 h-14 rounded-2xl',
      icon: 'w-7 h-7',
    },
  }[size];

  if (!showBackground) {
    return (
      <IconComponent
        className={`${sizeClasses.icon} ${config.textClass} ${className}`}
        aria-hidden={ariaLabel ? 'false' : 'true'}
      />
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 border shadow-2xs ${sizeClasses.box} ${config.bgClass} ${config.textClass} ${config.borderClass} ${className}`}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel || (ariaLabel === undefined ? undefined : config.label)}
      aria-hidden={ariaLabel ? undefined : 'true'}
    >
      <IconComponent className={sizeClasses.icon} />
    </div>
  );
}

interface CategoryIconProps {
  category: CategoryName;
  size?: 'sm' | 'md' | 'lg';
  showBackground?: boolean;
  className?: string;
}

export function CategoryIcon({
  category,
  size = 'md',
  showBackground = true,
  className = '',
}: CategoryIconProps) {
  const config = CATEGORY_ICON_MAP[category] || CATEGORY_ICON_MAP['All'];
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: {
      box: 'w-7 h-7 rounded-md',
      icon: 'w-3.5 h-3.5',
    },
    md: {
      box: 'w-9 h-9 rounded-lg',
      icon: 'w-4.5 h-4.5',
    },
    lg: {
      box: 'w-12 h-12 rounded-xl',
      icon: 'w-6 h-6',
    },
  }[size];

  if (!showBackground) {
    return <IconComponent className={`${sizeClasses.icon} ${config.textClass} ${className}`} aria-hidden="true" />;
  }

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 border shadow-2xs ${sizeClasses.box} ${config.bgClass} ${config.textClass} ${config.borderClass} ${className}`}
      aria-hidden="true"
    >
      <IconComponent className={sizeClasses.icon} />
    </div>
  );
}
