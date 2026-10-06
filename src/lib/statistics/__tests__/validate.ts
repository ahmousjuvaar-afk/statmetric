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
import { MathExpressionEvaluator } from '../../math/calculatorEngine';
import { calculateFractions } from '../../math/fractions';
import { calculatePercentage } from '../../math/percentages';
import { simplifyRatio, solveProportion } from '../../math/ratios';
import { convertUnits } from '../../converters/units';
import { calculateAge, calculateDateDifference, calculateTimeDuration } from '../../datetime/dateEngine';
import { calculateBinomial, calculatePoisson, calculateBayes } from '../binomial';
import { calculateCorrelationRegression } from '../correlation';
import { calculateOneWayAnova } from '../anova';
import { calculateChiSquareIndependence } from '../chisquare';
import { calculateSampleSizeTwoMeans, calculateSurveySampleSize } from '../samplesize';
import { TOOL_ICON_MAP } from '../../../components/ToolIcon';

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

  // --- 15. Mathematics: Safe Expression Evaluator ---
  const evaluator = new MathExpressionEvaluator('rad');
  assertClose('Math Evaluator: 25 * 4 + sqrt(81) -> 109', evaluator.evaluate('25 * 4 + sqrt(81)').value, 109, 1e-6);
  assertClose('Math Evaluator: (12 + 8) / 5 -> 4', evaluator.evaluate('(12 + 8) / 5').value, 4, 1e-6);
  assertClose('Math Evaluator: 2^5 + 3^2 -> 41', evaluator.evaluate('2^5 + 3^2').value, 41, 1e-6);
  assertClose('Math Evaluator: sin(pi / 2) -> 1', evaluator.evaluate('sin(pi / 2)').value, 1, 1e-6);
  assertClose('Math Evaluator: Factorial 5! -> 120', evaluator.evaluate('5!').value, 120, 1e-6);
  assertClose('Math Evaluator: log10(1000) -> 3', evaluator.evaluate('log10(1000)').value, 3, 1e-6);

  // Degree mode
  const degEval = new MathExpressionEvaluator('deg');
  assertClose('Math Evaluator Deg: sin(30) -> 0.5', degEval.evaluate('sin(30)').value, 0.5, 1e-6);

  // --- 16. Mathematics: Fraction Calculator ---
  const fAdd = calculateFractions({ numerator: 1, denominator: 3 }, { numerator: 1, denominator: 6 }, 'add');
  assertEqual('Fractions: 1/3 + 1/6 -> 1/2', fAdd.simplifiedString, '1/2');
  assertClose('Fractions: Decimal -> 0.5', fAdd.decimal, 0.5, 1e-6);

  const fDiv = calculateFractions({ numerator: 3, denominator: 4 }, { numerator: 2, denominator: 5 }, 'divide');
  assertEqual('Fractions: 3/4 ÷ 2/5 -> 15/8', fDiv.simplifiedString, '15/8');
  assertEqual('Fractions: Mixed -> 1 7/8', fDiv.mixedString, '1 7/8');

  // --- 17. Mathematics: Percentage Calculator ---
  const pOf = calculatePercentage('percent_of', 25, 200);
  assertClose('Percentage: 25% of 200 -> 50', pOf.primaryResult, 50, 1e-6);

  const pIs = calculatePercentage('is_what_percent', 35, 140);
  assertClose('Percentage: 35 is what % of 140 -> 25%', pIs.primaryResult, 25, 1e-6);

  const pChg = calculatePercentage('percent_change', 50, 75);
  assertClose('Percentage: 50 to 75 -> +50%', pChg.primaryResult, 50, 1e-6);

  const pRev = calculatePercentage('reverse_percent', 120, 20, 'increase');
  assertClose('Percentage Reverse: 120 after +20% -> 100', pRev.primaryResult, 100, 1e-6);

  // --- 18. Mathematics: Ratio & Proportion ---
  const rSimp = simplifyRatio(12, 18);
  assertEqual('Ratio: 12:18 simplified -> 2 : 3', rSimp.ratioString, '2 : 3');

  const propSolve = solveProportion(3, 4, 15, null);
  assertClose('Proportion: 3/4 = 15/x -> x=20', propSolve.solvedValue, 20, 1e-6);

  // --- 19. Converters Engine ---
  const lenConv = convertUnits('length', 'm', 'ft', 10);
  assertClose('Converter: 10 meters -> 32.8084 feet', lenConv.result, 32.80839895, 1e-4);

  const tempConv = convertUnits('temperature', 'c', 'f', 100);
  assertClose('Converter: 100 C -> 212 F', tempConv.result, 212, 1e-4);

  const dataConv = convertUnits('data', 'mb', 'kb', 2);
  assertClose('Converter: 2 MB -> 2048 KB', dataConv.result, 2048, 1e-4);

  // --- 20. Date & Time Engine ---
  const age = calculateAge('2000-01-01', '2025-01-01');
  assertEqual('Age: 2000-01-01 to 2025-01-01 -> 25 years', age.years, 25);
  assertEqual('Age: months -> 0', age.months, 0);

  const dateDiff = calculateDateDifference('2024-01-01', '2024-01-08');
  assertEqual('Date Difference: Total days -> 7', dateDiff.totalDays, 7);
  assertEqual('Date Difference: Business days -> 5', dateDiff.businessDays, 5);

  const duration = calculateTimeDuration('22:30', '02:00');
  assertEqual('Time Duration: 22:30 to 02:00 -> 3 hours', duration.hours, 3);
  assertEqual('Time Duration: minutes -> 30', duration.minutes, 30);
  assertEqual('Time Duration: crossed midnight', duration.crossedMidnight, true);

  // --- 21. Probability: Binomial, Poisson, Bayes ---
  const binom = calculateBinomial(10, 0.5, 5);
  assertClose('Binomial: n=10, p=0.5, k=5 -> 0.24609', binom.exactProbability, 0.24609375, 1e-4);
  assertClose('Binomial: Mean -> 5', binom.mean, 5, 1e-6);
  assertClose('Binomial: Variance -> 2.5', binom.variance, 2.5, 1e-6);

  const pois = calculatePoisson(4, 4);
  assertClose('Poisson: lambda=4, k=4 -> 0.19536', pois.exactProbability, 0.1953668, 1e-4);

  const bayes = calculateBayes(0.01, 0.95, 0.05);
  // P(D) = 0.01, P(+|D) = 0.95, P(+|~D) = 0.05 -> P(D|+) = 0.0095 / (0.0095 + 0.0495) = 0.1610
  assertClose('Bayes Theorem: Posterior P(Disease | +) -> ~0.1610', bayes.posteriorAGivenB, 0.1610169, 1e-3);

  // --- 22. Statistics & Research: Correlation & Regression ---
  const sampleCorrPoints = [
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    { x: 3, y: 5 },
    { x: 4, y: 4 },
    { x: 5, y: 6 },
  ];
  const corr = calculateCorrelationRegression(sampleCorrPoints);
  assertClose('Correlation r: -> 0.9', corr.r, 0.9, 1e-4);
  assertClose('Correlation R²: -> 0.81', corr.rSquared, 0.81, 1e-4);
  assertClose('Regression Slope: -> 0.9', corr.slope, 0.9, 1e-4);
  assertClose('Regression Intercept: -> 1.3', corr.intercept, 1.3, 1e-4);

  // --- 23. Statistics & Research: One-Way ANOVA ---
  const anovaGroups = [
    { name: 'Group A', values: [2, 3, 7, 2, 6] },
    { name: 'Group B', values: [10, 8, 7, 5, 10] },
    { name: 'Group C', values: [10, 13, 14, 13, 15] },
  ];
  const anova = calculateOneWayAnova(anovaGroups);
  assertEqual('ANOVA: k -> 3', anova.k, 3);
  assertEqual('ANOVA: dfBetween -> 2', anova.dfBetween, 2);
  assertEqual('ANOVA: dfWithin -> 12', anova.dfWithin, 12);
  assertClose('ANOVA: F-statistic -> 22.59', anova.fStatistic, 22.59259, 1e-2);
  assertEqual('ANOVA: isSignificant at 0.05 -> true', anova.isSignificant, true);

  // --- 24. Statistics & Research: Chi-Square Test of Independence ---
  const contingencyTable = [
    [20, 30],
    [30, 15],
  ];
  const chiRes = calculateChiSquareIndependence(contingencyTable);
  assertEqual('Chi-Square: df -> 1', chiRes.df, 1);
  assertEqual('Chi-Square: totalN -> 95', chiRes.totalN, 95);
  assertClose('Chi-Square: statistic -> 6.756', chiRes.chiSquare, 6.75556, 1e-2);
  assertClose('Chi-Square: Cramérs V -> 0.267', chiRes.cramersV, 0.26667, 1e-2);

  // --- 25. Research: Sample Size & Power ---
  const sampleMeans = calculateSampleSizeTwoMeans(0.5, 0.05, 0.80);
  assertEqual('Sample Size Means: Cohen d=0.5, power=0.8 -> 63 per group', sampleMeans.nPerGroup, 63);
  assertEqual('Sample Size Means: Total N -> 126', sampleMeans.totalN, 126);

  const surveySample = calculateSurveySampleSize(0.95, 0.05, 0.50);
  assertEqual('Survey Sample Size: 95% CI, 5% margin -> 385', surveySample.requiredSample, 385);

  // --- 26. Icon Registry Integrity Audit ---
  const allToolIds = [
    'p-value', 't-test', 'confidence-interval', 'sample-size', 'anova', 'chi-square', 'test-selector',
    'normal-distribution', 'binomial-distribution',
    'standard-deviation', 'z-score', 'descriptive-statistics', 'correlation-regression',
    'scientific-calculator', 'standard-calculator', 'fraction-calculator', 'percentage-calculator',
    'ratio-calculator', 'graphing-calculator',
    'unit-converter', 'date-calculator',
    'gpa', 'grade-calculator'
  ];
  for (const tid of allToolIds) {
    const iconDef = TOOL_ICON_MAP[tid];
    assertEqual(`Icon Registry: '${tid}' exists and has icon`, Boolean(iconDef && iconDef.icon), true);
  }

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
