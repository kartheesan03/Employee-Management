const { Op } = require('sequelize');
const { Employee, User, Attendance, LeaveRequest } = require('../models');

exports.getAllEmployees = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, department, status } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (department) where.department = department;
    if (status) where.status = status;

    const includeWhere = {};
    if (search) {
      includeWhere[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Employee.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'role'],
        where: Object.keys(includeWhere).length ? includeWhere : undefined,
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });

    return res.json({
      employees: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        { model: Attendance, as: 'attendanceRecords', limit: 30, order: [['date', 'DESC']] },
        { model: LeaveRequest, as: 'leaveRequests', limit: 10, order: [['created_at', 'DESC']] },
      ],
    });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    return res.json({ employee });
  } catch (error) {
    next(error);
  }
};

exports.createEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.create(req.body);
    return res.status(201).json({ employee });
  } catch (error) {
    next(error);
  }
};

exports.updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    await employee.update(req.body);
    return res.json({ employee });
  } catch (error) {
    next(error);
  }
};

exports.markAttendance = async (req, res, next) => {
  try {
    const { employee_id, date, check_in, check_out, status, notes } = req.body;

    const existing = await Attendance.findOne({
      where: { employee_id, date },
    });
    if (existing) {
      await existing.update({ check_in, check_out, status, notes });
      return res.json({ attendance: existing });
    }

    const attendance = await Attendance.create({
      employee_id, date, check_in, check_out, status, notes,
    });
    return res.status(201).json({ attendance });
  } catch (error) {
    next(error);
  }
};

exports.getAttendance = async (req, res, next) => {
  try {
    const { employee_id, start_date, end_date } = req.query;
    const where = {};

    if (employee_id) where.employee_id = employee_id;
    if (start_date && end_date) {
      where.date = { [Op.between]: [start_date, end_date] };
    }

    const records = await Attendance.findAll({
      where,
      include: [{
        model: Employee,
        as: 'employee',
        include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }],
      }],
      order: [['date', 'DESC']],
    });
    return res.json({ attendance: records });
  } catch (error) {
    next(error);
  }
};

exports.createLeaveRequest = async (req, res, next) => {
  try {
    const leave = await LeaveRequest.create(req.body);
    return res.status(201).json({ leave });
  } catch (error) {
    next(error);
  }
};

exports.updateLeaveRequest = async (req, res, next) => {
  try {
    const leave = await LeaveRequest.findByPk(req.params.id);
    if (!leave) {
      return res.status(404).json({ error: 'Leave request not found' });
    }
    await leave.update(req.body);
    return res.json({ leave });
  } catch (error) {
    next(error);
  }
};

exports.getLeaveRequests = async (req, res, next) => {
  try {
    const { status, employee_id } = req.query;
    const where = {};
    if (status) where.status = status;
    if (employee_id) where.employee_id = employee_id;

    const leaves = await LeaveRequest.findAll({
      where,
      include: [{
        model: Employee,
        as: 'employee',
        include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }],
      }],
      order: [['created_at', 'DESC']],
    });
    return res.json({ leaves });
  } catch (error) {
    next(error);
  }
};

exports.getHrmsStats = async (_req, res, next) => {
  try {
    const totalEmployees = await Employee.count();
    const activeEmployees = await Employee.count({ where: { status: 'active' } });
    const onLeave = await Employee.count({ where: { status: 'on_leave' } });
    const pendingLeaves = await LeaveRequest.count({ where: { status: 'pending' } });
    const departments = await Employee.findAll({
      attributes: ['department', [Employee.sequelize.fn('COUNT', Employee.sequelize.col('id')), 'count']],
      group: ['department'],
    });

    return res.json({
      stats: { totalEmployees, activeEmployees, onLeave, pendingLeaves, departments },
    });
  } catch (error) {
    next(error);
  }
};
