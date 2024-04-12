const form = document.getElementById('search-form');
const userInput = document.getElementById('search-input');
const userInfoContainer = document.getElementById('user-info');
const userReposContainer = document.getElementById('user-repos');

form.addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const searchTerm = userInput.value.trim(); 

    if (searchTerm === '') {
        alert('Please enter a search term.'); 
        return;
    }

    try {
        const userData = await fetchUserData(searchTerm);
        displayUserInfo(userData);
    } catch (error) {
        console.error('Error fetching user data:', error);
        alert('An error occurred while fetching user data.');
    }
});

async function fetchUserData(searchTerm) {
    const url = `https://api.github.com/search/users?q=${searchTerm}`;
    const response = await fetch(url, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    return data.items; 
}

function displayUserInfo(users) {
    userInfoContainer.innerHTML = ''; 
    users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.innerHTML = `
            <div>
                <img src="${user.avatar_url}" alt="${user.login}">
                <h2>${user.login}</h2>
                <a href="${user.html_url}" target="_blank">Profile</a>
            </div>
        `;
        userElement.addEventListener('click', async () => {
            try {
                const reposData = await fetchUserRepos(user.login);
                displayUserRepos(reposData);
            } catch (error) {
                console.error('Error fetching user repositories:', error);
                alert('An error occurred while fetching user repositories.');
            }
        });
        userInfoContainer.appendChild(userElement);
    });
}

async function fetchUserRepos(username) {
    const url = `https://api.github.com/users/${username}/repos`;
    const response = await fetch(url, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user repositories');
    }

    const data = await response.json();
    return data; 
}

function displayUserRepos(repos) {
    userReposContainer.innerHTML = ''; 

    repos.forEach(repo => {
        const repoElement = document.createElement('div');
        repoElement.textContent = repo.name;
        userReposContainer.appendChild(repoElement);
    });
}
