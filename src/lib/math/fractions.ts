/**
 * High-precision fraction arithmetic & simplification library.
 */

export interface Fraction {
  numerator: number;
  denominator: number;
}

export interface FractionResult {
  numerator: number;
  denominator: number;
  wholeNumber?: number;
  remainderNumerator?: number;
  isMixed: boolean;
  decimal: number;
  simplifiedString: string;
  mixedString: string;
  steps: { title: string; content: string }[];
}

export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

export function simplifyFraction(num: number, den: number): Fraction {
  if (den === 0) throw new Error('Denominator cannot be zero');
  if (num === 0) return { numerator: 0, denominator: 1 };

  const sign = (num < 0) !== (den < 0) ? -1 : 1;
  const absNum = Math.abs(num);
  const absDen = Math.abs(den);
  const common = gcd(absNum, absDen);

  return {
    numerator: sign * (absNum / common),
    denominator: absDen / common,
  };
}

export type FractionOperation = 'add' | 'subtract' | 'multiply' | 'divide';

export function calculateFractions(
  f1: Fraction,
  f2: Fraction,
  op: FractionOperation
): FractionResult {
  if (f1.denominator === 0 || f2.denominator === 0) {
    throw new Error('Denominator cannot be zero.');
  }

  let rawNum = 0;
  let rawDen = 1;
  const steps: { title: string; content: string }[] = [];

  if (op === 'add' || op === 'subtract') {
    const commonDen = lcm(f1.denominator, f2.denominator);
    const m1 = commonDen / f1.denominator;
    const m2 = commonDen / f2.denominator;
    const adjNum1 = f1.numerator * m1;
    const adjNum2 = f2.numerator * m2;

    steps.push({
      title: 'Find Common Denominator',
      content: `The least common multiple of ${f1.denominator} and ${f2.denominator} is ${commonDen}. Convert fractions: ${f1.numerator}/${f1.denominator} = ${adjNum1}/${commonDen} and ${f2.numerator}/${f2.denominator} = ${adjNum2}/${commonDen}.`,
    });

    if (op === 'add') {
      rawNum = adjNum1 + adjNum2;
      steps.push({
        title: 'Add Numerators',
        content: `(${adjNum1} + ${adjNum2}) / ${commonDen} = ${rawNum} / ${commonDen}`,
      });
    } else {
      rawNum = adjNum1 - adjNum2;
      steps.push({
        title: 'Subtract Numerators',
        content: `(${adjNum1} - ${adjNum2}) / ${commonDen} = ${rawNum} / ${commonDen}`,
      });
    }
    rawDen = commonDen;
  } else if (op === 'multiply') {
    rawNum = f1.numerator * f2.numerator;
    rawDen = f1.denominator * f2.denominator;
    steps.push({
      title: 'Multiply Numerators and Denominators',
      content: `(${f1.numerator} × ${f2.numerator}) / (${f1.denominator} × ${f2.denominator}) = ${rawNum} / ${rawDen}`,
    });
  } else if (op === 'divide') {
    if (f2.numerator === 0) {
      throw new Error('Cannot divide by a fraction with numerator 0.');
    }
    rawNum = f1.numerator * f2.denominator;
    rawDen = f1.denominator * f2.numerator;
    steps.push({
      title: 'Invert and Multiply (Reciprocal)',
      content: `Invert the second fraction (${f2.numerator}/${f2.denominator} becomes ${f2.denominator}/${f2.numerator}): (${f1.numerator} × ${f2.denominator}) / (${f1.denominator} × ${f2.numerator}) = ${rawNum} / ${rawDen}`,
    });
  }

  const simplified = simplifyFraction(rawNum, rawDen);
  const common = gcd(Math.abs(rawNum), Math.abs(rawDen));

  if (common > 1) {
    steps.push({
      title: 'Simplify Fraction',
      content: `Divide both numerator and denominator by greatest common divisor (${common}): ${rawNum} ÷ ${common} / ${rawDen} ÷ ${common} = ${simplified.numerator}/${simplified.denominator}`,
    });
  }

  const decimal = simplified.numerator / simplified.denominator;
  const absNum = Math.abs(simplified.numerator);
  const absDen = simplified.denominator;
  const isImproper = absNum >= absDen && absDen !== 1;

  let wholeNumber: number | undefined;
  let remainderNumerator: number | undefined;
  let mixedString = `${simplified.numerator}/${simplified.denominator}`;

  if (isImproper) {
    const whole = Math.floor(absNum / absDen);
    const rem = absNum % absDen;
    const sign = simplified.numerator < 0 ? '-' : '';
    wholeNumber = simplified.numerator < 0 ? -whole : whole;
    remainderNumerator = rem;
    mixedString = rem === 0 ? `${sign}${whole}` : `${sign}${whole} ${rem}/${absDen}`;

    steps.push({
      title: 'Convert to Mixed Number',
      content: `${simplified.numerator} / ${simplified.denominator} = ${mixedString}`,
    });
  }

  return {
    numerator: simplified.numerator,
    denominator: simplified.denominator,
    wholeNumber,
    remainderNumerator,
    isMixed: isImproper,
    decimal,
    simplifiedString: simplified.denominator === 1 ? `${simplified.numerator}` : `${simplified.numerator}/${simplified.denominator}`,
    mixedString,
    steps,
  };
}
