document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const data = {
        user: {
            first_name: formData.get('fullname').split(' ')[0],
            last_name: formData.get('fullname').split(' ')[1],
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
        },
        age: formData.get('age'),
        contact_no: formData.get('contact_no'),
        license_no: formData.get('license_no'),
        address: formData.get('address'),
    };

    try {
        const response = await fetch('http://127.0.0.1:8000/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Registration successful!');
            window.location.href = 'login.html';
        } else {
            const error = await response.json();
            document.getElementById('error-message').innerText = error.error || 'Registration failed';
            document.getElementById('error-message').style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('error-message').innerText = 'An unexpected error occurred. Please try again.';
        document.getElementById('error-message').style.display = 'block';
    }
});
