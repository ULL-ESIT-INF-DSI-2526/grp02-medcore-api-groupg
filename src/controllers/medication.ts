import { Request, Response, NextFunction } from "express";
import { MedicationService } from "../services/medication.js";

export class MedicationController {
  /**
   * Crea un nuevo medicamento.
   */
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const medication = await MedicationService.create(req.body);
      res.status(201).json(medication);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtiene medicamentos mediante query string.
   * Ej: /medications?name=Ibuprofeno
   */
  static async find(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const medications = await MedicationService.find(req.query);
      res.json(medications);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtiene un medicamento por ID.
   */
  static async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const medication = await MedicationService.findById(id);

      if (!medication) {
        res.status(404).json({ message: "Medication not found" });
        return;
      }

      res.json(medication);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualiza un medicamento mediante query string.
   * Ej: /medications?name=Ibuprofeno
   */
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await MedicationService.update(req.query, req.body);

      if (!updated) {
        res.status(404).json({ message: "Medication not found" });
        return;
      }

      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Elimina un medicamento mediante query string.
   * Ej: /medications?nationalCode=12345
   */
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await MedicationService.delete(req.query);

      if (!deleted) {
        res.status(404).json({ message: "Medication not found" });
        return;
      }

      res.json({ message: "Medication deleted successfully", deleted });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verifica si un medicamento está caducado.
   */
  static async isExpired(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const medication = await MedicationService.findById(id);

      if (!medication) {
        res.status(404).json({ message: "Medication not found" });
        return;
      }

      const expired = MedicationService.isExpired(medication);
      res.json({ expired });
    } catch (error) {
      next(error);
    }
  }
}
