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

  static async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id as string;
      const med = await MedicationService.getById(id);
      if (!med) {
        res.status(404).json({ error: "Medicamento no encontrado" });
        return;
      }
      res.json(med);
    } catch (err) {
      next(err);
    }
  }

  static async getByQuery(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const meds = await MedicationService.getByQuery(req.query);
      res.json(meds);
    } catch (err) {
      next(err);
    }
  }

  static async update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id as string;
      const med = await MedicationService.update(id, req.body);
      if (!med) {
        res.status(404).json({ error: "Medicamento no encontrado" });
        return;
      }
      res.json(med);
    } catch (err) {
      next(err);
    }
  }

  static async updateByQuery(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const med = await MedicationService.updateByQuery(req.query, req.body);
      if (!med) {
        res.status(404).json({ error: "Medicamento no encontrado" });
        return;
      }
      res.json(med);
    } catch (err) {
      next(err);
    }
  }

  static async delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id as string;
      const med = await MedicationService.delete(id);
      if (!med) {
        res.status(404).json({ error: "Medicamento no encontrado" });
        return;
      }
      res.json({ message: "Medicamento eliminado", med });
    } catch (err) {
      next(err);
    }
  }

  static async deleteByQuery(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const med = await MedicationService.deleteByQuery(req.query);
      if (!med) {
        res.status(404).json({ error: "Medicamento no encontrado" });
        return;
      }
      res.json({ message: "Medicamento eliminado", med });
    } catch (err) {
      next(err);
    }
  }
}
