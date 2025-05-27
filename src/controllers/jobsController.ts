import db from '../db/knex.js';
import { scheduler } from '../services/schedulingService.js';
import { io } from '../server.js';
import type { Request, Response } from 'express';

/* ─────────── POST /api/jobs ─────────── */
export const createJob = async (req: Request, res: Response) => {
  const j = req.body;
  const [id] = await db('jobs')
    .insert({ ...j })
    .returning('id');

  const job = await db('jobs').where('id', id.id).first();
  await scheduler.allocateJob(job, j.original_start_date_request);
  io.emit('schedule_updated');
  res.status(201).json(job);
};

/* ─────────── GET /api/jobs?startDate=&endDate= ─────────── */
export const getJobsForPeriod = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query as { startDate: string; endDate: string };
  const rows = await db('jobs as j')
    .leftJoin('job_allocations as ja', 'j.id', 'ja.job_id')
    .whereBetween('ja.allocation_date', [startDate, endDate])
    .select(
      'j.*',
      'ja.id as allocation_id',
      'ja.allocation_date',
      'ja.allocated_hours'
    )
    .orderBy('ja.allocation_date', 'asc');

  /* group allocations by job */
  const grouped: any = {};
  rows.forEach(r => {
    if (!grouped[r.id]) grouped[r.id] = { ...r, allocations: [] };
    if (r.allocation_id)
      grouped[r.id].allocations.push({
        id: r.allocation_id,
        allocation_date: r.allocation_date,
        allocated_hours: parseFloat(r.allocated_hours)
      });
  });

  res.json(Object.values(grouped));
};

/* ─────────── PUT /api/jobs/:id/move ─────────── */
export const moveJob = async (req: Request, res: Response) => {
  const job = await db('jobs').where('id', req.params.id).first();
  await scheduler.allocateJob(job, req.body.newStartDate);
  io.emit('schedule_updated');
  res.json({ ok: true });
};
