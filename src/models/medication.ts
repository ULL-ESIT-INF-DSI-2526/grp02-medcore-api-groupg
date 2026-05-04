import { Schema, model, Document } from "mongoose";

/**
 * @interface MedicationDocument
 * Representa un medicamento almacenado en la base de datos.
 */
export interface MedicationDocument extends Document {
  name: string;
  activeIngredient: string;
  nationalCode: string;
  form:
    | "comprimido"
    | "capsula"
    | "solucion oral"
    | "solucion inyectable"
    | "pomada"
    | "parche"
    | "inhalador"
    | "otro";
  dose: number;
  unit: string;
  route:
    | "oral"
    | "intravenosa"
    | "intramuscular"
    | "subcutanea"
    | "topica"
    | "inhalatoria";
  stock: number;
  price: number;
  requiresPrescription: boolean;
  expirationDate: Date;
  contraindications: string[];
}

/**
 * Esquema Mongoose para la colección "medications".
 * Incluye validaciones estrictas.
 */
const MedicationSchema = new Schema<MedicationDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  activeIngredient: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  nationalCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  form: {
    type: String,
    required: true,
    enum: [
      "comprimido",
      "capsula",
      "solucion oral",
      "solucion inyectable",
      "pomada",
      "parche",
      "inhalador",
      "otro",
    ],
  },
  dose: {
    type: Number,
    required: true,
    min: 1,
  },
  unit: {
    type: String,
    required: true,
    trim: true,
  },
  route: {
    type: String,
    required: true,
    enum: [
      "oral",
      "intravenosa",
      "intramuscular",
      "subcutanea",
      "topica",
      "inhalatoria",
    ],
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  requiresPrescription: {
    type: Boolean,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  contraindications: {
    type: [String],
    default: [],
  },
});

/**
 * Modelo Mongoose para interactuar con la colección "medications".
 */
export const Medication = model<MedicationDocument>(
  "Medication",
  MedicationSchema,
);
