// TEMPORARY: authentication bypass
import type { Request, Response, NextFunction } from 'express';

/** Simply lets every request through */
export const protect = (_req: Request, _res: Response, next: NextFunction) => next();
