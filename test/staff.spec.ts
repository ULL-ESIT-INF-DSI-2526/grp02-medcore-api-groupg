import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { Staff } from "../src/models/staff.js";

const firstStaff = {
  fullName: "Dra. Ana Garcia",
  collegiateNumber: "MD-9999",
  specialty: "cardiology",
  category: "attending",
  shift: "morning",
  assignedConsultation: "Room 101",
  yearsOfExperience: 10,
  departmentContact: "ext-555",
  status: "active"
};

beforeEach(async () => {
  await Staff.deleteMany();
  await new Staff(firstStaff).save();
});

describe("Operaciones CRUD para /staff", () => {
  test("Debe registrar un nuevo miembro del personal correctamente", async () => {
    const response = await request(app)
      .post("/staff")
      .send({
        fullName: "Dr. House",
        collegiateNumber: "MD-1111",
        specialty: "emergency",
        category: "head_of_service",
        shift: "night",
        assignedConsultation: "ICU",
        yearsOfExperience: 20,
        departmentContact: "ext-000",
        status: "active"
      })
      .expect(201);

    expect(response.body.fullName).to.equal("Dr. House");
    
    const staffInDb = await Staff.findById(response.body._id);
    expect(staffInDb).not.toBe(null);
    expect(staffInDb!.collegiateNumber).to.equal("MD-1111");
  });

  test("Debe obtener un miembro por su collegiateNumber", async () => {
    await request(app)
      .get("/staff?collegiateNumber=MD-9999")
      .expect(200);
  });

  test("Debe obtener un miembro por su ID de base de datos", async () => {
    const existing = await Staff.findOne({ collegiateNumber: "MD-9999" });
    const response = await request(app)
      .get(`/staff/${existing!._id}`)
      .expect(200);

    expect(response.body.collegiateNumber).to.equal("MD-9999");
  });

  test("Debe devolver 404 para un ID inexistente", async () => {
    await request(app)
      .get("/staff/661f1f5c9a7b4b001e3f1234")
      .expect(404);
  });

  test("Debe actualizar un miembro mediante ID de base de datos", async () => {
    const existing = await Staff.findOne({ collegiateNumber: "MD-9999" });
    const response = await request(app)
      .patch(`/staff/${existing!._id}`)
      .send({ shift: "afternoon" })
      .expect(200);

    expect(response.body.shift).to.equal("afternoon");
  });

  test("Debe eliminar un miembro mediante su collegiateNumber", async () => {
    await request(app)
      .delete("/staff?collegiateNumber=MD-9999")
      .expect(200);

    const checkDb = await Staff.findOne({ collegiateNumber: "MD-9999" });
    expect(checkDb).toBe(null);
  });
});