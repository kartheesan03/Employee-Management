// Sample HR credentials (in a real application, this would be in a secure database)
const HR_CREDENTIALS = {
    email: 'hr@company.com',
    password: 'hr123'
};

// Initialize employees array in localStorage if not exists
if (!localStorage.getItem('employees')) {
    const initialEmployees = [
        {
            id: 'EMP001',
            password: 'emp123',
            name: 'John Doe',
            position: 'Developer',
            salary: 5000,
            email: 'john@company.com',
            phone: '1234567890',
            department: 'IT',
            joinDate: '2023-01-01',
            leaves: {
                VL: 10,
                CL: 5,
                SL: 5
            },
            tasks: [],
            attendance: []
        }
    ];
    localStorage.setItem('employees', JSON.stringify(initialEmployees));
}

// DOM Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const loginForms = document.querySelectorAll('.login-form');
const hrLoginForm = document.getElementById('hrLoginForm');
const employeeLoginForm = document.getElementById('employeeLoginForm');

// Tab Switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and forms
        tabBtns.forEach(b => b.classList.remove('active'));
        loginForms.forEach(f => f.classList.remove('active'));
        
        // Add active class to clicked button and corresponding form
        btn.classList.add('active');
        const formId = btn.dataset.tab === 'hr' ? 'hrLoginForm' : 'employeeLoginForm';
        document.getElementById(formId).classList.add('active');
    });
});

// HR Login Handler
hrLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('hrEmail').value;
    const password = document.getElementById('hrPassword').value;

    if (email === HR_CREDENTIALS.email && password === HR_CREDENTIALS.password) {
        localStorage.setItem('userType', 'hr');
        window.location.href = 'hr-dashboard.html';
    } else {
        showNotification('Invalid HR credentials!', 'error');
    }
});

// Employee Login Handler
employeeLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const empId = document.getElementById('empId').value;
    const password = document.getElementById('empPassword').value;

    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    const employee = employees.find(emp => emp.id === empId && emp.password === password);

    if (employee) {
        localStorage.setItem('userType', 'employee');
        localStorage.setItem('employeeId', empId);
        window.location.href = 'employee-dashboard.html';
    } else {
        showNotification('Invalid employee credentials!', 'error');
    }
});

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type} show`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
} 