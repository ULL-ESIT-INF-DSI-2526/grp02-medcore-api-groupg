import { Record } from '../models/record.js';
import { Medication } from '../models/medication.js';
import { calculateTotal } from '../utils/calculateTotal.js';
import { validateStock } from '../utils/validateStock.js';

/**
 * @class RecordService
 * @description Lógica de negocio para registros médicos.
 */
export class RecordService {
  /**
   * @description Crea un registro médico con validaciones de stock y cálculo de importe.
   */
  static async create(data: any) {
    const meds = [];

    for (const item of data.medications) {
      const medication = await Medication.findById(item.medication);

      if (!medication) {
        throw new Error(`Medicamento no encontrado: ${item.medication}`);
      }

      if (!validateStock(medication, item.quantity)) {
        throw new Error(`Stock insuficiente para ${medication.name}`);
      }

      medication.stock -= item.quantity;
      await medication.save();

      meds.push({ medication, quantity: item.quantity });
    }

    const totalAmount = calculateTotal(meds);

    return Record.create({
      ...data,
      totalAmount,
    });
  }

  /**
   * @description Obtiene todos los registros.
   */
  static async getAll() {
    return Record.find().populate('patient doctor medications.medication');
  }

  /**
   * @description Cierra un registro médico.
   */
  static async close(id: string) {
    return Record.findByIdAndUpdate(id, { status: 'cerrado' }, { new: true });
  }
}
