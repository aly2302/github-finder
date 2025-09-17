// Attach event listener to the form for submit
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form from reloading the page
        searchUserName();
    });
});

async function fetchGitHubUser(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) {
            // If the response is not ok (e.g., 404), throw an error
            throw new Error(`User not found: ${response.status}`);
        }
        const data = await response.json();
        console.log(data); // You can display this data on the page
        return data;
    } catch (error) {
        console.error('Something went wrong!', error);
        return null;
    }
}

// In your searchUserName function, call fetchGitHubUser with the input value
function searchUserName() {
    const inputElement = document.querySelector('.js-input-username');
    const username = inputElement.value;
    const displayDiv = document.getElementById('profile-display');
    displayDiv.textContent = 'Loading...';
    fetchGitHubUser(username)
        .then(data => {
            if (data) {
                renderUserProfile(data);
            } else {
                displayDiv.textContent = 'User not found';
            }
        });
}

function renderUserProfile(user){
    const displayDiv = document.getElementById('profile-display');
    displayDiv.innerHTML = `
        <img src="${user.avatar_url}" alt="Avatar" width="100" style="border-radius:50%;">
        <h3>${user.name ? user.name : user.login}</h3>
        <p>${user.bio ? user.bio : 'No bio available.'}</p>
        <p><a href="${user.html_url}" target="_blank">View Profile</a></p>
    `;
}