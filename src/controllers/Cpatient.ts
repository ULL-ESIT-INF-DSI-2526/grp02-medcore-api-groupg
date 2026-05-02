import { Request, Response } from 'express';
import { PatientService } from '../services/Spatient.js';

const service = new PatientService();

/**
 * Interfaz para los parametros de ruta que incluyen un ID.
 */
interface IdParam {
  id: string;
}

/**
 * Interfaz para las cadenas de consulta de busqueda de pacientes.
 */
interface PatientQuery {
  name?: string;
  idNumber?: string;
}

/**
 * Controlador para gestionar las operaciones de los pacientes.
 */
export class PatientController {
  /**
   * Crea un nuevo paciente en el sistema
   * @param req Peticion con el cuerpo del paciente
   * @param res Objeto de respuesta
   */
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const result = await service.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  /**
   * Busca pacientes por nombre o numero de identificacion mediante query string
   * @param req Peticion con parametros name o idNumber
   * @param res Objeto de respuesta
   */
  public async getByQuery(req: Request<{}, {}, {}, PatientQuery>, res: Response): Promise<void> {
    const { name, idNumber } = req.query;

    const query = name
      ? { fullName: new RegExp(name, 'i') }
      : idNumber
        ? { idNumber }
        : {};

    const results = await service.find(query);
    res.json(results);
  }

  /**
   * Obtiene un paciente especifico por su identificador unico de base de datos
   * @param req Peticion que contiene el parametro id
   * @param res Objeto de respuesta
   */
  public async getById(req: Request<IdParam>, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await service.findById(id);

    if (!result) {
      res.status(404).json({ message: 'Paciente no encontrado' });
      return;
    }
    res.json(result);
  }

  /**
   * Actualiza la informacion de un paciente buscando por su numero de identificacion
   * @param req Peticion con idNumber en query y cuerpo de actualizacion
   * @param res Objeto de respuesta
   */
  public async updateByQuery(req: Request<{}, {}, {}, PatientQuery>, res: Response): Promise<void> {
    const { idNumber } = req.query;
    if (!idNumber) {
      res.status(400).json({ message: 'El parametro idNumber es obligatorio' });
      return;
    }
    const result = await service.update({ idNumber }, req.body);
    res.json(result);
  }

  /**
   * Actualiza la informacion de un paciente usando su ID de base de datos
   * @param req Peticion con parametro id y cuerpo de actualizacion
   * @param res Objeto de respuesta
   */
  public async updateById(req: Request<IdParam>, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await service.update({ _id: id }, req.body);
    res.json(result);
  }

  /**
   * Elimina un paciente del sistema buscando por su numero de identificacion
   * @param req Peticion con parametro idNumber en la query
   * @param res Objeto de respuesta
   */
  public async deleteByQuery(req: Request<{}, {}, {}, PatientQuery>, res: Response): Promise<void> {
    const { idNumber } = req.query;
    if (!idNumber) {
      res.status(400).json({ message: 'El parametro idNumber es obligatorio' });
      return;
    }
    const result = await service.delete({ idNumber });
    res.json({ message: 'Paciente eliminado correctamente', result });
  }

  /**
   * Elimina un paciente del sistema usando su ID de base de datos
   * @param req Peticion con parametro id en la ruta
   * @param res Objeto de respuesta
   */
  public async deleteById(req: Request<IdParam>, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await service.delete({ _id: id });
    res.json({ message: 'Paciente eliminado correctamente', result });
  }
}