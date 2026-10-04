import { tCdf, tPdf } from './distributions';

export type TTestType = 'independent_welch' | 'independent_equal' | 'paired';
export type TTestTail = 'two_tailed' | 'greater' | 'less';

export interface TTestInput {
  type: TTestType;
  tail: TTestTail;
  alpha: number;
  // Summary stats mode
  m1: number;
  sd1: number;
  n1: number;
  m2: number;
  sd2: number;
  n2: number;
}

export interface TTestResult {
  type: TTestType;
  tStatistic: number;
  df: number;
  pValue: number;
  pValueFormatted: string;
  isSignificant: boolean;
  meanDifference: number;
  standardErrorDiff: number;
  cohensD: number;
  effectSizeInterpretation: string;
  ciLower: number;
  ciUpper: number;
  alpha: number;
  apaReport: string;
  interpretation: string;
  formula: string;
  steps: { title: string; content: string }[];
  assumptions: string[];
  commonMistakes: string[];
}

export function calculateTTest(input: TTestInput): TTestResult {
  const { type, tail, alpha, m1, sd1, n1, m2, sd2, n2 } = input;

  if (n1 < 2 || n2 < 2) {
    throw new Error('Sample sizes must each be at least 2 (n ≥ 2).');
  }
  if (sd1 <= 0 || sd2 <= 0) {
    throw new Error('Standard deviations must be strictly positive.');
  }

  const meanDiff = m1 - m2;
  let df = 0;
  let seDiff = 0;
  let cohensD = 0;
  let formula = '';
  const steps: { title: string; content: string }[] = [];

  const var1 = sd1 * sd1;
  const var2 = sd2 * sd2;

  if (type === 'independent_equal') {
    // Equal variance Student's t
    df = n1 + n2 - 2;
    const pooledVariance = ((n1 - 1) * var1 + (n2 - 1) * var2) / df;
    const pooledSd = Math.sqrt(pooledVariance);
    seDiff = pooledSd * Math.sqrt(1 / n1 + 1 / n2);
    cohensD = Math.abs(meanDiff) / pooledSd;
    formula = 't = \\frac{\\bar{X}_1 - \\bar{X}_2}{s_p \\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}}, \\quad s_p = \\sqrt{\\frac{(n_1-1)s_1^2 + (n_2-1)s_2^2}{n_1+n_2-2}}';

    steps.push({
      title: 'Compute Pooled Variance & Standard Error',
      content: `Pooled Variance s_p² = [(${n1}-1)(${var1.toFixed(3)}) + (${n2}-1)(${var2.toFixed(3)})] / ${df} = ${pooledVariance.toFixed(4)} (Pooled SD = ${pooledSd.toFixed(3)}). SE_diff = ${seDiff.toFixed(4)}.`,
    });
  } else if (type === 'independent_welch') {
    // Welch's t (unequal variance default in modern R/Python)
    seDiff = Math.sqrt(var1 / n1 + var2 / n2);
    // Welch-Satterthwaite degrees of freedom
    const num = Math.pow(var1 / n1 + var2 / n2, 2);
    const den = Math.pow(var1 / n1, 2) / (n1 - 1) + Math.pow(var2 / n2, 2) / (n2 - 1);
    df = num / den;
    const pooledSd = Math.sqrt((var1 + var2) / 2);
    cohensD = Math.abs(meanDiff) / pooledSd;
    formula = 't = \\frac{\\bar{X}_1 - \\bar{X}_2}{\\sqrt{s_1^2/n_1 + s_2^2/n_2}}, \\quad df = \\frac{(s_1^2/n_1 + s_2^2/n_2)^2}{\\frac{(s_1^2/n_1)^2}{n_1-1} + \\frac{(s_2^2/n_2)^2}{n_2-1}}';

    steps.push({
      title: "Calculate Welch's Standard Error & Degrees of Freedom",
      content: `Unpooled SE_diff = √[(${var1.toFixed(3)}/${n1}) + (${var2.toFixed(3)}/${n2})] = ${seDiff.toFixed(4)}. Adjusted Welch df = ${df.toFixed(2)}.`,
    });
  } else {
    // Paired t-test
    const n = Math.min(n1, n2);
    df = n - 1;
    // Approximating standard error of difference assuming paired correlation or given SD of diffs
    seDiff = sd1 / Math.sqrt(n);
    cohensD = Math.abs(meanDiff) / sd1;
    formula = 't = \\frac{\\bar{D}}{s_D / \\sqrt{n}}, \\quad df = n - 1';

    steps.push({
      title: 'Calculate Paired Difference Standard Error',
      content: `Mean difference = ${meanDiff.toFixed(3)}, SE = ${seDiff.toFixed(4)}, df = ${df}.`,
    });
  }

  const tStat = meanDiff / seDiff;

  steps.push({
    title: 'Calculate t-Statistic',
    content: `t = (${meanDiff.toFixed(4)}) / (${seDiff.toFixed(4)}) = ${tStat.toFixed(4)}.`,
  });

  // Calculate p-value
  let p = 0;
  const cdfVal = tCdf(tStat, df);

  if (tail === 'less') {
    p = cdfVal;
    steps.push({
      title: 'Determine One-Tailed p-value (Left)',
      content: `p = P(T ≤ ${tStat.toFixed(4)}) = ${p.toFixed(5)}.`,
    });
  } else if (tail === 'greater') {
    p = 1 - cdfVal;
    steps.push({
      title: 'Determine One-Tailed p-value (Right)',
      content: `p = P(T ≥ ${tStat.toFixed(4)}) = 1 - ${cdfVal.toFixed(5)} = ${p.toFixed(5)}.`,
    });
  } else {
    // Two-tailed
    p = 2 * (1 - tCdf(Math.abs(tStat), df));
    steps.push({
      title: 'Determine Two-Tailed p-value',
      content: `p = 2 × (1 - P(T ≤ |${tStat.toFixed(4)}|)) = ${p.toFixed(5)}.`,
    });
  }

  p = Math.max(0, Math.min(1, p));
  const isSignificant = p < alpha;
  const pFormatted = p < 0.001 ? '< .001' : p.toFixed(4);

  // 95% Confidence Interval for mean difference
  // Critical t for two-tailed alpha=0.05
  // Approximate t critical via normal if df large or standard approximation
  const tCrit = 1.96 + 2.37 / df + 2.82 / (df * df); // accurate t critical approximation
  const marginOfError = tCrit * seDiff;
  const ciLower = meanDiff - marginOfError;
  const ciUpper = meanDiff + marginOfError;

  // Cohen's d interpretation
  let effectSizeInterpretation = 'Negligible effect';
  if (cohensD >= 0.8) effectSizeInterpretation = 'Large effect magnitude (d ≥ 0.8)';
  else if (cohensD >= 0.5) effectSizeInterpretation = 'Medium effect magnitude (d ≈ 0.5)';
  else if (cohensD >= 0.2) effectSizeInterpretation = 'Small effect magnitude (d ≈ 0.2)';

  // APA 7 Report string
  const pApa = p < 0.001 ? '< .001' : `= ${p.toFixed(3).replace(/^0\./, '.')}`;
  const apaReport = `t(${df.toFixed(type === 'independent_welch' ? 1 : 0)}) = ${tStat.toFixed(2)}, p ${pApa}, d = ${cohensD.toFixed(2)}`;

  const interpretation = isSignificant
    ? `The difference between group means (${meanDiff.toFixed(3)}) is statistically significant at α = ${alpha} (t(${df.toFixed(1)}) = ${tStat.toFixed(3)}, p = ${pFormatted}). We reject the null hypothesis of equal means. The estimated Cohen's d is ${cohensD.toFixed(2)} (${effectSizeInterpretation}).`
    : `The difference between group means (${meanDiff.toFixed(3)}) is not statistically significant at α = ${alpha} (t(${df.toFixed(1)}) = ${tStat.toFixed(3)}, p = ${pFormatted}). There is insufficient evidence to conclude that the population means differ.`;

  const assumptions = [
    'The continuous dependent variable is approximately normally distributed in each comparison group.',
    type === 'independent_equal'
      ? 'Homogeneity of variance (homoscedasticity): both populations share equal variance σ₁² = σ₂² (use Welch’s test if violated).'
      : 'Welch’s t-test robustly relaxes the assumption of equal variances.',
    'Observations are mutually independent between and within groups.',
  ];

  const commonMistakes = [
    'Using an independent t-test on before/after or matched pairs (use a paired t-test instead).',
    'Assuming statistical significance implies a large real-world difference without inspecting Cohen’s d effect size.',
    'Failing to use Welch’s t-test when group sample sizes are unequal and variances differ.',
  ];

  return {
    type,
    tStatistic: tStat,
    df,
    pValue: p,
    pValueFormatted: pFormatted,
    isSignificant,
    meanDifference: meanDiff,
    standardErrorDiff: seDiff,
    cohensD,
    effectSizeInterpretation,
    ciLower,
    ciUpper,
    alpha,
    apaReport,
    interpretation,
    formula,
    steps,
    assumptions,
    commonMistakes,
  };
}
