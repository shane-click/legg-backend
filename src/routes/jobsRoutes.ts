import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createJob, moveJob } from '../controllers/jobsController.js';
const r = Router();
r.use(protect);
r.post('/', createJob);
r.put('/:id/move', moveJob);
export default r;
