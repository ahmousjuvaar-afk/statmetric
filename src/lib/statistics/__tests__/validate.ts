/**
 * Automated Statistical & Educational Validation Test Suite.
 * Validates distribution algorithms, hypothesis tests, descriptive metrics, and educational engines.
 */

import {
  normalCdf,
  inverseNormalCdf,
  tCdf,
  chiSquareCdf,
  fCdf,
} from '../distributions';
import { calculatePValue } from '../pvalue';
import { calculateNormalDist } from '../normalDist';
import { calculateStandardDeviation, parseDatasetInput } from '../standardDev';
import { calculateSemesterGpa } from '../../education/gpa';
import { calculateFinalExamNeeded } from '../../education/gradeCalculator';
import { calculateTTest } from '../ttest';
import { calculateConfidenceInterval } from '../confidenceInterval';
import { calculateZScore } from '../zscore';
import { calculateDescriptiveStats } from '../descriptive';

interface TestResult {
  name: string;
  expected: string | number;
  actual: string | number;
  passed: boolean;
  delta?: number;
}

export function runStatisticalTests(): { total: number; passed: number; results: TestResult[] } {
  const results: TestResult[] = [];

  function assertClose(name: string, actual: number, expected: number, tolerance = 1e-3) {
    const delta = Math.abs(actual - expected);
    const passed = delta <= tolerance;
    results.push({
      name,
      expected,
      actual: Number(actual.toFixed(6)),
      passed,
      delta,
    });
  }

  function assertEqual(name: string, actual: string | number | boolean, expected: string | number | boolean) {
    results.push({
      name,
      expected: String(expected),
      actual: String(actual),
      passed: actual === expected,
    });
  }

  // --- 1. Standard Normal CDF ---
  assertClose('Normal CDF: z = 0 -> 0.5000', normalCdf(0), 0.5, 1e-4);
  assertClose('Normal CDF: z = 1.96 -> 0.9750', normalCdf(1.95996), 0.975, 1e-4);
  assertClose('Normal CDF: z = -1.96 -> 0.0250', normalCdf(-1.95996), 0.025, 1e-4);
  assertClose('Normal CDF: z = 2.576 -> 0.9950', normalCdf(2.5758), 0.995, 1e-4);
  assertClose('Normal CDF: z = -2.576 -> 0.0050', normalCdf(-2.5758), 0.005, 1e-4);
  assertClose('Normal CDF: extreme right z = 6 -> ~1.0', normalCdf(6), 1.0, 1e-4);

  // --- 2. Inverse Normal CDF (Acklam Algorithm) ---
  assertClose('Inverse Normal: p = 0.5 -> z = 0', inverseNormalCdf(0.5), 0, 1e-5);
  assertClose('Inverse Normal: p = 0.975 -> z = 1.95996', inverseNormalCdf(0.975), 1.95996, 1e-4);
  assertClose('Inverse Normal: p = 0.025 -> z = -1.95996', inverseNormalCdf(0.025), -1.95996, 1e-4);
  assertClose('Inverse Normal: p = 0.995 -> z = 2.5758', inverseNormalCdf(0.995), 2.5758, 1e-3);
  assertClose('Inverse Normal: p = 0.95 -> z = 1.64485', inverseNormalCdf(0.95), 1.64485, 1e-3);

  // --- 3. Student's t CDF ---
  assertClose('Student t CDF: t = 0, df = 10 -> 0.5', tCdf(0, 10), 0.5, 1e-4);
  assertClose('Student t CDF: t = 2.0639, df = 24 -> 0.975', tCdf(2.0639, 24), 0.975, 1e-3);
  assertClose('Student t CDF: t = 1.8125, df = 10 -> 0.95', tCdf(1.8125, 10), 0.95, 1e-3);

  // --- 4. Chi-Square CDF ---
  assertClose('Chi-Square CDF: x = 5.991, df = 2 -> 0.95', chiSquareCdf(5.991, 2), 0.95, 1e-3);
  assertClose('Chi-Square CDF: x = 3.841, df = 1 -> 0.95', chiSquareCdf(3.841, 1), 0.95, 1e-3);

  // --- 5. Snedecor's F CDF ---
  assertClose('F CDF: F = 3.340, df1 = 2, df2 = 28 -> 0.95', fCdf(3.340, 2, 28), 0.95, 2e-3);

  // --- 6. P-Value Calculations ---
  const zPVal = calculatePValue({
    distribution: 'z',
    statistic: 1.95996,
    tail: 'two_tailed',
    alpha: 0.05,
  });
  assertClose('P-Value: Z = 1.96 two-tailed -> 0.05', zPVal.pValue, 0.05, 1e-3);
  assertEqual('P-Value: Z = 1.96 significance at 0.05', zPVal.isSignificant, false);

  const zPValSig = calculatePValue({
    distribution: 'z',
    statistic: 2.15,
    tail: 'two_tailed',
    alpha: 0.05,
  });
  assertClose('P-Value: Z = 2.15 two-tailed -> 0.0315', zPValSig.pValue, 0.03155, 1e-3);
  assertEqual('P-Value: Z = 2.15 is significant at alpha 0.05', zPValSig.isSignificant, true);

  const tPValLeft = calculatePValue({
    distribution: 't',
    statistic: -2.064,
    df: 24,
    tail: 'left_tailed',
    alpha: 0.05,
  });
  assertClose('P-Value: t = -2.064 (df=24) left-tailed -> 0.025', tPValLeft.pValue, 0.025, 1e-3);
  assertEqual('P-Value: t = -2.064 is significant', tPValLeft.isSignificant, true);

  const chiPVal = calculatePValue({
    distribution: 'chisquare',
    statistic: 5.991,
    df: 2,
    tail: 'right_tailed',
    alpha: 0.05,
  });
  assertClose('P-Value: Chi2 = 5.991 (df=2) right-tailed -> 0.05', chiPVal.pValue, 0.05, 1e-3);

  // --- 7. Normal Distribution Calculator Module ---
  const normLess = calculateNormalDist({
    mode: 'less_than',
    mean: 100,
    sd: 15,
    x: 115,
  });
  assertClose('Normal Dist: P(X <= 115) with mu=100, sd=15 -> 0.8413', normLess.probability, 0.84134, 1e-3);
  assertClose('Normal Dist: z-score calculation -> 1.0', normLess.zScore ?? 0, 1.0, 1e-4);

  const normBetween = calculateNormalDist({
    mode: 'between',
    mean: 100,
    sd: 15,
    lowerBound: 85,
    upperBound: 115,
  });
  assertClose('Normal Dist: P(85 <= X <= 115) 1 SD range -> 0.6827', normBetween.probability, 0.68268, 1e-3);

  const normRev = calculateNormalDist({
    mode: 'inverse_percentile',
    mean: 100,
    sd: 15,
    percentile: 95,
  });
  assertClose('Normal Dist Reverse: 95th pct -> x = 124.673', normRev.xCalculated ?? 0, 124.6728, 1e-2);

  // --- 8. Standard Deviation Calculator Module ---
  const parsed1 = parseDatasetInput('10, 12, 15, 18, 21');
  assertEqual('Parser: parse comma-separated', parsed1.values.length, 5);

  const parsed2 = parseDatasetInput('10\n12\n 15   18, 21');
  assertEqual('Parser: mixed newlines/spaces/commas', parsed2.values.length, 5);

  const sdSample = calculateStandardDeviation(parsed1.values, 'sample');
  assertClose('Standard Deviation: sample mean -> 15.2', sdSample.mean, 15.2, 1e-4);
  assertClose('Standard Deviation: sample variance -> 19.7', sdSample.variance, 19.7, 1e-4);
  assertClose('Standard Deviation: sample SD -> 4.43847', sdSample.standardDeviation, 4.438468, 1e-4);

  const sdPop = calculateStandardDeviation(parsed1.values, 'population');
  assertClose('Standard Deviation: pop variance -> 15.76', sdPop.variance, 15.76, 1e-4);
  assertClose('Standard Deviation: pop SD -> 3.96989', sdPop.standardDeviation, 3.969887, 1e-4);

  const textbookData = [2, 4, 4, 4, 5, 5, 7, 9];
  const sdTextPop = calculateStandardDeviation(textbookData, 'population');
  assertClose('Textbook pop SD: [2,4,4,4,5,5,7,9] -> 2.0', sdTextPop.standardDeviation, 2.0, 1e-4);
  assertClose('Textbook pop variance: -> 4.0', sdTextPop.variance, 4.0, 1e-4);

  const sdTextSample = calculateStandardDeviation(textbookData, 'sample');
  assertClose('Textbook sample SD: -> 2.13809', sdTextSample.standardDeviation, 2.13809, 1e-4);
  assertClose('Textbook median: -> 4.5', sdTextSample.median, 4.5, 1e-4);
  assertClose('Textbook IQR: Q3(5.5)-Q1(4) -> 1.5', sdTextSample.iqr, 1.5, 1e-4);

  // --- 9. NEW: GPA & CGPA Calculator Engine ---
  const sampleCourses = [
    { id: '1', name: 'Math', credits: 3, grade: 'A' }, // 3 * 4.0 = 12
    { id: '2', name: 'Stats', credits: 3, grade: 'B+' }, // 3 * 3.3 = 9.9
    { id: '3', name: 'Bio', credits: 4, grade: 'A-' }, // 4 * 3.7 = 14.8
  ];
  const gpaResult = calculateSemesterGpa(sampleCourses, '4.0', 3.5, 30);
  assertClose('GPA Engine: Semester GPA -> 3.67', gpaResult.gpa, 3.67, 1e-2);
  assertEqual('GPA Engine: Total Credits -> 10', gpaResult.totalCredits, 10);
  assertClose('GPA Engine: Total Points -> 36.7', gpaResult.totalGradePoints, 36.7, 1e-2);
  // Cumulative CGPA: (30 * 3.5 + 36.7) / 40 = (105 + 36.7) / 40 = 141.7 / 40 = 3.5425
  assertClose('GPA Engine: Cumulative CGPA -> 3.5425', gpaResult.cumulativeCgpa ?? 0, 3.5425, 1e-3);
  assertEqual('GPA Engine: Academic Standing -> Honors', gpaResult.academicStanding.includes('Honors'), true);

  // --- 10. NEW: Grade & Final Exam Needed Calculator Engine ---
  const finalNeeded = calculateFinalExamNeeded({
    currentGrade: 78,
    targetGrade: 85,
    examWeight: 35,
  });
  // Needed = (85 - 78 * 0.65) / 0.35 = (85 - 50.7) / 0.35 = 34.3 / 0.35 = 98.0%
  assertClose('Final Grade Engine: Required score -> 98.0%', finalNeeded.requiredScore, 98.0, 1e-2);
  assertEqual('Final Grade Engine: Status -> challenging', finalNeeded.status, 'challenging');

  const finalGuaranteed = calculateFinalExamNeeded({
    currentGrade: 95,
    targetGrade: 80,
    examWeight: 10,
  });
  assertEqual('Final Grade Engine: Guaranteed status', finalGuaranteed.status, 'achieved');

  // --- 11. NEW: Two-Sample Student's T-Test Engine ---
  const tTestEqual = calculateTTest({
    type: 'independent_equal',
    tail: 'two_tailed',
    alpha: 0.05,
    m1: 10,
    sd1: 2,
    n1: 15,
    m2: 8,
    sd2: 2,
    n2: 15,
  });
  assertClose('Two-Sample t-Test: t-statistic -> 2.7386', tTestEqual.tStatistic, 2.7386, 1e-3);
  assertEqual('Two-Sample t-Test: df = 28', tTestEqual.df, 28);
  assertClose('Two-Sample t-Test: Cohen d -> 1.0', tTestEqual.cohensD, 1.0, 1e-3);
  assertEqual('Two-Sample t-Test: is significant at 0.05', tTestEqual.isSignificant, true);

  // --- 12. NEW: Confidence Interval Calculator Engine ---
  const ciMean = calculateConfidenceInterval({
    type: 'mean_z',
    confidenceLevel: 0.95,
    mean: 50,
    sd: 10,
    n: 36,
  });
  // SE = 10 / 6 = 1.6667. ME = 1.95996 * 1.6667 = 3.2666
  assertClose('Confidence Interval: Margin of Error -> 3.2666', ciMean.marginOfError, 3.2666, 1e-3);
  assertClose('Confidence Interval: Lower Bound -> 46.7334', ciMean.lowerBound, 46.7334, 1e-3);
  assertClose('Confidence Interval: Upper Bound -> 53.2666', ciMean.upperBound, 53.2666, 1e-3);

  // --- 13. NEW: Z-Score Calculator Engine ---
  const zScoreFwd = calculateZScore({
    mode: 'forward',
    x: 115,
    mean: 100,
    sd: 15,
  });
  assertClose('Z-Score Engine: Forward z -> 1.0', zScoreFwd.z, 1.0, 1e-4);
  assertClose('Z-Score Engine: Percentile -> 84.13%', zScoreFwd.percentile, 84.134, 1e-2);

  const zScoreRev = calculateZScore({
    mode: 'reverse',
    z: 2.0,
    mean: 100,
    sd: 15,
  });
  assertClose('Z-Score Engine: Reverse x -> 130', zScoreRev.x, 130.0, 1e-4);

  // --- 14. NEW: Descriptive Statistics Suite ---
  const descData = [10, 12, 15, 18, 21, 21, 25];
  const descStats = calculateDescriptiveStats(descData);
  assertClose('Descriptive Stats: Mean -> 17.4286', descStats.mean, 17.42857, 1e-3);
  assertEqual('Descriptive Stats: Median -> 18', descStats.median, 18);
  assertEqual('Descriptive Stats: Mode -> 21', descStats.mode[0], 21);
  assertEqual('Descriptive Stats: Mode Type -> unimodal', descStats.modeType, 'unimodal');
  assertEqual('Descriptive Stats: Min -> 10', descStats.min, 10);
  assertEqual('Descriptive Stats: Max -> 25', descStats.max, 25);
  assertEqual('Descriptive Stats: Range -> 15', descStats.range, 15);

  const total = results.length;
  const passed = results.filter((r) => r.passed).length;

  return { total, passed, results };
}

// Standalone execution runner if invoked via tsx
const suite = runStatisticalTests();
console.log(`\n=== STATMETRIC V2 BENCHMARK & ALGORITHM SUITE ===`);
console.log(`Passed: ${suite.passed} / ${suite.total} test cases (${((suite.passed / suite.total) * 100).toFixed(1)}%)\n`);

const failures = suite.results.filter((r) => !r.passed);
if (failures.length > 0) {
  console.error('Failed benchmarks:');
  failures.forEach((f) => {
    console.error(`- ${f.name}: Expected ${f.expected}, got ${f.actual} (delta: ${f.delta})`);
  });
  process.exit(1);
} else {
  console.log('All statistical, educational, and research benchmarks passed with 100% precision!');
}
