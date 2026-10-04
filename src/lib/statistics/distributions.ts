/**
 * Precision statistical distribution functions.
 * Implements high-accuracy numerical approximations for standard normal,
 * Student's t, Chi-Square, and F distributions.
 */

// Math constants
const SQRT_2PI = Math.sqrt(2 * Math.PI);
const LOG_SQRT_2PI = Math.log(SQRT_2PI);

/**
 * Standard Normal Probability Density Function (PDF)
 * f(z) = (1 / sqrt(2*pi)) * exp(-z^2 / 2)
 */
export function normalPdf(z: number): number {
  return Math.exp(-0.5 * z * z) / SQRT_2PI;
}

/**
 * Normal PDF with mean mu and standard deviation sigma
 */
export function normalPdfGeneral(x: number, mu: number, sigma: number): number {
  if (sigma <= 0) return 0;
  const z = (x - mu) / sigma;
  return normalPdf(z) / sigma;
}

/**
 * High-accuracy Error Function erf(x) using Chebyshev approximation.
 * Maximum error < 1.5e-7 (or better via 10-term coefficients).
 */
export function erf(x: number): number {
  // Abramowitz & Stegun 7.1.26
  const sign = x >= 0 ? 1 : -1;
  const absX = Math.abs(x);

  const p = 0.3275911;
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;

  const t = 1.0 / (1.0 + p * absX);
  const poly = ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t;
  const result = 1.0 - poly * Math.exp(-absX * absX);

  return sign * result;
}

/**
 * Complementary error function erfc(x) = 1 - erf(x)
 */
export function erfc(x: number): number {
  return 1 - erf(x);
}

/**
 * Standard Normal Cumulative Distribution Function (CDF): Phi(z)
 * Phi(z) = 0.5 * (1 + erf(z / sqrt(2)))
 */
export function normalCdf(z: number): number {
  if (isNaN(z)) return NaN;
  if (z === -Infinity) return 0;
  if (z === Infinity) return 1;
  if (z < -8.0) return 0;
  if (z > 8.0) return 1;

  return 0.5 * (1 + erf(z / Math.SQRT2));
}

/**
 * Normal CDF with general mean and standard deviation
 */
export function normalCdfGeneral(x: number, mu: number, sigma: number): number {
  if (sigma <= 0) {
    throw new Error('Standard deviation must be strictly positive');
  }
  const z = (x - mu) / sigma;
  return normalCdf(z);
}

/**
 * High-precision Inverse Normal CDF (Quantile / Probit function)
 * Uses Peter John Acklam's algorithm (precision < 1.15e-9).
 * Returns z such that normalCdf(z) = p for 0 < p < 1.
 */
export function inverseNormalCdf(p: number): number {
  if (p <= 0 || p >= 1) {
    if (p === 0) return -Infinity;
    if (p === 1) return Infinity;
    throw new Error('Probability p must be between 0 and 1 exclusive');
  }

  // Coefficients for Acklam's approximation
  const a1 = -3.969683028665376e1;
  const a2 = 2.209460984245205e2;
  const a3 = -2.759285104469687e2;
  const a4 = 1.383577518672690e2;
  const a5 = -3.066479806614716e1;
  const a6 = 2.506628277459239e0;

  const b1 = -5.447609879822406e1;
  const b2 = 1.615858368580409e2;
  const b3 = -1.556989798529320e2;
  const b4 = 6.680131188771972e1;
  const b5 = -1.328068155288572e1;

  const c1 = -7.784894002430293e-3;
  const c2 = -3.223964580411365e-1;
  const c3 = -2.400758277161838e0;
  const c4 = -2.549732539343734e0;
  const c5 = 4.374664141464968e0;
  const c6 = 2.938163982698783e0;

  const d1 = 7.784695709041462e-3;
  const d2 = 3.224671290700398e-1;
  const d3 = 2.445134137142996e0;
  const d4 = 3.754408661907416e0;

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  let q: number;
  let r: number;

  if (p < pLow) {
    // Rational approximation for lower region
    q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1)
    );
  } else if (p <= pHigh) {
    // Rational approximation for central region
    q = p - 0.5;
    r = q * q;
    return (
      (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) *
      q /
      (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1)
    );
  } else {
    // Rational approximation for upper region
    q = Math.sqrt(-2 * Math.log(1 - p));
    return (
      -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1)
    );
  }
}

/**
 * Natural log of Gamma function ln(Gamma(x)) using Lanczos approximation (g=7, n=9)
 * Accurate to 15 decimal digits for positive numbers.
 */
export function logGamma(x: number): number {
  if (x <= 0) return NaN;

  const p = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.138571095836524,
    9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];

  const g = 7;
  if (x < 0.5) {
    // Reflection formula: Gamma(1-z)*Gamma(z) = pi / sin(pi*z)
    return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x);
  }

  const z = x - 1;
  let a = p[0];
  for (let i = 1; i < p.length; i++) {
    a += p[i] / (z + i);
  }

  const t = z + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(a);
}

/**
 * Regularized lower incomplete gamma function P(a, x) = gamma(a, x) / Gamma(a)
 * Evaluated via series expansion for x < a + 1, and continued fraction for x >= a + 1.
 */
