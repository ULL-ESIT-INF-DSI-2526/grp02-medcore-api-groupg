import { Patient, IPatient } from '../models/patient.js';

/**
 * Clase de servicio para gestionar operaciones de pacientes
 */
export class PatientService {
  /**
   * Crea un nuevo paciente en la base de datos
   * @param data Datos del paciente
   * @returns Documento del paciente creado
   */
  static async create(data: Partial<IPatient>): Promise<IPatient> {
    return await Patient.create(data);
  }

  /**
   * Busca pacientes segun un filtro
   * @param query Criterios de busqueda
   * @returns Lista de pacientes encontrados
   */
  static async find(query: object): Promise<IPatient[]> {
    return await Patient.find(query);
  }

  /**
   * Busca un paciente por su ID
   * @param id Identificador de la base de datos
   * @returns Paciente encontrado o null
   */
  static async findById(id: string): Promise<IPatient | null> {
    return await Patient.findById(id);
  }

  /**
   * Actualiza un paciente segun el filtro
   * @param query Criterio de busqueda
   * @param data Datos a actualizar
   * @returns Paciente actualizado o null
   */
  static async update(query: object, data: Partial<IPatient>): Promise<IPatient | null> {
    return await Patient.findOneAndUpdate(query, data, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Elimina un paciente segun el filtro
   * @param query Criterio de busqueda
   * @returns Paciente eliminado o null
   */
  static async delete(query: object): Promise<IPatient | null> {
    return await Patient.findOneAndDelete(query);
  }
}