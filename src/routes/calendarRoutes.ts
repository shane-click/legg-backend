import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { addHoliday, listCalendar } from '../controllers/calendarController.js';
const r = Router();
r.use(protect);
r.post('/holiday', addHoliday);
r.get('/', listCalendar);
export default r;
