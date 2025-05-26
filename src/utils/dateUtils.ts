import { format, parseISO, addDays, getDay, isWeekend, isValid } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

const MEL_TZ = 'Australia/Melbourne';
export const toMel = (d: Date | string) =>
  typeof d === 'string' ? utcToZonedTime(parseISO(d), MEL_TZ) : utcToZonedTime(d, MEL_TZ);
export const ymd = (d: Date) => format(utcToZonedTime(d, MEL_TZ), 'yyyy-MM-dd');

export const nextWorkDay = (d: string | Date, holidays: string[] = []): string => {
  let dt = typeof d === 'string' ? parseISO(d) : d;
  dt = addDays(dt, 1);
  while (true) {
    const s = ymd(dt);
    if (!isWeekend(dt) && !holidays.includes(s)) return s;
    dt = addDays(dt, 1);
  }
};

export const isValidWorkDay = (s: string, holidays: string[] = []) => {
  const d = parseISO(s);
  return isValid(d) && !isWeekend(d) && !holidays.includes(s);
};
