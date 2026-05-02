import { Request, Response, NextFunction } from 'express';
import { RecordService } from '../services/record.js';

/**
 * @class RecordController
 * Controlador para gestionar registros médicos.
 */
export class RecordController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await RecordService.create(req.body);
      res.status(201).json(record);
    } catch (err) {
      next(err);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const records = await RecordService.getAll();
      res.json(records);
    } catch (err) {
      next(err);
    }
  }
}
