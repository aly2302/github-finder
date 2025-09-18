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
    fetchUserRepos(username)
        .then(data => {
            if(data){
                renderUserRepos(data);
                renderLanguageChart(data);
            } else {
                displayDiv.textContent = 'Repo not found';
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

function renderUserRepos(repos){
    const displayDiv = document.getElementById('repos-display');
    if (!repos || repos.length === 0) {
        displayDiv.textContent = 'No repositories found.';
        return;
    }
    // Sort by stars, descending
    repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
    // Show top 5
    const topRepos = repos.slice(0, 5);
      displayDiv.innerHTML = `
        <h4>Top Repositories:</h4>
        <div class="repos-list">
            ${topRepos.map(repo => `
                <div class="repo-card">
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                    <div class="repo-badges">
                        <span class="repo-badge">⭐ ${repo.stargazers_count}</span>
                        ${repo.language ? `<span class="repo-badge">${repo.language}</span>` : ''}
                    </div>
                    <p>${repo.description ? repo.description : ''}</p>
                </div>
            `).join('')}
        </div>
    `;
}

async function fetchUserRepos(username){
    try{
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        if(!response.ok){
            throw new Error(`Repos not Found: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        return data;
    }catch (error){
        console.error('Something went wrong!', error);
        return null;
    }
}


function renderLanguageChart(repos){
    const chartContainer = document.getElementById('chart-container');
    const ctx = document.getElementById('languageChart').getContext('2d');

    // 1. Process the repo data to count languages.
    const languageCounts = repos.reduce((acc, repo) => {
        if(repo.language){
            acc[repo.language] = (acc[repo.language] || 0) + 1;
        }
        return acc;
    }, {}); /* */

    // if there's no language data , don't show the chart.

    if(Object.keys(languageCounts).length === 0){
        chartContainer.style.display = 'none';
        return;
    }

    //2. prepare the data for Chart.js

    const labels = Object.keys(languageCounts);
    const data = Object.values(languageCounts);

    //3. Create the chart.

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Languages',
                data: data,
                backgroundColor: [
                    '#4a77e5',
                    '#ff6384',
                    '#36a2eb',
                    '#ffce56',
                    '#4bc0c0',
                    '#9966ff'
                ],
                borderWidth: 0,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Top Languages By Repo Count'
                }
            }
        }
    });

    //4. Make the chart container visible.
    chartContainer.style.display = 'block';
}
