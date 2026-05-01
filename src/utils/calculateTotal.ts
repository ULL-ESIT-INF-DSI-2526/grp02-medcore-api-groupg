import { MedicationDocument } from "../models/medication.js";

/**
 * @function calculateTotal
 * @description Calcula el importe total de los medicamentos prescritos.
 * @param meds Lista de objetos con medicamento y cantidad.
 * @returns Importe total en euros.
 */
export function calculateTotal(
  meds: { medication: MedicationDocument; quantity: number }[],
): number {
  return meds.reduce((acc, item) => {
    return acc + item.medication.price * item.quantity;
  }, 0);
}
