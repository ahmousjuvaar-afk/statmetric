/**
 * Chi-Square test of independence (contingency table) & goodness-of-fit engine.
 */

import { chiSquareCdf } from './distributions';

export interface ChiSquareResult {
  chiSquare: number;
  df: number;
  pValue: number;
  cramersV: number;
  isSignificant: boolean;
  totalN: number;
  rows: number;
  cols: number;
  expectedMatrix: number[][];
  observedMatrix: number[][];
  contributions: number[][];
  apaReport: string;
}

export function calculateChiSquareIndependence(
  observed: number[][],
  alpha = 0.05
): ChiSquareResult {
  const rows = observed.length;
  if (rows < 2) throw new Error('Contingency table must have at least 2 rows.');
  const cols = observed[0].length;
  if (cols < 2) throw new Error('Contingency table must have at least 2 columns.');

  // Verify non-negative and row lengths
  for (let r = 0; r < rows; r++) {
    if (observed[r].length !== cols) {
      throw new Error('All rows in contingency table must have the same number of columns.');
    }
    for (let c = 0; c < cols; c++) {
      if (isNaN(observed[r][c]) || observed[r][c] < 0) {
        throw new Error('Cell counts must be non-negative numbers.');
      }
    }
  }

  // Row and column sums
  const rowTotals = new Array(rows).fill(0);
  const colTotals = new Array(cols).fill(0);
  let totalN = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rowTotals[r] += observed[r][c];
      colTotals[c] += observed[r][c];
      totalN += observed[r][c];
    }
  }

  if (totalN <= 0) {
    throw new Error('Total observations in contingency table must be greater than zero.');
  }

  // Expected matrix & Chi-Square sum
  const expectedMatrix: number[][] = [];
  const contributions: number[][] = [];
  let chiSquare = 0;

  for (let r = 0; r < rows; r++) {
    expectedMatrix[r] = [];
    contributions[r] = [];
    for (let c = 0; c < cols; c++) {
      const exp = (rowTotals[r] * colTotals[c]) / totalN;
      expectedMatrix[r][c] = exp;
      if (exp > 0) {
        const diff = observed[r][c] - exp;
        const contrib = (diff * diff) / exp;
        contributions[r][c] = contrib;
        chiSquare += contrib;
      } else {
        contributions[r][c] = 0;
      }
    }
  }

  const df = (rows - 1) * (cols - 1);
  const pValue = Math.max(0, 1 - chiSquareCdf(chiSquare, df));

  // Cramér's V = sqrt(chi^2 / (N * min(r-1, c-1)))
  const kMin = Math.min(rows - 1, cols - 1);
  const cramersV = kMin > 0 ? Math.sqrt(chiSquare / (totalN * kMin)) : 0;
  const isSignificant = pValue < alpha;

  const apaReport = `χ²(${df}, N = ${totalN}) = ${chiSquare.toFixed(2)}, p ${
    pValue < 0.001 ? '< .001' : `= ${pValue.toFixed(3)}`
  }, V = ${cramersV.toFixed(2)}`;

  return {
    chiSquare,
    df,
    pValue,
    cramersV,
    isSignificant,
    totalN,
    rows,
    cols,
    expectedMatrix,
    observedMatrix: observed,
    contributions,
    apaReport,
  };
}
