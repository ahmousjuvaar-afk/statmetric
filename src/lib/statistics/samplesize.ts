/**
 * Sample Size & Statistical Power estimation engine.
 * Computes:
 * 1. Two-sample mean difference (independent t-test sample size per arm)
 * 2. Survey proportion with Margin of Error & finite population correction
 * 3. Two-proportion comparison
 */

import { inverseNormalCdf } from './distributions';

export interface SampleSizeMeansResult {
  effectSizeD: number;
  alpha: number;
  power: number;
  nPerGroup: number;
  totalN: number;
  zAlpha: number;
  zBeta: number;
  formula: string;
}

export function calculateSampleSizeTwoMeans(
  effectSizeD: number, // Cohen's d
  alpha = 0.05,
  power = 0.80
): SampleSizeMeansResult {
  if (effectSizeD <= 0) throw new Error('Effect size (Cohen’s d) must be strictly positive.');
  if (alpha <= 0 || alpha >= 1) throw new Error('Significance level (alpha) must be between 0 and 1.');
  if (power <= 0 || power >= 1) throw new Error('Statistical power (1 - β) must be between 0 and 1.');

  const zAlpha = inverseNormalCdf(1 - alpha / 2); // two-tailed
  const zBeta = inverseNormalCdf(power);

  // n = 2 * (z_alpha/2 + z_beta)^2 / d^2
  const rawN = (2 * Math.pow(zAlpha + zBeta, 2)) / Math.pow(effectSizeD, 2);
  const nPerGroup = Math.ceil(rawN);
  const totalN = nPerGroup * 2;

  const formula = 'n = \\frac{2(z_{\\alpha/2} + z_{\\beta})^2}{d^2}';

  return {
    effectSizeD,
    alpha,
    power,
    nPerGroup,
    totalN,
    zAlpha,
    zBeta,
    formula,
  };
}

export interface SurveySampleSizeResult {
  confidenceLevel: number;
  marginOfError: number;
  estimatedProportion: number;
  populationSize?: number;
  requiredSample: number;
  zScore: number;
  formula: string;
}

export function calculateSurveySampleSize(
  confidenceLevel = 0.95,
  marginOfError = 0.05,
  proportion = 0.50,
  populationSize?: number
): SurveySampleSizeResult {
  if (confidenceLevel <= 0 || confidenceLevel >= 1) {
    throw new Error('Confidence level must be between 0 and 1 (e.g., 0.95).');
  }
  if (marginOfError <= 0 || marginOfError >= 1) {
    throw new Error('Margin of error must be between 0 and 1 (e.g., 0.05 for ±5%).');
  }
  if (proportion <= 0 || proportion >= 1) {
    throw new Error('Estimated proportion must be between 0 and 1 (0.5 gives conservative max sample).');
  }

  const alpha = 1 - confidenceLevel;
  const zScore = inverseNormalCdf(1 - alpha / 2);

  // Cochran's formula: n0 = (z^2 * p * (1-p)) / e^2
  const n0 = (Math.pow(zScore, 2) * proportion * (1 - proportion)) / Math.pow(marginOfError, 2);

  let finalN = n0;
  if (populationSize && populationSize > 0) {
    // Finite population correction: n = n0 / (1 + (n0 - 1) / N)
    finalN = n0 / (1 + (n0 - 1) / populationSize);
  }

  const requiredSample = Math.ceil(finalN);
  const formula = populationSize
    ? 'n = \\frac{n_0}{1 + \\frac{n_0 - 1}{N}}, \\quad n_0 = \\frac{z^2 p (1-p)}{E^2}'
    : 'n = \\frac{z^2 p (1-p)}{E^2}';

  return {
    confidenceLevel,
    marginOfError,
    estimatedProportion: proportion,
    populationSize,
    requiredSample,
    zScore,
    formula,
  };
}
