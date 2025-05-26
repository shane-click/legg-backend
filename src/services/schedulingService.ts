/* eslint-disable no-await-in-loop */
import db from '../db/knex.js';
import { nextWorkDay, isValidWorkDay, ymd } from '../utils/dateUtils.js';
import type { Job, JobAllocation, StaffAssignment } from '../models.js';
import { addDays, parseISO } from 'date-fns';

class Scheduler {
  private async holidays(start: string, end: string) {
    const recs = await db('calendar_days')
      .where('is_working_day', false)
      .whereBetween('date', [start, end])
      .select('date');
    return recs.map((r: any) => ymd(r.date));
  }

  private async capacity(date: string) {
    const list: StaffAssignment[] = await db('day_staff_assignments as d')
      .join('staff as s', 's.id', 'd.staff_id')
      .where('d.assignment_date', date)
      .select('s.default_daily_capacity', 'd.day_capacity_override');
    return list.reduce(
      (sum, a) => sum + parseFloat((a.day_capacity_override ?? a.default_daily_capacity) as string),
      0
    );
  }

  private async allocated(date: string) {
    const r = await db('job_allocations').where('allocation_date', date).sum('allocated_hours as t');
    return parseFloat(r[0]?.t ?? '0');
  }

  public async allocateJob(job: Job, start: string): Promise<JobAllocation[]> {
    await db('job_allocations').where('job_id', job.id!).del();

    let current = start;
    const oneYrLater = ymd(addDays(parseISO(start), 365));
    const hols = await this.holidays(start, oneYrLater);

    while (!isValidWorkDay(current, hols)) current = nextWorkDay(current, hols);

    let hrs = job.hours_required;
    const allocs: JobAllocation[] = [];

    while (hrs > 0) {
      const dayCap = await this.capacity(current);
      const used = await this.allocated(current);
      const free = Math.max(0, dayCap - used);
      if (free > 0) {
        const take = Math.min(hrs, free);
        allocs.push({ job_id: job.id!, allocation_date: current, allocated_hours: take });
        hrs -= take;
      }
      if (hrs > 0) current = nextWorkDay(current, hols);
      if (allocs.length > 730)
        throw new Error(`Job ${job.id} still not placed after 2y; aborting.`);
    }

    if (allocs.length)
      await db('job_allocations').insert(
        allocs.map(a => ({ ...a, allocated_hours: a.allocated_hours.toString() }))
      );

    await db('jobs').where('id', job.id!).update({ status: 'Scheduled' });
    return allocs;
  }
}
export const scheduler = new Scheduler();
