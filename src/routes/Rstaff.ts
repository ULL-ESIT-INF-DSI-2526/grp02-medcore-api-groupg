import { Router } from 'express';
import { StaffController } from '../controllers/Cstaff.js';

const router = Router();

/**
 * Definicion de rutas para el recurso de personal medico
 */

router.post('/', StaffController.create);
router.get('/', StaffController.getByQuery);
router.get('/:id', StaffController.getById);
router.patch('/', StaffController.updateByQuery);
router.patch('/:id', StaffController.updateById);
router.delete('/', StaffController.deleteByQuery);
router.delete('/:id', StaffController.deleteById);

export default router;