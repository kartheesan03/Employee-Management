const express = require('express');
const router = express.Router();
const erpController = require('../controllers/erpController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/stats', erpController.getErpStats);

router.get('/vendors', erpController.getAllVendors);
router.get('/vendors/:id', erpController.getVendorById);
router.post('/vendors', authorize('admin', 'manager'), erpController.createVendor);
router.put('/vendors/:id', authorize('admin', 'manager'), erpController.updateVendor);
router.delete('/vendors/:id', authorize('admin'), erpController.deleteVendor);

router.get('/purchase-orders', erpController.getAllPurchaseOrders);
router.post('/purchase-orders', authorize('admin', 'manager'), erpController.createPurchaseOrder);
router.put('/purchase-orders/:id', authorize('admin', 'manager'), erpController.updatePurchaseOrder);

module.exports = router;
