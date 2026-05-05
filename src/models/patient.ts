import { Schema, model, Document } from "mongoose";

/**
 * @interface IPatient
 * @description Representa un paciente almacenado en la base de datos.
 */
export interface IPatient extends Document {
  fullName: string;
  birthDate: Date;
  idNumber: string;
  socialSecurityNumber: string;
  gender: "male" | "female" | "other";
  contact: {
    address: string;
    phone: string;
    email: string;
  };
  allergies: string[];
  bloodType: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "0+" | "0-";
  status: "active" | "inactive" | "deceased";
}

/**
 * @description Esquema Mongoose para la colección "Patients"
 * Incluye validaciones estrictas.
 */
const patientSchema = new Schema<IPatient>({
  fullName: {
    type: String,
    required: true,
    minlength: 3,
    trim: true,
  },
  birthDate: {
    type: Date,
    required: true,
    trim: true
  },
  idNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  socialSecurityNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  contact: {
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      trim: true,
    },
  },
  allergies: {
    type: [String],
    default: [],
  },
  bloodType: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "0+", "0-"],
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "deceased"],
    default: "active",
  },
});

export const Patient = model<IPatient>("Patient", patientSchema);
