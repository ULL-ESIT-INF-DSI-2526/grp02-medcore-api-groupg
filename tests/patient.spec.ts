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
  contact: { address: "Calle Falsa 123", phone: "600123456", email: "juan@example.com" },
  bloodType: "A+",
  status: "active"
};

beforeEach(async () => {
  await Patient.deleteMany();
  await new Patient(firstPatient).save();
});

describe("Operaciones CRUD completas para /patients", () => {

  test("Debe crear un paciente (201)", async () => {
    const p = { ...firstPatient, idNumber: "999", socialSecurityNumber: "SS9" };
    await request(app).post("/patients").send(p).expect(201);
  });

  test("Debe fallar (400) si los datos son invalidos (nombre corto)", async () => {
    await request(app).post("/patients").send({ fullName: "Jo" }).expect(400);
  });

  test("Debe listar todos (200) si no hay query", async () => {
    const res = await request(app).get("/patients").expect(200);
    expect(res.body.length).toBe(1);
  });

  test("Debe filtrar por fullName exacto (200)", async () => {
    const res = await request(app).get("/patients?fullName=Juan Pérez").expect(200);
    expect(res.body[0].idNumber).toBe("12345678A");
  });

  test("Debe devolver 404 si el filtro no encuentra nada", async () => {
    await request(app).get("/patients?idNumber=NONEXISTENT").expect(404);
  });

  test("Debe obtener por ID (200)", async () => {
    const p = await Patient.findOne();
    await request(app).get(`/patients/${p!._id}`).expect(200);
  });

  test("Debe dar 404 si el ID no existe", async () => {
    await request(app).get("/patients/661f1f5c9a7b4b001e3f1234").expect(404);
  });

  test("Debe dar 400 si el formato del ID es invalido (catch block)", async () => {
    await request(app).get("/patients/123-id-malo").expect(400);
  });

  test("Debe actualizar por ID (200)", async () => {
    const p = await Patient.findOne();
    const res = await request(app).patch(`/patients/${p!._id}`).send({ fullName: "Nuevo Nombre" }).expect(200);
    expect(res.body.fullName).toBe("Nuevo Nombre");
  });

  test("Debe dar 404 en PATCH si el ID no existe pero los datos son validos", async () => {
    await request(app).patch("/patients/661f1f5c9a7b4b001e3f1234").send({ fullName: "Maria Garcia" }).expect(404);
  });

  test("Debe dar 400 en PATCH si los datos son invalidos", async () => {
    const p = await Patient.findOne();
    await request(app).patch(`/patients/${p!._id}`).send({ gender: "INVALIDO" }).expect(400);
  });

  test("Debe actualizar por query (200)", async () => {
    await request(app).patch("/patients?idNumber=12345678A").send({ status: "deceased" }).expect(200);
  });

  test("Debe dar 400 si falta idNumber en la query de PATCH", async () => {
    await request(app).patch("/patients").send({ fullName: "Maria Garcia" }).expect(400);
  });

  test("Debe borrar por ID (200)", async () => {
    const p = await Patient.findOne();
    await request(app).delete(`/patients/${p!._id}`).expect(200);
  });

  test("Debe dar 400 en DELETE si el ID es malformado", async () => {
    await request(app).delete("/patients/ID-ERROR").expect(400);
  });

  test("Debe borrar por query (200)", async () => {
    await request(app).delete("/patients?idNumber=12345678A").expect(200);
  });

  test("Debe dar 400 si falta idNumber en query de DELETE", async () => {
    await request(app).delete("/patients").expect(400);
  });
});