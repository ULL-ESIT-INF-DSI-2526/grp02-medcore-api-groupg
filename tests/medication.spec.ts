import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { Medication } from "../src/models/medication.js";

beforeEach(async () => {
  await Medication.deleteMany();
});

const validMedication = {
  name: "Ibuprofeno",
  activeIngredient: "Ibuprofen",
  nationalCode: "123456789",
  form: "comprimido",
  dose: 600,
  unit: "mg",
  route: "oral",
  stock: 50,
  price: 4.99,
  requiresPrescription: false,
  expirationDate: "2026-12-31T00:00:00.000Z",
  contraindications: ["hipertensión"]
};

describe("POST /medications", () => {
  test("Debe crear un medicamento correctamente", async () => {
    const response = await request(app)
      .post("/medications")
      .send(validMedication)
      .expect(201);

    expect(response.body.name).toBe("Ibuprofeno");

    const med = await Medication.findById(response.body._id);
    expect(med).not.toBeNull();
  });

  test("Debe fallar si falta un campo obligatorio", async () => {
    const { name: _removed, ...invalid } = validMedication;

    await request(app)
      .post("/medications")
      .send(invalid)
      .expect(400);
  });
});

describe("GET /medications", () => {
  test("Debe devolver la lista de medicamentos", async () => {
    await new Medication(validMedication).save();

    const response = await request(app)
      .get("/medications")
      .expect(200);

    expect(response.body.length).toBe(1);
  });

  test("Debe filtrar por nombre", async () => {
    await new Medication(validMedication).save();

    const response = await request(app)
      .get("/medications?name=Ibuprofeno")
      .expect(200);

    expect(response.body.length).toBe(1);
  });

  test("Debe devolver vacío si no coincide", async () => {
    await new Medication(validMedication).save();

    const response = await request(app)
      .get("/medications?name=Paracetamol")
      .expect(200);

    expect(response.body.length).toBe(0);
  });
});

describe("GET /medications/:id", () => {
  test("Debe obtener un medicamento por ID", async () => {
    const med = await new Medication(validMedication).save();

    const response = await request(app)
      .get(`/medications/${med._id}`)
      .expect(200);

    expect(response.body.nationalCode).toBe("123456789");
  });

  test("Debe devolver 404 si no existe", async () => {
    await request(app)
      .get("/medications/000000000000000000000000")
      .expect(404);
  });
});

describe("PATCH /medications/:id", () => {
  test("Debe actualizar un medicamento por ID", async () => {
    const med = await new Medication(validMedication).save();

    const response = await request(app)
      .patch(`/medications/${med._id}`)
      .send({ stock: 20 })
      .expect(200);

    expect(response.body.stock).toBe(20);
  });
});

describe("DELETE /medications/:id", () => {
  test("Debe borrar un medicamento por ID", async () => {
    const med = await new Medication(validMedication).save();

    await request(app)
      .delete(`/medications/${med._id}`)
      .expect(200);

    const deleted = await Medication.findById(med._id);
    expect(deleted).toBeNull();
  });
});
