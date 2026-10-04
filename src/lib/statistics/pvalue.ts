import {
  normalCdf,
  normalPdf,
  tCdf,
  tPdf,
  chiSquareCdf,
  chiSquarePdf,
  fCdf,
  fPdf,
} from './distributions';

export type DistributionType = 'z' | 't' | 'chisquare' | 'f';
export type TailType = 'two_tailed' | 'left_tailed' | 'right_tailed';

export interface PValueInput {
  distribution: DistributionType;
  statistic: number;
  df?: number;
  df2?: number; // for F distribution
  tail: TailType;
  alpha: number;
}

export interface PValueResult {
  pValue: number;
  pValueFormatted: string;
  isSignificant: boolean;
  distributionName: string;
  testStatistic: number;
  df?: number;
  df2?: number;
  tail: TailType;
  alpha: number;
  interpretation: string;
  apaReport: string;
  formula: string;
  steps: { title: string; content: string }[];
  assumptions: string[];
  commonMistakes: string[];
  curvePoints: { x: number; y: number; inTail: boolean }[];
  criticalValues?: { label: string; value: number }[];
}

export function formatPValue(p: number, precision: number = 4): string {
  if (isNaN(p)) return 'NaN';
  if (p < 0.0001) {
    return '< .0001';
  }
  // Standard format without leading zero for APA or with standard decimal
  return p.toFixed(precision);
}

