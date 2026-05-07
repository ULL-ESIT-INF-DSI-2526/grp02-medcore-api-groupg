import express from "express";
import { Patient } from "../models/patient.js";

export const patientRouter = express.Router();

export interface PatientQuery {
  fullName?: string;
  idNumber?: string;
}


/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Create a new patient
 *     tags:
 *       - Patients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/PatientCreate"
 *     responses:
 *       201:
 *         description: Patient created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Patient"
 *       400:
 *         description: Invalid patient data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal server error
 */
patientRouter.post("/patients", async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(201).send(patient);
  } catch (error) {
    res.status(400).send({ error: "Invalid patient data", details: error });
  }
});

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Get patients by query or list all
 *     tags:
 *       - Patients
 *     parameters:
 *       - in: query
 *         name: fullName
 *         schema:
 *           type: string
 *         description: Filter by full name
 *       - in: query
 *         name: idNumber
 *         schema:
 *           type: string
 *         description: Filter by identification number
 *     responses:
 *       200:
 *         description: List of patients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Patient"
 *       500:
 *         description: Internal server error
 */
patientRouter.get("/patients", async (req, res) => {
  try {
    const { fullName, idNumber } = req.query;

    if (fullName || idNumber) {
      const query: PatientQuery = {};
      if (fullName) query.fullName = fullName as string;
      if (idNumber) query.idNumber = idNumber as string;
      const patients = await Patient.find(query);
      if (patients.length === 0) {
      return res.status(404).send({ error: "Patient not found" });
      }
      return res.send(patients);
    }
  } catch (error) {
    res.status(500).send({ error: "Server error" });
  }
});

/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Get a patient by database ID
 *     tags:
 *       - Patients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient MongoDB ID
 *     responses:
 *       200:
 *         description: Patient found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Patient"
 *       404:
 *         description: Patient not found
 *       400:
 *         description: Invalid ID format
 */
patientRouter.get("/patients/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).send({ error: "Patient not found" });
    res.send(patient);
  } catch {
    res.status(400).send({ error: "Invalid ID" });
  }
});

/**
 * @swagger
 * /patients/{id}:
 *   patch:
 *     summary: Update a patient by ID
 *     tags:
 *       - Patients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/PatientCreate"
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *       404:
 *         description: Patient not found
 *       400:
 *         description: Invalid data
 */
patientRouter.patch("/patients/:id", async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!patient) return res.status(404).send({ error: "Patient not found" });
    res.send(patient);
  } catch (error) {
    res.status(400).send({ error: "Invalid data", details: error });
  }
});

/**
 * @swagger
 * /patients:
 *   patch:
 *     summary: Update a patient using query parameters
 *     tags:
 *       - Patients
 *     parameters:
 *       - in: query
 *         name: idNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Identification number of the patient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/PatientCreate"
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *       404:
 *         description: Patient not found
 *       400:
 *         description: Missing or invalid query parameter
 */
patientRouter.patch("/patients", async (req, res) => {
  try {
    const { idNumber } = req.query;
    if (!idNumber) return res.status(400).send({ error: "idNumber query required" });

    const patient = await Patient.findOneAndUpdate({ idNumber: idNumber as string }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!patient) return res.status(404).send({ error: "Patient not found" });
    res.send(patient);
  } catch (error) {
    res.status(400).send({ error: "Invalid data", details: error });
  }
});

/**
 * @swagger
 * /patients/{id}:
 *   delete:
 *     summary: Delete a patient by ID
 *     tags:
 *       - Patients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *       404:
 *         description: Patient not found
 *       400:
 *         description: Invalid ID format
 */
patientRouter.delete("/patients/:id", async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).send({ error: "Patient not found" });
    res.send({ message: "Patient deleted" });
  } catch {
    res.status(400).send({ error: "Invalid ID" });
  }
});

/**
 * @swagger
 * /patients:
 *   delete:
 *     summary: Delete a patient using query parameters
 *     tags:
 *       - Patients
 *     parameters:
 *       - in: query
 *         name: idNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Identification number of the patient
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *       404:
 *         description: Patient not found
 *       400:
 *         description: Missing or invalid query parameter
 */
patientRouter.delete("/patients", async (req, res) => {
  try {
    const { idNumber } = req.query;
    if (!idNumber) return res.status(400).send({ error: "idNumber query required" });

    const patient = await Patient.findOneAndDelete({ idNumber: idNumber as string });
    if (!patient) return res.status(404).send({ error: "Patient not found" });
    res.send({ message: "Patient deleted" });
  } catch {
    res.status(500).send({ error: "Server error" });
  }
});