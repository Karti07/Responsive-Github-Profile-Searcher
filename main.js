const APIURL = 'https://api.github.com/users/';
const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const userCardContainer = document.getElementById('user-card-container');
const errorCardContainer = document.getElementById('error-card-container');

async function getUser(username) {
    try {
        const { data } = await axios(APIURL + username);
        createUserCard(data);
        getRepos(username);
    } catch (err) {
        if (err.response && err.response.status == 404) {
            createErrorCard('No profile with this username');
        } else {
            createErrorCard('Error fetching data');
        }
    }
}

async function getRepos(username) {
    try {
        const { data } = await axios(APIURL + username + '/repos?sort=created');
        addReposToCard(data);
    } catch (err) {
        createErrorCard('Problem fetching repos');
    }
}

function createUserCard(user) {
    const template = document.getElementById('user-card-template');
    const clone = document.importNode(template.content, true);

    clone.querySelector('.avatar').src = user.avatar_url;
    clone.querySelector('.avatar').alt = user.name;
    clone.querySelector('h2').textContent = user.name || user.login;
    clone.querySelector('p').textContent = user.bio || '';
    clone.querySelector('ul li:nth-child(1) span').textContent = user.followers;
    clone.querySelector('ul li:nth-child(2) span').textContent = user.following;
    clone.querySelector('ul li:nth-child(3) span').textContent = user.public_repos;

    userCardContainer.innerHTML = '';
    userCardContainer.appendChild(clone);
}

function createErrorCard(msg) {
    const template = document.getElementById('error-card-template');
    const clone = document.importNode(template.content, true);

    clone.querySelector('h1').textContent = msg;

    errorCardContainer.innerHTML = '';
    errorCardContainer.appendChild(clone);
}

function addReposToCard(repos) {
    const reposEl = document.getElementById('repos');
    repos
        .slice(0, 5)
        .forEach(repo => {
            const repoEl = document.createElement('a');
            repoEl.classList.add('repo');
            repoEl.href = repo.html_url;
            repoEl.target = '_blank';
            repoEl.innerText = repo.name;
            reposEl.appendChild(repoEl);
        });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = search.value;
    if (user) {
        getUser(user);
        search.value = '';
    }
});
