/**
 * Educational Grade & Final Exam Calculator Engine
 * Solves "What grade do I need on my final exam?"
 * Calculates weighted course grades across assignments, midterms, and projects.
 */

export interface FinalExamInput {
  currentGrade: number; // percentage (e.g. 78%)
  targetGrade: number; // desired final percentage (e.g. 85%)
  examWeight: number; // final exam weight percentage (e.g. 35%)
}

export interface FinalExamResult {
  requiredScore: number;
  requiredScorePercent: string;
  status: 'achieved' | 'easy' | 'moderate' | 'challenging' | 'near_impossible' | 'impossible';
  statusMessage: string;
  formula: string;
  steps: { title: string; content: string }[];
  advice: string;
}

export function calculateFinalExamNeeded(input: FinalExamInput): FinalExamResult {
  const { currentGrade, targetGrade, examWeight } = input;

  if (examWeight <= 0 || examWeight > 100) {
    throw new Error('Final exam weight must be between 1% and 100%.');
  }

  const w = examWeight / 100;
  const currentWeight = 1 - w;

  // Formula: Target = (Current * (1 - w)) + (Required * w)
  // Required = (Target - Current * (1 - w)) / w
  const currentContribution = currentGrade * currentWeight;
  const neededFromFinal = targetGrade - currentContribution;
  const requiredScore = neededFromFinal / w;

  const steps = [
    {
      title: 'Determine Current Points Contributed',
      content: `Your current grade (${currentGrade}%) carries ${(currentWeight * 100).toFixed(0)}% of the total course: ${currentGrade} × ${currentWeight.toFixed(2)} = ${currentContribution.toFixed(2)}% toward your final grade.`,
    },
    {
      title: 'Determine Points Needed from Final Exam',
      content: `To reach your target of ${targetGrade}%, you need ${targetGrade}% - ${currentContribution.toFixed(2)}% = ${neededFromFinal.toFixed(2)}% total points.`,
    },
    {
      title: 'Scale by Final Exam Weight',
      content: `Since the final is worth ${examWeight}% (w = ${w.toFixed(2)}): Required Score = ${neededFromFinal.toFixed(2)} / ${w.toFixed(2)} = ${requiredScore.toFixed(2)}%.`,
    },
  ];

  let status: FinalExamResult['status'] = 'moderate';
  let statusMessage = '';
  let advice = '';

  if (requiredScore <= 0) {
    status = 'achieved';
    statusMessage = 'Target Already Guaranteed!';
    advice = `Even if you score 0% on the final exam, your current grade already guarantees at least ${currentContribution.toFixed(1)}%, which exceeds your target of ${targetGrade}%.`;
  } else if (requiredScore <= 60) {
    status = 'easy';
    statusMessage = 'Comfortably Achievable';
    advice = `You only need a passing score of ${requiredScore.toFixed(1)}% on the final to maintain your desired grade.`;
  } else if (requiredScore <= 80) {
    status = 'moderate';
    statusMessage = 'Realistic with Standard Study';
    advice = `A solid preparation plan targeting ${requiredScore.toFixed(1)}% will secure your desired grade.`;
  } else if (requiredScore <= 100) {
    status = 'challenging';
    statusMessage = 'High Performance Needed';
    advice = `You need a score of ${requiredScore.toFixed(1)}% on the final. Review high-yield syllabus areas and practice past exams thoroughly.`;
  } else if (requiredScore <= 110) {
    status = 'near_impossible';
    statusMessage = 'Extra Credit or Curve Required';
    advice = `You need ${requiredScore.toFixed(1)}%, which exceeds 100%. Check with your instructor if extra credit, a class curve, or an exam drop policy is available.`;
  } else {
    status = 'impossible';
    statusMessage = 'Mathematically Not Feasible';
    advice = `Even a 100% on the final would yield only ${(currentContribution + 100 * w).toFixed(1)}%. Consider adjusting your target grade to ${(currentContribution + 100 * w).toFixed(1)}% or discussing options with your academic advisor.`;
  }

  return {
    requiredScore,
    requiredScorePercent: `${requiredScore.toFixed(1)}%`,
    status,
    statusMessage,
    formula: '\\text{Score Required} = \\frac{\\text{Target} - (\\text{Current} \\times (1 - w))}{w}',
    steps,
    advice,
  };
}

export interface GradeCategory {
  id: string;
  name: string;
  weight: number; // percentage (e.g. 20%)
  score: number; // percentage (e.g. 85%)
}

export interface WeightedGradeResult {
  finalGrade: number;
  totalWeight: number;
  breakdown: {
    name: string;
    weight: number;
    score: number;
    pointsEarned: number;
  }[];
  letterGrade: string;
}

export function calculateWeightedGrade(categories: GradeCategory[]): WeightedGradeResult {
  let totalWeight = 0;
  let totalPoints = 0;

  const breakdown = categories.map((cat) => {
    const points = (cat.score * cat.weight) / 100;
    totalWeight += cat.weight;
    totalPoints += points;
    return {
      name: cat.name,
      weight: cat.weight,
      score: cat.score,
      pointsEarned: points,
    };
  });

  const finalGrade = totalWeight > 0 ? (totalPoints / totalWeight) * 100 : 0;

  let letterGrade = 'F';
  if (finalGrade >= 93) letterGrade = 'A';
  else if (finalGrade >= 90) letterGrade = 'A-';
  else if (finalGrade >= 87) letterGrade = 'B+';
  else if (finalGrade >= 83) letterGrade = 'B';
  else if (finalGrade >= 80) letterGrade = 'B-';
  else if (finalGrade >= 77) letterGrade = 'C+';
  else if (finalGrade >= 73) letterGrade = 'C';
  else if (finalGrade >= 70) letterGrade = 'C-';
  else if (finalGrade >= 60) letterGrade = 'D';

  return {
    finalGrade,
    totalWeight,
    breakdown,
    letterGrade,
  };
}
