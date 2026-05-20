// Check if user is logged in as employee
if (localStorage.getItem('userType') !== 'employee') {
    window.location.href = 'index.html';
}

// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.dashboard-section');
const logoutBtn = document.getElementById('logoutBtn');
const leaveForm = document.getElementById('leaveForm');

// Get Employee Data
const employeeId = localStorage.getItem('employeeId');
const employees = JSON.parse(localStorage.getItem('employees')) || [];
const employee = employees.find(emp => emp.id === employeeId);

if (!employee) {
    window.location.href = 'index.html';
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
    });
});

// Handle Logout
function handleLogout() {
    localStorage.removeItem('userType');
    localStorage.removeItem('employeeId');
    window.location.href = 'index.html';
}

// Update Overview Stats
function updateStats() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const attendance = JSON.parse(localStorage.getItem('attendance')) || [];
    const leaveRequests = JSON.parse(localStorage.getItem('leaveRequests')) || [];

    // Pending Tasks
    const pendingTasks = tasks.filter(t => t.employeeId === employeeId && t.status === 'pending').length;
    document.getElementById('pendingTasks').textContent = pendingTasks;

    // Attendance Status
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.find(a => a.employeeId === employeeId && a.date === today);
    document.getElementById('attendanceStatus').textContent = todayAttendance ? todayAttendance.status : 'Not Marked';

    // Leave Balance
    document.getElementById('vlBalance').textContent = employee.leaves.VL;
    document.getElementById('clBalance').textContent = employee.leaves.CL;
    document.getElementById('slBalance').textContent = employee.leaves.SL;
}

// Display Profile
function displayProfile() {
    document.getElementById('profileName').textContent = employee.name;
    document.getElementById('profileId').textContent = employee.id;
    document.getElementById('profilePosition').textContent = employee.position;
    document.getElementById('profileDepartment').textContent = employee.department || 'Not Assigned';
    document.getElementById('profileEmail').textContent = employee.email || 'Not Provided';
    document.getElementById('profilePhone').textContent = employee.phone || 'Not Provided';
    document.getElementById('profileJoinDate').textContent = new Date(employee.joinDate).toLocaleDateString();
}

// Display Attendance
function displayAttendance() {
    const attendance = JSON.parse(localStorage.getItem('attendance')) || [];
    const attendanceTable = document.getElementById('attendanceTable');
    attendanceTable.innerHTML = '';

    const employeeAttendance = attendance
        .filter(a => a.employeeId === employeeId)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    employeeAttendance.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(record.date).toLocaleDateString()}</td>
            <td>${record.status}</td>
            <td>${record.timeIn || 'Not Recorded'}</td>
            <td>${record.timeOut || 'Not Recorded'}</td>
        `;
        attendanceTable.appendChild(row);
    });
}

// Display Tasks
function displayTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskTable = document.getElementById('taskTable');
    taskTable.innerHTML = '';

    const employeeTasks = tasks
        .filter(t => t.employeeId === employeeId)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    employeeTasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.description}</td>
            <td>${new Date(task.dueDate).toLocaleDateString()}</td>
            <td>
                <span class="status-badge ${task.status}">${task.status}</span>
            </td>
            <td>
                <button onclick="updateTaskStatus('${task.id}')">
                    <i class="fas fa-check"></i> Complete
                </button>
            </td>
        `;
        taskTable.appendChild(row);
    });
}

// Update Task Status
function updateTaskStatus(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
        task.status = 'completed';
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks();
        updateStats();
        showNotification('Task marked as completed!');
    }
}

// Display Leaves
function displayLeaves() {
    const leaveRequests = JSON.parse(localStorage.getItem('leaveRequests')) || [];
    const leaveTable = document.getElementById('leaveTable');
    leaveTable.innerHTML = '';

    const employeeLeaves = leaveRequests
        .filter(l => l.employeeId === employeeId)
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    employeeLeaves.forEach(leave => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${leave.type}</td>
            <td>${new Date(leave.startDate).toLocaleDateString()}</td>
            <td>${new Date(leave.endDate).toLocaleDateString()}</td>
            <td>${leave.days}</td>
            <td>${leave.reason}</td>
            <td>
                <span class="status-badge ${leave.status}">${leave.status}</span>
            </td>
        `;
        leaveTable.appendChild(row);
    });
}

// Apply Leave
leaveForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const type = document.getElementById('leaveType').value;
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const reason = document.getElementById('leaveReason').value;

    // Calculate days
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    // Validate leave balance
    if (employee.leaves[type] < days) {
        showNotification('Insufficient leave balance!', 'error');
        return;
    }

    // Create leave request
    const leaveRequest = {
        id: Date.now().toString(),
        employeeId,
        type,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        days,
        reason,
        status: 'pending'
    };

    // Save leave request
    const leaveRequests = JSON.parse(localStorage.getItem('leaveRequests')) || [];
    leaveRequests.push(leaveRequest);
    localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests));

    // Update UI
    displayLeaves();
    updateStats();
    showNotification('Leave request submitted successfully!');
    leaveForm.reset();
});

// Display Salary
function displaySalary() {
    const salaryTable = document.getElementById('salaryTable');
    salaryTable.innerHTML = '';

    const allowances = calculateAllowances(employee.salary);
    const deductions = calculateDeductions(employee.salary);
    const netSalary = Number(employee.salary) + allowances - deductions;

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${employee.position}</td>
        <td>$${Number(employee.salary).toLocaleString()}</td>
        <td>$${allowances.toLocaleString()}</td>
        <td>$${deductions.toLocaleString()}</td>
        <td>$${netSalary.toLocaleString()}</td>
    `;
    salaryTable.appendChild(row);
}

// Helper Functions
function calculateAllowances(salary) {
    return Math.round(salary * 0.1); // 10% of basic salary
}

function calculateDeductions(salary) {
    return Math.round(salary * 0.05); // 5% of basic salary
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

// Initialize the dashboard
updateStats();
displayProfile();
displayAttendance();
displayTasks();
displayLeaves();
displaySalary(); 