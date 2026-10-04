/**
 * Educational GPA & CGPA Calculation Engine
 * Supports global grading scales (US 4.0, 5.0 scale, Percentage scale, and Custom points)
 * Supports Semester GPA, Cumulative CGPA, and Academic Standing analysis.
 */

export type GpaScaleType = '4.0' | '5.0' | 'percentage' | 'custom';

export interface CourseEntry {
  id: string;
  name: string;
  credits: number;
  grade: string;
  customPoints?: number;
}

export interface GpaScaleDefinition {
  name: string;
  maxGpa: number;
  grades: { grade: string; points: number; percentMin?: number; percentMax?: number }[];
}

export const GPA_SCALES: Record<GpaScaleType, GpaScaleDefinition> = {
  '4.0': {
    name: 'Standard 4.0 Scale (US & International)',
    maxGpa: 4.0,
    grades: [
      { grade: 'A+', points: 4.0, percentMin: 97, percentMax: 100 },
      { grade: 'A', points: 4.0, percentMin: 93, percentMax: 96 },
      { grade: 'A-', points: 3.7, percentMin: 90, percentMax: 92 },
      { grade: 'B+', points: 3.3, percentMin: 87, percentMax: 89 },
      { grade: 'B', points: 3.0, percentMin: 83, percentMax: 86 },
      { grade: 'B-', points: 2.7, percentMin: 80, percentMax: 82 },
      { grade: 'C+', points: 2.3, percentMin: 77, percentMax: 79 },
      { grade: 'C', points: 2.0, percentMin: 73, percentMax: 76 },
      { grade: 'C-', points: 1.7, percentMin: 70, percentMax: 72 },
      { grade: 'D+', points: 1.3, percentMin: 67, percentMax: 69 },
      { grade: 'D', points: 1.0, percentMin: 60, percentMax: 66 },
      { grade: 'F', points: 0.0, percentMin: 0, percentMax: 59 },
    ],
  },
  '5.0': {
    name: '5.0 Scale (Weighted / Honors / International)',
    maxGpa: 5.0,
    grades: [
      { grade: 'A+', points: 5.0 },
      { grade: 'A', points: 5.0 },
      { grade: 'A-', points: 4.7 },
      { grade: 'B+', points: 4.3 },
      { grade: 'B', points: 4.0 },
      { grade: 'B-', points: 3.7 },
      { grade: 'C+', points: 3.3 },
      { grade: 'C', points: 3.0 },
      { grade: 'C-', points: 2.7 },
      { grade: 'D', points: 2.0 },
      { grade: 'F', points: 0.0 },
    ],
  },
  'percentage': {
    name: 'Percentage Scale (0 - 100%)',
    maxGpa: 100,
    grades: [
      { grade: 'Distinction (85-100%)', points: 90 },
      { grade: 'Merit (75-84%)', points: 80 },
      { grade: 'Credit (65-74%)', points: 70 },
      { grade: 'Pass (50-64%)', points: 55 },
      { grade: 'Fail (<50%)', points: 35 },
    ],
  },
  'custom': {
    name: 'Custom Institution Scale',
    maxGpa: 4.0,
    grades: [],
  },
};

export interface GpaCalculationResult {
  gpa: number;
  totalCredits: number;
  totalGradePoints: number;
  courseBreakdown: {
    name: string;
    credits: number;
    grade: string;
    gradePointsPerCredit: number;
    courseTotalPoints: number;
  }[];
  academicStanding: string;
  cumulativeCgpa?: number;
  combinedTotalCredits?: number;
}

export function getGradePoints(gradeStr: string, scale: GpaScaleType, customPoints?: number): number {
  if (scale === 'custom' && customPoints !== undefined && !isNaN(customPoints)) {
    return customPoints;
  }
  const scaleDef = GPA_SCALES[scale];
  const found = scaleDef.grades.find((g) => g.grade.toLowerCase() === gradeStr.toLowerCase().trim());
  if (found) return found.points;

  // Try numeric input
  const num = parseFloat(gradeStr);
  if (!isNaN(num)) return num;

  return 0.0;
}

export function calculateSemesterGpa(
  courses: CourseEntry[],
  scale: GpaScaleType = '4.0',
  priorGpa?: number,
  priorCredits?: number
): GpaCalculationResult {
  let totalCredits = 0;
  let totalGradePoints = 0;

  const validCourses = courses.filter((c) => c.credits > 0);

  const breakdown = validCourses.map((c) => {
    const pointsPerCredit = getGradePoints(c.grade, scale, c.customPoints);
    const coursePoints = pointsPerCredit * c.credits;
    totalCredits += c.credits;
    totalGradePoints += coursePoints;

    return {
      name: c.name.trim() || 'Untitled Course',
      credits: c.credits,
      grade: c.grade,
      gradePointsPerCredit: pointsPerCredit,
      courseTotalPoints: coursePoints,
    };
  });

  const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

  // Academic standing analysis based on 4.0 standard scale or normalized
  let academicStanding = 'Good Standing';
  const normGpa = scale === '5.0' ? (gpa / 5.0) * 4.0 : scale === 'percentage' ? (gpa / 100) * 4.0 : gpa;

  if (normGpa >= 3.8) {
    academicStanding = "Summa Cum Laude / Dean's Highest Honors";
  } else if (normGpa >= 3.5) {
    academicStanding = "Dean's List / High Academic Honors";
  } else if (normGpa >= 3.0) {
    academicStanding = 'Good Academic Standing';
  } else if (normGpa >= 2.0) {
    academicStanding = 'Satisfactory Progress';
  } else if (totalCredits > 0) {
    academicStanding = 'Academic Warning / Probationary Range (< 2.0)';
  }

  let cumulativeCgpa: number | undefined;
  let combinedTotalCredits: number | undefined;

  if (priorGpa !== undefined && priorCredits !== undefined && priorCredits > 0) {
    const priorPoints = priorGpa * priorCredits;
    const combinedPoints = priorPoints + totalGradePoints;
    combinedTotalCredits = priorCredits + totalCredits;
    cumulativeCgpa = combinedTotalCredits > 0 ? combinedPoints / combinedTotalCredits : 0;
  }

  return {
    gpa,
    totalCredits,
    totalGradePoints,
    courseBreakdown: breakdown,
    academicStanding,
    cumulativeCgpa,
    combinedTotalCredits,
  };
}
