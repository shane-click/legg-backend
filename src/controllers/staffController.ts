import { Request, Response } from 'express';
import db from '../db/knex.js';

export const addStaff = async (req: Request, res: Response) => {
  const { name, default_daily_capacity } = req.body;
  const [s] = await db('staff').insert({ name, default_daily_capacity }).returning('*');
  res.status(201).json(s);
};
export const listStaff = (_req: Request, res: Response) => db('staff').then(r => res.json(r));
