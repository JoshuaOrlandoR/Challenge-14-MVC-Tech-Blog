const newDashboardHandler = async (event) => {
    event.preventDefault();

    const postTitle = document.getElementById('post-title').value.trim();
    const postContent = document.getElementById('post-content').value.trim();

    if (postTitle && postContent) {
        const response = await fetch ('/api/post', {
            method: "POST",
            body: JSON.stringify({title, description}),
            headers: { 'Content-Type': 'application/json'},
        });

        if(response.ok) {
            document.location.replace('/dashboard')
        } else {
            alert('Could not create blog...')
        }
    }
};

const deleteHandler = async (event) => {
    if(event.target.hasAttribute('data-id')) {
        const dataId = event.target.getAttribute ('data-id');

        const response = await fetch (`/api/post/${id}`, {
            method:'DELETE',
        });

        if(response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert('Could not delete blog')
        }
    }
};

document
.querySelector('.form-post')
.addEventListener('submit', newDashboardHandler);

document
.querySelector('.post-list')
.addEventListener('click', deleteHandler);

//repurposed example provided on stack overflow for formatting - I assume this is ok? 