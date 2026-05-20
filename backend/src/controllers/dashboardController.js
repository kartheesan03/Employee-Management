const { Material, Employee, Vendor, Customer, Lead, PurchaseOrder, LeaveRequest } = require('../models');

exports.getDashboardStats = async (_req, res, next) => {
  try {
    const [
      totalMaterials,
      lowStockMaterials,
      totalEmployees,
      activeEmployees,
      totalVendors,
      totalCustomers,
      activeLeads,
      pendingOrders,
      pendingLeaves,
      totalRevenue,
    ] = await Promise.all([
      Material.count(),
      Material.count({ where: { status: 'low_stock' } }),
      Employee.count(),
      Employee.count({ where: { status: 'active' } }),
      Vendor.count({ where: { status: 'active' } }),
      Customer.count(),
      Lead.count({ where: { status: 'active' } }),
      PurchaseOrder.count({ where: { status: 'pending' } }),
      LeaveRequest.count({ where: { status: 'pending' } }),
      Customer.sum('total_revenue'),
    ]);

    const recentMaterials = await Material.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
    });

    const recentOrders = await PurchaseOrder.findAll({
      limit: 5,
      order: [['created_at', 'DESC']],
      include: [{ model: Vendor, as: 'vendor', attributes: ['name'] }],
    });

    const salesPipeline = await Lead.findAll({
      attributes: [
        'stage',
        [Lead.sequelize.fn('COUNT', Lead.sequelize.col('id')), 'count'],
        [Lead.sequelize.fn('SUM', Lead.sequelize.col('value')), 'total_value'],
      ],
      where: { status: 'active' },
      group: ['stage'],
    });

    return res.json({
      stats: {
        materials: { total: totalMaterials, lowStock: lowStockMaterials },
        hr: { total: totalEmployees, active: activeEmployees, pendingLeaves },
        erp: { vendors: totalVendors, pendingOrders },
        crm: { customers: totalCustomers, activeLeads, totalRevenue: totalRevenue || 0 },
      },
      recentMaterials,
      recentOrders,
      salesPipeline,
    });
  } catch (error) {
    next(error);
  }
};
