import { Request, Response, NextFunction } from "express";
import { MedicationService } from "../services/medication.js";

/**
 * @class MedicationController
 * Controlador para gestionar medicamentos.
 */
export class MedicationController {
  static async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const medication = await MedicationService.create(req.body);
      res.status(201).json(medication);
    } catch (err) {
      next(err);
    }
  }

  static async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const meds = await MedicationService.getAll();
      res.json(meds);
    } catch (err) {
      next(err);
    }
  }
}
