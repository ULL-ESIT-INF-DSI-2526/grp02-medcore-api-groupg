import { Request, Response, NextFunction } from 'express';
import { QueryFilter } from 'mongoose';
import { IPatient } from '../models/patient.js';
import { PatientService } from '../services/Spatient.js';

/**
 * Controlador para gestionar pacientes 
 */
export class PatientController {
  /**
   * Crea un nuevo paciente en el sistema
   * @param req Peticion con el cuerpo del paciente
   * @param res Objeto de respuesta
   * @param next Funcion para el siguiente middleware de error
   */
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const patient = await PatientService.create(req.body);
      res.status(201).json(patient);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Obtiene pacientes mediante filtros proporcionados en la query
   * @param req Peticion con parametros name o idNumber
   * @param res Objeto de respuesta
   * @param next Funcion para el siguiente middleware de error
   */
  static async getByQuery(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const name = req.query.name as string;
      const idNumber = req.query.idNumber as string;
      const mongoQuery: QueryFilter<IPatient> = {};

      if (name) mongoQuery.fullName = new RegExp(name, 'i');
      if (idNumber) mongoQuery.idNumber = idNumber;

      const patients = await PatientService.find(mongoQuery);
      res.json(patients);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Obtiene un paciente especifico por su ID 
   * @param req Peticion que contiene el parametro id en la ruta
   * @param res Objeto de respuesta
   * @param next Funcion para el siguiente middleware de error
   */
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const patient = await PatientService.findById(id);

      if (!patient) {
        res.status(404).json({ error: 'Paciente no encontrado' });
        return;
      }

      res.json(patient);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Actualiza un paciente por su ID de base de datos
   * @param req Peticion con parametro id y cuerpo de actualizacion
   * @param res Objeto de respuesta
   * @param next Funcion para el siguiente middleware de error
   */
  static async updateById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const updated = await PatientService.update({ _id: id }, req.body);

      if (!updated) {
        res.status(404).json({ error: 'Paciente no encontrado' });
        return;
      }

      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Actualiza un paciente buscando por su numero de identificacion en la query
   * @param req Peticion con idNumber en query y cuerpo de actualizacion
   * @param res Objeto de respuesta
   * @param next Funcion para el siguiente middleware de error
   */
  static async updateByQuery(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idNumber = req.query.idNumber as string;

      if (!idNumber) {
        res.status(400).json({ error: 'El parametro idNumber es obligatorio' });
        return;
      }

      const updated = await PatientService.update({ idNumber }, req.body);

      if (!updated) {
        res.status(404).json({ error: 'Paciente no encontrado' });
        return;
      }

      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Elimina un paciente por su ID de base de datos
   * @param req Peticion con el parametro id en la ruta
   * @param res Objeto de respuesta
   * @param next Funcion para el siguiente middleware de error
   */
  static async deleteById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const deleted = await PatientService.delete({ _id: id });

      if (!deleted) {
        res.status(404).json({ error: 'Paciente no encontrado' });
        return;
      }

      res.json({ message: 'Paciente eliminado correctamente', deleted });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Elimina un paciente buscando por su numero de identificacion en la query
   * @param req Peticion con el parametro idNumber en la consulta
   * @param res Objeto de respuesta
   * @param next Funcion para el siguiente middleware de error
   */
  static async deleteByQuery(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idNumber = req.query.idNumber as string;

      if (!idNumber) {
        res.status(400).json({ error: 'El parametro idNumber es obligatorio' });
        return;
      }

      const deleted = await PatientService.delete({ idNumber });

      if (!deleted) {
        res.status(404).json({ error: 'Paciente no encontrado' });
        return;
      }

      res.json({ message: 'Paciente eliminado correctamente', deleted });
    } catch (err) {
      next(err);
    }
  }
}