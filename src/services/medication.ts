import { Medication } from '../models/medication.js';
import { isExpired } from '../utils/dateUtils.js';

/**
 * @class MedicationService
 * @description Contiene la lógica de negocio relacionada con medicamentos.
 */
export class MedicationService {
  /**
   * @description Crea un nuevo medicamento.
   */
  static async create(data: any) {
    return Medication.create(data);
  }

  /**
   * @description Obtiene todos los medicamentos.
   */
  static async getAll() {
    return Medication.find();
  }

  /**
   * @description Obtiene un medicamento por ID.
   */
  static async getById(id: string) {
    return Medication.findById(id);
  }

  /**
   * @description Actualiza un medicamento.
   */
  static async update(id: string, data: any) {
    return Medication.findByIdAndUpdate(id, data, { new: true });
  }

  /**
   * @description Elimina un medicamento.
   */
  static async delete(id: string) {
    return Medication.findByIdAndDelete(id);
  }

  /**
   * @description Verifica si un medicamento está caducado.
   */
  static isExpired(medication: any): boolean {
    return isExpired(medication.expirationDate);
  }
}
