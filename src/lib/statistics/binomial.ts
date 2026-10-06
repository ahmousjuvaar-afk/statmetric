/**
 * Discrete probability distributions & Bayes' theorem.
 * Includes Binomial Distribution, Poisson Distribution, and Bayes' Theorem.
 */

import { factorial } from '../math/calculatorEngine';

export interface BinomialResult {
  n: number;
  p: number;
  k: number;
  exactProbability: number;      // P(X = k)
  cumulativeLessEqual: number;   // P(X <= k)
  cumulativeGreaterEqual: number;// P(X >= k)
  cumulativeStrictLess: number;  // P(X < k)
  cumulativeStrictGreater: number;// P(X > k)
  mean: number;                  // np
  variance: number;              // np(1-p)
  sd: number;                    // sqrt(np(1-p))
  distributionPoints: { k: number; p: number }[];
}

export function combinations(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  k = Math.min(k, n - k);
  let c = 1;
  for (let i = 0; i < k; i++) {
    c = (c * (n - i)) / (i + 1);
  }
  return c;
}

export function calculateBinomial(n: number, p: number, k: number): BinomialResult {
  if (!Number.isInteger(n) || n < 1 || n > 500) {
    throw new Error('Number of trials (n) must be an integer between 1 and 500.');
  }
  if (p < 0 || p > 1) {
    throw new Error('Probability of success (p) must be between 0 and 1.');
  }
  if (!Number.isInteger(k) || k < 0 || k > n) {
    throw new Error(`Number of successes (k) must be an integer between 0 and ${n}.`);
  }

  const probAt = (targetK: number): number => {
    const c = combinations(n, targetK);
    return c * Math.pow(p, targetK) * Math.pow(1 - p, n - targetK);
  };

  const exact = probAt(k);

  let cLessEqual = 0;
  const distributionPoints: { k: number; p: number }[] = [];

  for (let i = 0; i <= n; i++) {
    const prob = probAt(i);
    distributionPoints.push({ k: i, p: prob });
    if (i <= k) cLessEqual += prob;
  }

  // Ensure numerical boundaries
  cLessEqual = Math.min(1, Math.max(0, cLessEqual));
  const cLess = Math.max(0, cLessEqual - exact);
  const cGreaterEqual = Math.min(1, Math.max(0, 1 - cLess));
  const cGreater = Math.max(0, 1 - cLessEqual);

  const mean = n * p;
  const variance = n * p * (1 - p);
  const sd = Math.sqrt(variance);

  return {
    n,
    p,
    k,
    exactProbability: exact,
    cumulativeLessEqual: cLessEqual,
    cumulativeGreaterEqual: cGreaterEqual,
    cumulativeStrictLess: cLess,
    cumulativeStrictGreater: cGreater,
    mean,
    variance,
    sd,
    distributionPoints,
  };
}

export interface PoissonResult {
  lambda: number;
  k: number;
  exactProbability: number;
  cumulativeLessEqual: number;
  cumulativeGreaterEqual: number;
  mean: number;
  variance: number;
  sd: number;
  distributionPoints: { k: number; p: number }[];
}

export function calculatePoisson(lambda: number, k: number): PoissonResult {
  if (lambda <= 0 || lambda > 200) {
    throw new Error('Rate parameter (λ) must be strictly positive and ≤ 200.');
  }
  if (!Number.isInteger(k) || k < 0) {
    throw new Error('Number of occurrences (k) must be a non-negative integer.');
  }

  const probAt = (targetK: number): number => {
    // P(X=k) = (lambda^k * e^-lambda) / k!
    // Compute in log-space for stability
    let logP = targetK * Math.log(lambda) - lambda;
    for (let i = 2; i <= targetK; i++) logP -= Math.log(i);
    return Math.exp(logP);
  };

  const exact = probAt(k);

  const maxPlot = Math.max(k + 10, Math.ceil(lambda + 4 * Math.sqrt(lambda)));
  let cLessEqual = 0;
  const distributionPoints: { k: number; p: number }[] = [];

  for (let i = 0; i <= maxPlot; i++) {
    const prob = probAt(i);
    distributionPoints.push({ k: i, p: prob });
    if (i <= k) cLessEqual += prob;
  }

  cLessEqual = Math.min(1, cLessEqual);
  const cGreaterEqual = Math.max(0, 1 - (cLessEqual - exact));

  return {
    lambda,
    k,
    exactProbability: exact,
    cumulativeLessEqual: cLessEqual,
    cumulativeGreaterEqual: cGreaterEqual,
    mean: lambda,
    variance: lambda,
    sd: Math.sqrt(lambda),
    distributionPoints,
  };
}

export interface BayesResult {
  priorA: number;             // P(A)
  priorNotA: number;          // P(~A)
  probBGivenA: number;        // P(B|A) - sensitivity
  probBGivenNotA: number;     // P(B|~A) - false positive rate
  marginalB: number;          // P(B) = P(B|A)P(A) + P(B|~A)P(~A)
  posteriorAGivenB: number;   // P(A|B)
  posteriorNotAGivenB: number;// P(~A|B)
  steps: { title: string; content: string }[];
}

export function calculateBayes(
  priorA: number,
  probBGivenA: number,
  probBGivenNotA: number
): BayesResult {
  if (priorA <= 0 || priorA >= 1) throw new Error('Prior probability P(A) must be between 0 and 1.');
  if (probBGivenA < 0 || probBGivenA > 1) throw new Error('P(B|A) must be between 0 and 1.');
  if (probBGivenNotA < 0 || probBGivenNotA > 1) throw new Error('P(B|~A) must be between 0 and 1.');

  const priorNotA = 1 - priorA;
  const term1 = probBGivenA * priorA;
  const term2 = probBGivenNotA * priorNotA;
  const marginalB = term1 + term2;

  if (marginalB === 0) throw new Error('Marginal probability P(B) is 0; Bayes update undefined.');

  const posteriorAGivenB = term1 / marginalB;
  const posteriorNotAGivenB = term2 / marginalB;

  const steps = [
    {
      title: 'Calculate Complement Prior P(¬A)',
      content: `P(¬A) = 1 - P(A) = 1 - ${priorA} = ${Number(priorNotA.toFixed(4))}`,
    },
    {
      title: 'Calculate Total / Marginal Probability P(B)',
      content: `P(B) = P(B|A)P(A) + P(B|¬A)P(¬A) = (${probBGivenA} × ${priorA}) + (${probBGivenNotA} × ${priorNotA}) = ${term1.toFixed(
        6
      )} + ${term2.toFixed(6)} = ${Number(marginalB.toFixed(6))}`,
    },
    {
      title: "Apply Bayes' Theorem to Find Posterior P(A|B)",
      content: `P(A|B) = [P(B|A) × P(A)] ÷ P(B) = ${term1.toFixed(6)} ÷ ${marginalB.toFixed(6)} = ${Number(
        posteriorAGivenB.toFixed(6)
      )} (${(posteriorAGivenB * 100).toFixed(2)}%)`,
    },
  ];

  return {
    priorA,
    priorNotA,
    probBGivenA,
    probBGivenNotA,
    marginalB,
    posteriorAGivenB,
    posteriorNotAGivenB,
    steps,
  };
}
