import { normalCdf, normalPdf, inverseNormalCdf } from './distributions';

export interface ZScoreInput {
  mode: 'forward' | 'reverse';
  x?: number;
  z?: number;
  mean: number;
  sd: number;
}

export interface ZScoreResult {
  mode: 'forward' | 'reverse';
  x: number;
  z: number;
  mean: number;
  sd: number;
  percentile: number;
  percentileFormatted: string;
  leftTailArea: number;
  rightTailArea: number;
  twoTailArea: number;
  interpretation: string;
  formula: string;
  steps: { title: string; content: string }[];
}

export function calculateZScore(input: ZScoreInput): ZScoreResult {
  const { mode, mean, sd } = input;

  if (sd <= 0 || isNaN(sd)) {
    throw new Error('Standard deviation (σ) must be strictly greater than 0.');
  }
  if (isNaN(mean)) {
    throw new Error('Mean (μ) must be a valid number.');
  }

  let x = 0;
  let z = 0;
  const steps: { title: string; content: string }[] = [];
  let formula = '';

  if (mode === 'forward') {
    x = input.x ?? mean;
    z = (x - mean) / sd;
    formula = 'z = \\frac{x - \\mu}{\\sigma}';
    steps.push({
      title: 'Step 1: Subtract Distribution Mean',
      content: `Difference from mean = x - μ = ${x} - ${mean} = ${(x - mean).toFixed(4)}.`,
    });
    steps.push({
      title: 'Step 2: Divide by Standard Deviation',
      content: `z = (${(x - mean).toFixed(4)}) / ${sd} = ${z.toFixed(4)}.`,
    });
  } else {
    z = input.z ?? 0;
    x = mean + z * sd;
    formula = 'x = \\mu + z \\times \\sigma';
    steps.push({
      title: 'Step 1: Multiply Z-Score by Standard Deviation',
      content: `Distance from mean = z × σ = ${z} × ${sd} = ${(z * sd).toFixed(4)}.`,
    });
    steps.push({
      title: 'Step 2: Add Distribution Mean',
      content: `x = ${mean} + ${(z * sd).toFixed(4)} = ${x.toFixed(4)}.`,
    });
  }

  const leftTail = normalCdf(z);
  const rightTail = 1 - leftTail;
  const twoTail = 2 * (1 - normalCdf(Math.abs(z)));
  const pct = leftTail * 100;

  const direction = z >= 0 ? 'above' : 'below';
  const interpretation = `A raw value of ${x.toFixed(3)} corresponds to a standard score of z = ${z.toFixed(3)}. It is ${Math.abs(
    z
  ).toFixed(2)} standard deviations ${direction} the mean (μ = ${mean}). Approximately ${pct.toFixed(2)}% of the population lies below this score (placing it at the ${pct.toFixed(1)}th percentile).`;

  return {
    mode,
    x,
    z,
    mean,
    sd,
    percentile: pct,
    percentileFormatted: `${pct.toFixed(2)}%`,
    leftTailArea: leftTail,
    rightTailArea: rightTail,
    twoTailArea: twoTail,
    interpretation,
    formula,
    steps,
  };
}
