function changeTheme(theme) {
    document.body.className = theme + '-theme';
}
 
function saveProfile() {
    const name = document.getElementById('editName').value;
    const profilePicInput = document.getElementById('editProfilePic');
    const profilePicFile = profilePicInput.files[0];
 
    if (name.trim() === '') {
        alert('Name is required.');
        return;
    }
 
    document.getElementById('profileName').innerText = name;
 
    if (profilePicFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('profilePic').src = event.target.result;
        };
        reader.readAsDataURL(profilePicFile);
    }
 
    alert('Profile updated successfully!');
}