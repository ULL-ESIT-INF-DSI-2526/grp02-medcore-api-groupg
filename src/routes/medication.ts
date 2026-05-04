import { Router } from "express";
import { MedicationController } from "../controllers/medication.js";

const router = Router();

router.post("/", MedicationController.create);

router.get("/", MedicationController.getByQuery);
router.get("/all", MedicationController.getAll);
router.get("/:id", MedicationController.getById);

router.put("/:id", MedicationController.update);
router.put("/", MedicationController.updateByQuery);

router.delete("/:id", MedicationController.delete);
router.delete("/", MedicationController.deleteByQuery);

export default router;
