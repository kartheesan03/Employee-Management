let employees = JSON.parse(localStorage.getItem('employees')) || [];

const addForm = document.getElementById('addForm');
const editForm = document.getElementById('editForm');
const employeeTable = document.getElementById('employeeTable');
const searchInput = document.getElementById('searchInput');
const positionFilter = document.getElementById('positionFilter');
const sortBy = document.getElementById('sortBy');
const editModal = document.getElementById('editModal');
const closeModal = document.querySelector('.close');
const totalEmployees = document.getElementById('totalEmployees');
const totalSalary = document.getElementById('totalSalary');

addForm.addEventListener('submit', handleAddEmployee);
editForm.addEventListener('submit', handleEditEmployee);
searchInput.addEventListener('input', filterEmployees);
positionFilter.addEventListener('change', filterEmployees);
sortBy.addEventListener('change', sortEmployees);
closeModal.addEventListener('click', () => editModal.style.display = 'none');

window.addEventListener('click', (e) => {
    if (e.target === editModal) {
        editModal.style.display = 'none';
    }
});

function init() {
    displayEmployees();
    updateStats();
    updatePositionFilter();
}

function handleAddEmployee(e) {
    e.preventDefault();

    const emp_id = document.getElementById('emp_id').value;
    const name = document.getElementById('name').value;
    const position = document.getElementById('position').value;
    const salary = document.getElementById('salary').value;

    if (employees.some(emp => emp.emp_id === emp_id)) {
        showNotification('Employee ID already exists!', 'error');
        return;
    }

    const employee = { emp_id, name, position, salary };
    employees.push(employee);
    
    saveToLocalStorage();
    displayEmployees();
    updateStats();
    updatePositionFilter();
    addForm.reset();
    
    showNotification('Employee added successfully!');
}

function handleEditEmployee(e) {
    e.preventDefault();

    const index = document.getElementById('editIndex').value;
    const name = document.getElementById('editName').value;
    const position = document.getElementById('editPosition').value;
    const salary = document.getElementById('editSalary').value;

    employees[index] = {
        ...employees[index],
        name,
        position,
        salary
    };

    saveToLocalStorage();
    displayEmployees();
    updateStats();
    updatePositionFilter();
    editModal.style.display = 'none';
    
    showNotification('Employee updated successfully!');
}

function displayEmployees() {
    employeeTable.innerHTML = '';

    employees.forEach((employee, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.emp_id}</td>
            <td>${employee.name}</td>
            <td>${employee.position}</td>
            <td>$${Number(employee.salary).toLocaleString()}</td>
            <td class="actions">
                <button class="edit" onclick="openEditModal(${index})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="delete" onclick="deleteEmployee(${index})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        employeeTable.appendChild(row);
    });
}

function openEditModal(index) {
    const employee = employees[index];
    document.getElementById('editIndex').value = index;
    document.getElementById('editName').value = employee.name;
    document.getElementById('editPosition').value = employee.position;
    document.getElementById('editSalary').value = employee.salary;
    editModal.style.display = 'block';
}

function deleteEmployee(index) {
    if (confirm('Are you sure you want to delete this employee?')) {
        employees.splice(index, 1);
        saveToLocalStorage();
        displayEmployees();
        updateStats();
        updatePositionFilter();
        showNotification('Employee deleted successfully!');
    }
}

function filterEmployees() {
    const searchTerm = searchInput.value.toLowerCase();
    const positionValue = positionFilter.value.toLowerCase();

    const filteredEmployees = employees.filter(employee => {
        const matchesSearch = 
            employee.name.toLowerCase().includes(searchTerm) ||
            employee.emp_id.toLowerCase().includes(searchTerm) ||
            employee.position.toLowerCase().includes(searchTerm);
        
        const matchesPosition = positionValue === '' || employee.position.toLowerCase() === positionValue;

        return matchesSearch && matchesPosition;
    });

    displayFilteredEmployees(filteredEmployees);
}

function displayFilteredEmployees(filteredEmployees) {
    employeeTable.innerHTML = '';

    filteredEmployees.forEach((employee, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.emp_id}</td>
            <td>${employee.name}</td>
            <td>${employee.position}</td>
            <td>$${Number(employee.salary).toLocaleString()}</td>
            <td class="actions">
                <button class="edit" onclick="openEditModal(${employees.indexOf(employee)})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="delete" onclick="deleteEmployee(${employees.indexOf(employee)})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        employeeTable.appendChild(row);
    });
}

function sortEmployees() {
    const sortValue = sortBy.value;
    
    employees.sort((a, b) => {
        if (sortValue === 'salary') {
            return Number(b.salary) - Number(a.salary);
        }
        return a[sortValue].localeCompare(b[sortValue]);
    });

    displayEmployees();
}

function updatePositionFilter() {
    const positions = [...new Set(employees.map(emp => emp.position))];
    positionFilter.innerHTML = '<option value="">All Positions</option>';
    
    positions.forEach(position => {
        const option = document.createElement('option');
        option.value = position;
        option.textContent = position;
        positionFilter.appendChild(option);
    });
}

function updateStats() {
    totalEmployees.textContent = employees.length;
    const total = employees.reduce((sum, emp) => sum + Number(emp.salary), 0);
    totalSalary.textContent = `$${total.toLocaleString()}`;
}

function saveToLocalStorage() {
    localStorage.setItem('employees', JSON.stringify(employees));
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.className = 'notification';
    }, 3000);
}

init();