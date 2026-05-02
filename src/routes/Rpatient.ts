import { Router } from 'express';
import { PatientController } from '../controllers/Cpatient.js';

const router = Router();

/**
 * Definicion de rutas para el recurso de pacientes
 */

router.post('/', PatientController.create);
router.get('/', PatientController.getByQuery);
router.get('/:id', PatientController.getById);
router.patch('/', PatientController.updateByQuery);
router.patch('/:id', PatientController.updateById);
router.delete('/', PatientController.deleteByQuery);
router.delete('/:id', PatientController.deleteById);

export default router;