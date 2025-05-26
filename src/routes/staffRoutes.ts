import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { addStaff, listStaff } from '../controllers/staffController.js';
const r = Router();
r.use(protect);
r.post('/', addStaff);
r.get('/', listStaff);
export default r;
