import {
  normalCdf,
  normalPdf,
  inverseNormalCdf,
} from './distributions';

export type NormalDistMode =
  | 'less_than'
  | 'greater_than'
  | 'between'
  | 'outside'
  | 'inverse_percentile'
  | 'find_z';

export interface NormalDistInput {
  mode: NormalDistMode;
  mean: number;
  sd: number;
  x?: number;
  lowerBound?: number;
  upperBound?: number;
  percentile?: number; // 0 to 100 or 0 to 1
}

export interface NormalDistResult {
  mode: NormalDistMode;
  mean: number;
  sd: number;
  probability: number;
  probabilityPercent: string;
  zScore?: number;
  zScoreLower?: number;
  zScoreUpper?: number;
  xCalculated?: number;
  interpretation: string;
  apaReport: string;
  steps: { title: string; content: string }[];
  assumptions: string[];
  commonMistakes: string[];
  curvePoints: { x: number; y: number; inShaded: boolean }[];
  domainMin: number;
  domainMax: number;
}

export function calculateNormalDist(input: NormalDistInput): NormalDistResult {
  const { mode, mean, sd } = input;

  if (sd <= 0 || isNaN(sd)) {
    throw new Error('Standard deviation (σ) must be strictly greater than 0.');
  }
  if (isNaN(mean)) {
    throw new Error('Mean (μ) must be a valid number.');
  }

  let probability = 0;
  let zScore: number | undefined;
  let zScoreLower: number | undefined;
  let zScoreUpper: number | undefined;
  let xCalculated: number | undefined;
  const steps: { title: string; content: string }[] = [];
  let apaReport = '';
  let interpretation = '';

  const assumptions = [
    'The variable follows a continuous, symmetrical bell-shaped Gaussian distribution centered at mean μ.',
    '68.27% of observations lie within μ ± 1σ; 95.45% within μ ± 2σ; 99.73% within μ ± 3σ (Empirical Rule).',
    'The tails extend asymptotically toward infinity in both directions without ever reaching zero probability.',
  ];

  const commonMistakes = [
    'Confusing probability density f(x) with cumulative probability P(X ≤ x). For a continuous variable, P(X = exact number) = 0.',
    'Using raw units instead of standardized Z-scores when comparing distributions with different scales.',
    'Assuming real-world empirical data is perfectly normal without testing for heavy tails, skewness, or extreme outliers.',
  ];

  const domainMin = mean - 4 * sd;
  const domainMax = mean + 4 * sd;

  switch (mode) {
    case 'less_than': {
      const x = input.x ?? mean;
      zScore = (x - mean) / sd;
      probability = normalCdf(zScore);

      steps.push({
        title: 'Step 1: Standardize to Z-Score',
        content: `Convert raw value x = ${x} to standard units: z = (x - μ) / σ = (${x} - ${mean}) / ${sd} = ${zScore.toFixed(4)}.`,
      });
      steps.push({
        title: 'Step 2: Cumulative Standard Normal Probability',
        content: `Lookup Φ(${zScore.toFixed(4)}) = P(Z ≤ ${zScore.toFixed(4)}) = ${probability.toFixed(5)}.`,
      });

      interpretation = `The probability of a randomly selected value being less than or equal to ${x} is ${(
        probability * 100
      ).toFixed(2)}% (P(X ≤ ${x}) = ${probability.toFixed(4)}). In a normal population with μ = ${mean} and σ = ${sd}, approximately ${(
        probability * 100
      ).toFixed(1)}% of values fall below this point.`;

      apaReport = `P(X ≤ ${x}) = ${(probability * 100).toFixed(1)}%, z = ${zScore.toFixed(2)}`;
      break;
    }

    case 'greater_than': {
      const x = input.x ?? mean;
      zScore = (x - mean) / sd;
      const cdfVal = normalCdf(zScore);
      probability = 1 - cdfVal;

      steps.push({
        title: 'Step 1: Standardize to Z-Score',
        content: `z = (x - μ) / σ = (${x} - ${mean}) / ${sd} = ${zScore.toFixed(4)}.`,
      });
      steps.push({
        title: 'Step 2: Apply Complement Rule',
        content: `P(X ≥ ${x}) = 1 - P(X ≤ ${x}) = 1 - Φ(${zScore.toFixed(4)}) = 1 - ${cdfVal.toFixed(5)} = ${probability.toFixed(5)}.`,
      });

      interpretation = `The probability of a randomly selected value exceeding ${x} is ${(
        probability * 100
      ).toFixed(2)}% (P(X ≥ ${x}) = ${probability.toFixed(4)}). Approximately ${(
        probability * 100
      ).toFixed(1)}% of the distribution lies above ${x}.`;

      apaReport = `P(X ≥ ${x}) = ${(probability * 100).toFixed(1)}%, z = ${zScore.toFixed(2)}`;
      break;
    }

    case 'between': {
      let a = input.lowerBound ?? mean - sd;
      let b = input.upperBound ?? mean + sd;
      if (a > b) {
        const temp = a;
        a = b;
        b = temp;
      }
      zScoreLower = (a - mean) / sd;
      zScoreUpper = (b - mean) / sd;
      const cdfA = normalCdf(zScoreLower);
      const cdfB = normalCdf(zScoreUpper);
      probability = cdfB - cdfA;

      steps.push({
        title: 'Step 1: Compute Lower and Upper Z-Scores',
        content: `z₁ = (${a} - ${mean}) / ${sd} = ${zScoreLower.toFixed(4)}; z₂ = (${b} - ${mean}) / ${sd} = ${zScoreUpper.toFixed(4)}.`,
      });
      steps.push({
        title: 'Step 2: Calculate Area Difference',
        content: `P(${a} ≤ X ≤ ${b}) = Φ(z₂) - Φ(z₁) = ${cdfB.toFixed(5)} - ${cdfA.toFixed(5)} = ${probability.toFixed(5)}.`,
      });

      interpretation = `Approximately ${(probability * 100).toFixed(2)}% of observations fall within the interval between ${a} and ${b} (P(${a} ≤ X ≤ ${b}) = ${probability.toFixed(4)}).`;

      apaReport = `P(${a} ≤ X ≤ ${b}) = ${(probability * 100).toFixed(1)}% (z₁ = ${zScoreLower.toFixed(2)}, z₂ = ${zScoreUpper.toFixed(2)})`;
      break;
    }

    case 'outside': {
      let a = input.lowerBound ?? mean - sd;
      let b = input.upperBound ?? mean + sd;
      if (a > b) {
        const temp = a;
        a = b;
        b = temp;
      }
      zScoreLower = (a - mean) / sd;
      zScoreUpper = (b - mean) / sd;
      const cdfA = normalCdf(zScoreLower);
      const cdfB = normalCdf(zScoreUpper);
      probability = cdfA + (1 - cdfB);

      steps.push({
        title: 'Step 1: Compute Z-Scores for Both Tails',
        content: `z_lower = (${a} - ${mean}) / ${sd} = ${zScoreLower.toFixed(4)}; z_upper = (${b} - ${mean}) / ${sd} = ${zScoreUpper.toFixed(4)}.`,
      });
      steps.push({
        title: 'Step 2: Sum the Left and Right Tail Probabilities',
        content: `P(X < ${a}) + P(X > ${b}) = Φ(${zScoreLower.toFixed(4)}) + [1 - Φ(${zScoreUpper.toFixed(4)})] = ${cdfA.toFixed(5)} + ${(1 - cdfB).toFixed(5)} = ${probability.toFixed(5)}.`,
      });

      interpretation = `The combined probability of observing a value outside [${a}, ${b}] is ${(
        probability * 100
      ).toFixed(2)}% (P(X < ${a} or X > ${b}) = ${probability.toFixed(4)}).`;

      apaReport = `P(X < ${a} ∪ X > ${b}) = ${(probability * 100).toFixed(1)}%`;
      break;
    }

    case 'inverse_percentile': {
      let pct = input.percentile ?? 95;
      if (pct > 1) {
        // provided as 95 -> 0.95
        pct = pct / 100;
      }
      if (pct <= 0 || pct >= 1) {
        throw new Error('Percentile must be between 0% and 100% exclusive (e.g. 95 or 0.95).');
      }

      zScore = inverseNormalCdf(pct);
      xCalculated = mean + zScore * sd;
      probability = pct;

      steps.push({
        title: 'Step 1: Find Critical Z-Score from Cumulative Probability',
        content: `For cumulative probability p = ${pct.toFixed(4)}, the standard normal inverse quantile is z = Φ⁻¹(${pct.toFixed(4)}) = ${zScore.toFixed(4)}.`,
      });
      steps.push({
        title: 'Step 2: Unstandardize back to Raw Scale (x)',
        content: `x = μ + z × σ = ${mean} + (${zScore.toFixed(4)}) × ${sd} = ${xCalculated.toFixed(4)}.`,
      });

      interpretation = `The ${(pct * 100).toFixed(1)}th percentile corresponds to x = ${xCalculated.toFixed(3)} (z = ${zScore.toFixed(3)}). Exactly ${(
        pct * 100
      ).toFixed(1)}% of values in this normal distribution fall below ${xCalculated.toFixed(3)}.`;

      apaReport = `${(pct * 100).toFixed(0)}th percentile = ${xCalculated.toFixed(2)} (z = ${zScore.toFixed(2)})`;
      break;
    }

    case 'find_z': {
      const x = input.x ?? mean;
      zScore = (x - mean) / sd;
      probability = normalCdf(zScore);

      steps.push({
        title: 'Step 1: Apply Z-Score Formula',
        content: `z = (x - μ) / σ = (${x} - ${mean}) / ${sd} = ${zScore.toFixed(4)}.`,
      });
      steps.push({
        title: 'Step 2: Determine Standard Deviations Distance',
        content: `A raw score of ${x} lies exactly ${Math.abs(zScore).toFixed(4)} standard deviations ${
          zScore >= 0 ? 'above' : 'below'
        } the mean of ${mean}.`,
      });

      interpretation = `A value of x = ${x} has a standard score of z = ${zScore.toFixed(3)}. It is ${Math.abs(
        zScore
      ).toFixed(2)} standard deviations ${zScore >= 0 ? 'above' : 'below'} the mean (μ = ${mean}). This places it at the ${(
        probability * 100
      ).toFixed(1)}th percentile.`;

      apaReport = `x = ${x}, z = ${zScore.toFixed(2)}, percentile = ${(probability * 100).toFixed(1)}%`;
      break;
    }
  }

  // Generate SVG curve points
  const curvePoints: { x: number; y: number; inShaded: boolean }[] = [];
  const numSteps = 150;
  const stepSize = (domainMax - domainMin) / numSteps;

  for (let i = 0; i <= numSteps; i++) {
    const currX = domainMin + i * stepSize;
    const currZ = (currX - mean) / sd;
    const y = normalPdf(currZ) / sd;

    let inShaded = false;
    if (mode === 'less_than' || mode === 'find_z') {
      const thresh = input.x ?? mean;
      inShaded = currX <= thresh;
    } else if (mode === 'greater_than') {
      const thresh = input.x ?? mean;
      inShaded = currX >= thresh;
    } else if (mode === 'between') {
      let a = input.lowerBound ?? mean - sd;
      let b = input.upperBound ?? mean + sd;
      if (a > b) {
        const t = a;
        a = b;
        b = t;
      }
      inShaded = currX >= a && currX <= b;
    } else if (mode === 'outside') {
      let a = input.lowerBound ?? mean - sd;
      let b = input.upperBound ?? mean + sd;
      if (a > b) {
        const t = a;
        a = b;
        b = t;
      }
      inShaded = currX < a || currX > b;
    } else if (mode === 'inverse_percentile') {
      if (xCalculated !== undefined) {
        inShaded = currX <= xCalculated;
      }
    }

    curvePoints.push({ x: currX, y, inShaded });
  }

  return {
    mode,
    mean,
    sd,
    probability,
    probabilityPercent: `${(probability * 100).toFixed(2)}%`,
    zScore,
    zScoreLower,
    zScoreUpper,
    xCalculated,
    interpretation,
    apaReport,
    steps,
    assumptions,
    commonMistakes,
    curvePoints,
    domainMin,
    domainMax,
  };
}
