document.addEventListener('DOMContentLoaded', async () => {
    await fetchUsers();
    await fetchBikes();
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

async function fetchBikes() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/bikes/');
        const bikes = await response.json();
        window.bikesData = bikes; // Store the fetched bikes data globally
        displayBikes(bikes); // Display the bikes
    } catch (error) {
        console.error('Error fetching bikes:', error);
    }
}

function displayBikes(bikes) {
    const bikesTable = document.getElementById('bikesTable').getElementsByTagName('tbody')[0];
    bikesTable.innerHTML = '';  // Clear existing rows
    bikes.forEach(bike => {
        const row = bikesTable.insertRow();
        row.insertCell(0).textContent = bike.id;
        row.insertCell(1).textContent = bike.model_name;
        row.insertCell(2).textContent = bike.number_plate;
        row.insertCell(3).textContent = bike.assigned_driver;
        row.insertCell(4).innerHTML = `<button class="btn btn-warning" onclick="editRow(${bike.id})">Edit</button>`;
        row.insertCell(5).innerHTML = `<button class="btn btn-danger" onclick="deleteRow(${bike.id})">Delete</button>`;
    });
}

function showAddVehicleForm() {
    document.getElementById('addVehicleForm').classList.toggle('d-none');
    clearForm();
}

async function saveVehicle() {
    const vehicleModel = document.getElementById('vehicleModel').value;
    const vehicleNumber = document.getElementById('vehicleNumber').value;
    const assignedDriver = document.getElementById('assignedDriver').value;
    const vehicleId = document.getElementById('vehicleId').value;

    const data = {
        model_name: vehicleModel,
        number_plate: vehicleNumber,
        assigned_driver: assignedDriver,
    };

    try {
        let response;
        if (vehicleId) {
            // Update existing vehicle
            response = await fetch(`http://127.0.0.1:8000/api/bikes/${vehicleId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
        } else {
            // Add new vehicle
            response = await fetch('http://127.0.0.1:8000/api/bikes/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
        }

        if (response.ok) {
            await fetchBikes();
            showAddVehicleForm();  // Hide form after saving
        } else {
            console.error('Error saving vehicle:', await response.json());
        }
    } catch (error) {
        console.error('Error saving vehicle:', error);
    }
}

function editRow(id) {
    showAddVehicleForm();
    populateForm(id);
}

async function populateForm(id) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/bikes/${id}/`);
        const bike = await response.json();
        document.getElementById('vehicleId').value = bike.id;
        document.getElementById('vehicleModel').value = bike.model_name;
        document.getElementById('vehicleNumber').value = bike.number_plate;
        document.getElementById('assignedDriver').value = bike.assigned_driver;
    } catch (error) {
        console.error('Error fetching bike details:', error);
    }
}

function clearForm() {
    document.getElementById('vehicleId').value = '';
    document.getElementById('vehicleModel').value = '';
    document.getElementById('vehicleNumber').value = '';
    document.getElementById('assignedDriver').value = '';
}

function deleteRow(id) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
        deleteVehicle(id);
    }
}

async function deleteVehicle(id) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/bikes/${id}/`, {
            method: 'DELETE',
        });

        if (response.ok) {
            await fetchBikes();
        } else {
            console.error('Error deleting vehicle:', await response.json());
        }
    } catch (error) {
        console.error('Error deleting vehicle:', error);
    }
}

// Add search functionality
document.getElementById('searchInput').addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredBikes = window.bikesData.filter(bike =>
        bike.model_name.toLowerCase().includes(searchTerm) ||
        bike.number_plate.toLowerCase().includes(searchTerm) ||
        bike.assigned_driver.toLowerCase().includes(searchTerm)
    );
    displayBikes(filteredBikes);
});
