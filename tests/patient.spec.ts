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
  /**
   * Test de creacion exitosa
   */
  test("Should successfully create a new patient", async () => {
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

    expect(response.body.fullName).toBe("Maria Garcia");
    
    const dbCheck = await Patient.findOne({ idNumber: "87654321B" });
    expect(dbCheck).not.toBeNull();
  });

  /**
   * Test de lectura por query string
   */
  test("Should get a patient by idNumber query", async () => {
    const response = await request(app)
      .get("/patients?idNumber=12345678A")
      .expect(200);

    expect(response.body[0].fullName).toBe("Juan Pérez");
  });

  /**
   * Test de error 404
   */
  test("Should return 404 if patient is not found by query", async () => {
    await request(app)
      .get("/patients?idNumber=NONEXISTENT")
      .expect(404);
  });

  /**
   * Test de actualizacion por ID
   */
  test("Should update a patient by database ID", async () => {
    const existing = await Patient.findOne({ idNumber: "12345678A" });
    const response = await request(app)
      .patch(`/patients/${existing!._id}`)
      .send({ fullName: "Juan Pérez Actualizado" })
      .expect(200);

    expect(response.body.fullName).toBe("Juan Pérez Actualizado");
  });

  /**
   * Test de actualizacion por query string
   */
  test("Should update a patient by idNumber query", async () => {
    const response = await request(app)
      .patch("/patients?idNumber=12345678A")
      .send({ status: "inactive" })
      .expect(200);

    expect(response.body.status).toBe("inactive");
  });

  /**
   * Test de borrado por ID
   */
  test("Should delete a patient by database ID", async () => {
    const existing = await Patient.findOne({ idNumber: "12345678A" });
    await request(app)
      .delete(`/patients/${existing!._id}`)
      .expect(200);

    const dbCheck = await Patient.findById(existing!._id);
    expect(dbCheck).toBeNull();
  });

  /**
   * Test de borrado por query string
   */
  test("Should delete a patient by idNumber query", async () => {
    await request(app)
      .delete("/patients?idNumber=12345678A")
      .expect(200);

    const dbCheck = await Patient.findOne({ idNumber: "12345678A" });
    expect(dbCheck).toBeNull();
  });
});