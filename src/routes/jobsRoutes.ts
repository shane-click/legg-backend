import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';

import {
  createJob,
  getJobsForPeriod,
  moveJob
} from '../controllers/jobsController.js';

const router = Router();

router.use(protect);

router.post('/', createJob);          // POST /api/jobs
router.get('/',  getJobsForPeriod);   // GET  /api/jobs?startDate=&endDate=
router.put('/:id/move', moveJob);     // PUT  /api/jobs/:id/move

export default router;
