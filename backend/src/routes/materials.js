const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/stats', materialController.getStats);
router.get('/low-stock', materialController.getLowStock);
router.get('/', materialController.getAll);
router.get('/:id', materialController.getById);
router.post('/', authorize('admin', 'manager'), materialController.create);
router.put('/:id', authorize('admin', 'manager'), materialController.update);
router.delete('/:id', authorize('admin'), materialController.delete);
router.post('/:id/movement', materialController.recordMovement);

module.exports = router;
