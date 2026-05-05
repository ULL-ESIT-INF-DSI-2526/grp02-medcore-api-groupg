import { Schema, model, Document } from "mongoose";

/**
 * @interface IStaff
 * @description Reprecenta un trabajador almacenado en la base de datos.
 */
export interface IStaff extends Document {
  fullName: string;
  collegiateNumber: string;
  specialty:
    | "general"
    | "cardiology"
    | "traumatology"
    | "pediatrics"
    | "oncology"
    | "emergency";
  category:
    | "attending"
    | "resident"
    | "nurse"
    | "nursing_assistant"
    | "head_of_service";
  shift: "morning" | "afternoon" | "night" | "rotating";
  assignedConsultation: string;
  yearsOfExperience: number;
  departmentContact: string;
  status: "active" | "inactive";
}

/**
 * @description Esquema Mongoose para la colección "Staff"
 * Incluye validaciones estrictas.
 */
const staffSchema = new Schema<IStaff>({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  collegiateNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  specialty: {
    type: String,
    enum: [
      "general",
      "cardiology",
      "traumatology",
      "pediatrics",
      "oncology",
      "emergency",
    ],
    required: true,
  },
  category: {
    type: String,
    enum: [
      "attending",
      "resident",
      "nurse",
      "nursing_assistant",
      "head_of_service",
    ],
    required: true,
  },
  shift: {
    type: String,
    enum: ["morning", "afternoon", "night", "rotating"],
    required: true,
  },
  assignedConsultation: {
    type: String,
    required: true,
    trim: true,
  },
  yearsOfExperience: {
    type: Number,
    min: 0,
    trim: true,
  },
  departmentContact: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

export const Staff = model<IStaff>("Staff", staffSchema);
