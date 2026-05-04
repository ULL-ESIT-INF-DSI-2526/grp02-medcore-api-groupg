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
   * Obtiene un registro por ID.
   */
  static async getById(id: string): Promise<RecordDocument | null> {
    return Record.findById(id).populate("patient doctor medications.medication");
  }

  /**
   * Obtiene registros por DNI del paciente.
   */
  static async getByQuery(query: any): Promise<RecordDocument[]> {
    return Record.find(query).populate("patient doctor medications.medication");
  }

  /**
   * Obtiene registros por rango de fechas y tipo.
   */
  static async getByDateRange(
    startDate: string,
    endDate: string,
    type?: string
  ): Promise<RecordDocument[]> {
    const filter: any = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

    if (type) filter.type = type;

    return Record.find(filter).populate("patient doctor medications.medication");
  }

  /**
   * Actualiza un registro por ID.
   */
  static async update(
    id: string,
    data: Partial<RecordDocument>
  ): Promise<RecordDocument | null> {
    return Record.findByIdAndUpdate(id, data, { new: true }).populate(
      "patient doctor medications.medication"
    );
  }

  /**
   * Cierra un registro médico.
   */
  static async close(id: string): Promise<RecordDocument | null> {
    return Record.findByIdAndUpdate(id, { status: "cerrado" }, { new: true });
  }

  /**
   * Elimina un registro médico.
   */
  static async delete(id: string): Promise<RecordDocument | null> {
    return Record.findByIdAndDelete(id);
  }
}
