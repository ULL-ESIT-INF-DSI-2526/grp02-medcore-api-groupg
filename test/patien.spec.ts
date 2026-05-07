import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { Patient } from "../src/models/patient.js";

const firstPatient = {
  fullName: "Juan Perez",
  birthDate: "1990-05-15",
  idNumber: "12345678Z",
  socialSecurityNumber: "0101010101",
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
    const response = await request(app)
      .post("/patients")
      .send({
        fullName: "Maria Garcia",
        birthDate: "1985-10-20",
        idNumber: "87654321X",
        socialSecurityNumber: "0202020202",
        gender: "female",
        contact: {
          address: "Avenida Central 45",
          phone: "611987654",
          email: "maria@example.com"
        },
        bloodType: "0-",
        status: "active"
      })
      .expect(201);

    expect(response.body).to.include({
      fullName: "Maria Garcia",
      idNumber: "87654321X"
    });

    const patientInDb = await Patient.findById(response.body._id);
    expect(patientInDb).not.toBe(null);
    expect(patientInDb!.idNumber).to.equal("87654321X");
  });

  test("Debe obtener un paciente mediante query string (idNumber)", async () => {
    const response = await request(app)
      .get("/patients?idNumber=12345678Z")
      .expect(200);

    expect(response.body[0].fullName).to.equal("Juan Perez");
  });

  test("Debe devolver 404 si el paciente buscado no existe", async () => {
    await request(app)
      .get("/patients?idNumber=NONEXISTENT")
      .expect(404);
  });

  test("Debe actualizar un paciente mediante idNumber en la query", async () => {
    const response = await request(app)
      .patch("/patients?idNumber=12345678Z")
      .send({ fullName: "Juan Modificado" })
      .expect(200);

    expect(response.body.fullName).to.equal("Juan Modificado");
  });

  test("Debe eliminar un paciente mediante idNumber en la query", async () => {
    const response = await request(app)
      .delete("/patients?idNumber=12345678Z")
      .expect(200);

    const checkDb = await Patient.findOne({ idNumber: "12345678Z" });
    expect(checkDb).toBe(null);
  });
});