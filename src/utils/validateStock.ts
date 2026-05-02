import { MedicationDocument } from "../models/medication.js";

/**
 * @function validateStock
 * Comprueba si un medicamento tiene stock suficiente.
 * @param medication Documento del medicamento.
 * @param quantity Cantidad requerida.
 * @returns true si hay stock suficiente.
 */
export function validateStock(
  medication: MedicationDocument,
  quantity: number,
): boolean {
  return medication.stock >= quantity;
}
