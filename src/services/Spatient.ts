import { Patient, IPatient } from '../models/patient.js';

/**
 * Clase de servicios que gestiona las operaciones
 */
export class PatientService {
  /**
   * Crea un nuevo paciente en la base de
   * @param data Dato de objeto del paciente
   * @returns El documento creado 
   */
  public async create(data: Partial<IPatient>): Promise<IPatient> {
    return Patient.create(data);
  }

  /**
   * Encuentra el paciente basado en una consulta
   * @param query Criterio de busqueda
   * @returns Array de pacientes
   */
  public async find(query: object): Promise<IPatient[]> {
    return await Patient.find(query);
  }

  /**
   * Encuentra un unico paciente mediante un ID
   * @param id MongoDB ObjectId
   * @returns Documento del paciente o null
   */
  public async findById(id: string): Promise<IPatient | null> {
    return await Patient.findById(id);
  }

  /**
   * Actualiza a un paciente mediante una consulta
   * @param query Criterio de busqueda
   * @param data Dato para actualizar
   * @returns Actualiza el paciente o null
   */
  public async update(query: object, data: Partial<IPatient>): Promise<IPatient | null> {
    return await Patient.findOneAndUpdate(query, data, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Borra al paciente por busuqeda
   * @param query Criterio de busuqeda
   * @returns Documento eliminado o null
   */
  public async delete(query: object): Promise<IPatient | null> {
    return await Patient.findOneAndDelete(query);
  }
}