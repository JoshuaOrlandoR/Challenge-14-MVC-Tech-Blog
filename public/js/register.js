const registerFormHandler = async (event) => {
    event.preventDefault();

    const username = document.querySelector('#username-register').value.trim();
    const password = document.querySelector('#password-register').value.trim();

    if(username && password) {
        const response = await fetch ('/api/user', {
            method:'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json'},
        });

        if (response.ok) {
            document.location.replace('/dashboard')
        } else {
            alert(response.statusText)
        }
    }
};

document
.querySelector('#register-section')
.addEventListener('submit', registerFormHandler);
