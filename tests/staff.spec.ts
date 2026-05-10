import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { Staff } from "../src/models/staff.js";

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

const nonExistentId = "661f1f5c9a7b4b001e3f1234";

beforeEach(async () => {
  await Staff.deleteMany();
  await new Staff(firstStaff).save();
});

describe("Operaciones CRUD completas para /staff", () => {

  test("Debe registrar un nuevo miembro del personal correctamente (201)", async () => {
    const newStaff = { ...firstStaff, collegiateNumber: "COL-NUEVO-001" };
    const response = await request(app).post("/staff").send(newStaff).expect(201);
    expect(response.body.collegiateNumber).toBe("COL-NUEVO-001");
  });

  test("Debe devolver 400 si los datos del staff son invalidos (Error de validacion)", async () => {
    await request(app).post("/staff").send({}).expect(400);
  });

  test("Debe listar todo el personal cuando no se proporciona query (200)", async () => {
    const res = await request(app).get("/staff").expect(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Debe obtener un miembro por filtro de especialidad (200)", async () => {
    const res = await request(app).get("/staff?specialty=cardiology").expect(200);
    expect(res.body[0].collegiateNumber).toBe("COL1234");
  });

  test("Debe devolver 404 si el filtro de busqueda no encuentra resultados", async () => {
    await request(app).get("/staff?specialty=oncology").expect(404);
  });

  test("Debe obtener un miembro por su ID de base de datos (200)", async () => {
    const s = await Staff.findOne();
    await request(app).get(`/staff/${s!._id}`).expect(200);
  });

  test("Debe devolver 404 si el ID tiene formato correcto pero no existe", async () => {
    await request(app).get(`/staff/${nonExistentId}`).expect(404);
  });

  test("Debe devolver 400 si el formato del ID es incorrecto (Bloque catch)", async () => {
    await request(app).get("/staff/id-no-valido-123").expect(400);
  });

  test("Debe actualizar un miembro por su ID de base de datos (200)", async () => {
    const s = await Staff.findOne();
    const res = await request(app)
      .patch(`/staff/${s!._id}`)
      .send({ shift: "afternoon" })
      .expect(200);
    expect(res.body.shift).toBe("afternoon");
  });

  test("Debe devolver 404 al intentar actualizar un ID que no existe", async () => {
    await request(app)
      .patch(`/staff/${nonExistentId}`)
      .send({ shift: "night" })
      .expect(404);
  });

  test("Debe devolver 400 si los datos de actualizacion son invalidos (Error de validacion)", async () => {
    const s = await Staff.findOne();
    await request(app)
      .patch(`/staff/${s!._id}`)
      .send({ status: "ESTADO_INVENTADO" })
      .expect(400);
  });

  test("Debe actualizar un miembro mediante query de collegiateNumber (200)", async () => {
    const res = await request(app)
      .patch("/staff?collegiateNumber=COL1234")
      .send({ assignedConsultation: "Room 999" })
      .expect(200);
    expect(res.body.assignedConsultation).toBe("Room 999");
  });

  test("Debe devolver 400 si falta el parámetro collegiateNumber en la query de PATCH", async () => {
    await request(app).patch("/staff").send({ shift: "morning" }).expect(400);
  });

  test("Debe devolver 404 si el colegiado para actualizar no existe", async () => {
    await request(app)
      .patch("/staff?collegiateNumber=NO-EXISTE")
      .send({ shift: "morning" })
      .expect(404);
  });

  test("Debe borrar un miembro por su ID de base de datos (200)", async () => {
    const s = await Staff.findOne();
    await request(app).delete(`/staff/${s!._id}`).expect(200);
  });

  test("Debe devolver 404 al intentar borrar un ID que no existe", async () => {
    await request(app).delete(`/staff/${nonExistentId}`).expect(404);
  });

  test("Debe devolver 400 al intentar borrar un ID malformado", async () => {
    await request(app).delete("/staff/mal-formato-id").expect(400);
  });

  test("Debe borrar un miembro mediante query de collegiateNumber (200)", async () => {
    await request(app).delete("/staff?collegiateNumber=COL1234").expect(200);
    const check = await Staff.findOne({ collegiateNumber: "COL1234" });
    expect(check).toBeNull();
  });

  test("Debe devolver 400 si falta el parámetro collegiateNumber en la query de DELETE", async () => {
    await request(app).delete("/staff").expect(400);
  });

  test("Debe devolver 404 si el colegiado para borrar no existe", async () => {
    await request(app).delete("/staff?collegiateNumber=COL-FANTASMA").expect(404);
  });
});