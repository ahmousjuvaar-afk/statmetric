export type StandardDevType = 'sample' | 'population';

export interface ObservationStep {
  index: number;
  value: number;
  deviation: number;
  squaredDeviation: number;
}

export interface StandardDevResult {
  type: StandardDevType;
  count: number;
  mean: number;
  sum: number;
  sumSquares: number;
  sumSquaredDeviations: number;
  variance: number;
  standardDeviation: number;
  standardError: number;
  min: number;
  max: number;
  range: number;
  median: number;
  q1: number;
  q3: number;
  iqr: number;
  observations: number[];
  steps: ObservationStep[];
  interpretation: string;
  apaReport: string;
  assumptions: string[];
  commonMistakes: string[];
}

export interface ParseResult {
  values: number[];
  error?: string;
  rawCount: number;
}

/**
 * Parses user input accommodating commas, newlines, spaces, tabs, and scientific notation.
 * Returns informative errors for non-numeric entries.
 */
export function parseDatasetInput(raw: string): ParseResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { values: [], rawCount: 0 };
  }

  // Tokenize by commas, semicolons, whitespace or newlines
  const tokens = trimmed.split(/[\s,;]+/).filter(Boolean);

  const values: number[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    // Clean potential quotes or stray brackets
    const cleaned = token.replace(/^[[({\\s]+|[\])}\\s]+$/g, '');
    if (!cleaned) continue;

    const num = Number(cleaned);
    if (isNaN(num) || !isFinite(num)) {
      return {
        values: [],
        rawCount: tokens.length,
        error: `Invalid numeric value "${token}" at position ${i + 1}. Please ensure inputs are valid numbers.`,
      };
    }
    values.push(num);
  }

  return { values, rawCount: values.length };
}

/**
 * Computes quartile value using linear interpolation (Type 7 method, R / NumPy default)
 */
function quantile(sorted: number[], q: number): number {
  const n = sorted.length;
  if (n === 0) return 0;
  if (n === 1) return sorted[0];

  const pos = (n - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;

  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  } else {
    return sorted[base];
  }
}

export function calculateStandardDeviation(
  values: number[],
  type: StandardDevType = 'sample'
): StandardDevResult {
  const n = values.length;

  if (type === 'sample' && n < 2) {
    throw new Error('Sample standard deviation requires at least 2 observations (n ≥ 2) for degrees of freedom (n - 1).');
  }
  if (type === 'population' && n < 1) {
    throw new Error('Population standard deviation requires at least 1 observation.');
  }

  // Numerically stable calculation using two-pass algorithm to avoid catastrophic cancellation
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += values[i];
  }
  const mean = sum / n;

  let sumSquaredDeviations = 0;
  let sumSquares = 0;
  const steps: ObservationStep[] = [];

  for (let i = 0; i < n; i++) {
    const val = values[i];
    const dev = val - mean;
    const sqDev = dev * dev;
    sumSquaredDeviations += sqDev;
    sumSquares += val * val;

    steps.push({
      index: i + 1,
      value: val,
      deviation: dev,
      squaredDeviation: sqDev,
    });
  }

  const divisor = type === 'sample' ? n - 1 : n;
  const variance = sumSquaredDeviations / divisor;
  const standardDeviation = Math.sqrt(variance);
  const standardError = standardDeviation / Math.sqrt(n);

  // Order statistics
  const sorted = [...values].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[n - 1];
  const range = max - min;
  const median = quantile(sorted, 0.5);
  const q1 = quantile(sorted, 0.25);
  const q3 = quantile(sorted, 0.75);
  const iqr = q3 - q1;

  const symbol = type === 'sample' ? 's' : 'σ';
  const meanSymbol = type === 'sample' ? 'x̄' : 'μ';

  const interpretation = `For this ${type} of ${n} observations with mean ${meanSymbol} = ${mean.toFixed(
    3
  )}, the ${type} standard deviation is ${symbol} = ${standardDeviation.toFixed(
    3
  )}. This indicates that observations in this dataset typically deviate from the mean by about ${standardDeviation.toFixed(
    3
  )} units. The variance is ${variance.toFixed(3)} square units.`;

  const apaReport =
    type === 'sample'
      ? `M = ${mean.toFixed(2)}, SD = ${standardDeviation.toFixed(2)}, n = ${n}`
      : `μ = ${mean.toFixed(2)}, σ = ${standardDeviation.toFixed(2)}, N = ${n}`;

  const assumptions = [
    type === 'sample'
      ? 'The sample observations are drawn independently from a larger target population.'
      : 'The dataset encompasses the entire population of interest (census), not a sample.',
    'Data values are measured on a continuous interval or ratio scale where arithmetic differences are meaningful.',
    'The standard deviation is sensitive to extreme values (outliers); check range and IQR to assess skewness.',
  ];

  const commonMistakes = [
    'Using population standard deviation (dividing by N) on sample data, which systematically underestimates the true population dispersion.',
    'Assuming standard deviation and standard error of the mean (SE) are identical. Standard deviation measures individual variability; SE measures sampling uncertainty of the sample mean.',
    'Reporting standard deviation for heavily skewed data without also reporting median and interquartile range (IQR).',
  ];

  return {
    type,
    count: n,
    mean,
    sum,
    sumSquares,
    sumSquaredDeviations,
    variance,
    standardDeviation,
    standardError,
    min,
    max,
    range,
    median,
    q1,
    q3,
    iqr,
    observations: values,
    steps,
    interpretation,
    apaReport,
    assumptions,
    commonMistakes,
  };
}
