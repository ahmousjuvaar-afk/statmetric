import { parseDatasetInput } from './standardDev';

export interface DescriptiveResult {
  count: number;
  mean: number;
  median: number;
  mode: number[];
  modeType: 'unimodal' | 'bimodal' | 'multimodal' | 'no_mode';
  sampleVariance: number;
  popVariance: number;
  sampleSd: number;
  popSd: number;
  seMean: number;
  min: number;
  max: number;
  range: number;
  q1: number;
  q3: number;
  iqr: number;
  sum: number;
  sumSquares: number;
  sumSquaredDeviations: number;
  skewness: number;
  skewnessLabel: string;
  fiveNumberSummary: [number, number, number, number, number];
  sortedData: number[];
}

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

export function calculateDescriptiveStats(values: number[]): DescriptiveResult {
  const n = values.length;
  if (n < 2) {
    throw new Error('At least 2 data observations are required for descriptive statistics.');
  }

  // Mean
  let sum = 0;
  for (let i = 0; i < n; i++) sum += values[i];
  const mean = sum / n;

  // Sum of squares & deviations
  let sumSquares = 0;
  let sumSquaredDeviations = 0;
  let sumCubedDeviations = 0;

  for (let i = 0; i < n; i++) {
    const val = values[i];
    sumSquares += val * val;
    const dev = val - mean;
    const devSq = dev * dev;
    sumSquaredDeviations += devSq;
    sumCubedDeviations += devSq * dev;
  }

  const sampleVariance = sumSquaredDeviations / (n - 1);
  const popVariance = sumSquaredDeviations / n;
  const sampleSd = Math.sqrt(sampleVariance);
  const popSd = Math.sqrt(popVariance);
  const seMean = sampleSd / Math.sqrt(n);

  // Sorted order statistics
  const sorted = [...values].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[n - 1];
  const range = max - min;
  const median = quantile(sorted, 0.5);
  const q1 = quantile(sorted, 0.25);
  const q3 = quantile(sorted, 0.75);
  const iqr = q3 - q1;

  // Mode
  const frequencyMap = new Map<number, number>();
  let maxFreq = 0;
  for (const v of values) {
    const count = (frequencyMap.get(v) || 0) + 1;
    frequencyMap.set(v, count);
    if (count > maxFreq) maxFreq = count;
  }

  let modes: number[] = [];
  let modeType: DescriptiveResult['modeType'] = 'no_mode';

  if (maxFreq > 1) {
    frequencyMap.forEach((count, val) => {
      if (count === maxFreq) modes.push(val);
    });
    modes.sort((a, b) => a - b);

    if (modes.length === 1) modeType = 'unimodal';
    else if (modes.length === 2) modeType = 'bimodal';
    else if (modes.length > 2 && modes.length < frequencyMap.size) modeType = 'multimodal';
    else {
      // If every unique value appeared with the exact same frequency, there is no unique mode
      modeType = 'no_mode';
      modes = [];
    }
  }

  // Fisher-Pearson Skewness
  let skewness = 0;
  let skewnessLabel = 'Approximately Symmetric';
  if (sampleSd > 0 && n >= 3) {
    const m3 = sumCubedDeviations / n;
    const s3 = Math.pow(popSd, 3);
    skewness = s3 > 0 ? m3 / s3 : 0;

    if (skewness > 0.5) skewnessLabel = 'Positively Skewed (Right-tailed)';
    else if (skewness < -0.5) skewnessLabel = 'Negatively Skewed (Left-tailed)';
    else skewnessLabel = 'Fairly Symmetric (-0.5 to +0.5)';
  }

  const fiveNumberSummary: [number, number, number, number, number] = [min, q1, median, q3, max];

  return {
    count: n,
    mean,
    median,
    mode: modes,
    modeType,
    sampleVariance,
    popVariance,
    sampleSd,
    popSd,
    seMean,
    min,
    max,
    range,
    q1,
    q3,
    iqr,
    sum,
    sumSquares,
    sumSquaredDeviations,
    skewness,
    skewnessLabel,
    fiveNumberSummary,
    sortedData: sorted,
  };
}
