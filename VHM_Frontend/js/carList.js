document.addEventListener('DOMContentLoaded', async () => {
  await fetchUsers();
  await fetchCars();
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

async function fetchCars() {
  try {
      const response = await fetch('http://127.0.0.1:8000/api/cars/');
      const cars = await response.json();
      window.carsData = cars; // Store the fetched cars data globally
      displayCars(cars); // Display the cars
  } catch (error) {
      console.error('Error fetching cars:', error);
  }
}

function displayCars(cars) {
  const carsTable = document.getElementById('carsTable').getElementsByTagName('tbody')[0];
  carsTable.innerHTML = '';  // Clear existing rows
  cars.forEach(car => {
      const row = carsTable.insertRow();
      row.insertCell(0).textContent = car.id;
      row.insertCell(1).textContent = car.model_name;
      row.insertCell(2).textContent = car.number_plate;
      row.insertCell(3).textContent = car.assigned_driver;
      row.insertCell(4).innerHTML = `<button class="btn btn-warning" onclick="editRow(${car.id})">Edit</button>`;
      row.insertCell(5).innerHTML = `<button class="btn btn-danger" onclick="deleteRow(${car.id})">Delete</button>`;
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
          response = await fetch(`http://127.0.0.1:8000/api/cars/${vehicleId}/`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
          });
      } else {
          // Add new vehicle
          response = await fetch('http://127.0.0.1:8000/api/cars/', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
          });
      }

      if (response.ok) {
          await fetchCars();
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
      const response = await fetch(`http://127.0.0.1:8000/api/cars/${id}/`);
      const car = await response.json();
      document.getElementById('vehicleId').value = car.id;
      document.getElementById('vehicleModel').value = car.model_name;
      document.getElementById('vehicleNumber').value = car.number_plate;
      document.getElementById('assignedDriver').value = car.assigned_driver;
  } catch (error) {
      console.error('Error fetching car details:', error);
  }
}

function clearForm() {
  document.getElementById('vehicleId').value = '';
  document.getElementById('vehicleModel').value = '';
  document.getElementById('vehicleNumber').value = '';
  document.getElementById('assignedDriver').value = '';
}

function deleteRow(id) {
  if (confirm('Are you sure you want to delete this car?')) {
      deleteVehicle(id);
  }
}

async function deleteVehicle(id) {
  try {
      const response = await fetch(`http://127.0.0.1:8000/api/cars/${id}/`, {
          method: 'DELETE',
      });

      if (response.ok) {
          await fetchCars();
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
  const filteredCars = window.carsData.filter(car =>
      car.model_name.toLowerCase().includes(searchTerm) ||
      car.number_plate.toLowerCase().includes(searchTerm) ||
      car.assigned_driver.toLowerCase().includes(searchTerm)
  );
  displayCars(filteredCars);
});
