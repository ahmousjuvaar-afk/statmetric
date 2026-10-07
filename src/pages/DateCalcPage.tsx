import { useState, useMemo } from 'react';
import { SeoHead } from '../components/SeoHead';
import { ToolIcon } from '../components/ToolIcon';
import { NextStepCard } from '../components/NextStepCard';
import { calculateAge, calculateDateDifference, calculateTimeDuration } from '../lib/datetime/dateEngine';
import { Calendar, Clock, Briefcase, Gift } from 'lucide-react';

export function DateCalcPage() {
  const [tab, setTab] = useState<'age' | 'difference' | 'duration'>('age');

  // Age state
  const [birthDate, setBirthDate] = useState('');
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split('T')[0]);

  // Difference state
  const [diffStart, setDiffStart] = useState('');
  const [diffEnd, setDiffEnd] = useState('');

  // Duration state
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');

  const hasAgeInputs = birthDate.trim() !== '' && asOfDate.trim() !== '';
  const hasDiffInputs = diffStart.trim() !== '' && diffEnd.trim() !== '';
  const hasDurationInputs = timeStart.trim() !== '' && timeEnd.trim() !== '';

  const ageResult = useMemo(() => {
    if (!hasAgeInputs) return { data: null, error: null };
    try {
      const res = calculateAge(birthDate, asOfDate);
      return { data: res, error: null };
    } catch (e: unknown) {
      return { data: null, error: e instanceof Error ? e.message : 'Invalid date calculation.' };
    }
  }, [birthDate, asOfDate, hasAgeInputs]);

  const diffResult = useMemo(() => {
    if (!hasDiffInputs) return { data: null, error: null };
    try {
      const res = calculateDateDifference(diffStart, diffEnd);
      return { data: res, error: null };
    } catch (e: unknown) {
      return { data: null, error: e instanceof Error ? e.message : 'Invalid date interval.' };
    }
  }, [diffStart, diffEnd, hasDiffInputs]);

  const durationResult = useMemo(() => {
    if (!hasDurationInputs) return { data: null, error: null };
    try {
      const res = calculateTimeDuration(timeStart, timeEnd);
      return { data: res, error: null };
    } catch (e: unknown) {
      return { data: null, error: e instanceof Error ? e.message : 'Invalid time string.' };
    }
  }, [timeStart, timeEnd, hasDurationInputs]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <SeoHead
        title="Date & Time Calculator - Exact Age, Business Days & Duration | StatMetric"
        description="Free online date and time calculator. Calculate exact age in years/months/days, business days excluding weekends, and time duration across midnight."
        path="/calculators/date-calculator"
        schemaType="WebApplication"
      />

      {/* Hero Header with ToolIcon */}
      <div className="mb-6 flex items-start gap-4">
        <ToolIcon toolId="date-calculator" size="lg" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-200/60">
              Date & Time
            </span>
            <span className="text-xs text-slate-500">Calendar Math · Business Days</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Date & Time Calculator
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Compute calendar ages with leap-year precision, exact business days excluding weekends, and 24-hour clock durations across midnight.
          </p>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-lg mb-6 w-fit">
        <button
          onClick={() => setTab('age')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold transition-colors ${
            tab === 'age' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Gift className="w-3.5 h-3.5 text-violet-600" />
          <span>Age Calculator</span>
        </button>
        <button
          onClick={() => setTab('difference')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold transition-colors ${
            tab === 'difference' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 text-blue-600" />
          <span>Date & Business Days</span>
        </button>
        <button
          onClick={() => setTab('duration')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold transition-colors ${
            tab === 'duration' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Time Duration (Hours/Mins)</span>
        </button>
      </div>

      {/* Tab 1: Age Calculator */}
      {tab === 'age' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Calculate Age As Of</label>
                <input
                  type="date"
                  value={asOfDate}
                  onChange={(e) => setAsOfDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500">Chronological age and birthday countdown</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setBirthDate('2000-01-15');
                    setAsOfDate(new Date().toISOString().split('T')[0]);
                  }}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  Load Example (DOB: Jan 15, 2000)
                </button>
                <button
                  type="button"
                  onClick={() => setBirthDate('')}
                  className="text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {ageResult.error ? (
              <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-md p-3 mt-4">
                {ageResult.error}
              </div>
            ) : ageResult.data ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 mt-4">
                <div className="p-3 bg-violet-50/60 border border-violet-100 rounded-lg text-center">
                  <span className="text-[11px] text-violet-700 font-medium block">Exact Age</span>
                  <div className="text-2xl font-black text-violet-900 mt-0.5">
                    {ageResult.data.years}
                  </div>
                  <span className="text-[10px] text-violet-600 font-medium">years</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <span className="text-[11px] text-slate-500 font-medium block">Months & Days</span>
                  <div className="text-base font-bold text-slate-800 mt-1">
                    {ageResult.data.months}m, {ageResult.data.days}d
                  </div>
                  <span className="text-[10px] text-slate-600">breakdown</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <span className="text-[11px] text-slate-500 font-medium block">Total Days Lived</span>
                  <div className="text-base font-bold text-slate-800 mt-1 font-mono">
                    {ageResult.data.totalDays.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-600">({ageResult.data.totalHours.toLocaleString()} hrs)</span>
                </div>
                <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-lg text-center">
                  <span className="text-[11px] text-amber-700 font-medium block">Next Birthday</span>
                  <div className="text-base font-bold text-amber-900 mt-1">
                    {ageResult.data.nextBirthdayCountdownDays} days
                  </div>
                  <span className="text-[10px] text-amber-600">{ageResult.data.nextBirthdayDayOfWeek}</span>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-slate-500 space-y-1 mt-4">
                <p className="text-xs font-semibold text-slate-700">Chronological age will appear here</p>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  Select your birthdate above to compute exact age, days lived, and countdown to your next birthday.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Date Difference & Business Days */}
      {tab === 'difference' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={diffStart}
                  onChange={(e) => setDiffStart(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={diffEnd}
                  onChange={(e) => setDiffEnd(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500">Business days (Mon-Fri) and calendar span</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDiffStart('2025-01-01');
                    setDiffEnd('2025-06-30');
                  }}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  Load Example (Jan 1 to June 30)
                </button>
                <button
                  type="button"
                  onClick={() => { setDiffStart(''); setDiffEnd(''); }}
                  className="text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {diffResult.error ? (
              <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-md p-3 mt-4">
                {diffResult.error}
              </div>
            ) : diffResult.data ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 mt-4">
                <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg text-center">
                  <span className="text-[11px] text-blue-700 font-medium block">Total Days</span>
                  <div className="text-2xl font-black text-blue-900 mt-0.5">
                    {diffResult.data.totalDays}
                  </div>
                  <span className="text-[10px] text-blue-600">calendar days</span>
                </div>
                <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-lg text-center">
                  <span className="text-[11px] text-emerald-700 font-medium block">Business Days</span>
                  <div className="text-2xl font-black text-emerald-900 mt-0.5">
                    {diffResult.data.businessDays}
                  </div>
                  <span className="text-[10px] text-emerald-600">Mon − Fri (no weekends)</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <span className="text-[11px] text-slate-500 font-medium block">Weekend Days</span>
                  <div className="text-base font-bold text-slate-800 mt-1">
                    {diffResult.data.weekendDays} days
                  </div>
                  <span className="text-[10px] text-slate-600">Sat & Sun</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <span className="text-[11px] text-slate-500 font-medium block">Calendar Breakdown</span>
                  <div className="text-sm font-bold text-slate-800 mt-1">
                    {diffResult.data.calendarMonths}m, {diffResult.data.calendarDays}d
                  </div>
                  <span className="text-[10px] text-slate-600">{diffResult.data.calendarYears} years</span>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-slate-500 space-y-1 mt-4">
                <p className="text-xs font-semibold text-slate-700">Date difference will appear here</p>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  Select start and end dates above to calculate calendar elapsed time and working business days.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Time Duration */}
      {tab === 'duration' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time (HH:MM)</label>
                <input
                  type="time"
                  value={timeStart}
                  onChange={(e) => setTimeStart(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">End Time (HH:MM)</label>
                <input
                  type="time"
                  value={timeEnd}
                  onChange={(e) => setTimeEnd(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono font-medium"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500">Duration across daytime or midnight</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setTimeStart('09:15');
                    setTimeEnd('17:45');
                  }}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  Load Example (09:15 to 17:45)
                </button>
                <button
                  type="button"
                  onClick={() => { setTimeStart(''); setTimeEnd(''); }}
                  className="text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {durationResult.error ? (
              <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-md p-3 mt-4">
                {durationResult.error}
              </div>
            ) : durationResult.data ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 mt-4">
                <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-lg text-center">
                  <span className="text-[11px] text-amber-700 font-medium block">Total Duration</span>
                  <div className="text-2xl font-black text-amber-900 mt-0.5">
                    {durationResult.data.hours}h {durationResult.data.minutes}m
                  </div>
                  <span className="text-[10px] text-amber-600">
                    {durationResult.data.crossedMidnight ? 'Crossed midnight (+1 day)' : 'Same day'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <span className="text-[11px] text-slate-500 font-medium block">Decimal Hours</span>
                  <div className="text-xl font-bold text-slate-800 mt-1 font-mono">
                    {durationResult.data.decimalHours.toFixed(2)} hrs
                  </div>
                  <span className="text-[10px] text-slate-600">For timesheets & payroll</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <span className="text-[11px] text-slate-500 font-medium block">Total Minutes</span>
                  <div className="text-xl font-bold text-slate-800 mt-1 font-mono">
                    {durationResult.data.totalMinutes} mins
                  </div>
                  <span className="text-[10px] text-slate-600">({(durationResult.data.totalMinutes * 60).toLocaleString()} secs)</span>
                </div>
              </div>
            ) : (
              <div className="p-5 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-slate-500 space-y-1 mt-4">
                <p className="text-xs font-semibold text-slate-700">Duration will appear here</p>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  Select start and end clock times above to calculate total elapsed hours, minutes, and payroll decimal hours.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className="mt-8">
        <NextStepCard
          options={[
            {
              prompt: 'Convert time units or intervals?',
              toolName: 'Unit Converter Suite',
              path: '/calculators/unit-converter',
              description: 'Convert seconds, minutes, hours, days, weeks, and calendar years.',
            },
            {
              prompt: 'Calculate final course exam targets?',
              toolName: 'Final Grade Calculator',
              path: '/calculators/grade-calculator',
              description: 'Find required final exam score based on study schedule and term weight.',
            },
            {
              prompt: 'Compute college semester GPA?',
              toolName: 'GPA & CGPA Calculator',
              path: '/calculators/gpa',
              description: 'Credit-weighted semester GPA and cumulative academic honors standing.',
            },
          ]}
        />
      </div>
    </div>
  );
}
