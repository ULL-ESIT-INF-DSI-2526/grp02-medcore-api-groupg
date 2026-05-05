import { QueryFilter, UpdateQuery } from 'mongoose';
import { Medication, MedicationDocument } from "../models/medication.js";
import { isExpired } from "../utils/dateUtils.js";

/**
 * @class MedicationService
 * Contiene la lógica de negocio relacionada con medicamentos.
 */
export class MedicationService {
  /**
   * Crea un nuevo medicamento.
   * @returns El documento creado de tipo MedicationDocument.
   */
  static async create(data: Partial<MedicationDocument>): Promise<MedicationDocument> {
    return await Medication.create(data);
  }

  /**
   * Obtiene medicamentos mediante query string.
   * Permite buscar por name, activeIngredient o nationalCode.
   */
  static async find(query: QueryFilter<MedicationDocument>): Promise<MedicationDocument[]> {
    return await Medication.find(query);
  }

  /**
   * Obtiene un medicamento por ID.
   * @returns El documento encontrado o null.
   */
  static async findById(id: string): Promise<MedicationDocument | null> {
    return await Medication.findById(id);
  }

  /**
   * Actualiza un medicamento mediante query string.
   * @returns El documento actualizado o null.
   */
  static async update(
    query: QueryFilter<MedicationDocument>,
    data: UpdateQuery<MedicationDocument>
  ): Promise<MedicationDocument | null> {
    return await Medication.findOneAndUpdate(query, data, { 
      new: true,
      runValidators: true 
    });
  }

  /**
   * Elimina un medicamento mediante query string.
   * @returns El documento eliminado o null.
   */
  static async delete(query: QueryFilter<MedicationDocument>): Promise<MedicationDocument | null> {
    return await Medication.findOneAndDelete(query);
  }

  /**
   * Verifica si un medicamento está caducado.
   * @returns true si está caducado.
   */
  static isExpired(medication: MedicationDocument): boolean {
    return isExpired(medication.expirationDate);
  }
}