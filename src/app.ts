import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jobsRoutes from './routes/jobsRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use('/api/jobs', jobsRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/calendar', calendarRoutes);

app.get('/', (_req, res) => res.send('LEGG Scheduler API live')); // health‑check

export default app;
