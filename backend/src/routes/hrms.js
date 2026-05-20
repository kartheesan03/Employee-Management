const express = require('express');
const router = express.Router();
const hrmsController = require('../controllers/hrmsController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/stats', hrmsController.getHrmsStats);
router.get('/employees', hrmsController.getAllEmployees);
router.get('/employees/:id', hrmsController.getEmployeeById);
router.post('/employees', authorize('admin', 'hr'), hrmsController.createEmployee);
router.put('/employees/:id', authorize('admin', 'hr'), hrmsController.updateEmployee);

router.get('/attendance', hrmsController.getAttendance);
router.post('/attendance', authorize('admin', 'hr', 'manager'), hrmsController.markAttendance);

router.get('/leaves', hrmsController.getLeaveRequests);
router.post('/leaves', hrmsController.createLeaveRequest);
router.put('/leaves/:id', authorize('admin', 'hr', 'manager'), hrmsController.updateLeaveRequest);

module.exports = router;
