import express from "express";
import { Staff } from "../models/staff.js";

export const staffRouter = express.Router();

export interface StaffQuery {
  fullName?: string;
  collegiateNumber?: string;
  specialty?: string;
  category?: string;
  shift?: string;
  assignedConsultation?: string;
  status?: string;
}


/**
 * @swagger
 * /staff:
 *   post:
 *     summary: Create a new staff member
 *     tags:
 *       - Staff
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/StaffCreate"
 *     responses:
 *       201:
 *         description: Staff member created successfully
 *       400:
 *         description: Invalid staff data
 */
staffRouter.post("/staff", async (req, res) => {
  try {
    const staff = new Staff(req.body);
    await staff.save();
    res.status(201).send(staff);
  } catch (error) {
    res.status(400).send({ error: "Invalid staff data", details: error });
  }
});

/**
 * @swagger
 * /staff:
 *   get:
 *     summary: Get staff members by query or list all
 *     tags:
 *       - Staff
 *     parameters:
 *       - in: query
 *         name: fullName
 *         schema:
 *           type: string
 *       - in: query
 *         name: specialty
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of staff members
 */
staffRouter.get("/staff", async (req, res) => {
  try {
    const { fullName, specialty } = req.query;
    const query: StaffQuery = {};
    if (fullName) query.fullName = fullName as string;
    if (specialty) query.specialty = specialty as string;
    const staff = await Staff.find(query as any);
    res.send(staff);
  } catch {
    res.status(500).send({ error: "Server error" });
  }
});

/**
 * @swagger
 * /staff/{id}:
 *   get:
 *     summary: Get a staff member by ID
 *     tags:
 *       - Staff
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Staff member found
 *       404:
 *         description: Staff not found
 */
staffRouter.get("/staff/:id", async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).send({ error: "Staff not found" });
    res.send(staff);
  } catch {
    res.status(400).send({ error: "Invalid ID" });
  }
});

/**
 * @swagger
 * /staff/{id}:
 *   put:
 *     summary: Update a staff member by ID
 *     tags:
 *       - Staff
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/StaffCreate"
 *     responses:
 *       200:
 *         description: Staff updated successfully
 *       404:
 *         description: Staff not found
 */
staffRouter.put("/staff/:id", async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!staff) return res.status(404).send({ error: "Staff not found" });
    res.send(staff);
  } catch (error) {
    res.status(400).send({ error: "Invalid data", details: error });
  }
});

/**
 * @swagger
 * /staff:
 *   put:
 *     summary: Update a staff member using query parameters
 *     tags:
 *       - Staff
 *     parameters:
 *       - in: query
 *         name: collegiateNumber
 *         required: true
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Staff updated successfully
 *       404:
 *         description: Staff not found
 */
staffRouter.put("/staff", async (req, res) => {
  try {
    const { collegiateNumber } = req.query;
    if (!collegiateNumber)
      return res.status(400).send({ error: "collegiateNumber query required" });

    const staff = await Staff.findOneAndUpdate({ collegiateNumber: collegiateNumber as string }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!staff) return res.status(404).send({ error: "Staff not found" });
    res.send(staff);
  } catch (error) {
    res.status(400).send({ error: "Invalid data", details: error });
  }
});

/**
 * @swagger
 * /staff/{id}:
 *   delete:
 *     summary: Delete a staff member by ID
 *     tags:
 *       - Staff
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Staff deleted successfully
 *       404:
 *         description: Staff not found
 */
staffRouter.delete("/staff/:id", async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).send({ error: "Staff not found" });
    res.send({ message: "Staff deleted" });
  } catch {
    res.status(400).send({ error: "Invalid ID" });
  }
});

/**
 * @swagger
 * /staff:
 *   delete:
 *     summary: Delete a staff member using query parameters
 *     tags:
 *       - Staff
 *     parameters:
 *       - in: query
 *         name: collegiateNumber
 *         required: true
 *     responses:
 *       200:
 *         description: Staff deleted successfully
 *       404:
 *         description: Staff not found
 */
staffRouter.delete("/staff", async (req, res) => {
  try {
    const { collegiateNumber } = req.query;
    if (!collegiateNumber)
      return res.status(400).send({ error: "collegiateNumber query required" });

    const staff = await Staff.findOneAndDelete({ collegiateNumber: collegiateNumber as string });
    if (!staff) return res.status(404).send({ error: "Staff not found" });
    res.send({ message: "Staff deleted" });
  } catch {
    res.status(500).send({ error: "Server error" });
  }
});
