import { Router } from 'express'
import { PatientController } from '../controllers/Cpatient.js'

const router = Router()
const controller = new PatientController()

router.post('/', controller.create)
router.get('/', controller.getByQuery)
router.get('/:id', controller.getById)
router.patch('/', controller.updateByQuery)
router.patch('/:id', controller.updateById)
router.delete('/', controller.deleteByQuery)
router.delete('/:id', controller.deleteById)

export default router