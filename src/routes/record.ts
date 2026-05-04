import { Router } from "express";
import { RecordController } from "../controllers/record.js";

const router = Router();

router.post("/", RecordController.create);

router.get("/", RecordController.getAll);
router.get("/query", RecordController.getByQuery);
router.get("/range", RecordController.getByDateRange);
router.get("/:id", RecordController.getById);

router.put("/:id", RecordController.update);
router.patch("/:id/close", RecordController.close);

router.delete("/:id", RecordController.delete);

export default router;
