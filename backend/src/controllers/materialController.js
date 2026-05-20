const { Op } = require('sequelize');
const { Material, MaterialMovement, Vendor, User } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, category, status } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { sku: { [Op.like]: `%${search}%` } },
      ];
    }
    if (category) where.category = category;
    if (status) where.status = status;

    const { count, rows } = await Material.findAndCountAll({
      where,
      include: [{ model: Vendor, as: 'supplier', attributes: ['id', 'name'] }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });

    return res.json({
      materials: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const material = await Material.findByPk(req.params.id, {
      include: [
        { model: Vendor, as: 'supplier' },
        {
          model: MaterialMovement,
          as: 'movements',
          limit: 20,
          order: [['created_at', 'DESC']],
          include: [{ model: User, as: 'performedBy', attributes: ['id', 'first_name', 'last_name'] }],
        },
      ],
    });

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    return res.json({ material });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const material = await Material.create(req.body);
    return res.status(201).json({ material });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const material = await Material.findByPk(req.params.id);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    await material.update(req.body);
    return res.json({ material });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const material = await Material.findByPk(req.params.id);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    await material.destroy();
    return res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.recordMovement = async (req, res, next) => {
  try {
    const material = await Material.findByPk(req.params.id);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    const { movement_type, quantity, from_location, to_location, reference_number, notes } = req.body;

    if (movement_type === 'inbound') {
      material.quantity += quantity;
    } else if (movement_type === 'outbound') {
      if (material.quantity < quantity) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }
      material.quantity -= quantity;
    }
    await material.save();

    const movement = await MaterialMovement.create({
      material_id: material.id,
      movement_type,
      quantity,
      from_location,
      to_location,
      reference_number,
      notes,
      performed_by: req.user.id,
    });

    return res.status(201).json({ movement, material });
  } catch (error) {
    next(error);
  }
};

exports.getLowStock = async (_req, res, next) => {
  try {
    const materials = await Material.findAll({
      where: {
        status: { [Op.in]: ['low_stock', 'out_of_stock'] },
      },
      include: [{ model: Vendor, as: 'supplier', attributes: ['id', 'name'] }],
      order: [['quantity', 'ASC']],
    });
    return res.json({ materials });
  } catch (error) {
    next(error);
  }
};

exports.getStats = async (_req, res, next) => {
  try {
    const totalMaterials = await Material.count();
    const inStock = await Material.count({ where: { status: 'in_stock' } });
    const lowStock = await Material.count({ where: { status: 'low_stock' } });
    const outOfStock = await Material.count({ where: { status: 'out_of_stock' } });
    const totalValue = await Material.sum(
      Material.sequelize.literal('quantity * unit_price')
    );

    return res.json({
      stats: { totalMaterials, inStock, lowStock, outOfStock, totalValue: totalValue || 0 },
    });
  } catch (error) {
    next(error);
  }
};
