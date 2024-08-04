document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {
        username: formData.get('username'),
        password: formData.get('password'),
    };

    try {
        const response = await fetch('http://127.0.0.1:8000/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Login successful!');
            // Get the username from the data object
            const username = data.username;
            
            // Redirect based on the username
            if (username === 'Admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'driver_dashboard.html';
            }
        } else {
            const error = await response.json();
            alert(`Login failed: ${error.error}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
