const { Op } = require('sequelize');
const { Vendor, PurchaseOrder, User } = require('../models');

exports.getAllVendors = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { contact_person: { [Op.like]: `%${search}%` } },
      ];
    }
    if (status) where.status = status;

    const { count, rows } = await Vendor.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });

    return res.json({
      vendors: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getVendorById = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id, {
      include: [{
        model: PurchaseOrder,
        as: 'purchaseOrders',
        limit: 10,
        order: [['created_at', 'DESC']],
      }],
    });
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    return res.json({ vendor });
  } catch (error) {
    next(error);
  }
};

exports.createVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.create(req.body);
    return res.status(201).json({ vendor });
  } catch (error) {
    next(error);
  }
};

exports.updateVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    await vendor.update(req.body);
    return res.json({ vendor });
  } catch (error) {
    next(error);
  }
};

exports.deleteVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    await vendor.destroy();
    return res.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getAllPurchaseOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, vendor_id } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;
    if (vendor_id) where.vendor_id = vendor_id;

    const { count, rows } = await PurchaseOrder.findAndCountAll({
      where,
      include: [
        { model: Vendor, as: 'vendor', attributes: ['id', 'name'] },
        { model: User, as: 'createdBy', attributes: ['id', 'first_name', 'last_name'] },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });

    return res.json({
      orders: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.createPurchaseOrder = async (req, res, next) => {
  try {
    const order = await PurchaseOrder.create({
      ...req.body,
      created_by: req.user.id,
    });
    return res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
};

exports.updatePurchaseOrder = async (req, res, next) => {
  try {
    const order = await PurchaseOrder.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }
    await order.update(req.body);
    return res.json({ order });
  } catch (error) {
    next(error);
  }
};

exports.getErpStats = async (_req, res, next) => {
  try {
    const totalVendors = await Vendor.count();
    const activeVendors = await Vendor.count({ where: { status: 'active' } });
    const totalOrders = await PurchaseOrder.count();
    const pendingOrders = await PurchaseOrder.count({ where: { status: 'pending' } });
    const totalOrderValue = await PurchaseOrder.sum('net_amount') || 0;
    const unpaidOrders = await PurchaseOrder.count({ where: { payment_status: 'unpaid' } });

    return res.json({
      stats: { totalVendors, activeVendors, totalOrders, pendingOrders, totalOrderValue, unpaidOrders },
    });
  } catch (error) {
    next(error);
  }
};
