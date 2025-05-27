import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import jobsRoutes from './routes/jobsRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';

dotenv.config();

/* ───────────────────────── CORS ──────────────────────────
   Allow any Netlify sub-domain  */
const netlifyRegex = /https:\/\/.*\.netlify\.app$/;

const app = express();
app.use(
  cors({
    origin: netlifyRegex,   
    credentials: true,     
  })
);

app.use(express.json());

/* ─────────────────────── API routes ────────────────────── */
app.use('/api/jobs',   jobsRoutes);
app.use('/api/staff',  staffRoutes);
app.use('/api/calendar', calendarRoutes);

/* health check */
app.get('/', (_req, res) => res.send('LEGG Scheduler API live'));

export default app;
