// Check if user is logged in as HR
if (localStorage.getItem('userType') !== 'hr') {
    window.location.href = 'index.html';
}

// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.dashboard-section');
const logoutBtn = document.getElementById('logoutBtn');
const addEmployeeForm = document.getElementById('addEmployeeForm');
const addTaskForm = document.getElementById('addTaskForm');
const processSalaryForm = document.getElementById('processSalaryForm');
const attendanceDateInput = document.getElementById('attendanceDate');

// Initialize Data
let employees = JSON.parse(localStorage.getItem('employees')) || [];
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let attendance = JSON.parse(localStorage.getItem('attendance')) || [];
let leaveRequests = JSON.parse(localStorage.getItem('leaveRequests')) || [];

// Set today's date as default for attendance
if (attendanceDateInput) {
    attendanceDateInput.valueAsDate = new Date();
}

// Navigation
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        if (item.id === 'logoutBtn') {
            e.preventDefault();
            handleLogout();
            return;
        }

        const targetId = item.getAttribute('href').substring(1);
        
        // Update active states
        navItems.forEach(nav => nav.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));
        
        item.classList.add('active');
        document.getElementById(targetId).classList.add('active');

        // If attendance section is selected, load attendance data
        if (targetId === 'attendance') {
            markAttendance();
        }
    });
});

// Handle Logout
function handleLogout() {
    localStorage.removeItem('userType');
    window.location.href = 'index.html';
}

// Update Overview Stats
function updateStats() {
    document.getElementById('totalEmployees').textContent = employees.length;
    
    const today = new Date().toISOString().split('T')[0];
    const presentToday = attendance.filter(a => a.date === today && a.status === 'present').length;
    document.getElementById('presentToday').textContent = presentToday;
    
    const onLeave = leaveRequests.filter(l => l.status === 'approved' && 
        new Date(l.startDate) <= new Date() && new Date(l.endDate) >= new Date()).length;
    document.getElementById('onLeave').textContent = onLeave;
    
    const pendingTasks = tasks.filter(t => t.status === 'pending').length;
    document.getElementById('pendingTasks').textContent = pendingTasks;
}

// Employee Management
function displayEmployees() {
    const employeeTable = document.getElementById('employeeTable');
    if (!employeeTable) return;
    
    employeeTable.innerHTML = '';

    employees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.name}</td>
            <td>${employee.position}</td>
            <td>$${Number(employee.salary).toLocaleString()}</td>
            <td>
                <button class="edit" onclick="editEmployee('${employee.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete" onclick="deleteEmployee('${employee.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        employeeTable.appendChild(row);
    });
}

// Add Employee
if (addEmployeeForm) {
    addEmployeeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const empId = document.getElementById('empId').value;
        const empName = document.getElementById('empName').value;
        const empPosition = document.getElementById('empPosition').value;
        const empSalary = document.getElementById('empSalary').value;
        const empPassword = document.getElementById('empPassword').value;
        const empEmail = document.getElementById('empEmail').value;
        const empPhone = document.getElementById('empPhone').value;
        const empDepartment = document.getElementById('empDepartment').value;

        // Validate required fields
        if (!empId || !empName || !empPosition || !empSalary || !empPassword) {
            showNotification('Please fill in all required fields!', 'error');
            return;
        }

        // Check if employee ID already exists
        if (employees.some(emp => emp.id === empId)) {
            showNotification('Employee ID already exists!', 'error');
            return;
        }

        const employee = {
            id: empId,
            name: empName,
            position: empPosition,
            salary: empSalary,
            password: empPassword,
            email: empEmail,
            phone: empPhone,
            department: empDepartment,
            joinDate: new Date().toISOString().split('T')[0],
            leaves: {
                VL: 10,
                CL: 5,
                SL: 5
            },
            tasks: [],
            attendance: []
        };

        employees.push(employee);
        saveToLocalStorage();
        displayEmployees();
        updateStats();
        closeModal('addEmployeeModal');
        showNotification('Employee added successfully!');
        addEmployeeForm.reset();
    });
}

