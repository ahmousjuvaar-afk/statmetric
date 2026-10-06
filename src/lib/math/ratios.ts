/**
 * Ratio & Proportion calculation engine:
 * 1. Simplify ratio A : B (or A : B : C)
 * 2. Solve proportion: A / B = C / D (finding any single unknown)
 * 3. Part-to-Whole and Part-to-Part ratio distribution of a total sum
 */

import { gcd } from './fractions';

export interface SimplifyRatioResult {
  simplifiedA: number;
  simplifiedB: number;
  simplifiedC?: number;
  ratioString: string;
  decimalAtoB: number;
  steps: { title: string; content: string }[];
}

export function simplifyRatio(a: number, b: number, c?: number): SimplifyRatioResult {
  if (a <= 0 || b <= 0 || (c !== undefined && c <= 0)) {
    throw new Error('Ratio terms must be positive numbers.');
  }

  // Handle decimals by finding multiplier to make all integers
  const getDecimals = (n: number) => {
    const s = n.toString();
    const idx = s.indexOf('.');
    return idx >= 0 ? s.length - idx - 1 : 0;
  };
  const maxDec = Math.max(getDecimals(a), getDecimals(b), c !== undefined ? getDecimals(c) : 0);
  const factor = Math.pow(10, maxDec);

  const intA = Math.round(a * factor);
  const intB = Math.round(b * factor);
  const intC = c !== undefined ? Math.round(c * factor) : undefined;

  let common = gcd(intA, intB);
  if (intC !== undefined) {
    common = gcd(common, intC);
  }

  const sA = intA / common;
  const sB = intB / common;
  const sC = intC !== undefined ? intC / common : undefined;

  const ratioString = sC !== undefined ? `${sA} : ${sB} : ${sC}` : `${sA} : ${sB}`;
  const steps: { title: string; content: string }[] = [];

  if (factor > 1) {
    steps.push({
      title: 'Convert to Whole Numbers',
      content: `Multiply all terms by ${factor} to remove decimals: ${intA} : ${intB}${intC !== undefined ? ` : ${intC}` : ''}`,
    });
  }

  steps.push({
    title: 'Divide by Greatest Common Divisor',
    content: `Greatest common divisor is ${common}. Divide each term: ${intA} ÷ ${common} = ${sA}, ${intB} ÷ ${common} = ${sB}${
      intC !== undefined ? `, ${intC} ÷ ${common} = ${sC}` : ''
    }`,
  });

  return {
    simplifiedA: sA,
    simplifiedB: sB,
    simplifiedC: sC,
    ratioString,
    decimalAtoB: a / b,
    steps,
  };
}

export type MissingProportionTerm = 'A' | 'B' | 'C' | 'D';

export interface ProportionResult {
  missingTerm: MissingProportionTerm;
  solvedValue: number;
  formattedFormula: string;
  steps: { title: string; content: string }[];
}

export function solveProportion(
  a: number | null,
  b: number | null,
  c: number | null,
  d: number | null
): ProportionResult {
  // Exactly one term must be null
  const nullCount = [a, b, c, d].filter((x) => x === null || isNaN(x as number)).length;
  if (nullCount !== 1) {
    throw new Error('Please leave exactly one value blank to solve for it.');
  }

  const steps: { title: string; content: string }[] = [];

  if (a === null) {
    if (d === 0) throw new Error('D cannot be 0.');
    const val = ((b as number) * (c as number)) / (d as number);
    steps.push({
      title: 'Cross Multiply',
      content: `A × D = B × C  =>  A × ${d} = ${b} × ${c} = ${(b as number) * (c as number)}`,
    });
    steps.push({
      title: 'Divide by D',
      content: `A = (${b} × ${c}) ÷ ${d} = ${Number(val.toFixed(6))}`,
    });
    return {
      missingTerm: 'A',
      solvedValue: val,
      formattedFormula: `A = \\frac{B \\times C}{D}`,
      steps,
    };
  }

  if (b === null) {
    if (c === 0) throw new Error('C cannot be 0.');
    const val = ((a as number) * (d as number)) / (c as number);
    steps.push({
      title: 'Cross Multiply',
      content: `B × C = A × D  =>  B × ${c} = ${a} × ${d} = ${(a as number) * (d as number)}`,
    });
    steps.push({
      title: 'Divide by C',
      content: `B = (${a} × ${d}) ÷ ${c} = ${Number(val.toFixed(6))}`,
    });
    return {
      missingTerm: 'B',
      solvedValue: val,
      formattedFormula: `B = \\frac{A \\times D}{C}`,
      steps,
    };
  }

  if (c === null) {
    if (b === 0) throw new Error('B cannot be 0.');
    const val = ((a as number) * (d as number)) / (b as number);
    steps.push({
      title: 'Cross Multiply',
      content: `A × D = B × C  =>  ${a} × ${d} = ${b} × C`,
    });
    steps.push({
      title: 'Divide by B',
      content: `C = (${a} × ${d}) ÷ ${b} = ${Number(val.toFixed(6))}`,
    });
    return {
      missingTerm: 'C',
      solvedValue: val,
      formattedFormula: `C = \\frac{A \\times D}{B}`,
      steps,
    };
  }

  // d === null
  if (a === 0) throw new Error('A cannot be 0.');
  const val = ((b as number) * (c as number)) / (a as number);
  steps.push({
    title: 'Cross Multiply',
    content: `A × D = B × C  =>  ${a} × D = ${b} × ${c}`,
  });
  steps.push({
    title: 'Divide by A',
    content: `D = (${b} × ${c}) ÷ ${a} = ${Number(val.toFixed(6))}`,
  });
  return {
    missingTerm: 'D',
    solvedValue: val,
    formattedFormula: `D = \\frac{B \\times C}{A}`,
    steps,
  };
}
