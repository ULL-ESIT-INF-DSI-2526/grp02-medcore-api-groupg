import express from "express";
import { Patient } from "../models/patient.js";
import { Staff } from "../models/staff.js";
import { Medication } from "../models/medication.js";
import { Record } from "../models/record.js";

export const recordRouter = express.Router();

export interface RecordQuery {
  patient?: string; // ObjectId string
  doctor?: string;  // ObjectId string
  type?: "consulta" | "ingreso";
  startDate?: {
    $gte?: Date;
    $lte?: Date;
  };
}


/**
 * @swagger
 * /records:
 *   post:
 *     summary: Create a new medical record
 *     tags:
 *       - Records
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RecordCreate"
 *     responses:
 *       201:
 *         description: Record created successfully
 *       404:
 *         description: Patient, doctor or medication not found
 *       409:
 *         description: Stock insufficient or medication expired
 *       500:
 *         description: Internal server error
 */
recordRouter.post("/records", async (req, res) => {
  try {
    const {
      patientIdNumber,
      doctorCollegiateNumber,
      type,
      reason,
      diagnosis,
      medications,
    } = req.body;

    const patient = await Patient.findOne({ idNumber: patientIdNumber });
    if (!patient) return res.status(404).send({ error: "Patient not found" });

    const doctor = await Staff.findOne({
      collegiateNumber: doctorCollegiateNumber,
      status: "active",
    });
    if (!doctor) return res.status(404).send({ error: "Active doctor not found" });

    if (!Array.isArray(medications))
      return res.status(400).send({ error: "medications must be an array" });

    const prescribed: {
      medication: any;
      quantity: number;
      posology: string;
    }[] = [];
    let totalAmount = 0;

    for (const item of medications) {
      const { nationalCode, quantity, posology } = item;
      const med = await Medication.findOne({ nationalCode });
      if (!med) return res.status(404).send({ error: `Medication ${nationalCode} not found` });

      if (med.expirationDate < new Date())
        return res.status(409).send({ error: `Medication ${nationalCode} expired` });

      if (med.stock < quantity)
        return res
          .status(409)
          .send({ error: `Insufficient stock for medication ${nationalCode}` });

      med.stock -= quantity;
      await med.save();

      totalAmount += med.price * quantity;
      prescribed.push({ medication: med._id, quantity, posology });
    }

    const record = new Record({
      patient: patient._id,
      doctor: doctor._id,
      type,
      reason,
      diagnosis,
      medications: prescribed,
      totalAmount,
      status: "abierto",
    });

    await record.save();
    res.status(201).send(record);
  } catch (error) {
    res.status(500).send({ error: "Server error", details: error });
  }
});

/**
 * @swagger
 * /records:
 *   get:
 *     summary: Get medical records by query or list all
 *     tags:
 *       - Records
 *     parameters:
 *       - in: query
 *         name: idNumber
 *         schema:
 *           type: string
 *         description: Patient identification number
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [consulta, ingreso]
 *     responses:
 *       200:
 *         description: List of records
 *       404:
 *         description: Patient not found
 */
recordRouter.get("/records", async (req, res) => {
  try {
    const { idNumber, startDate, endDate, type } = req.query;

    if (idNumber) {
      const patient = await Patient.findOne({ idNumber: idNumber as string });
      if (!patient) return res.status(404).send({ error: "Patient not found" });

      const records = await Record.find({ patient: patient._id }).sort({ startDate: 1 });
      return res.send(records);
    }

    const query: RecordQuery = {};
    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate as string);
      if (endDate) query.startDate.$lte = new Date(endDate as string);
    }
    if (type === "consulta" || type === "ingreso") {
      query.type = type;
    }
    
    const records = await Record.find(query);
    res.send(records);
  } catch {
    res.status(500).send({ error: "Server error" });
  }
});

/**
 * @swagger
 * /records/{id}:
 *   get:
 *     summary: Get a medical record by ID
 *     tags:
 *       - Records
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Record found
 *       404:
 *         description: Record not found
 */
recordRouter.get("/records/:id", async (req, res) => {
  try {
    const record = await Record.findById(req.params.id)
      .populate("patient")
      .populate("doctor")
      .populate("medications.medication");
    if (!record) return res.status(404).send({ error: "Record not found" });
    res.send(record);
  } catch {
    res.status(400).send({ error: "Invalid ID" });
  }
});

/**
 * @swagger
 * /records/{id}:
 *   put:
 *     summary: Update a medical record by ID
 *     tags:
 *       - Records
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Record updated successfully
 *       404:
 *         description: Record not found
 *       409:
 *         description: Stock insufficient or medication expired
 */
recordRouter.put("/records/:id", async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) return res.status(404).send({ error: "Record not found" });

    // Restaurar stock anterior
    for (const item of record.medications) {
      const med = await Medication.findById(item.medication);
      if (!med) continue;
      med.stock += item.quantity;
      await med.save();
    }

    const { medications, ...rest } = req.body;

    let newMedications = record.medications;
    let totalAmount = record.totalAmount;

    if (Array.isArray(medications)) {
      newMedications = [];
      totalAmount = 0;

      for (const item of medications) {
        const { nationalCode, quantity, posology } = item;
        const med = await Medication.findOne({ nationalCode });
        if (!med) return res.status(404).send({ error: `Medication ${nationalCode} not found` });

        if (med.expirationDate < new Date())
          return res.status(409).send({ error: `Medication ${nationalCode} expired` });

        if (med.stock < quantity)
          return res
            .status(409)
            .send({ error: `Insufficient stock for medication ${nationalCode}` });

        med.stock -= quantity;
        await med.save();

        totalAmount += med.price * quantity;
        newMedications.push({ medication: med._id, quantity, posology });
      }
    }

    record.set({ ...rest, medications: newMedications, totalAmount });
    await record.save();

    res.send(record);
  } catch (error) {
    res.status(500).send({ error: "Server error", details: error });
  }
});

/**
 * @swagger
 * /records/{id}:
 *   delete:
 *     summary: Delete a medical record by ID
 *     tags:
 *       - Records
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Record deleted and stock restored
 *       404:
 *         description: Record not found
 */
recordRouter.delete("/records/:id", async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) return res.status(404).send({ error: "Record not found" });

    for (const item of record.medications) {
      const med = await Medication.findById(item.medication);
      if (!med) continue;
      med.stock += item.quantity;
      await med.save();
    }

    await record.deleteOne();
    res.send({ message: "Record deleted and stock restored" });
  } catch {
    res.status(400).send({ error: "Invalid ID" });
  }
});
