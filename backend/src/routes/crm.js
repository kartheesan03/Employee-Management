const express = require('express');
const router = express.Router();
const crmController = require('../controllers/crmController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/stats', crmController.getCrmStats);
router.get('/pipeline', crmController.getSalesPipeline);

router.get('/customers', crmController.getAllCustomers);
router.get('/customers/:id', crmController.getCustomerById);
router.post('/customers', authorize('admin', 'manager', 'sales'), crmController.createCustomer);
router.put('/customers/:id', authorize('admin', 'manager', 'sales'), crmController.updateCustomer);
router.delete('/customers/:id', authorize('admin'), crmController.deleteCustomer);

router.get('/leads', crmController.getAllLeads);
router.post('/leads', authorize('admin', 'manager', 'sales'), crmController.createLead);
router.put('/leads/:id', authorize('admin', 'manager', 'sales'), crmController.updateLead);

module.exports = router;
