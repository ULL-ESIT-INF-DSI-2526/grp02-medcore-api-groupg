import { Router } from "express";
import { MedicationController } from "../controllers/medication.js";

const router = Router();

router.post("/", MedicationController.create);
router.get("/", MedicationController.find);
router.get("/:id", MedicationController.findById);
router.put("/", MedicationController.update);
router.delete("/", MedicationController.delete);
router.get("/:id/expired", MedicationController.isExpired);

export default router;
