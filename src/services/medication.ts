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
    return Medication.create(data);
  }

  /**
   * Obtiene todos los medicamentos.
   * @returns Lista de documentos MedicationDocument.
   */
  static async getAll(): Promise<MedicationDocument[]> {
    return Medication.find();
  }

  /**
   * Obtiene un medicamento por ID.
   * @returns El documento encontrado o null.
   */
  static async getById(id: string): Promise<MedicationDocument | null> {
    return Medication.findById(id);
  }

  /**
   * Obtiene medicamentos mediante query string.
   * Permite buscar por name, activeIngredient o nationalCode.
   */
  static async getByQuery(query: any): Promise<MedicationDocument[]> {
    return Medication.find(query);
  }

  /**
   * Actualiza un medicamento por ID.
   * @returns El documento actualizado o null.
   */
  static async update(
    id: string,
    data: Partial<MedicationDocument>
  ): Promise<MedicationDocument | null> {
    return Medication.findByIdAndUpdate(id, data, { new: true });
  }

  /**
   * Actualiza un medicamento mediante query string.
   * @returns El documento actualizado o null.
   */
  static async updateByQuery(
    query: any,
    data: Partial<MedicationDocument>
  ): Promise<MedicationDocument | null> {
    return Medication.findOneAndUpdate(query, data, { new: true });
  }

  /**
   * Elimina un medicamento por ID.
   * @returns El documento eliminado o null.
   */
  static async delete(id: string): Promise<MedicationDocument | null> {
    return Medication.findByIdAndDelete(id);
  }

  /**
   * Elimina un medicamento mediante query string.
   * @returns El documento eliminado o null.
   */
  static async deleteByQuery(query: any): Promise<MedicationDocument | null> {
    return Medication.findOneAndDelete(query);
  }

  /**
   * Verifica si un medicamento está caducado.
   * @returns true si está caducado.
   */
  static isExpired(medication: MedicationDocument): boolean {
    return isExpired(medication.expirationDate);
  }
}
