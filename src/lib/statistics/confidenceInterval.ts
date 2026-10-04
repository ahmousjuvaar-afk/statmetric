import { inverseNormalCdf } from './distributions';

export type CiType = 'mean_t' | 'mean_z' | 'proportion';

export interface CiInput {
  type: CiType;
  confidenceLevel: number; // e.g. 0.95
  mean?: number;
  sd?: number;
  n?: number;
  successes?: number;
  sampleSize?: number;
}

export interface CiResult {
  type: CiType;
  confidenceLevel: number;
  confidencePercent: string;
  pointEstimate: number;
  marginOfError: number;
  lowerBound: number;
  upperBound: number;
  criticalValue: number;
  criticalValueName: string;
  apaReport: string;
  interpretation: string;
  formula: string;
  steps: { title: string; content: string }[];
}

export function calculateConfidenceInterval(input: CiInput): CiResult {
  const { type, confidenceLevel } = input;

  if (confidenceLevel <= 0 || confidenceLevel >= 1) {
    throw new Error('Confidence level must be between 0 and 1 exclusive (e.g. 0.95 for 95%).');
  }

  const alpha = 1 - confidenceLevel;
  const confPct = `${(confidenceLevel * 100).toFixed(0)}%`;
  const zCrit = inverseNormalCdf(1 - alpha / 2);

  let pointEstimate = 0;
  let marginOfError = 0;
  let critVal = zCrit;
  let critName = 'z*';
  let formula = '';
  const steps: { title: string; content: string }[] = [];

  if (type === 'mean_z' || type === 'mean_t') {
    const mean = input.mean ?? 0;
    const sd = input.sd ?? 1;
    const n = input.n ?? 30;

    if (n < 2) throw new Error('Sample size n must be at least 2.');
    if (sd <= 0) throw new Error('Standard deviation must be strictly positive.');

    pointEstimate = mean;
    const se = sd / Math.sqrt(n);

    if (type === 'mean_t') {
      const df = n - 1;
      // Approximate t critical from normal + Hill/Fisher expansion
      critVal = zCrit + (zCrit * zCrit * zCrit + zCrit) / (4 * df);
      critName = `t* (df = ${df})`;
      formula = '\\text{CI} = \\bar{x} \\pm t^* \\times \\frac{s}{\\sqrt{n}}';

      steps.push({
        title: 'Step 1: Compute Standard Error of the Mean',
        content: `SE = s / √n = ${sd} / √${n} = ${se.toFixed(4)}.`,
      });
      steps.push({
        title: 'Step 2: Determine Critical t-Value',
        content: `For a ${confPct} two-sided confidence interval with df = ${df}, critical t* = ${critVal.toFixed(4)}.`,
      });
    } else {
      critVal = zCrit;
      critName = 'z*';
      formula = '\\text{CI} = \\bar{x} \\pm z^* \\times \\frac{\\sigma}{\\sqrt{n}}';

      steps.push({
        title: 'Step 1: Standard Error of the Mean',
        content: `SE = σ / √n = ${sd} / √${n} = ${se.toFixed(4)}.`,
      });
      steps.push({
        title: 'Step 2: Critical Normal Z-Value',
        content: `For a ${confPct} level (α/2 = ${(alpha / 2).toFixed(3)}), critical z* = ${critVal.toFixed(4)}.`,
      });
    }

    marginOfError = critVal * se;
    steps.push({
      title: 'Step 3: Calculate Margin of Error & Interval Bounds',
      content: `Margin of Error (ME) = ${critVal.toFixed(3)} × ${se.toFixed(4)} = ${marginOfError.toFixed(4)}. Interval = ${mean} ± ${marginOfError.toFixed(4)}.`,
    });
  } else {
    // Proportion
    const k = input.successes ?? 50;
    const n = input.sampleSize ?? 100;
    if (n <= 0) throw new Error('Sample size must be greater than 0.');
    if (k < 0 || k > n) throw new Error('Successes must be between 0 and total sample size.');

    pointEstimate = k / n;
    critVal = zCrit;
    critName = 'z*';
    const se = Math.sqrt((pointEstimate * (1 - pointEstimate)) / n);
    marginOfError = critVal * se;
    formula = '\\text{CI} = \\hat{p} \\pm z^* \\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{n}}';

    steps.push({
      title: 'Step 1: Compute Sample Proportion & Standard Error',
      content: `p̂ = ${k} / ${n} = ${pointEstimate.toFixed(4)}. SE = √[(${pointEstimate.toFixed(4)} × ${(1 - pointEstimate).toFixed(4)}) / ${n}] = ${se.toFixed(4)}.`,
    });
    steps.push({
      title: 'Step 2: Calculate Margin of Error',
      content: `Margin of Error = ${critVal.toFixed(3)} × ${se.toFixed(4)} = ${marginOfError.toFixed(4)}.`,
    });
  }

  const lowerBound = pointEstimate - marginOfError;
  const upperBound = pointEstimate + marginOfError;

  const apaReport = `${confPct} CI [${lowerBound.toFixed(2)}, ${upperBound.toFixed(2)}]`;
  const interpretation = `We are ${confPct} confident that the true population parameter lies between ${lowerBound.toFixed(3)} and ${upperBound.toFixed(3)}. In repeated random sampling under identical conditions, approximately ${confPct} of calculated intervals will contain the true parameter.`;

  return {
    type,
    confidenceLevel,
    confidencePercent: confPct,
    pointEstimate,
    marginOfError,
    lowerBound,
    upperBound,
    criticalValue: critVal,
    criticalValueName: critName,
    apaReport,
    interpretation,
    formula,
    steps,
  };
}
