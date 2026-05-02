import { Request, Response, NextFunction } from "express";
import { RecordService } from "../services/record.js";

interface RecordQuery {
  patientDni?: string;
}

interface DateRangeQuery {
  startDate?: string;
  endDate?: string;
  type?: string;
}

/**
 * @class RecordController
 * Controlador para gestionar registros médicos.
 */
export class RecordController {
  /**
   * Crea un nuevo registro médico.
   */
  static async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const record = await RecordService.create(req.body);
      res.status(201).json(record);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Obtiene todos los registros.
   */
  static async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const records = await RecordService.getAll();
      res.json(records);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Obtiene un registro por ID.
   */
  static async getById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id;
      const record = await RecordService.getById(id);

      if (!record) {
        res.status(404).json({ error: "Registro no encontrado" });
        return;
      }

      res.json(record);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Obtiene registros por DNI del paciente.
   */
  static async getByQuery(
    req: Request<{}, {}, {}, RecordQuery>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { patientDni } = req.query;

      const query = patientDni ? { patientDni } : {};

      const records = await RecordService.getByQuery(query);
      res.json(records);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Obtiene registros por rango de fechas y tipo.
   */
  static async getByDateRange(
    req: Request<{}, {}, {}, DateRangeQuery>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { startDate, endDate, type } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({ error: "startDate y endDate son obligatorios" });
        return;
      }

      const records = await RecordService.getByDateRange(startDate, endDate, type);
      res.json(records);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Actualiza un registro por ID.
   */
  static async update(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id;
      const updated = await RecordService.update(id, req.body);

      if (!updated) {
        res.status(404).json({ error: "Registro no encontrado" });
        return;
      }

      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Cierra un registro médico.
   */
  static async close(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id;
      const closed = await RecordService.close(id);

      if (!closed) {
        res.status(404).json({ error: "Registro no encontrado" });
        return;
      }

      res.json(closed);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Elimina un registro médico.
   */
  static async delete(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id;
      const deleted = await RecordService.delete(id);

      if (!deleted) {
        res.status(404).json({ error: "Registro no encontrado" });
        return;
      }

      res.json({ message: "Registro eliminado correctamente", deleted });
    } catch (err) {
      next(err);
    }
  }
}