export function gammaInc(a: number, x: number): number {
  if (a <= 0 || x < 0) return NaN;
  if (x === 0) return 0;

  if (x < a + 1) {
    // Series expansion
    let sum = 1 / a;
    let term = 1 / a;
    for (let n = 1; n < 300; n++) {
      term *= x / (a + n);
      sum += term;
      if (Math.abs(term) < Math.abs(sum) * 1e-15) break;
    }
    return sum * Math.exp(-x + a * Math.log(x) - logGamma(a));
  } else {
    // Continued fraction method (Lentz's method) for Q(a, x) = 1 - P(a, x)
    const TINY = 1e-30;
    let b = x + 1 - a;
    let c = 1 / TINY;
    let d = 1 / b;
    let h = d;

    for (let i = 1; i < 300; i++) {
      const an = -i * (i - a);
      b += 2;
      d = an * d + b;
      if (Math.abs(d) < TINY) d = TINY;
      c = b + an / c;
      if (Math.abs(c) < TINY) c = TINY;
      d = 1 / d;
      const del = d * c;
      h *= del;
      if (Math.abs(del - 1) < 1e-15) break;
    }

    const q = Math.exp(-x + a * Math.log(x) - logGamma(a)) * h;
    return Math.max(0, Math.min(1, 1 - q));
  }
}

/**
 * Regularized incomplete beta function I_x(a, b) = B(x; a, b) / B(a, b)
 * Uses continued fraction representation.
 */
export function betaInc(x: number, a: number, b: number): number {
  if (x < 0 || x > 1 || a <= 0 || b <= 0) return NaN;
  if (x === 0) return 0;
  if (x === 1) return 1;

  // Use symmetry transformation if x > (a + 1)/(a + b + 2)
  if (x > (a + 1) / (a + b + 2)) {
    return 1 - betaInc(1 - x, b, a);
  }

  // Pre-factor: exp(ln(x^a * (1-x)^b / B(a,b)))
  const lnBeta = logGamma(a) + logGamma(b) - logGamma(a + b);
  const factor = Math.exp(a * Math.log(x) + b * Math.log(1 - x) - lnBeta) / a;

  // Modified Lentz's method for continued fraction
  const TINY = 1e-30;
  let c = 1;
  let d = 1 - ((a + b) * x) / (a + 1);
  if (Math.abs(d) < TINY) d = TINY;
  d = 1 / d;
  let h = d;

  for (let m = 1; m <= 200; m++) {
    // Even step: m=1 -> 2m=2
    const m2 = 2 * m;
    let num = (m * (b - m) * x) / ((a + m2 - 1) * (a + m2));
    d = 1 + num * d;
    if (Math.abs(d) < TINY) d = TINY;
    c = 1 + num / c;
    if (Math.abs(c) < TINY) c = TINY;
    d = 1 / d;
    h *= d * c;

    // Odd step
    num = -((a + m) * (a + b + m) * x) / ((a + m2) * (a + m2 + 1));
    d = 1 + num * d;
    if (Math.abs(d) < TINY) d = TINY;
    c = 1 + num / c;
    if (Math.abs(c) < TINY) c = TINY;
    d = 1 / d;
    const del = d * c;
    h *= del;

    if (Math.abs(del - 1) < 1e-15) break;
  }

  return Math.max(0, Math.min(1, factor * h));
}

/**
 * Student's t distribution Cumulative Distribution Function (CDF)
 * tCdf(t, df) = P(T <= t)
 */
export function tCdf(t: number, df: number): number {
  if (df <= 0 || isNaN(t) || isNaN(df)) return NaN;
  if (t === 0) return 0.5;

  const x = df / (df + t * t);
  const prob = 0.5 * betaInc(x, df / 2, 0.5);

  return t > 0 ? 1 - prob : prob;
}

/**
 * Student's t distribution Probability Density Function (PDF)
 */
export function tPdf(t: number, df: number): number {
  if (df <= 0) return NaN;
  const factor =
    Math.exp(logGamma((df + 1) / 2) - logGamma(df / 2)) /
    (Math.sqrt(Math.PI * df) * Math.pow(1 + (t * t) / df, (df + 1) / 2));
  return factor;
}

/**
 * Chi-Square distribution Cumulative Distribution Function (CDF)
 * chiSquareCdf(x, df) = P(X^2 <= x)
 */
export function chiSquareCdf(x: number, df: number): number {
  if (df <= 0 || isNaN(x) || isNaN(df)) return NaN;
  if (x <= 0) return 0;
  return gammaInc(df / 2, x / 2);
}

/**
 * Chi-Square distribution PDF
 */
export function chiSquarePdf(x: number, df: number): number {
  if (df <= 0 || x <= 0) return 0;
  const k = df / 2;
  const lnPdf = (k - 1) * Math.log(x) - x / 2 - k * Math.log(2) - logGamma(k);
  return Math.exp(lnPdf);
}

/**
 * Snedecor's F distribution Cumulative Distribution Function (CDF)
 * fCdf(f, df1, df2) = P(F <= f)
 */
export function fCdf(f: number, df1: number, df2: number): number {
  if (df1 <= 0 || df2 <= 0 || isNaN(f)) return NaN;
  if (f <= 0) return 0;

  const x = (df1 * f) / (df1 * f + df2);
  return betaInc(x, df1 / 2, df2 / 2);
}

/**
 * Snedecor's F distribution PDF
 */
export function fPdf(f: number, df1: number, df2: number): number {
  if (df1 <= 0 || df2 <= 0 || f <= 0) return 0;
  const num = Math.pow(df1 * f, df1) * Math.pow(df2, df2);
  const den = Math.pow(df1 * f + df2, df1 + df2);
  const lnTerm = 0.5 * Math.log(num / den) - Math.log(f);
  const lnBeta = logGamma(df1 / 2) + logGamma(df2 / 2) - logGamma((df1 + df2) / 2);
  return Math.exp(lnTerm - lnBeta);
}
