/**
 * One-Way Analysis of Variance (ANOVA) engine.
 * Computes Omnibus F-test across k continuous treatment groups.
 */

import { fCdf } from './distributions';

export interface AnovaGroup {
  name: string;
  values: number[];
  count: number;
  mean: number;
  sd: number;
  variance: number;
}

export interface AnovaResult {
  k: number;             // Number of groups
  totalN: number;        // Total observations
  grandMean: number;
  ssBetween: number;
  ssWithin: number;
  ssTotal: number;
  dfBetween: number;     // k - 1
  dfWithin: number;      // N - k
  dfTotal: number;       // N - 1
  msBetween: number;     // ssBetween / dfBetween
  msWithin: number;      // ssWithin / dfWithin
  fStatistic: number;    // msBetween / msWithin
  pValue: number;
  etaSquared: number;    // ssBetween / ssTotal
  isSignificant: boolean;
  apaReport: string;
  groups: AnovaGroup[];
}

export function calculateOneWayAnova(
  rawGroups: { name: string; values: number[] }[],
  alpha = 0.05
): AnovaResult {
  const validGroups = rawGroups
    .map((g) => ({
      name: g.name,
      values: g.values.filter((v) => !isNaN(v)),
    }))
    .filter((g) => g.values.length > 0);

  const k = validGroups.length;
  if (k < 2) {
    throw new Error('ANOVA requires at least 2 distinct groups with observations.');
  }

  let totalN = 0;
  let sumAll = 0;

  const groupStats: AnovaGroup[] = validGroups.map((g) => {
    const count = g.values.length;
    if (count < 2) {
      throw new Error(`Group '${g.name}' must have at least 2 observations.`);
    }
    totalN += count;
    const sum = g.values.reduce((acc, v) => acc + v, 0);
    sumAll += sum;
    const mean = sum / count;
    const ss = g.values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);
    const variance = ss / (count - 1);
    const sd = Math.sqrt(variance);

    return {
      name: g.name,
      values: g.values,
      count,
      mean,
      sd,
      variance,
    };
  });

  const grandMean = sumAll / totalN;

  // SS Between = sum(n_i * (mean_i - grandMean)^2)
  let ssBetween = 0;
  // SS Within = sum(ss_i)
  let ssWithin = 0;

  for (const g of groupStats) {
    ssBetween += g.count * Math.pow(g.mean - grandMean, 2);
    for (const v of g.values) {
      ssWithin += Math.pow(v - g.mean, 2);
    }
  }

  const ssTotal = ssBetween + ssWithin;
  const dfBetween = k - 1;
  const dfWithin = totalN - k;
  const dfTotal = totalN - 1;

  const msBetween = ssBetween / dfBetween;
  const msWithin = ssWithin / dfWithin;

  if (msWithin === 0) {
    throw new Error('Within-group variance is zero; F-test cannot be calculated.');
  }

  const fStatistic = msBetween / msWithin;
  const pValue = Math.max(0, 1 - fCdf(fStatistic, dfBetween, dfWithin));
  const etaSquared = ssBetween / ssTotal;
  const isSignificant = pValue < alpha;

  const apaReport = `F(${dfBetween}, ${dfWithin}) = ${fStatistic.toFixed(2)}, p ${
    pValue < 0.001 ? '< .001' : `= ${pValue.toFixed(3)}`
  }, η² = ${etaSquared.toFixed(3)}`;

  return {
    k,
    totalN,
    grandMean,
    ssBetween,
    ssWithin,
    ssTotal,
    dfBetween,
    dfWithin,
    dfTotal,
    msBetween,
    msWithin,
    fStatistic,
    pValue,
    etaSquared,
    isSignificant,
    apaReport,
    groups: groupStats,
  };
}
