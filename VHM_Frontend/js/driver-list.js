document.addEventListener('DOMContentLoaded', async () => {
    await fetchDrivers();
    $('#driverTable').DataTable({
        searching: false, // Disable searching
        paging: true, // Enable pagination
        info: false, // Disable info
        ordering: false, // Disable ordering (sorting)
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const wrapper = document.getElementById('wrapper');

    menuToggle.addEventListener('click', function() {
        wrapper.classList.toggle('toggled');
    });
});


async function fetchDrivers() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/driver-list/');
        const data = await response.json();

        const driverTableBody = document.querySelector('#driverTable tbody');
        driverTableBody.innerHTML = '';

        data.forEach(driver => {
            const row = driverTableBody.insertRow();
            row.insertCell(0).textContent = driver.username;
            row.insertCell(1).textContent = driver.contact_no;
            row.insertCell(2).textContent = driver.email;
            row.insertCell(3).textContent = driver.vehicle_number;
        });
    } catch (error) {
        console.error('Error fetching drivers:', error);
    }
}
