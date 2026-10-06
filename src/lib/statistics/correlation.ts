/**
 * Pearson correlation coefficient & Ordinary Least Squares (OLS) regression engine.
 */

import { tCdf } from './distributions';

export interface DataPoint {
  x: number;
  y: number;
}

export interface CorrelationResult {
  n: number;
  r: number;
  rSquared: number;
  slope: number;       // beta1
  intercept: number;   // beta0
  meanX: number;
  meanY: number;
  sdX: number;
  sdY: number;
  ssXX: number;
  ssYY: number;
  ssXY: number;
  seRegression: number;// Residual standard error
  tStatistic: number;
  pValue: number;      // Two-tailed test for H0: rho = 0
  isSignificant: boolean;
  regressionEquation: string;
  apaReport: string;
  points: DataPoint[];
}

export function parsePairedData(input: string): DataPoint[] {
  const lines = input.trim().split(/[\r\n]+/);
  const points: DataPoint[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // Match two numbers separated by comma, tab, space, or semicolon
    const parts = trimmed.split(/[\t,;\s]+/).map(Number);
    if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      points.push({ x: parts[0], y: parts[1] });
    }
  }

  return points;
}

export function calculateCorrelationRegression(points: DataPoint[], alpha = 0.05): CorrelationResult {
  const n = points.length;
  if (n < 3) {
    throw new Error('Correlation & Regression require at least 3 paired data points.');
  }

  let sumX = 0;
  let sumY = 0;
  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
  }
  const meanX = sumX / n;
  const meanY = sumY / n;

  let ssXX = 0;
  let ssYY = 0;
  let ssXY = 0;

  for (const p of points) {
    const dx = p.x - meanX;
    const dy = p.y - meanY;
    ssXX += dx * dx;
    ssYY += dy * dy;
    ssXY += dx * dy;
  }

  if (ssXX === 0 || ssYY === 0) {
    throw new Error('Variance of X or Y is zero. Cannot compute correlation for constant data.');
  }

  const r = ssXY / Math.sqrt(ssXX * ssYY);
  const rSquared = r * r;
  const slope = ssXY / ssXX;
  const intercept = meanY - slope * meanX;

  const sdX = Math.sqrt(ssXX / (n - 1));
  const sdY = Math.sqrt(ssYY / (n - 1));

  // Residual sum of squares & standard error
  let ssRes = 0;
  for (const p of points) {
    const predY = intercept + slope * p.x;
    const res = p.y - predY;
    ssRes += res * res;
  }
  const df = n - 2;
  const seRegression = Math.sqrt(ssRes / df);

  // t-test for correlation: t = r * sqrt((n - 2) / (1 - r^2))
  const tStat = Math.abs(r) >= 1 ? Infinity : r * Math.sqrt(df / Math.max(1e-12, 1 - rSquared));
  const cdf = tCdf(Math.abs(tStat), df);
  const pValue = Math.max(0, 2 * (1 - cdf));

  const sign = intercept >= 0 ? '+' : '-';
  const regressionEquation = `y = ${slope.toFixed(4)}x ${sign} ${Math.abs(intercept).toFixed(4)}`;
  const apaReport = `r(${df}) = ${r.toFixed(3)}, p ${pValue < 0.001 ? '< .001' : `= ${pValue.toFixed(3)}`}, R² = ${rSquared.toFixed(3)}`;

  return {
    n,
    r,
    rSquared,
    slope,
    intercept,
    meanX,
    meanY,
    sdX,
    sdY,
    ssXX,
    ssYY,
    ssXY,
    seRegression,
    tStatistic: tStat,
    pValue,
    isSignificant: pValue < alpha,
    regressionEquation,
    apaReport,
    points,
  };
}
