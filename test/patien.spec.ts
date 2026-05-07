import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { Patient } from "../src/models/patient.js";

const firstPatient = {
  fullName: "Juan Pérez",
  birthDate: "1990-05-15T00:00:00.000Z",
  idNumber: "12345678A",
  socialSecurityNumber: "SS123456",
  gender: "male",
  contact: {
    address: "Calle Falsa 123",
    phone: "600123456",
    email: "juan@example.com"
  },
  bloodType: "A+",
  status: "active"
};

beforeEach(async () => {
  await Patient.deleteMany();
  await new Patient(firstPatient).save();
});

describe("Operaciones CRUD para /patients", () => {

  test("Debe crear un nuevo paciente correctamente", async () => {
    const newPatient = {
      fullName: "Maria Garcia",
      birthDate: "1985-10-20T00:00:00.000Z",
      idNumber: "87654321B",
      socialSecurityNumber: "SS876543",
      gender: "female",
      contact: {
        address: "Avenida Central 45",
        phone: "611987654",
        email: "maria@example.com"
      },
      bloodType: "0-",
      status: "active"
    };

    const response = await request(app)
      .post("/patients")
      .send(newPatient)
      .expect(201);

    expect(response.body).to.include({
      fullName: "Maria Garcia",
      idNumber: "87654321B"
    });

    const patientInDb = await Patient.findById(response.body._id);
    expect(patientInDb).not.toBe(null);
  });

  test("Debe obtener un paciente mediante su idNumber", async () => {
    const response = await request(app)
      .get("/patients?idNumber=12345678A")
      .expect(200);

    expect(response.body[0].fullName).to.equal("Juan Pérez");
  });

  test("Debe devolver 404 si el paciente buscado por query no existe", async () => {
    await request(app)
      .get("/patients?idNumber=NONEXISTENT")
      .expect(404);
  });

  test("Debe actualizar un paciente mediante idNumber en la query", async () => {
    const response = await request(app)
      .patch("/patients?idNumber=12345678A")
      .send({ fullName: "Juan Pérez Modificado" })
      .expect(200);

    expect(response.body.fullName).to.equal("Juan Pérez Modificado");
  });

  test("Debe eliminar un paciente por su identificador unico de base de datos", async () => {
    const existing = await Patient.findOne({ idNumber: "12345678A" });
    await request(app)
      .delete(`/patients/${existing!._id}`)
      .expect(200);

    const checkDb = await Patient.findById(existing!._id);
    expect(checkDb).toBe(null);
  });
});