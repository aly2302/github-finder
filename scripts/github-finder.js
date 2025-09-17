// Attach event listener to the form for submit
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form from reloading the page
        searchUserName();
    });
});

function searchUserName() {
    const inputElement = document.querySelector('.js-input-username');
    const username = inputElement.value;
    console.log(username);
}