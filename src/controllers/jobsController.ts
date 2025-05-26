import { Request, Response } from 'express';
import db from '../db/knex.js';
import { scheduler } from '../services/schedulingService.js';
import { io } from '../server.js';
import type { Job } from '../models.js';

export const createJob = async (req: Request, res: Response) => {
  const j = req.body as Job;
  const [idObj] = await db('jobs')
    .insert({
      customer_name: j.customer_name,
      quote_number: j.quote_number,
      activity_type: j.activity_type,
      hours_required: j.hours_required,
      color_code: j.color_code,
      original_start_date_request: j.original_start_date_request
    })
    .returning('id');

  const job = await db('jobs').where('id', idObj.id).first();
  await scheduler.allocateJob(job, j.original_start_date_request!);
  io.emit('schedule_updated');
  res.status(201).json(job);
};

export const moveJob = async (req: Request, res: Response) => {
  const job = await db('jobs').where('id', req.params.id).first<Job>();
  if (!job) return res.status(404).json({ msg: 'Not found' });
  await scheduler.allocateJob(job, req.body.newStartDate);
  io.emit('schedule_updated');
  res.json({ ok: true });
};
