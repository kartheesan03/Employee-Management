require('dotenv').config();
const { sequelize, User, Material, Employee, Vendor, Customer, Lead, PurchaseOrder } = require('../models');

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced');

    const admin = await User.create({
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@smtbms.com',
      password: 'admin123',
      role: 'admin',
      department: 'Administration',
    });

    const hrUser = await User.create({
      first_name: 'Sarah',
      last_name: 'Johnson',
      email: 'hr@smtbms.com',
      password: 'hr123456',
      role: 'hr',
      department: 'Human Resources',
    });

    const manager = await User.create({
      first_name: 'Michael',
      last_name: 'Brown',
      email: 'manager@smtbms.com',
      password: 'manager123',
      role: 'manager',
      department: 'Operations',
    });

    const salesUser = await User.create({
      first_name: 'Emily',
      last_name: 'Davis',
      email: 'sales@smtbms.com',
      password: 'sales123',
      role: 'sales',
      department: 'Sales',
    });

    const employees = [];
    const empUsers = [hrUser, manager, salesUser];
    const departments = ['Human Resources', 'Operations', 'Sales'];
    const designations = ['HR Manager', 'Operations Manager', 'Sales Executive'];

    for (let i = 0; i < empUsers.length; i++) {
      const emp = await Employee.create({
        user_id: empUsers[i].id,
        employee_id: `EMP${String(i + 1).padStart(4, '0')}`,
        department: departments[i],
        designation: designations[i],
        date_of_joining: '2023-01-15',
        salary: 50000 + (i * 10000),
        employment_type: 'full_time',
        status: 'active',
      });
      employees.push(emp);
    }

    for (let i = 0; i < 5; i++) {
      const user = await User.create({
        first_name: ['John', 'Jane', 'Robert', 'Lisa', 'David'][i],
        last_name: ['Smith', 'Wilson', 'Taylor', 'Anderson', 'Thomas'][i],
        email: `employee${i + 1}@smtbms.com`,
        password: 'emp12345',
        role: 'employee',
        department: ['Engineering', 'Marketing', 'Engineering', 'Finance', 'Operations'][i],
      });

      await Employee.create({
        user_id: user.id,
        employee_id: `EMP${String(i + 4).padStart(4, '0')}`,
        department: ['Engineering', 'Marketing', 'Engineering', 'Finance', 'Operations'][i],
        designation: ['Software Engineer', 'Marketing Specialist', 'Senior Engineer', 'Accountant', 'Logistics Coordinator'][i],
        date_of_joining: '2023-06-01',
        salary: 40000 + (i * 5000),
        employment_type: 'full_time',
        status: 'active',
      });
    }

    const vendors = await Vendor.bulkCreate([
      { name: 'Steel Corp Inc.', email: 'info@steelcorp.com', phone: '+1-555-0101', contact_person: 'James Miller', category: 'Raw Materials', rating: 4.5, payment_terms: 'Net 30', status: 'active' },
      { name: 'ElectroSupply Ltd.', email: 'sales@electrosupply.com', phone: '+1-555-0102', contact_person: 'Anna Chen', category: 'Electronics', rating: 4.2, payment_terms: 'Net 15', status: 'active' },
      { name: 'PackagePro', email: 'orders@packagepro.com', phone: '+1-555-0103', contact_person: 'Tom Harris', category: 'Packaging', rating: 3.8, payment_terms: 'Net 45', status: 'active' },
      { name: 'ChemWorks Global', email: 'supply@chemworks.com', phone: '+1-555-0104', contact_person: 'Dr. Patel', category: 'Chemicals', rating: 4.7, payment_terms: 'Net 30', status: 'active' },
      { name: 'FastLogistics Co.', email: 'logistics@fastlog.com', phone: '+1-555-0105', contact_person: 'Maria Garcia', category: 'Logistics', rating: 4.0, payment_terms: 'Net 15', status: 'active' },
    ]);

    await Material.bulkCreate([
      { name: 'Steel Sheets (1mm)', sku: 'STL-001', category: 'Raw Materials', quantity: 500, unit: 'sheets', unit_price: 45.00, reorder_level: 50, location: 'Warehouse A', supplier_id: vendors[0].id, status: 'in_stock' },
      { name: 'Copper Wire (10m)', sku: 'COP-001', category: 'Raw Materials', quantity: 200, unit: 'rolls', unit_price: 25.50, reorder_level: 30, location: 'Warehouse A', supplier_id: vendors[0].id, status: 'in_stock' },
      { name: 'Circuit Board Type-A', sku: 'ELC-001', category: 'Electronics', quantity: 15, unit: 'pieces', unit_price: 120.00, reorder_level: 20, location: 'Warehouse B', supplier_id: vendors[1].id, status: 'low_stock' },
      { name: 'LED Display Module', sku: 'ELC-002', category: 'Electronics', quantity: 0, unit: 'pieces', unit_price: 85.00, reorder_level: 10, location: 'Warehouse B', supplier_id: vendors[1].id, status: 'out_of_stock' },
      { name: 'Cardboard Box (Large)', sku: 'PKG-001', category: 'Packaging', quantity: 1000, unit: 'pieces', unit_price: 3.50, reorder_level: 100, location: 'Warehouse C', supplier_id: vendors[2].id, status: 'in_stock' },
      { name: 'Bubble Wrap Roll', sku: 'PKG-002', category: 'Packaging', quantity: 75, unit: 'rolls', unit_price: 15.00, reorder_level: 20, location: 'Warehouse C', supplier_id: vendors[2].id, status: 'in_stock' },
      { name: 'Industrial Adhesive', sku: 'CHM-001', category: 'Chemicals', quantity: 8, unit: 'liters', unit_price: 55.00, reorder_level: 10, location: 'Warehouse D', supplier_id: vendors[3].id, status: 'low_stock' },
      { name: 'Aluminum Ingots', sku: 'ALM-001', category: 'Raw Materials', quantity: 300, unit: 'kg', unit_price: 12.00, reorder_level: 50, location: 'Warehouse A', supplier_id: vendors[0].id, status: 'in_stock' },
    ]);

    await PurchaseOrder.bulkCreate([
      { order_number: 'PO-2024-001', vendor_id: vendors[0].id, order_date: '2024-01-15', expected_delivery: '2024-02-15', total_amount: 22500.00, tax_amount: 4050.00, net_amount: 26550.00, status: 'received', payment_status: 'paid', created_by: admin.id },
      { order_number: 'PO-2024-002', vendor_id: vendors[1].id, order_date: '2024-02-01', expected_delivery: '2024-02-20', total_amount: 6000.00, tax_amount: 1080.00, net_amount: 7080.00, status: 'ordered', payment_status: 'unpaid', created_by: manager.id },
      { order_number: 'PO-2024-003', vendor_id: vendors[2].id, order_date: '2024-02-10', expected_delivery: '2024-03-01', total_amount: 3500.00, tax_amount: 630.00, net_amount: 4130.00, status: 'pending', payment_status: 'unpaid', created_by: manager.id },
    ]);

    const customers = await Customer.bulkCreate([
      { company_name: 'TechStart Solutions', contact_name: 'Alex Johnson', email: 'alex@techstart.com', phone: '+1-555-1001', industry: 'Technology', source: 'website', customer_type: 'customer', total_revenue: 150000.00, assigned_to: salesUser.id, status: 'active' },
      { company_name: 'Green Energy Corp', contact_name: 'Patricia Lee', email: 'patricia@greenenergy.com', phone: '+1-555-1002', industry: 'Energy', source: 'referral', customer_type: 'customer', total_revenue: 85000.00, assigned_to: salesUser.id, status: 'active' },
      { company_name: 'BuildRight Construction', contact_name: 'Mark Thompson', email: 'mark@buildright.com', phone: '+1-555-1003', industry: 'Construction', source: 'exhibition', customer_type: 'prospect', total_revenue: 0, assigned_to: salesUser.id, status: 'active' },
      { company_name: 'MediCare Plus', contact_name: 'Dr. Susan White', email: 'susan@medicareplus.com', phone: '+1-555-1004', industry: 'Healthcare', source: 'cold_call', customer_type: 'lead', total_revenue: 0, assigned_to: salesUser.id, status: 'active' },
      { company_name: 'AutoParts Global', contact_name: 'Kevin Rodriguez', email: 'kevin@autoparts.com', phone: '+1-555-1005', industry: 'Automotive', source: 'social_media', customer_type: 'customer', total_revenue: 220000.00, assigned_to: salesUser.id, status: 'active' },
    ]);

    await Lead.bulkCreate([
      { customer_id: customers[0].id, title: 'Enterprise Software Package', value: 75000.00, stage: 'proposal', probability: 60, expected_close_date: '2024-04-30', assigned_to: salesUser.id, source: 'website', status: 'active' },
      { customer_id: customers[1].id, title: 'Solar Panel Components', value: 120000.00, stage: 'negotiation', probability: 80, expected_close_date: '2024-03-31', assigned_to: salesUser.id, source: 'referral', status: 'active' },
      { customer_id: customers[2].id, title: 'Construction Material Supply', value: 250000.00, stage: 'qualified', probability: 40, expected_close_date: '2024-06-30', assigned_to: salesUser.id, source: 'exhibition', status: 'active' },
      { customer_id: customers[3].id, title: 'Medical Equipment Order', value: 45000.00, stage: 'contacted', probability: 20, expected_close_date: '2024-05-31', assigned_to: salesUser.id, source: 'cold_call', status: 'active' },
      { customer_id: customers[4].id, title: 'Auto Parts Bulk Order', value: 180000.00, stage: 'closed_won', probability: 100, expected_close_date: '2024-02-28', assigned_to: salesUser.id, source: 'social_media', status: 'active' },
    ]);

    console.log('Seed data created successfully!');
    console.log('\nDefault login credentials:');
    console.log('  Admin: admin@smtbms.com / admin123');
    console.log('  HR: hr@smtbms.com / hr123456');
    console.log('  Manager: manager@smtbms.com / manager123');
    console.log('  Sales: sales@smtbms.com / sales123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
