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

describe.sequential("CRUD /records (tests ampliados)", () => {

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


  test("GET /records debe devolver todos los registros si no hay filtros", async () => {
    const res = await request(app).get("/records").expect(200);
    expect(res.body.length).toBe(1);
  });

  test("GET /records debe devolver registros filtrando por idNumber", async () => {
    const res = await request(app)
      .get(`/records?idNumber=${patientDoc.idNumber}`)
      .expect(200);

    expect(res.body.length).toBe(1);
  });

  test("GET /records debe devolver 404 si el paciente no existe", async () => {
    await request(app)
      .get("/records?idNumber=NO_EXISTE")
      .expect(404);
  });

  test("GET /records/:id debe devolver un registro por ID", async () => {
    const list = await request(app)
      .get(`/records?idNumber=${patientDoc.idNumber}`)
      .expect(200);

    const id = list.body[0]._id;

    const res = await request(app)
      .get(`/records/${id}`)
      .expect(200);

    expect(res.body.diagnosis).toBe("Migraña");
  });

  test("GET /records/:id debe devolver 404 si no existe", async () => {
    await request(app)
      .get("/records/000000000000000000000000")
      .expect(404);
  });

  test("GET /records/:id debe devolver 400 si el ID es inválido", async () => {
    await request(app)
      .get("/records/INVALIDO")
      .expect(400);
  });


  test("POST debe crear un registro y descontar stock", async () => {
    await request(app)
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

  test("POST debe fallar si el paciente no existe", async () => {
    await request(app)
      .post("/records")
      .send({
        patientIdNumber: "NO_EXISTE",
        doctorCollegiateNumber: doctorDoc.collegiateNumber,
        type: "consulta",
        reason: "test",
        diagnosis: "test",
        medications: []
      })
      .expect(404);
  });

  test("POST debe fallar si el doctor no existe", async () => {
    await request(app)
      .post("/records")
      .send({
        patientIdNumber: patientDoc.idNumber,
        doctorCollegiateNumber: "NO_EXISTE",
        type: "consulta",
        reason: "test",
        diagnosis: "test",
        medications: []
      })
      .expect(404);
  });

  test("POST debe fallar si medications no es un array", async () => {
    await request(app)
      .post("/records")
      .send({
        patientIdNumber: patientDoc.idNumber,
        doctorCollegiateNumber: doctorDoc.collegiateNumber,
        type: "consulta",
        reason: "test",
        diagnosis: "test",
        medications: "NO_ARRAY"
      })
      .expect(400);
  });

  test("POST debe fallar si el medicamento no existe", async () => {
    await request(app)
      .post("/records")
      .send({
        patientIdNumber: patientDoc.idNumber,
        doctorCollegiateNumber: doctorDoc.collegiateNumber,
        type: "consulta",
        reason: "test",
        diagnosis: "test",
        medications: [
          { nationalCode: "NO_EXISTE", quantity: 1, posology: "test" }
        ]
      })
      .expect(404);
  });

  test("POST debe fallar si el medicamento está caducado", async () => {
    const expired = await Medication.create({
      ...baseMedication,
      nationalCode: "EXPIRED",
      expirationDate: "2000-01-01T00:00:00.000Z"
    });

    await request(app)
      .post("/records")
      .send({
        patientIdNumber: patientDoc.idNumber,
        doctorCollegiateNumber: doctorDoc.collegiateNumber,
        type: "consulta",
        reason: "test",
        diagnosis: "test",
        medications: [
          { nationalCode: expired.nationalCode, quantity: 1, posology: "test" }
        ]
      })
      .expect(409);
  });

  test("POST debe fallar si no hay stock suficiente", async () => {
    await request(app)
      .post("/records")
      .send({
        patientIdNumber: patientDoc.idNumber,
        doctorCollegiateNumber: doctorDoc.collegiateNumber,
        type: "consulta",
        reason: "test",
        diagnosis: "test",
        medications: [
          { nationalCode: medDoc.nationalCode, quantity: 999, posology: "test" }
        ]
      })
      .expect(409);
  });


  test("DELETE debe eliminar un registro y restaurar stock", async () => {
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

  test("DELETE debe devolver 404 si no existe", async () => {
    await request(app)
      .delete("/records/000000000000000000000000")
      .expect(404);
  });

  test("DELETE debe devolver 400 si el ID es inválido", async () => {
    await request(app)
      .delete("/records/INVALIDO")
      .expect(400);
  });
});