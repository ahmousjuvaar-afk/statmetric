/**
 * Date & Time calculation engine.
 * Computes calendar ages, exact day intervals, working/business days (excluding weekends),
 * and clock durations across midnight.
 */

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  nextBirthdayCountdownDays: number;
  nextBirthdayDayOfWeek: string;
}

export function calculateAge(birthDateStr: string, asOfDateStr?: string): AgeResult {
  const birth = new Date(birthDateStr + 'T00:00:00');
  const asOf = asOfDateStr ? new Date(asOfDateStr + 'T00:00:00') : new Date();

  if (isNaN(birth.getTime()) || isNaN(asOf.getTime())) {
    throw new Error('Please select valid calendar dates.');
  }

  if (birth > asOf) {
    throw new Error('Date of birth cannot be in the future.');
  }

  let years = asOf.getFullYear() - birth.getFullYear();
  let months = asOf.getMonth() - birth.getMonth();
  let days = asOf.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    // Get days in the previous month of asOf
    const prevMonth = new Date(asOf.getFullYear(), asOf.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const diffMs = asOf.getTime() - birth.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalHours = totalDays * 24;

  // Next birthday
  const nextBirthday = new Date(asOf.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday < asOf) {
    nextBirthday.setFullYear(asOf.getFullYear() + 1);
  }
  const nextBdayDiff = Math.ceil((nextBirthday.getTime() - asOf.getTime()) / (1000 * 60 * 60 * 24));
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const nextBirthdayDayOfWeek = dayNames[nextBirthday.getDay()];

  return {
    years,
    months,
    days,
    totalDays,
    totalHours,
    nextBirthdayCountdownDays: nextBdayDiff,
    nextBirthdayDayOfWeek,
  };
}

export interface DateDifferenceResult {
  totalDays: number;
  businessDays: number;
  weekendDays: number;
  calendarYears: number;
  calendarMonths: number;
  calendarDays: number;
  isReversed: boolean;
}

export function calculateDateDifference(startDateStr: string, endDateStr: string): DateDifferenceResult {
  const start = new Date(startDateStr + 'T00:00:00');
  const end = new Date(endDateStr + 'T00:00:00');

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Please select valid calendar dates.');
  }

  const isReversed = end < start;
  const d1 = isReversed ? end : start;
  const d2 = isReversed ? start : end;

  const diffMs = d2.getTime() - d1.getTime();
  const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  // Count business days (Mon-Fri) and weekends (Sat-Sun)
  let businessDays = 0;
  let weekendDays = 0;
  const current = new Date(d1.getTime());

  while (current < d2) {
    current.setDate(current.getDate() + 1);
    const day = current.getDay();
    if (day === 0 || day === 6) {
      weekendDays++;
    } else {
      businessDays++;
    }
  }

  // Calendar breakdown
  let years = d2.getFullYear() - d1.getFullYear();
  let months = d2.getMonth() - d1.getMonth();
  let days = d2.getDate() - d1.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    totalDays,
    businessDays,
    weekendDays,
    calendarYears: years,
    calendarMonths: months,
    calendarDays: days,
    isReversed,
  };
}

export interface TimeDurationResult {
  hours: number;
  minutes: number;
  totalMinutes: number;
  decimalHours: number;
  crossedMidnight: boolean;
}

export function calculateTimeDuration(startTime: string, endTime: string): TimeDurationResult {
  const [h1, m1] = startTime.split(':').map(Number);
  const [h2, m2] = endTime.split(':').map(Number);

  if (isNaN(h1) || isNaN(m1) || isNaN(h2) || isNaN(m2)) {
    throw new Error('Please provide valid 24-hour time strings (HH:MM).');
  }

  let startMins = h1 * 60 + m1;
  let endMins = h2 * 60 + m2;
  let crossedMidnight = false;

  if (endMins < startMins) {
    endMins += 24 * 60; // Crosses midnight
    crossedMidnight = true;
  }

  const diff = endMins - startMins;
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  const decimalHours = diff / 60;

  return {
    hours,
    minutes,
    totalMinutes: diff,
    decimalHours,
    crossedMidnight,
  };
}
