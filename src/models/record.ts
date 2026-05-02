import { Schema, model, Document, Types } from "mongoose";

/**
 * @interface PrescribedMedication
 * @description Representa un medicamento prescrito dentro de un registro médico.
 */
export interface PrescribedMedication {
  medication: Types.ObjectId;
  quantity: number;
  posology: string;
}

/**
 * @interface RecordDocument
 * @description Representa un registro médico (consulta o ingreso).
 * Contiene referencias a paciente, médico, medicamentos y datos clínicos.
 */
export interface RecordDocument extends Document {
  patient: Types.ObjectId;
  doctor: Types.ObjectId;
  type: "consulta" | "ingreso";
  startDate: Date;
  endDate?: Date;
  reason: string;
  diagnosis: string;
  medications: PrescribedMedication[];
  totalAmount: number;
  status: "abierto" | "cerrado";
}

/**
 * @description Subesquema para medicamentos prescritos dentro de un registro.
 */
const PrescribedMedicationSchema = new Schema<PrescribedMedication>({
  medication: {
    type: Schema.Types.ObjectId,
    ref: "Medication",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  posology: {
    type: String,
    required: true,
    trim: true,
  },
});

/**
 * @description Esquema principal para la colección "records".
 * Incluye referencias, fechas automáticas y validaciones clínicas.
 */
const RecordSchema = new Schema<RecordDocument>({
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "Staff",
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["consulta", "ingreso"],
  },
  startDate: {
    type: Date,
    default: () => new Date(),
  },
  endDate: {
    type: Date,
  },
  reason: {
    type: String,
    required: true,
    trim: true,
  },
  diagnosis: {
    type: String,
    required: true,
    trim: true,
  },
  medications: {
    type: [PrescribedMedicationSchema],
    default: [],
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    required: true,
    enum: ["abierto", "cerrado"],
    default: "abierto",
  },
});

/**
 * @description Modelo Mongoose para interactuar con la colección "records".
 */
export const Record = model<RecordDocument>("Record", RecordSchema);
