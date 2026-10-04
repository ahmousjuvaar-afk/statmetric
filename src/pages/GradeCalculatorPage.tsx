import { useState, useMemo } from 'react';
import { SeoHead } from '../components/SeoHead';
import { ReportBox } from '../components/ReportBox';
import { StepsExplanation } from '../components/StepsExplanation';
import { NextStepCard, NextStepOption } from '../components/NextStepCard';
import { LearnVerifyBox } from '../components/LearnVerifyBox';
import {
  calculateFinalExamNeeded,
  calculateWeightedGrade,
  GradeCategory,
} from '../lib/education/gradeCalculator';
import { Target, CheckCircle2, AlertTriangle, RotateCcw, Plus, Trash2, Printer } from 'lucide-react';

export function GradeCalculatorPage() {
  const [tab, setTab] = useState<'final_exam' | 'weighted'>('final_exam');

  // Final Exam Mode State
  const [currentGradeStr, setCurrentGradeStr] = useState<string>('78');
  const [targetGradeStr, setTargetGradeStr] = useState<string>('85');
  const [examWeightStr, setExamWeightStr] = useState<string>('30');

  // Weighted Course Mode State
  const [categories, setCategories] = useState<GradeCategory[]>([
    { id: '1', name: 'Homework & Assignments', weight: 20, score: 92 },
    { id: '2', name: 'Midterm Exam', weight: 25, score: 78 },
    { id: '3', name: 'Term Project', weight: 20, score: 88 },
    { id: '4', name: 'Quizzes', weight: 10, score: 85 },
    { id: '5', name: 'Final Exam', weight: 25, score: 80 },
  ]);

  const currentGrade = parseFloat(currentGradeStr) || 0;
  const targetGrade = parseFloat(targetGradeStr) || 0;
  const examWeight = parseFloat(examWeightStr) || 0;

  let finalExamError: string | null = null;
  if (examWeight <= 0 || examWeight > 100) {
    finalExamError = 'Final exam weight must be between 1% and 100%.';
  }

  const finalExamResult = useMemo(() => {
    if (finalExamError) return null;
    try {
      return calculateFinalExamNeeded({
        currentGrade,
        targetGrade,
        examWeight,
      });
    } catch (err: unknown) {
      if (err instanceof Error) finalExamError = err.message;
      return null;
    }
  }, [currentGrade, targetGrade, examWeight, finalExamError]);

  const weightedResult = useMemo(() => {
    return calculateWeightedGrade(categories);
  }, [categories]);

  const addCategory = () => {
    setCategories([
      ...categories,
      { id: String(Date.now()), name: 'New Component', weight: 10, score: 85 },
    ]);
  };

  const removeCategory = (id: string) => {
    if (categories.length <= 1) return;
    setCategories(categories.filter((c) => c.id !== id));
  };

  const updateCategory = (id: string, field: keyof GradeCategory, val: string | number) => {
    setCategories(
      categories.map((c) => {
        if (c.id === id) return { ...c, [field]: val };
        return c;
      })
    );
  };

  const nextSteps: NextStepOption[] = [
    {
      prompt: 'Need to combine your semester grades into your overall GPA?',
      toolName: 'GPA & CGPA Calculator',
      path: '/calculators/gpa',
      description: 'Compute credit-weighted Grade Point Average across all your courses.',
      isAvailable: true,
    },
    {
      prompt: 'Need to calculate the average and spread of class scores?',
      toolName: 'Standard Deviation Calculator',
      path: '/calculators/standard-deviation',
      description: 'Find the mean, standard deviation, and variance of test scores.',
      isAvailable: true,
    },
    {
      prompt: 'Need to find your z-score relative to the class mean and curve?',
      toolName: 'Z-Score Calculator',
      path: '/calculators/z-score',
      description: 'Standardize your test score against the class average to find your percentile rank.',
      isAvailable: true,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SeoHead
        title="Final Grade Calculator — What Grade Do I Need on My Final Exam?"
        description="Free final exam grade calculator. Find out exactly what score you need on your final exam to get your desired target course grade, or calculate weighted semester grades."
        path="/calculators/grade-calculator"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Calculators', path: '/calculators' },
          { name: 'Grade Calculator', path: '/calculators/grade-calculator' },
        ]}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumbs" className="mb-4 text-xs text-slate-500 flex items-center gap-1.5 no-print">
        <span>Education</span>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-medium">Grade & Final Exam Calculator</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Grade & Final Exam Calculator
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Determine the exact percentage score required on your final exam to pass or achieve your target course grade.
        </p>

        {/* Mode Selector Buttons */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => setTab('final_exam')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              tab === 'final_exam'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            What Grade Do I Need on My Final Exam?
          </button>
          <button
            onClick={() => setTab('weighted')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              tab === 'weighted'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Weighted Semester Course Grade
          </button>
        </div>
      </div>

      {tab === 'final_exam' ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden mb-8">
          <div className="p-5 sm:p-7 border-b border-slate-200 bg-slate-50/50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  1. Current Grade (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="150"
                    value={currentGradeStr}
                    onChange={(e) => setCurrentGradeStr(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 pr-8"
                    placeholder="e.g. 78"
                  />
                  <span className="absolute right-3 top-2 text-slate-400 text-xs font-medium">%</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Your standing prior to the final exam
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  2. Target Final Grade (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={targetGradeStr}
                    onChange={(e) => setTargetGradeStr(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 pr-8"
                    placeholder="e.g. 85"
                  />
                  <span className="absolute right-3 top-2 text-slate-400 text-xs font-medium">%</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  e.g. 90% for A, 80% for B, 70% for C
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  3. Final Exam Weight (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="1"
                    max="100"
                    value={examWeightStr}
                    onChange={(e) => setExamWeightStr(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 pr-8"
                    placeholder="e.g. 30"
                  />
                  <span className="absolute right-3 top-2 text-slate-400 text-xs font-medium">%</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Percentage of syllabus weight
                </span>
              </div>
            </div>

            {/* Quick target helper buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 text-xs text-slate-600 no-print">
              <span className="font-medium text-slate-500">Quick target presets:</span>
              <button
                onClick={() => setTargetGradeStr('90')}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
              >
                Aim for A (90%)
              </button>
              <button
                onClick={() => setTargetGradeStr('80')}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
              >
                Aim for B (80%)
              </button>
              <button
                onClick={() => setTargetGradeStr('70')}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
              >
                Pass Class (70%)
              </button>
            </div>
          </div>

          {/* Validation Banner */}
          {finalExamError && (
            <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-start gap-2 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{finalExamError}</span>
            </div>
          )}

          {/* Results */}
          {finalExamResult && (
            <div className="p-5 sm:p-7 space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Required Final Exam Score
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                    {finalExamResult.requiredScorePercent}
                  </div>
                  <div className="mt-1 text-xs text-slate-600">
                    {finalExamResult.advice}
                  </div>
                </div>

                <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6">
                  <div className="text-xs text-slate-500 uppercase font-semibold">
                    Assessment
                  </div>
                  <div
                    className={`text-sm font-bold mt-0.5 ${
                      finalExamResult.status === 'achieved' || finalExamResult.status === 'easy'
                        ? 'text-emerald-700'
                        : finalExamResult.status === 'moderate'
                        ? 'text-blue-700'
                        : finalExamResult.status === 'challenging'
                        ? 'text-amber-700'
                        : 'text-rose-700'
                    }`}
                  >
                    {finalExamResult.statusMessage}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Exam carries {examWeight}% of course
                  </div>
                </div>
              </div>

              {/* Progressive Disclosure Steps */}
              <StepsExplanation
                steps={finalExamResult.steps}
                formula={finalExamResult.formula}
                title="Mathematical Step-by-Step Derivation"
              />

              {/* Learn & Verify Box */}
              <LearnVerifyBox
                learnNotes={{
                  concept:
                    'Your final course grade is a weighted linear combination of your coursework grade and your final exam grade.',
                  intuition:
                    'If the final exam is worth 30%, then 70% of your course is already locked in. The remaining 30% must make up all points between what you already have and your desired goal.',
                  formulaBreakdown:
                    'Target = (Current Grade × (1 - w)) + (Required Score × w). Solving for Required Score yields (Target - Current Grade × (1 - w)) / w.',
                  commonTrap:
                    'Forgetting that the remaining weight is (1 - w). For instance, with a 40% final, current coursework counts for 60% (0.60), not 40%.',
                }}
                manualCheckSteps={[
                  'Multiply your current grade by (1 - final exam weight decimal). This is your locked-in course points.',
                  'Subtract your locked-in points from your desired target course grade.',
                  'Divide that difference by the final exam weight decimal.',
                  'The result is your required final exam percentage.',
                ]}
              />

              <ReportBox
                apaString={`To achieve an overall course grade of ${targetGrade}%, a score of ${finalExamResult.requiredScorePercent} is required on the final exam (weighted at ${examWeight}% with current standing ${currentGrade}%).`}
                contextNote="Clear statement of required academic performance for study planning."
              />

              <NextStepCard options={nextSteps} />
            </div>
          )}
        </div>
      ) : (
        /* Weighted Course Mode */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden mb-8">
          <div className="p-5 sm:p-7 border-b border-slate-200 bg-slate-50/50">
            <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white mb-4">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 uppercase text-[11px]">
                  <tr>
                    <th className="p-3">Component / Assessment</th>
                    <th className="p-3 w-28">Weight (%)</th>
                    <th className="p-3 w-28">Your Score (%)</th>
                    <th className="p-3 w-24 text-right">Points Earned</th>
                    <th className="p-3 w-12 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map((cat) => (
                    <tr key={cat.id}>
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={cat.name}
                          onChange={(e) => updateCategory(cat.id, 'name', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          value={cat.weight}
                          onChange={(e) =>
                            updateCategory(cat.id, 'weight', parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-2 py-1 text-xs font-mono border border-slate-200 rounded-md"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          value={cat.score}
                          onChange={(e) =>
                            updateCategory(cat.id, 'score', parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-2 py-1 text-xs font-mono border border-slate-200 rounded-md"
                        />
                      </td>
                      <td className="p-2.5 text-right font-mono font-semibold text-slate-800">
                        {((cat.score * cat.weight) / 100).toFixed(2)}%
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => removeCategory(cat.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          aria-label="Remove category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-xs">
              <button
                onClick={addCategory}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Component</span>
              </button>
              <div className="font-medium text-slate-600">
                Total Weights Sum: <strong className={weightedResult.totalWeight === 100 ? 'text-emerald-700' : 'text-amber-700'}>{weightedResult.totalWeight}%</strong>
                {weightedResult.totalWeight !== 100 && ' (weights should sum to 100%)'}
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-7 space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Overall Weighted Grade
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">
                  {weightedResult.finalGrade.toFixed(2)}%
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 uppercase font-semibold">Estimated Letter Grade</span>
                <div className="text-2xl font-bold text-sky-700">{weightedResult.letterGrade}</div>
              </div>
            </div>

            <NextStepCard options={nextSteps} />
          </div>
        </div>
      )}
    </div>
  );
}
