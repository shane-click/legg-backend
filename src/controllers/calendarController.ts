import { Request, Response } from 'express';
import db from '../db/knex.js';

export const addHoliday = async (req: Request, res: Response) => {
  const { date, description } = req.body;
  await db('calendar_days').insert({ date, is_working_day: false, description });
  res.status(201).json({ ok: true });
};
export const listCalendar = (_req: Request, res: Response) =>
  db('calendar_days').then(d => res.json(d));
