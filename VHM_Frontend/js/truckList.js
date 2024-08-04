document.addEventListener('DOMContentLoaded', async () => {
    await fetchUsers();
    await fetchTrucks();
});

async function fetchUsers() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/users/');
        const users = await response.json();
        const driverSelect = document.getElementById('assignedDriver');
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.username;
            option.textContent = user.username;
            driverSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

async function fetchTrucks() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/trucks/');
        const trucks = await response.json();
        const trucksTable = document.getElementById('trucksTable').getElementsByTagName('tbody')[0];
        trucksTable.innerHTML = '';  // Clear existing rows
        trucks.forEach(truck => {
            const row = trucksTable.insertRow();
            row.insertCell(0).textContent = truck.id;
            row.insertCell(1).textContent = truck.model_name;
            row.insertCell(2).textContent = truck.number_plate;
            row.insertCell(3).textContent = truck.assigned_driver;
            row.insertCell(4).innerHTML = `<button class="btn btn-warning" onclick="editRow(${truck.id})">Edit</button>`;
            row.insertCell(5).innerHTML = `<button class="btn btn-danger" onclick="deleteRow(${truck.id})">Delete</button>`;
        });
    } catch (error) {
        console.error('Error fetching trucks:', error);
    }
}

function showAddTruckForm() {
    document.getElementById('addTruckForm').classList.toggle('d-none');
}

async function saveTruck() {
    const truckId = document.getElementById('truckId').value;
    const truckModel = document.getElementById('truckModel').value;
    const truckNumber = document.getElementById('truckNumber').value;
    const assignedDriver = document.getElementById('assignedDriver').value;

    const data = {
        model_name: truckModel,
        number_plate: truckNumber,
        assigned_driver: assignedDriver,
    };

    try {
        const method = truckId ? 'PUT' : 'POST';
        const url = truckId ? `http://127.0.0.1:8000/api/trucks/${truckId}/` : 'http://127.0.0.1:8000/api/trucks/';
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            await fetchTrucks();
            showAddTruckForm();  // Hide form after saving
        } else {
            console.error('Error saving truck:', await response.json());
        }
    } catch (error) {
        console.error('Error saving truck:', error);
    }
}

async function editRow(id) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/trucks/${id}/`);
        const truck = await response.json();
        document.getElementById('truckId').value = truck.id;
        document.getElementById('truckModel').value = truck.model_name;
        document.getElementById('truckNumber').value = truck.number_plate;
        document.getElementById('assignedDriver').value = truck.assigned_driver;
        showAddTruckForm();  // Show form for editing
    } catch (error) {
        console.error('Error fetching truck for editing:', error);
    }
}

async function deleteRow(id) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/trucks/${id}/`, {
            method: 'DELETE',
        });

        if (response.ok) {
            await fetchTrucks();
        } else {
            console.error('Error deleting truck:', await response.json());
        }
    } catch (error) {
        console.error('Error deleting truck:', error);
    }
}
