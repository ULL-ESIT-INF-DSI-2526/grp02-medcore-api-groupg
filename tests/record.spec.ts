import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";

import { Patient } from "../src/models/patient.js";
import { Staff } from "../src/models/staff.js";
import { Medication } from "../src/models/medication.js";
import { Record } from "../src/models/record.js";

interface PatientTest {
  _id?: string;
  fullName: string;
  birthDate: Date | string;
  idNumber: string;
  socialSecurityNumber: string;
  gender: "male" | "female" | "other";
  contact: {
    address: string;
    phone: string;
    email: string;
  };
  bloodType: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "0+" | "0-";
  status: "active" | "inactive" | "deceased";
}

interface StaffTest {
  _id?: string;
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
  departmentContact: string;
  yearsOfExperience: number;
  status: "active" | "inactive";
}

interface MedicationTest {
  _id?: string;
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
  expirationDate: Date | string;
}


let patientDoc;
let doctorDoc;
let medDoc;

const basePatient: PatientTest = {
  fullName: "Test Patient",
  birthDate: "1990-01-01T00:00:00.000Z",
  idNumber: "TEST123",
  socialSecurityNumber: "SS001",
  gender: "female",
  contact: { address: "Calle Test", phone: "600000000", email: "test@patient.com" },
  bloodType: "A+",
  status: "active"
};

const baseDoctor: StaffTest = {
  fullName: "Test Doctor",
  collegiateNumber: "COLTEST",
  specialty: "cardiology",
  category: "attending",
  shift: "morning",
  assignedConsultation: "101",
  departmentContact: "200",
  yearsOfExperience: 5,
  status: "active",
};

const baseMedication: MedicationTest = {
  name: "TestMed",
  activeIngredient: "TestIngredient",
  nationalCode: "MED001",
  form: "comprimido",
  dose: 500,
  unit: "mg",
  route: "oral",
  stock: 10,
  price: 2,
  requiresPrescription: false,
  expirationDate: "2030-01-01T00:00:00.000Z",
};

async function createRecord() {
  return await Record.create({
    patient: patientDoc._id,
    doctor: doctorDoc._id,
    type: "consulta",
    reason: "Dolor fuerte",
    diagnosis: "Migraña",
    medications: [
      {
        medication: medDoc._id,
        quantity: 1,
        posology: "1 cada 8h"
      }
    ],
    totalAmount: medDoc.price,
    status: "abierto"
  });
}

describe.sequential("Operaciones CRUD para /records", () => {

  beforeEach(async () => {
    await Record.deleteMany({});
    await Patient.deleteMany({});
    await Staff.deleteMany({});
    await Medication.deleteMany({});

    patientDoc = await Patient.create(basePatient);
    doctorDoc = await Staff.create(baseDoctor);
    medDoc = await Medication.create(baseMedication);

    await createRecord();
  });

  test("Debe devolver registros filtrando por idNumber del paciente", async () => {
    const res = await request(app)
      .get(`/records?idNumber=${patientDoc.idNumber}`)
      .expect(200);

    expect(res.body.length).toBe(1);
  });

  test("Debe devolver un registro especifico por su ID", async () => {
    const list = await request(app)
      .get(`/records?idNumber=${patientDoc.idNumber}`)
      .expect(200);

    const id = list.body[0]._id;

    const res = await request(app)
      .get(`/records/${id}`)
      .expect(200);

    expect(res.body.diagnosis).toBe("Migraña");
  });

  test("Debe crear un registro correctamente y descontar stock", async () => {
    const res = await request(app)
      .post("/records")
      .send({
        patientIdNumber: patientDoc.idNumber,
        doctorCollegiateNumber: doctorDoc.collegiateNumber,
        type: "consulta",
        reason: "Revision",
        diagnosis: "Sano",
        medications: [
          { nationalCode: medDoc.nationalCode, quantity: 2, posology: "1 cada 12h" }
        ]
      })
      .expect(201);

    const updatedMed = await Medication.findOne({ nationalCode: medDoc.nationalCode });

    expect(updatedMed!.stock).toBe(8);
  });

  test("Debe eliminar un registro y restaurar el stock de los medicamentos", async () => {
    const list = await request(app)
      .get(`/records?idNumber=${patientDoc.idNumber}`)
      .expect(200);

    const id = list.body[0]._id;

    await request(app)
      .delete(`/records/${id}`)
      .expect(200);

    const restoredMed = await Medication.findOne({ nationalCode: medDoc.nationalCode });

    expect(restoredMed!.stock).toBe(11);
  });
});