export function calculatePValue(input: PValueInput): PValueResult {
  const { distribution, statistic, tail, alpha } = input;
  const df = input.df !== undefined ? input.df : 1;
  const df2 = input.df2 !== undefined ? input.df2 : 1;

  let p = 0;
  let distName = '';
  let formulaStr = '';
  const steps: { title: string; content: string }[] = [];
  const assumptions: string[] = [];
  const commonMistakes: string[] = [];

  switch (distribution) {
    case 'z': {
      distName = 'Standard Normal (Z) Distribution';
      formulaStr = 'Z = \\frac{\\bar{X} - \\mu_0}{\\sigma / \\sqrt{n}}';

      assumptions.push(
        'Data values are independent and identically distributed.',
        'The population standard deviation (σ) is known or the sample size is very large (n ≥ 30) under the Central Limit Theorem.',
        'The sampling distribution of the mean is approximately normal.'
      );

      commonMistakes.push(
        'Do not interpret p as the probability that the null hypothesis (H₀) is true. It is the probability of observing data at least this extreme IF H₀ were true.',
        'Do not confuse statistical significance with practical significance or effect size. A tiny difference can be significant with large sample sizes.',
        'Using a Z-test when the population standard deviation is unknown and the sample is small (use a Student’s t-test instead).'
      );

      const cdfVal = normalCdf(statistic);

      if (tail === 'left_tailed') {
        p = cdfVal;
        steps.push({
          title: 'Calculate Left-Tail Area',
          content: `For a left-tailed test with Z = ${statistic.toFixed(4)}, the p-value is the probability P(Z ≤ ${statistic.toFixed(4)}) = ${p.toFixed(5)}.`,
        });
      } else if (tail === 'right_tailed') {
        p = 1 - cdfVal;
        steps.push({
          title: 'Calculate Right-Tail Area',
          content: `For a right-tailed test with Z = ${statistic.toFixed(4)}, the p-value is the probability P(Z ≥ ${statistic.toFixed(4)}) = 1 - P(Z ≤ ${statistic.toFixed(4)}) = 1 - ${cdfVal.toFixed(5)} = ${p.toFixed(5)}.`,
        });
      } else {
        // Two-tailed
        p = 2 * (1 - normalCdf(Math.abs(statistic)));
        steps.push({
          title: 'Calculate Two-Tailed Area',
          content: `For a two-tailed test, the test statistic magnitude |Z| = ${Math.abs(statistic).toFixed(4)}. The two-tailed p-value is 2 × P(Z ≥ ${Math.abs(statistic).toFixed(4)}) = 2 × (1 - ${normalCdf(Math.abs(statistic)).toFixed(5)}) = ${p.toFixed(5)}.`,
        });
      }
      break;
    }

    case 't': {
      distName = `Student's t-Distribution (df = ${df})`;
      formulaStr = 't = \\frac{\\bar{X} - \\mu_0}{s / \\sqrt{n}} \\quad (df = n - 1)';

      assumptions.push(
        'The continuous outcome is sampled randomly from the population of interest.',
        'Observations are independent of one another.',
        'The population is approximately normally distributed (robust for moderate to large samples under the Central Limit Theorem).'
      );

      commonMistakes.push(
        'Failing to use correct degrees of freedom (e.g. n - 1 for one-sample / paired t-test; n₁ + n₂ - 2 for independent two-sample t-test).',
        'Interpreting p > α as "proving the null hypothesis is true". An insignificant result means insufficient evidence to reject H₀.',
        'Selecting a one-tailed test after looking at the direction of the sample data (post-hoc tail selection biases results).'
      );

      const cdfVal = tCdf(statistic, df);

      if (tail === 'left_tailed') {
        p = cdfVal;
        steps.push({
          title: 'Left-Tail Student-t Area',
          content: `For a left-tailed t-test with t = ${statistic.toFixed(4)} and df = ${df}, p = P(T ≤ ${statistic.toFixed(4)}) = ${p.toFixed(5)}.`,
        });
      } else if (tail === 'right_tailed') {
        p = 1 - cdfVal;
        steps.push({
          title: 'Right-Tail Student-t Area',
          content: `For a right-tailed t-test with t = ${statistic.toFixed(4)} and df = ${df}, p = P(T ≥ ${statistic.toFixed(4)}) = 1 - ${cdfVal.toFixed(5)} = ${p.toFixed(5)}.`,
        });
      } else {
        // Two-tailed
        p = 2 * (1 - tCdf(Math.abs(statistic), df));
        steps.push({
          title: 'Two-Tailed Student-t Area',
          content: `For a two-tailed test with df = ${df} and |t| = ${Math.abs(statistic).toFixed(4)}, p = 2 × P(T ≥ ${Math.abs(statistic).toFixed(4)}) = 2 × (1 - ${tCdf(Math.abs(statistic), df).toFixed(5)}) = ${p.toFixed(5)}.`,
        });
      }
      break;
    }

    case 'chisquare': {
      distName = `Chi-Square (χ²) Distribution (df = ${df})`;
      formulaStr = '\\chi^2 = \\sum \\frac{(O - E)^2}{E} \\quad (df = k - 1)';

      assumptions.push(
        'Data consists of independent categorical frequencies/counts.',
        'Mutually exclusive and exhaustive categories.',
        'Adequate expected cell frequencies (traditionally all E ≥ 1 and at least 80% of cells have E ≥ 5).'
      );

      commonMistakes.push(
        'Entering percentages or proportions instead of raw counts/frequencies.',
        'Using Chi-Square on repeated measures or paired data (use McNemar’s test instead).',
        'Testing with very small sample sizes without Yates correction or Fisher’s exact test.'
      );

      const cdfVal = chiSquareCdf(statistic, df);

      if (tail === 'left_tailed') {
        p = cdfVal;
        steps.push({
          title: 'Left-Tail Chi-Square Probability',
          content: `P(χ² ≤ ${statistic.toFixed(4)}) with ${df} df = ${p.toFixed(5)}. Note: standard goodness-of-fit and independence tests use the upper right tail.`,
        });
      } else if (tail === 'two_tailed') {
        // Chi-square is asymmetrical: two-tailed tail area is bounded
        const lower = cdfVal;
        const upper = 1 - cdfVal;
        p = Math.min(1, 2 * Math.min(lower, upper));
        steps.push({
          title: 'Two-Tailed Chi-Square Probability',
          content: `Because χ² is non-negative and asymmetric, two-tailed probability is computed as 2 × min(P(χ² ≤ ${statistic.toFixed(4)}), P(χ² ≥ ${statistic.toFixed(4)})) = ${p.toFixed(5)}.`,
        });
      } else {
        // Right-tailed (standard)
        p = 1 - cdfVal;
        steps.push({
          title: 'Standard Upper-Tail Chi-Square Probability',
          content: `For χ² = ${statistic.toFixed(4)} and df = ${df}, the upper-tail probability is p = 1 - P(χ² ≤ ${statistic.toFixed(4)}) = 1 - ${cdfVal.toFixed(5)} = ${p.toFixed(5)}.`,
        });
      }
      break;
    }

    case 'f': {
      distName = `Snedecor's F-Distribution (df₁ = ${df}, df₂ = ${df2})`;
      formulaStr = 'F = \\frac{MS_{between}}{MS_{within}} = \\frac{s_1^2}{s_2^2}';

      assumptions.push(
        'Populations sampled are normally distributed.',
        'Homogeneity of variance across comparison groups (homoscedasticity).',
        'Samples are independent random selections.'
      );

      commonMistakes.push(
        'Swapping numerator degrees of freedom (df₁) and denominator degrees of freedom (df₂).',
        'Assuming a significant omnibus F-test identifies which specific pair of group means differ (requires post-hoc pairwise tests like Tukey HSD).',
        'Ignoring extreme variance heterogeneity when sample sizes are unbalanced.'
      );

      const cdfVal = fCdf(statistic, df, df2);

      if (tail === 'left_tailed') {
        p = cdfVal;
        steps.push({
          title: 'Left-Tail F-Distribution Probability',
          content: `P(F ≤ ${statistic.toFixed(4)}) with df₁ = ${df} and df₂ = ${df2} is ${p.toFixed(5)}.`,
        });
      } else if (tail === 'two_tailed') {
        const lower = cdfVal;
        const upper = 1 - cdfVal;
        p = Math.min(1, 2 * Math.min(lower, upper));
        steps.push({
          title: 'Two-Tailed F-Distribution Probability',
          content: `Two-tailed F-probability is 2 × min(P(F ≤ ${statistic.toFixed(4)}), P(F ≥ ${statistic.toFixed(4)})) = ${p.toFixed(5)}.`,
        });
      } else {
        // Right-tailed (standard ANOVA / regression)
        p = 1 - cdfVal;
        steps.push({
          title: 'Standard Upper-Tail F-Distribution Probability',
          content: `For F = ${statistic.toFixed(4)} with df₁ = ${df}, df₂ = ${df2}, the right-tail p-value is p = 1 - P(F ≤ ${statistic.toFixed(4)}) = 1 - ${cdfVal.toFixed(5)} = ${p.toFixed(5)}.`,
        });
      }
      break;
    }
  }

  // Ensure p stays in [0, 1]
  p = Math.max(0, Math.min(1, p));

  const isSignificant = p < alpha;
  const pFormatted = formatPValue(p);
  const pFormattedApa = p < 0.001 ? '< .001' : `= ${p.toFixed(3).replace(/^0\./, '.')}`;

  // APA 7th Edition style reporting
  let apaReport = '';
  switch (distribution) {
    case 'z':
      apaReport = `z = ${statistic.toFixed(2)}, p ${pFormattedApa}`;
      break;
    case 't':
      apaReport = `t(${df}) = ${statistic.toFixed(2)}, p ${pFormattedApa}`;
      break;
    case 'chisquare':
      apaReport = `χ²(${df}) = ${statistic.toFixed(2)}, p ${pFormattedApa}`;
      break;
    case 'f':
      apaReport = `F(${df}, ${df2}) = ${statistic.toFixed(2)}, p ${pFormattedApa}`;
      break;
  }

  const pPct = (p * 100).toFixed(2);
  const tailDesc =
    tail === 'two_tailed' ? 'two-tailed' : tail === 'left_tailed' ? 'left-tailed' : 'right-tailed';

  const interpretation = isSignificant
    ? `The result is statistically significant at the α = ${alpha} level (p = ${pFormatted}). Assuming the null hypothesis is true, a ${tailDesc} test statistic at least as extreme as ${statistic.toFixed(3)} would occur by chance with an estimated probability of ${pPct}%. Because p < α, there is sufficient statistical evidence to reject the null hypothesis in favor of the alternative hypothesis.`
    : `The result is not statistically significant at the α = ${alpha} level (p = ${pFormatted}). Assuming the null hypothesis is true, a ${tailDesc} test statistic at least as extreme as ${statistic.toFixed(3)} would occur by chance with a probability of ${pPct}%. Because p ≥ α, the data does not provide sufficient evidence to reject the null hypothesis at this significance threshold.`;

  // Generate visualization points
  const curvePoints = generateDistributionPoints(distribution, statistic, tail, df, df2);

  return {
    pValue: p,
    pValueFormatted: pFormatted,
    isSignificant,
    distributionName: distName,
    testStatistic: statistic,
    df,
    df2,
    tail,
    alpha,
    interpretation,
    apaReport,
    formula: formulaStr,
    steps,
    assumptions,
    commonMistakes,
    curvePoints,
  };
}

