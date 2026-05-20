const { Op } = require('sequelize');
const { Customer, Lead, User } = require('../models');

exports.getAllCustomers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, customer_type, status } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { company_name: { [Op.like]: `%${search}%` } },
        { contact_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }
    if (customer_type) where.customer_type = customer_type;
    if (status) where.status = status;

    const { count, rows } = await Customer.findAndCountAll({
      where,
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'first_name', 'last_name'] },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });

    return res.json({
      customers: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findByPk(req.params.id, {
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'first_name', 'last_name'] },
        { model: Lead, as: 'leads', order: [['created_at', 'DESC']] },
      ],
    });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    return res.json({ customer });
  } catch (error) {
    next(error);
  }
};

exports.createCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.create(req.body);
    return res.status(201).json({ customer });
  } catch (error) {
    next(error);
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    await customer.update(req.body);
    return res.json({ customer });
  } catch (error) {
    next(error);
  }
};

exports.deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    await customer.destroy();
    return res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getAllLeads = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, stage, status } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (stage) where.stage = stage;
    if (status) where.status = status;

    const { count, rows } = await Lead.findAndCountAll({
      where,
      include: [
        { model: Customer, as: 'customer', attributes: ['id', 'company_name', 'contact_name'] },
        { model: User, as: 'assignedUser', attributes: ['id', 'first_name', 'last_name'] },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });

    return res.json({
      leads: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.createLead = async (req, res, next) => {
  try {
    const lead = await Lead.create(req.body);
    return res.status(201).json({ lead });
  } catch (error) {
    next(error);
  }
};

exports.updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByPk(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    await lead.update(req.body);
    return res.json({ lead });
  } catch (error) {
    next(error);
  }
};

exports.getSalesPipeline = async (_req, res, next) => {
  try {
    const pipeline = await Lead.findAll({
      attributes: [
        'stage',
        [Lead.sequelize.fn('COUNT', Lead.sequelize.col('id')), 'count'],
        [Lead.sequelize.fn('SUM', Lead.sequelize.col('value')), 'total_value'],
      ],
      where: { status: 'active' },
      group: ['stage'],
    });
    return res.json({ pipeline });
  } catch (error) {
    next(error);
  }
};

exports.getCrmStats = async (_req, res, next) => {
  try {
    const totalCustomers = await Customer.count();
    const activeCustomers = await Customer.count({ where: { status: 'active' } });
    const totalLeads = await Lead.count({ where: { status: 'active' } });
    const totalRevenue = await Customer.sum('total_revenue') || 0;
    const wonDeals = await Lead.count({ where: { stage: 'closed_won' } });
    const lostDeals = await Lead.count({ where: { stage: 'closed_lost' } });

    const customerTypes = await Customer.findAll({
      attributes: [
        'customer_type',
        [Customer.sequelize.fn('COUNT', Customer.sequelize.col('id')), 'count'],
      ],
      group: ['customer_type'],
    });

    return res.json({
      stats: { totalCustomers, activeCustomers, totalLeads, totalRevenue, wonDeals, lostDeals, customerTypes },
    });
  } catch (error) {
    next(error);
  }
};
