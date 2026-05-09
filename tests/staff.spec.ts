import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { Staff } from "../src/models/staff.js";

/**
 * Datos iniciales para las pruebas de personal
 */
const firstStaff = {
  fullName: "Dra. Ana Garcia",
  collegiateNumber: "COL1234",
  specialty: "cardiology",
  category: "attending",
  shift: "morning",
  assignedConsultation: "Room 101",
  yearsOfExperience: 10,
  departmentContact: "ext-555",
  status: "active"
};

/**
 * Limpieza y preparacion de la base de datos antes de cada test
 */
beforeEach(async () => {
  await Staff.deleteMany();
  await new Staff(firstStaff).save();
});

describe("Operaciones CRUD para /staff", () => {
  /**
   * Test de creacion exitosa mediante POST
   */
  test("Should successfully register a new staff member", async () => {
    const newStaff = {
      fullName: "Dr. Gregory House",
      collegiateNumber: "COL5678",
      specialty: "emergency",
      category: "head_of_service",
      shift: "night",
      assignedConsultation: "ICU",
      departmentContact: "ext-999",
      yearsOfExperience: 20,
      status: "active"
    };

    const response = await request(app)
      .post("/staff")
      .send(newStaff)
      .expect(201);

    expect(response.body.collegiateNumber).toBe("COL5678");
    
    const dbCheck = await Staff.findOne({ collegiateNumber: "COL5678" });
    expect(dbCheck).not.toBeNull();
  });

  /**
   * Test de lectura por numero de colegiado en query string
   */
  test("Should get a staff member by collegiateNumber query", async () => {
    const response = await request(app)
      .get("/staff?collegiateNumber=COL1234")
      .expect(200);

    // find() devuelve un array, verificamos la primera posicion
    expect(response.body[0].fullName).toBe("Dra. Ana Garcia");
  });

  /**
   * Test de lectura por nombre en query string
   */
  test("Should get a staff member by fullName query", async () => {
    const response = await request(app)
      .get("/staff?fullName=Dra. Ana Garcia")
      .expect(200);

    expect(response.body[0].collegiateNumber).toBe("COL1234");
  });

/**
   * Test de error 404 al no encontrar resultados por nombre
   */
  test("Should return 404 if staff member is not found by query", async () => {
    await request(app)
      .get("/staff?fullName=NONEXISTENT_NAME")
      .expect(404);
  });

  /**
   * Test de lectura por ID dinamico de MongoDB
   */
  test("Should get a staff member by database ID", async () => {
    const existing = await Staff.findOne({ collegiateNumber: "COL1234" });
    const response = await request(app)
      .get(`/staff/${existing!._id}`)
      .expect(200);

    expect(response.body.collegiateNumber).toBe("COL1234");
  });

  /**
   * Test de actualizacion mediante ID de base de datos
   */
  test("Should update a staff member by database ID", async () => {
    const existing = await Staff.findOne({ collegiateNumber: "COL1234" });
    const response = await request(app)
      .patch(`/staff/${existing!._id}`)
      .send({ shift: "afternoon" })
      .expect(200);

    expect(response.body.shift).toBe("afternoon");
  });

  /**
   * Test de actualizacion mediante query string
   */
  test("Should update a staff member by collegiateNumber query", async () => {
    const response = await request(app)
      .patch("/staff?collegiateNumber=COL1234")
      .send({ assignedConsultation: "Room 202" })
      .expect(200);

    expect(response.body.assignedConsultation).toBe("Room 202");
  });

  /**
   * Test de borrado mediante ID de base de datos
   */
  test("Should delete a staff member by database ID", async () => {
    const existing = await Staff.findOne({ collegiateNumber: "COL1234" });
    await request(app)
      .delete(`/staff/${existing!._id}`)
      .expect(200);

    const dbCheck = await Staff.findById(existing!._id);
    expect(dbCheck).toBeNull();
  });

  /**
   * Test de borrado mediante query string
   */
  test("Should delete a staff member by collegiateNumber query", async () => {
    await request(app)
      .delete("/staff?collegiateNumber=COL1234")
      .expect(200);

    const dbCheck = await Staff.findOne({ collegiateNumber: "COL1234" });
    expect(dbCheck).toBeNull();
  });
});