function generateDistributionPoints(
  dist: DistributionType,
  stat: number,
  tail: TailType,
  df: number,
  df2: number
): { x: number; y: number; inTail: boolean }[] {
  const points: { x: number; y: number; inTail: boolean }[] = [];
  const numSteps = 120;

  let minX = -4;
  let maxX = 4;

  if (dist === 'z') {
    const range = Math.max(4, Math.abs(stat) + 1);
    minX = -range;
    maxX = range;
  } else if (dist === 't') {
    const range = Math.max(4, Math.abs(stat) + 1.2);
    minX = -range;
    maxX = range;
  } else if (dist === 'chisquare') {
    minX = 0;
    maxX = Math.max(df * 3 + 2, stat + 4);
  } else if (dist === 'f') {
    minX = 0.01;
    maxX = Math.max(5, stat + 2);
  }

  const step = (maxX - minX) / numSteps;

  for (let i = 0; i <= numSteps; i++) {
    const x = minX + i * step;
    let y = 0;

    if (dist === 'z') {
      y = normalPdf(x);
    } else if (dist === 't') {
      y = tPdf(x, df);
    } else if (dist === 'chisquare') {
      y = chiSquarePdf(x, df);
    } else if (dist === 'f') {
      y = fPdf(x, df, df2);
    }

    let inTail = false;
    if (dist === 'z' || dist === 't') {
      if (tail === 'left_tailed') {
        inTail = x <= stat;
      } else if (tail === 'right_tailed') {
        inTail = x >= stat;
      } else {
        const absVal = Math.abs(stat);
        inTail = x <= -absVal || x >= absVal;
      }
    } else {
      // Chi-Square and F
      if (tail === 'left_tailed') {
        inTail = x <= stat;
      } else if (tail === 'right_tailed') {
        inTail = x >= stat;
      } else {
        inTail = x >= stat;
      }
    }

    points.push({ x, y, inTail });
  }

  return points;
}
