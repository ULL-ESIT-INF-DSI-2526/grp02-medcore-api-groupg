import { Request, Response, NextFunction } from 'express';
import { QueryFilter } from 'mongoose';
import { IStaff } from '../models/staff.js';
import { StaffService } from '../services/Sstaff.js';

/**
 * Controlador para gestionar el personal medico mediante metodos estaticos
 */
export class StaffController {
  /**
   * Registra un nuevo miembro del personal en el hospital
   * @param req Peticion con el cuerpo del staff
   * @param res Objeto de respuesta
   * @param next Funcion para el siguiente middleware de error
   */
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const member = await StaffService.create(req.body);
      res.status(201).json(member);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Obtiene personal medico filtrando por nombre, especialidad o numero de colegiado
   * @param req Peticion con parametros name o idNumber
   * @param res Objeto de respuesta
   * @param next Funcion para el siguiente middleware de error
   */
  static async getByQuery(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const name = req.query.name as string;
      const specialty = req.query.specialty as string;
      const collegiateNumber = req.query.collegiateNumber as string;
      const mongoQuery: QueryFilter<IStaff> = {};

      if (name) mongoQuery.fullName = new RegExp(name, 'i');
      if (specialty) mongoQuery.specialty = specialty as IStaff['specialty'];
      if (collegiateNumber) mongoQuery.collegiateNumber = collegiateNumber;

      const results = await StaffService.find(mongoQuery);
      res.json(results);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Busca un miembro del personal por su ID
   * @param req Peticion que contiene el parametro id en la ruta
   * @param res Objeto de respuesta
   * @param next Funcion para el siguiente middleware de error
   */
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const member = await StaffService.findById(id);

      if (!member) {
        res.status(404).json({ error: 'Miembro del personal no encontrado' });
        return;
      }
      res.json(member);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Actualiza la informacion de un miembro por su ID de base de datos
   * @param req Peticion con parametro id y cuerpo de actualizacion
   * @param res Objeto de respuesta
   * @param next Funcion para el siguiente middleware de error
   */
  static async updateById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const updated = await StaffService.update({ _id: id }, req.body);

      if (!updated) {
        res.status(404).json({ error: 'Miembro del personal no encontrado' });
        return;
      }
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Actualiza la informacion de un miembro buscando por numero de colegiado
   * @param req Peticion con collegiateNumber en query y cuerpo de actualizacion
   * @param res Objeto de respuesta
   * @param next Funcion para el siguiente middleware de error
   */
  static async updateByQuery(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const collegiateNumber = req.query.collegiateNumber as string;

      if (!collegiateNumber) {
        res.status(400).json({ error: 'El parametro collegiateNumber es obligatorio' });
        return;
      }

      const updated = await StaffService.update({ collegiateNumber }, req.body);

      if (!updated) {
        res.status(404).json({ error: 'Miembro del personal no encontrado' });
        return;
      }
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Elimina un miembro del personal por su ID
   * @param req Peticion con el parametro id en la ruta
   * @param res Objeto de respuesta
   * @param next Funcion para el siguiente middleware de error
   */
  static async deleteById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const deleted = await StaffService.delete({ _id: id });

      if (!deleted) {
        res.status(404).json({ error: 'Miembro del personal no encontrado' });
        return;
      }
      res.json({ message: 'Miembro eliminado correctamente', deleted });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Elimina un miembro del personal buscando por numero de colegiado
   * @param req Peticion con el parametro collegiateNumber en la consulta
   * @param res Objeto de respuesta
   * @param next Funcion para el siguiente middleware de error
   */
  static async deleteByQuery(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const collegiateNumber = req.query.collegiateNumber as string;

      if (!collegiateNumber) {
        res.status(400).json({ error: 'El parametro collegiateNumber es obligatorio' });
        return;
      }

      const deleted = await StaffService.delete({ collegiateNumber });

      if (!deleted) {
        res.status(404).json({ error: 'Miembro del personal no encontrado' });
        return;
      }
      res.json({ message: 'Miembro eliminado correctamente', deleted });
    } catch (err) {
      next(err);
    }
  }
}