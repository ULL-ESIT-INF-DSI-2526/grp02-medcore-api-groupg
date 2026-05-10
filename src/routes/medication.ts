import express from "express";
import { Medication } from "../models/medication.js";
import { Record } from "../models/record.js";


export const medicationRouter = express.Router();


export interface MedicationQuery {
 name?: string;
 activeIngredient?: string;
 nationalCode?: string;
 form?: string;
 route?: string;
 requiresPrescription?: boolean;
}

async function cascadeDeleteMedication(medId: string) {
  const records = await Record.find({ "medications.medication": medId });

  for (const r of records) {
    await Record.findByIdAndDelete(r._id);
  }

  await Medication.findByIdAndDelete(medId);
}


/**
* @swagger
* /medications:
*   post:
*     summary: Create a new medication
*     tags:
*       - Medications
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: "#/components/schemas/MedicationCreate"
*     responses:
*       201:
*         description: Medication created successfully
*       400:
*         description: Invalid medication data
*/
medicationRouter.post("/medications", async (req, res) => {
 try {
   const med = new Medication(req.body);
   await med.save();
   res.status(201).send(med);
 } catch (error) {
   res.status(400).send({ error: "Invalid medication data", details: error });
 }
});


/**
* @swagger
* /medications:
*   get:
*     summary: Get medications by query or list all
*     tags:
*       - Medications
*     parameters:
*       - in: query
*         name: name
*         schema:
*           type: string
*       - in: query
*         name: activeIngredient
*         schema:
*           type: string
*       - in: query
*         name: nationalCode
*         schema:
*           type: string
*     responses:
*       200:
*         description: List of medications
*/
medicationRouter.get("/medications", async (req, res) => {
 try {
   const { name, activeIngredient, nationalCode } = req.query;
   const query: MedicationQuery = {};
   if (name) query.name = name as string;
   if (activeIngredient) query.activeIngredient = activeIngredient as string;
   if (nationalCode) query.nationalCode = nationalCode as string;


   const meds = await Medication.find(query as any);
   res.send(meds);
 } catch {
   res.status(500).send({ error: "Server error" });
 }
});


/**
* @swagger
* /medications/{id}:
*   get:
*     summary: Get a medication by ID
*     tags:
*       - Medications
*     parameters:
*       - in: path
*         name: id
*         required: true
*     responses:
*       200:
*         description: Medication found
*       404:
*         description: Medication not found
*/
medicationRouter.get("/medications/:id", async (req, res) => {
 try {
   const med = await Medication.findById(req.params.id);
   if (!med) return res.status(404).send({ error: "Medication not found" });
   res.send(med);
 } catch {
   res.status(400).send({ error: "Invalid ID" });
 }
});


/**
* @swagger
* /medications/{id}:
*   put:
*     summary: Update a medication by ID
*     tags:
*       - Medications
*     parameters:
*       - in: path
*         name: id
*         required: true
*     requestBody:
*       required: true
*     responses:
*       200:
*         description: Medication updated successfully
*       404:
*         description: Medication not found
*/
medicationRouter.patch("/medications/:id", async (req, res) => {
 try {
   const med = await Medication.findByIdAndUpdate(req.params.id, req.body, {
     new: true,
     runValidators: true,
   });
   if (!med) return res.status(404).send({ error: "Medication not found" });
   res.send(med);
 } catch (error) {
   res.status(400).send({ error: "Invalid data", details: error });
 }
});


/**
* @swagger
* /medications:
*   put:
*     summary: Update a medication using query parameters
*     tags:
*       - Medications
*     parameters:
*       - in: query
*         name: nationalCode
*         required: true
*     requestBody:
*       required: true
*     responses:
*       200:
*         description: Medication updated successfully
*       404:
*         description: Medication not found
*/
medicationRouter.patch("/medications", async (req, res) => {
 try {
   const { nationalCode } = req.query;
   if (!nationalCode)
     return res.status(400).send({ error: "nationalCode query required" });


   const med = await Medication.findOneAndUpdate({ nationalCode: nationalCode as string }, req.body, {
     new: true,
     runValidators: true,
   });
   if (!med) return res.status(404).send({ error: "Medication not found" });
   res.send(med);
 } catch (error) {
   res.status(400).send({ error: "Invalid data", details: error });
 }
});


/**
* @swagger
* /medications/{id}:
*   delete:
*     summary: Delete a medication by ID
*     tags:
*       - Medications
*     parameters:
*       - in: path
*         name: id
*         required: true
*     responses:
*       200:
*         description: Medication deleted successfully
*       404:
*         description: Medication not found
*/
medicationRouter.delete("/medications/:id", async (req, res) => {
  try {
    const med = await Medication.findById(req.params.id);
    if (!med) return res.status(404).send({ error: "Medication not found" });

    await cascadeDeleteMedication(med._id.toString());

    res.send({ message: "Medication and related records deleted" });
  } catch {
    res.status(400).send({ error: "Invalid ID" });
  }
});



/**
* @swagger
* /medications:
*   delete:
*     summary: Delete a medication using query parameters
*     tags:
*       - Medications
*     parameters:
*       - in: query
*         name: nationalCode
*         required: true
*     responses:
*       200:
*         description: Medication deleted successfully
*       404:
*         description: Medication not found
*/
medicationRouter.delete("/medications", async (req, res) => {
  try {
    const { nationalCode } = req.query;
    if (!nationalCode)
      return res.status(400).send({ error: "nationalCode query required" });

    const med = await Medication.findOne({ nationalCode: nationalCode as string });
    if (!med) return res.status(404).send({ error: "Medication not found" });

    await cascadeDeleteMedication(med._id.toString());

    res.send({ message: "Medication and related records deleted" });
  } catch {
    res.status(500).send({ error: "Server error" });
  }
});