// Edit Employee
function editEmployee(empId) {
    const employee = employees.find(emp => emp.id === empId);
    if (!employee) return;

    document.getElementById('empId').value = employee.id;
    document.getElementById('empName').value = employee.name;
    document.getElementById('empPosition').value = employee.position;
    document.getElementById('empSalary').value = employee.salary;
    document.getElementById('empEmail').value = employee.email || '';
    document.getElementById('empPhone').value = employee.phone || '';
    document.getElementById('empDepartment').value = employee.department || '';

    openModal('addEmployeeModal');
}

// Delete Employee
function deleteEmployee(empId) {
    if (confirm('Are you sure you want to delete this employee?')) {
        employees = employees.filter(emp => emp.id !== empId);
        saveToLocalStorage();
        displayEmployees();
        updateStats();
        showNotification('Employee deleted successfully!');
    }
}

// Attendance Management
function markAttendance() {
    const date = document.getElementById('attendanceDate').value;
    if (!date) {
        showNotification('Please select a date!', 'error');
        return;
    }

    const attendanceTable = document.getElementById('attendanceTable');
    if (!attendanceTable) return;
    
    attendanceTable.innerHTML = '';

    employees.forEach(employee => {
        const existingRecord = attendance.find(a => 
            a.employeeId === employee.id && a.date === date
        );

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.name}</td>
            <td>
                <select onchange="updateAttendanceStatus('${employee.id}', '${date}', this.value)">
                    <option value="present" ${existingRecord?.status === 'present' ? 'selected' : ''}>Present</option>
                    <option value="absent" ${existingRecord?.status === 'absent' ? 'selected' : ''}>Absent</option>
                    <option value="late" ${existingRecord?.status === 'late' ? 'selected' : ''}>Late</option>
                </select>
            </td>
            <td>
                <input type="time" value="${existingRecord?.timeIn || ''}" 
                    onchange="updateAttendanceTime('${employee.id}', '${date}', 'in', this.value)">
            </td>
            <td>
                <input type="time" value="${existingRecord?.timeOut || ''}"
                    onchange="updateAttendanceTime('${employee.id}', '${date}', 'out', this.value)">
            </td>
            <td>
                <button onclick="saveAttendance('${employee.id}', '${date}')">
                    <i class="fas fa-save"></i> Save
                </button>
            </td>
        `;
        attendanceTable.appendChild(row);
    });
}

// Update Attendance Status
function updateAttendanceStatus(empId, date, status) {
    const existingRecord = attendance.find(a => 
        a.employeeId === empId && a.date === date
    );

    if (existingRecord) {
        existingRecord.status = status;
    } else {
        attendance.push({
            employeeId: empId,
            date,
            status,
            timeIn: '',
            timeOut: ''
        });
    }
    saveToLocalStorage();
}

// Update Attendance Time
function updateAttendanceTime(empId, date, type, time) {
    const record = attendance.find(a => 
        a.employeeId === empId && a.date === date
    );

    if (record) {
        record[type === 'in' ? 'timeIn' : 'timeOut'] = time;
        saveToLocalStorage();
    }
}

// Save Attendance
function saveAttendance(empId, date) {
    const record = attendance.find(a => 
        a.employeeId === empId && a.date === date
    );

    if (record) {
        saveToLocalStorage();
        showNotification('Attendance saved successfully!');
        updateStats();
    }
}

// Task Management
function displayTasks() {
    const taskTable = document.getElementById('taskTable');
    taskTable.innerHTML = '';

    tasks.forEach(task => {
        const employee = employees.find(e => e.id === task.employeeId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.id}</td>
            <td>${employee?.name || 'Unknown'}</td>
            <td>${task.description}</td>
            <td>${new Date(task.dueDate).toLocaleDateString()}</td>
            <td>
                <span class="status-badge ${task.status}">${task.status}</span>
            </td>
            <td>
                <button onclick="updateTaskStatus('${task.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteTask('${task.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        taskTable.appendChild(row);
    });
}

// Add Task
addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const task = {
        id: Date.now().toString(),
        employeeId: document.getElementById('taskEmployee').value,
        description: document.getElementById('taskDescription').value,
        dueDate: document.getElementById('taskDueDate').value,
        status: 'pending'
    };

    tasks.push(task);
    saveToLocalStorage();
    displayTasks();
    updateStats();
    closeModal('addTaskModal');
    showNotification('Task assigned successfully!');
    addTaskForm.reset();
});

// Update Task Status
function updateTaskStatus(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    task.status = newStatus;
    saveToLocalStorage();
    displayTasks();
    showNotification('Task status updated successfully!');
}

// Delete Task
function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveToLocalStorage();
        displayTasks();
        updateStats();
        showNotification('Task deleted successfully!');
    }
}

// Leave Management
function displayLeaveRequests() {
    const leaveTable = document.getElementById('leaveTable');
    leaveTable.innerHTML = '';

    leaveRequests.forEach(request => {
        const employee = employees.find(e => e.id === request.employeeId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee?.name || 'Unknown'}</td>
            <td>${request.type}</td>
            <td>${new Date(request.startDate).toLocaleDateString()}</td>
            <td>${new Date(request.endDate).toLocaleDateString()}</td>
            <td>${request.reason}</td>
            <td>
                <span class="status-badge ${request.status}">${request.status}</span>
            </td>
            <td>
                ${request.status === 'pending' ? `
                    <button onclick="updateLeaveStatus('${request.id}', 'approved')">
                        <i class="fas fa-check"></i>
                    </button>
                    <button onclick="updateLeaveStatus('${request.id}', 'rejected')">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
            </td>
        `;
        leaveTable.appendChild(row);
    });
}

// Update Leave Status
function updateLeaveStatus(requestId, status) {
    const request = leaveRequests.find(r => r.id === requestId);
    if (!request) return;

    request.status = status;
    
    if (status === 'approved') {
        const employee = employees.find(e => e.id === request.employeeId);
        if (employee) {
            employee.leaves[request.type] -= request.days;
        }
    }

    saveToLocalStorage();
    displayLeaveRequests();
    updateStats();
    showNotification('Leave request ' + status + ' successfully!');
}

// Salary Management
function displaySalary() {
    const salaryTable = document.getElementById('salaryTable');
    salaryTable.innerHTML = '';

    employees.forEach(employee => {
        const row = document.createElement('tr');
        const allowances = calculateAllowances(employee.salary);
        const deductions = calculateDeductions(employee.salary);
        const netSalary = Number(employee.salary) + allowances - deductions;

        row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.name}</td>
            <td>${employee.position}</td>
            <td>$${Number(employee.salary).toLocaleString()}</td>
            <td>$${allowances.toLocaleString()}</td>
            <td>$${deductions.toLocaleString()}</td>
            <td>$${netSalary.toLocaleString()}</td>
            <td>
                <span class="status-badge pending">Pending</span>
            </td>
            <td>
                <button onclick="processSalaryPayment('${employee.id}', ${netSalary})">
                    <i class="fas fa-money-bill-wave"></i> Pay
                </button>
            </td>
        `;
        salaryTable.appendChild(row);
    });
}

// Process Salary Payment
function processSalaryPayment(empId, amount) {
    document.getElementById('upiId').value = '';
    document.getElementById('amount').value = amount;
    openModal('processSalaryModal');
}

// Process Salary Form Submit
processSalaryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const upiId = document.getElementById('upiId').value;
    const amount = document.getElementById('amount').value;

    // In a real application, this would integrate with a payment gateway
    showNotification('Salary payment processed successfully!');
    closeModal('processSalaryModal');
});

// Helper Functions
function calculateAllowances(salary) {
    return Math.round(salary * 0.1); // 10% of basic salary
}

function calculateDeductions(salary) {
    return Math.round(salary * 0.05); // 5% of basic salary
}

function saveToLocalStorage() {
    localStorage.setItem('employees', JSON.stringify(employees));
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('attendance', JSON.stringify(attendance));
    localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests));
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type} show`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Initialize the dashboard
updateStats();
displayEmployees();
displayTasks();
displayLeaveRequests();
displaySalary();

// Add event listener for attendance date change
if (attendanceDateInput) {
    attendanceDateInput.addEventListener('change', markAttendance);
} 