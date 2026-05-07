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

beforeEach(async () => {
  await Staff.deleteMany();
  await new Staff(firstStaff).save();
});

describe("Operaciones CRUD para /staff", () => {
  
  test("Debe registrar un nuevo miembro del personal correctamente", async () => {
    const newStaff = {
      fullName: "Dr. Gregory House",
      collegiateNumber: "COL5678",
      specialty: "emergency",
      category: "head_of_service",
      shift: "night",
      assignedConsultation: "ICU",
      departmentContact: "ext-999",
      yearsOfExperience: 20
    };

    const response = await request(app)
      .post("/staff")
      .send(newStaff)
      .expect(201);

    expect(response.body.collegiateNumber).to.equal("COL5678");
  });

  test("Debe obtener un miembro por su ID de base de datos", async () => {
    const existing = await Staff.findOne({ collegiateNumber: "COL1234" });
    const response = await request(app)
      .get(`/staff/${existing!._id}`)
      .expect(200);

    expect(response.body.fullName).to.equal("Dra. Ana Garcia");
  });

  test("Debe actualizar un miembro mediante su ID de base de datos", async () => {
    const existing = await Staff.findOne({ collegiateNumber: "COL1234" });
    const response = await request(app)
      .patch(`/staff/${existing!._id}`)
      .send({ shift: "afternoon" })
      .expect(200);

    expect(response.body.shift).to.equal("afternoon");
  });

  test("Debe actualizar un miembro mediante collegiateNumber en la query", async () => {
    const response = await request(app)
      .patch("/staff?collegiateNumber=COL1234")
      .send({ assignedConsultation: "Room 202" })
      .expect(200);

    expect(response.body.assignedConsultation).to.equal("Room 202");
  });

  test("Debe eliminar un miembro mediante su collegiateNumber", async () => {
    await request(app)
      .delete("/staff?collegiateNumber=COL1234")
      .expect(200);

    const checkDb = await Staff.findOne({ collegiateNumber: "COL1234" });
    expect(checkDb).toBe(null);
  });
});