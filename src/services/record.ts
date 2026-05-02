import { Record, RecordDocument } from "../models/record.js";
import { Medication, MedicationDocument } from "../models/medication.js";
import { calculateTotal } from "../utils/calculateTotal.js";
import { validateStock } from "../utils/validateStock.js";

/**
 * Datos necesarios para crear un registro médico.
 */
interface CreateRecordInput {
  patient: string;
  doctor: string;
  medications: Array<{
    medication: string;
    quantity: number;
  }>;
  notes?: string;
}

/**
 * Medicamento procesado para el cálculo del importe.
 */
interface ProcessedMedication {
  medication: MedicationDocument;
  quantity: number;
}

/**
 * @class RecordService
 * Lógica de negocio para registros médicos.
 */
export class RecordService {
  /**
   * Crea un registro médico con validaciones de stock y cálculo de importe.
   */
  static async create(data: CreateRecordInput): Promise<RecordDocument> {
    const meds: ProcessedMedication[] = [];

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
   * Obtiene todos los registros.
   */
  static async getAll(): Promise<RecordDocument[]> {
    return Record.find().populate("patient doctor medications.medication");
  }

  /**
   * Cierra un registro médico.
   */
  static async close(id: string): Promise<RecordDocument | null> {
    return Record.findByIdAndUpdate(id, { status: "cerrado" }, { new: true });
  }
}
