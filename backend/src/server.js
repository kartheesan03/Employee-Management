require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { sequelize } = require('./models');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const materialRoutes = require('./routes/materials');
const hrmsRoutes = require('./routes/hrms');
const erpRoutes = require('./routes/erp');
const crmRoutes = require('./routes/crm');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/hrms', hrmsRoutes);
app.use('/api/erp', erpRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    await sequelize.sync({ alter: true });
    console.log('Database models synchronized');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
