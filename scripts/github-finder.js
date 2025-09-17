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
    fetchGitHubUser(username)
        .then(data => {
            if (data) {
                // Display user data on the page here
            } else {
                // Show an error message to the user
            }
        });
}