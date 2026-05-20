# SMTBMS - Smart Material Tracking & Business Management System

A comprehensive web application integrating Material Tracking, HRMS, ERP, and CRM modules into a single unified platform.

## Features

### Material Tracking
- Real-time inventory management
- Material movement tracking (inbound/outbound/transfer)
- Low stock alerts and notifications
- Barcode/QR code integration support
- Stock monitoring dashboard

### HRMS (Human Resource Management)
- Employee data management
- Attendance tracking
- Leave request management with approval workflow
- Department-wise employee organization
- Employment type categorization

### ERP (Enterprise Resource Planning)
- Vendor management
- Purchase order creation and tracking
- Financial tracking (amounts, taxes, payments)
- Order status management
- Procurement analytics

### CRM (Customer Relationship Management)
- Customer database management
- Lead tracking and management
- Sales pipeline visualization
- Deal stage management
- Revenue tracking

### Core Features
- Centralized dashboard with real-time analytics
- Role-based access control (Admin, HR, Manager, Employee, Sales)
- Secure JWT authentication
- Responsive design
- Interactive charts and data visualization

## Technology Stack

- **Frontend:** React 18, React Router, Chart.js, Axios, React Toastify
- **Backend:** Node.js, Express.js, Sequelize ORM
- **Database:** MySQL 8.0
- **Authentication:** JWT (JSON Web Tokens)
- **Containerization:** Docker & Docker Compose

## Quick Start

### Using Docker (Recommended)

```bash
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MySQL: localhost:3306

### Manual Setup

#### Prerequisites
- Node.js 18+
- MySQL 8.0+

#### Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
npm install
npm run seed  # Seed the database with sample data
npm run dev   # Start development server
```

#### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Default Login Credentials

| Role    | Email               | Password   |
|---------|---------------------|------------|
| Admin   | admin@smtbms.com    | admin123   |
| HR      | hr@smtbms.com       | hr123456   |
| Manager | manager@smtbms.com  | manager123 |
| Sales   | sales@smtbms.com    | sales123   |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update profile

### Materials
- `GET /api/materials` - List all materials
- `POST /api/materials` - Create material
- `GET /api/materials/:id` - Get material details
- `PUT /api/materials/:id` - Update material
- `DELETE /api/materials/:id` - Delete material
- `POST /api/materials/:id/movement` - Record movement
- `GET /api/materials/low-stock` - Get low stock items
- `GET /api/materials/stats` - Get material statistics

### HRMS
- `GET /api/hrms/employees` - List employees
- `POST /api/hrms/employees` - Create employee
- `GET /api/hrms/attendance` - Get attendance records
- `POST /api/hrms/attendance` - Mark attendance
- `GET /api/hrms/leaves` - Get leave requests
- `POST /api/hrms/leaves` - Create leave request
- `PUT /api/hrms/leaves/:id` - Update leave request

### ERP
- `GET /api/erp/vendors` - List vendors
- `POST /api/erp/vendors` - Create vendor
- `GET /api/erp/purchase-orders` - List purchase orders
- `POST /api/erp/purchase-orders` - Create purchase order

### CRM
- `GET /api/crm/customers` - List customers
- `POST /api/crm/customers` - Create customer
- `GET /api/crm/leads` - List leads
- `POST /api/crm/leads` - Create lead
- `GET /api/crm/pipeline` - Get sales pipeline

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

## User Roles & Permissions

| Feature           | Admin | HR  | Manager | Employee | Sales |
|-------------------|-------|-----|---------|----------|-------|
| Dashboard         | Full  | Full| Full    | Limited  | Full  |
| Materials         | CRUD  | -   | CRUD    | Read     | -     |
| Employees         | CRUD  | CRUD| Read    | -        | -     |
| Attendance        | CRUD  | CRUD| CRUD    | -        | -     |
| Leave Management  | All   | All | Approve | Request  | -     |
| Vendors           | CRUD  | -   | CRUD    | -        | -     |
| Purchase Orders   | CRUD  | -   | CRUD    | -        | -     |
| Customers         | CRUD  | -   | CRUD    | -        | CRUD  |
| Sales Pipeline    | CRUD  | -   | CRUD    | -        | CRUD  |
| Settings          | Full  | -   | -       | -        | -     |

## Project Structure

```
smtbms/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/      # Auth & error handling
│   │   ├── models/          # Sequelize models
│   │   ├── routes/          # API routes
│   │   ├── seeders/         # Database seeders
│   │   └── server.js        # Entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context (Auth)
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   └── App.js           # Main app with routing
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## License

MIT
