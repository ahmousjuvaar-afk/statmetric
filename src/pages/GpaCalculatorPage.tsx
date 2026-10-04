import { useState, useMemo } from 'react';
import { SeoHead } from '../components/SeoHead';
import { ReportBox } from '../components/ReportBox';
import { StepsExplanation } from '../components/StepsExplanation';
import { NextStepCard, NextStepOption } from '../components/NextStepCard';
import { LearnVerifyBox } from '../components/LearnVerifyBox';
import {
  GpaScaleType,
  CourseEntry,
  GPA_SCALES,
  calculateSemesterGpa,
} from '../lib/education/gpa';
import { Plus, Trash2, RotateCcw, Printer, Copy, Check, GraduationCap, Award } from 'lucide-react';

const INITIAL_COURSES: CourseEntry[] = [
  { id: '1', name: 'Calculus I', credits: 4, grade: 'A' },
  { id: '2', name: 'Introduction to Statistics', credits: 3, grade: 'A-' },
  { id: '3', name: 'Academic Writing & Research', credits: 3, grade: 'B+' },
  { id: '4', name: 'Principles of Economics', credits: 3, grade: 'B' },
  { id: '5', name: 'Data Structures Lab', credits: 2, grade: 'A' },
];

export function GpaCalculatorPage() {
  const [scale, setScale] = useState<GpaScaleType>('4.0');
  const [courses, setCourses] = useState<CourseEntry[]>(INITIAL_COURSES);
  const [enableCgpa, setEnableCgpa] = useState<boolean>(false);
  const [priorGpaStr, setPriorGpaStr] = useState<string>('3.50');
  const [priorCreditsStr, setPriorCreditsStr] = useState<string>('30');
  const [copiedGpa, setCopiedGpa] = useState(false);

  const priorGpa = enableCgpa ? parseFloat(priorGpaStr) || 0 : undefined;
  const priorCredits = enableCgpa ? parseFloat(priorCreditsStr) || 0 : undefined;

  const result = useMemo(() => {
    return calculateSemesterGpa(courses, scale, priorGpa, priorCredits);
  }, [courses, scale, priorGpa, priorCredits]);

  const addCourse = () => {
    const newId = String(Date.now());
    setCourses([...courses, { id: newId, name: '', credits: 3, grade: 'A' }]);
  };

  const removeCourse = (id: string) => {
    if (courses.length <= 1) return;
    setCourses(courses.filter((c) => c.id !== id));
  };

  const updateCourse = (id: string, field: keyof CourseEntry, value: string | number) => {
    setCourses(
      courses.map((c) => {
        if (c.id === id) {
          return { ...c, [field]: value };
        }
        return c;
      })
    );
  };

  const loadPreset = (preset: 'freshman' | 'stem' | 'fiveScale') => {
    if (preset === 'freshman') {
      setScale('4.0');
      setCourses([
        { id: '1', name: 'Psychology 101', credits: 3, grade: 'A' },
        { id: '2', name: 'Introductory Biology', credits: 4, grade: 'B+' },
        { id: '3', name: 'College Composition', credits: 3, grade: 'A-' },
        { id: '4', name: 'World History', credits: 3, grade: 'B' },
      ]);
      setEnableCgpa(false);
    } else if (preset === 'stem') {
      setScale('4.0');
      setCourses([
        { id: '1', name: 'Linear Algebra', credits: 4, grade: 'A' },
        { id: '2', name: 'Probability & Statistics', credits: 3, grade: 'A' },
        { id: '3', name: 'Physics I (Mechanics)', credits: 4, grade: 'B+' },
        { id: '4', name: 'Physics Lab', credits: 1, grade: 'A' },
      ]);
      setEnableCgpa(true);
      setPriorGpaStr('3.72');
      setPriorCreditsStr('45');
    } else if (preset === 'fiveScale') {
      setScale('5.0');
      setCourses([
        { id: '1', name: 'Engineering Mathematics', credits: 4, grade: 'A' },
        { id: '2', name: 'Applied Chemistry', credits: 3, grade: 'B+' },
        { id: '3', name: 'Thermodynamics', credits: 3, grade: 'A-' },
      ]);
      setEnableCgpa(false);
    }
  };

  const handleCopyGpa = async () => {
    try {
      await navigator.clipboard.writeText(result.gpa.toFixed(2));
      setCopiedGpa(true);
      setTimeout(() => setCopiedGpa(false), 2000);
    } catch {}
  };

  const nextSteps: NextStepOption[] = [
    {
      prompt: 'Need to find what score you need on an upcoming final exam?',
      toolName: 'Final Grade Calculator',
      path: '/calculators/grade-calculator',
      description: 'Calculate the exact final exam percentage needed to achieve your target semester grade.',
      isAvailable: true,
    },
    {
      prompt: 'Need to analyze the dispersion of your class scores?',
      toolName: 'Standard Deviation Calculator',
      path: '/calculators/standard-deviation',
      description: 'Calculate the spread, variance, and mean of exam scores or lab measurements.',
      isAvailable: true,
    },
    {
      prompt: 'Need comprehensive 5-number summary and median for scores?',
      toolName: 'Descriptive Statistics Suite',
      path: '/calculators/descriptive-statistics',
      description: 'Compute full summary metrics including mean, median, mode, IQR, and box plot boundaries.',
      isAvailable: true,
    },
  ];

  const steps = [
    {
      title: 'Step 1: Calculate Course Quality Points',
      content: `For each course, multiply credit hours by the grade point value (e.g. 3 credits × 4.0 for an A = 12.0 points). Total grade points earned = ${result.totalGradePoints.toFixed(1)}.`,
    },
    {
      title: 'Step 2: Sum Total Attempted Credits',
      content: `Sum all graded credit hours: Total Credits = ${result.totalCredits}. (Non-graded courses or pass/fail credits are excluded from GPA weights).`,
    },
    {
      title: 'Step 3: Divide Total Points by Total Credits',
      content: `GPA = Total Points / Total Credits = ${result.totalGradePoints.toFixed(1)} / ${result.totalCredits} = ${result.gpa.toFixed(3)}.`,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SeoHead
        title="GPA Calculator — Semester GPA & Cumulative CGPA (4.0 & 5.0 Scales)"
        description="Free, accurate GPA & CGPA calculator. Calculate credit-weighted grade point averages for US 4.0, 5.0, and percentage grading scales with cumulative projection."
        path="/calculators/gpa"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Calculators', path: '/calculators' },
          { name: 'GPA Calculator', path: '/calculators/gpa' },
        ]}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumbs" className="mb-4 text-xs text-slate-500 flex items-center gap-1.5 no-print">
        <span>Education</span>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-medium">GPA & CGPA Calculator</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
          GPA & CGPA Calculator
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Compute your credit-weighted semester Grade Point Average (GPA) and project your cumulative standing (CGPA). Supports standard US 4.0, 5.0 weighted, and international percentage scales.
        </p>

        {/* Classroom & Student Presets */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs no-print">
          <span className="text-slate-500 font-medium">Classroom examples:</span>
          <button
            onClick={() => loadPreset('freshman')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            Freshman Semester (4.0 Scale)
          </button>
          <button
            onClick={() => loadPreset('stem')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            STEM Major + Cumulative CGPA
          </button>
          <button
            onClick={() => loadPreset('fiveScale')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
          >
            5.0 Honors / International Scale
          </button>
        </div>
      </div>

      {/* Main Calculator Box */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden mb-8">
        <div className="p-5 sm:p-7 border-b border-slate-200 bg-slate-50/50">
          {/* Scale Selector */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Grading System / Scale
              </label>
              <div className="flex flex-wrap gap-1.5 p-1 bg-slate-200/60 rounded-lg">
                <button
                  type="button"
                  onClick={() => setScale('4.0')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    scale === '4.0'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Standard 4.0 Scale
                </button>
                <button
                  type="button"
                  onClick={() => setScale('5.0')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    scale === '5.0'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  5.0 Weighted Scale
                </button>
                <button
                  type="button"
                  onClick={() => setScale('percentage')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    scale === 'percentage'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Percentage (0-100%)
                </button>
              </div>
            </div>

            {/* Cumulative Toggle */}
            <div className="pt-4 sm:pt-0">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={enableCgpa}
                  onChange={(e) => setEnableCgpa(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <span>Include Prior Cumulative CGPA</span>
              </label>
            </div>
          </div>

          {/* Optional Cumulative CGPA Inputs */}
          {enableCgpa && (
            <div className="mb-6 p-4 bg-sky-50/70 border border-sky-200/80 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Prior Cumulative GPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={scale === '5.0' ? 5.0 : 4.0}
                  value={priorGpaStr}
                  onChange={(e) => setPriorGpaStr(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="e.g. 3.50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Prior Earned Credits Hours
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={priorCreditsStr}
                  onChange={(e) => setPriorCreditsStr(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="e.g. 30"
                />
              </div>
            </div>
          )}

          {/* Courses Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/90 text-slate-700 border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3">Course Title</th>
                  <th className="p-3 w-28">Credits</th>
                  <th className="p-3 w-36">Grade</th>
                  <th className="p-3 w-24 text-right">Points</th>
                  <th className="p-3 w-12 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((course, idx) => (
                  <tr key={course.id} className="hover:bg-slate-50/50">
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={course.name}
                        onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                        placeholder={`Course ${idx + 1}`}
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={course.credits}
                        onChange={(e) =>
                          updateCourse(course.id, 'credits', parseFloat(e.target.value) || 0)
                        }
                        className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </td>
                    <td className="p-2.5">
                      <select
                        value={course.grade}
                        onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
                      >
                        {GPA_SCALES[scale].grades.map((g) => (
                          <option key={g.grade} value={g.grade}>
                            {g.grade} ({g.points.toFixed(1)})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2.5 text-right font-mono text-slate-800 font-semibold">
                      {(
                        course.credits *
                        (GPA_SCALES[scale].grades.find((g) => g.grade === course.grade)?.points || 0)
                      ).toFixed(1)}
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        onClick={() => removeCourse(course.id)}
                        disabled={courses.length <= 1}
                        className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-slate-400 rounded transition-colors"
                        title="Delete course"
                        aria-label="Delete course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Row */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 no-print">
            <button
              onClick={addCourse}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Course</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCourses(INITIAL_COURSES)}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset courses</span>
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print transcript summary</span>
              </button>
            </div>
          </div>
        </div>

        {/* Calculation Result */}
        <div className="p-5 sm:p-7 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Semester Grade Point Average (GPA)
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                  {result.gpa.toFixed(2)}
                </span>
                <span className="text-sm font-mono text-slate-500">
                  / {GPA_SCALES[scale].maxGpa.toFixed(1)} max
                </span>
                <button
                  onClick={handleCopyGpa}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors no-print"
                  title="Copy GPA"
                  aria-label="Copy GPA"
                >
                  {copiedGpa ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="mt-1 text-xs text-slate-500 font-mono">
                Total Quality Points: {result.totalGradePoints.toFixed(1)} · Total Graded Credits: {result.totalCredits}
              </div>
            </div>

            {/* Standing or CGPA Column */}
            <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6 space-y-1">
              {result.cumulativeCgpa !== undefined && (
                <div>
                  <div className="text-xs text-slate-500 uppercase font-semibold">
                    Cumulative CGPA
                  </div>
                  <div className="text-2xl font-bold font-mono text-sky-700">
                    {result.cumulativeCgpa.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Total Career Credits: {result.combinedTotalCredits}
                  </div>
                </div>
              )}
              <div className="flex items-center sm:justify-end gap-1.5 pt-1">
                <Award className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-slate-800">
                  {result.academicStanding}
                </span>
              </div>
            </div>
          </div>

          {/* Progressive Disclosure Steps */}
          <StepsExplanation
            steps={steps}
            formula="\\text{Semester GPA} = \\frac{\\sum (\\text{Credits}_i \\times \\text{Grade Points}_i)}{\\sum \\text{Credits}_i}"
            title="How was this GPA calculated? (Weighting formula)"
          />

          {/* Learn & Verify Box */}
          <LearnVerifyBox
            learnNotes={{
              concept:
                'A Grade Point Average is not a simple arithmetic mean. It is a credit-weighted average, meaning a 4-credit course carries twice the impact of a 2-credit course.',
              intuition:
                'Think of credits as masses on a balance beam. An A in a 4-credit lab pulls your GPA up twice as hard as an A in a 2-credit elective.',
              formulaBreakdown:
                'Quality Points for each course = Credits × Grade Point. Add all Quality Points together, then divide by Total Credits attempted.',
              commonTrap:
                'Do not average the grade points directly without weighting by credits! Averaging 4.0 and 3.0 equally when one is a 4-credit class produces an inaccurate GPA.',
            }}
            manualCheckSteps={[
              'Multiply each course credit by its corresponding numerical grade points from your institution scale.',
              'Sum the quality points column to get Total Points.',
              'Sum the credit hours column to get Total Credits.',
              'Divide Total Points by Total Credits and round to 2 or 3 decimal places.',
            ]}
          />

          {/* APA / Transcript Summary Box */}
          <ReportBox
            apaString={`Semester GPA: ${result.gpa.toFixed(2)} (${result.totalCredits} credits, ${result.totalGradePoints.toFixed(1)} points)${
              result.cumulativeCgpa ? `; Cumulative CGPA: ${result.cumulativeCgpa.toFixed(2)} (${result.combinedTotalCredits} credits)` : ''
            }`}
            contextNote="Standard transcript summary notation for graduate school applications, scholarships, and academic resumes."
          />

          {/* What Should I Do Next? */}
          <NextStepCard options={nextSteps} />
        </div>
      </div>
    </div>
  );
}
