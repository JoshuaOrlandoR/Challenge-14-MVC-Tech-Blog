const commentFormHandler = async function (event) {
    event.preventDefault();
    const post_id = document.querySelector('.post-comments').dataset.post_id;
    const comment_content = document.querySelector('#comment_content').value.trim();

    if(comment_content) {
        await fetch ('/api/comments', {
            method: 'POST',
            body: JSON.stringify({
                post_id,
                comment_content,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        document.location.reload()
    }
};

document
    .querySelector('.post-comments')
    .addEventListener('submit',commentFormHandler)