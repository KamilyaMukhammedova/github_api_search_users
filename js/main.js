import {
  AUTH_HEADERS,
  GITHUB_URL,
  PRELOADER,
  TITLE_OF_RANDOM_SEARCH_RESULTS,
  TITLE_OF_USER_SEARCH_RESULTS
} from "../constants.js";

const app = document.getElementById("app");
const mainPage = createElement('div', 'mainPage');
mainPage.id = 'mainPage';
const usersListContainer = createElement('div', 'container');
usersListContainer.id = 'usListCont';
const favoritesPage = createElement('div', 'favoritesPage');
favoritesPage.style.display = 'none';
const favoritesContainer = createElement('div', 'container');
favoritesPage.append(favoritesContainer);
const favoritesTitle = createElement('h3', 'commonTitle');
const favoritesUsersBlock = createElement('div', 'favUsersBlock');

const userInfoPage = createElement('div', 'userInfoPage');
userInfoPage.style.display = 'none';
const userInfoPreloaderArea = createElement('div', 'userInfoPreloaderArea');
userInfoPreloaderArea.innerHTML = PRELOADER;
userInfoPreloaderArea.style.display = 'none';
const userInfoContainer = createElement('div', 'container');
userInfoPage.append(userInfoPreloaderArea, userInfoContainer);
const userInfoTitle = createElement('h3', 'commonTitle');
const userReposTitle = createElement('h3', 'commonTitle');
userInfoTitle.textContent = 'User info';
userReposTitle.textContent = 'Repositories';
const userInfoBlock = createElement('div', 'userInfoBlock');
const userReposBlock = createElement('div', 'userReposBlock');
userInfoContainer.append(userInfoTitle, userInfoBlock, userReposTitle, userReposBlock);

const searchBox = createElement('div', 'searchBox');
const searchBoxContainer = createElement('div', 'container');
searchBox.append(searchBoxContainer);
const searchLine = createElement('div', 'searchLine');

const searchDiv1 = createElement('div', 'searchDiv1');
const searchLabel = createElement('label', 'label');
searchLabel.textContent = 'Search for Github users';
const searchInput = createElement('input', 'searchInput');
searchInput.type = 'text';
searchInput.id = 'searchInput';
searchDiv1.append(searchLabel, searchInput);

const searchDiv2 = createElement('div', 'searchDiv2');
const sortLabel = createElement('label', 'label');
sortLabel.textContent = 'Sort';
const sortSelect = createElement('select');
sortSelect.id = 'sortSelect';
const sortOption1 = createElement('option');
sortOption1.textContent = 'Joined';
sortOption1.value = 'joined';
sortSelect.defaultValue = sortOption1.value;
const sortOption2 = createElement('option');
sortOption2.textContent = 'Followers';
sortOption2.value = 'followers';
const sortOption3 = createElement('option');
sortOption3.textContent = 'Repositories';
sortOption3.value = 'repositories';
sortSelect.append(sortOption1, sortOption2, sortOption3);
searchDiv2.append(sortLabel, sortSelect);

const searchDiv3 = createElement('div', 'searchDiv3');
const orderLabel = createElement('label', 'label');
orderLabel.textContent = 'Order';
const orderSelect = createElement('select');
orderSelect.id = 'orderSelect';
const orderOption1 = createElement('option');
orderOption1.textContent = 'Desc';
orderOption1.value = 'desc';
const orderOption2 = createElement('option');
orderOption2.textContent = 'Asc';
orderOption2.value = 'asc';
orderSelect.defaultValue = orderOption2.value;
orderSelect.append(orderOption1, orderOption2);
searchDiv3.append(orderLabel, orderSelect);

const searchDiv4 = createElement('div', 'searchDiv4');
const perPageLabel = createElement('label', 'label');
perPageLabel.textContent = 'Per page';
const perPageInput = createElement('input');
perPageInput.type = 'number';
perPageInput.id = 'perPage';
perPageInput.min = 1;
perPageInput.max = 100;
searchDiv4.append(perPageLabel, perPageInput);
searchLine.append(searchDiv1, searchDiv2, searchDiv3, searchDiv4);

const usersWrapper = createElement('div', 'usersWrapper');
usersWrapper.append(usersListContainer);
const main = createElement('div', 'mainDiv');
const titlesContainer = createElement('div', 'container');
const titleRandomResults = createElement('h3', 'commonTitle');
const titleSearchResults = createElement('h3', 'commonTitle');
titleRandomResults.textContent = TITLE_OF_RANDOM_SEARCH_RESULTS;
titleSearchResults.textContent = TITLE_OF_USER_SEARCH_RESULTS;
titleSearchResults.style.display = 'none';
titlesContainer.append(titleRandomResults, titleSearchResults);
main.append(titlesContainer, usersWrapper);

const paginationArea = createElement('nav', 'paginationArea');
const paginationContainer = createElement('div', 'container');
paginationArea.innerHTML = `
               <ul class="navList paginationList">
                 <li><button type="button" id="prevBtn"><<</button></li>
                 <li>
                   <input type="number" placeholder="page" class="currentPage" min="1" id="currentPage">
                 </li>
                 <li class="lastLi"><button type="button" id="nextBtn">>></button></li>
               </ul>
               <div class="allPagesText" id="allPagesText"></div>
  `;
paginationContainer.append(paginationArea);

mainPage.append(searchBox);
searchBoxContainer.append(searchLine);
mainPage.append(main, paginationContainer);
app.append(mainPage, favoritesPage, userInfoPage);

document.querySelector('#prevBtn').addEventListener('click', onPreviousPage, false);
document.querySelector('#nextBtn').addEventListener('click', onNextPage, false);
document.querySelector('#searchBtnLink').classList.add('activeNavLink');

const randomSymbolForRandomFetch = getRandomSymbol();
let pageRandomFetch = 1;
let pageSearchFetch = 1;
let loadingError = false;
let totalNumberOfPages = 0;
let isRandomFetch = true;

const currentPage = document.getElementById('currentPage');
currentPage.value = 1;
currentPage.addEventListener('input', async () => {
  if (currentPage.value !== '') {
    if (isRandomFetch) {
      pageRandomFetch = parseInt(currentPage.value);
      const users = await fetchRandomUsers(pageRandomFetch);
      renderCards(users, usersListContainer, 'main');
    } else {
      pageSearchFetch = parseInt(currentPage.value);
      const users = await searchUsers
      (searchInput.value, sortSelect.value, orderSelect.value, perPageInput.value, pageSearchFetch);
      renderCards(users, usersListContainer, 'main');
    }
  }
});

searchInput.addEventListener('input', () => onSearchProcess());
sortSelect.addEventListener('change', () => onSearchProcess());
orderSelect.addEventListener('change', () => onSearchProcess());
perPageInput.addEventListener('input', () => onSearchProcess());

document.querySelector('#logoLink').addEventListener('click', onMainPage);
document.querySelector('#searchBtnLink').addEventListener('click', onMainPage);
document.querySelector('#favoritesBtnLink').addEventListener('click', onFavoritesPage);

document.addEventListener('DOMContentLoaded', async () => {
  const randomUsers = await fetchRandomUsers(pageRandomFetch);
  renderCards(randomUsers, usersListContainer, 'main');

  favoritesTitle.textContent = 'Favorites';
  favoritesContainer.append(favoritesTitle, favoritesUsersBlock);

  sortSelect.disabled = true;
  orderSelect.disabled = true;
  perPageInput.disabled = true;
});

function onMainPage() {
  mainPage.style.display = 'block';
  favoritesPage.style.display = 'none';
  userInfoPage.style.display = 'none';
  document.querySelector('#searchBtnLink').classList.add('activeNavLink');
  document.querySelector('#favoritesBtnLink').classList.remove('activeNavLink');
}

function onFavoritesPage() {
  favoritesUsersBlock.innerHTML = '';
  mainPage.style.display = 'none';
  userInfoPage.style.display = 'none';
  favoritesPage.style.display = 'block';
  document.querySelector('#searchBtnLink').classList.remove('activeNavLink');
  document.querySelector('#favoritesBtnLink').classList.add('activeNavLink');

  const storage = JSON.parse(localStorage.getItem('favUsers'));
  storage.reverse().forEach(user => {
    createUserCard(user, favoritesUsersBlock, 'favorites');
    const starBtn = document.getElementById(user.id + user.login);
    starBtn.classList.add('btnStarSelected');
    starBtn.addEventListener('click', () => addInFavorites(user, 'favorites'));

    const showRepsBtn = document.getElementById(user.login + user.id);
    showRepsBtn.addEventListener('click', () => onUserInfoPage(user));
  });
}

function getRandomSymbol() {
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return possible.charAt(Math.floor(Math.random() * possible.length));
}

async function fetchRandomUsers(page) {
  usersListContainer.innerHTML = PRELOADER;
  loadingError = false;
  const per_page = 30;
  perPageInput.value = per_page;

  const response = await fetch(
    `${GITHUB_URL}?q=${randomSymbolForRandomFetch}&page=${page}&per_page=${per_page}`, AUTH_HEADERS
  );

  if (response.ok) {
    const users = await response.json();
    titleRandomResults.textContent = `${TITLE_OF_RANDOM_SEARCH_RESULTS} (${users.total_count}):`;
    totalNumberOfPages = Math.ceil(users.total_count / per_page);
    document.getElementById('allPagesText').textContent = `Total pages: ${totalNumberOfPages}`;

    return users.items;
  } else {
    loadingError = true;
    usersListContainer.innerHTML = `<h1 class="error">Data loading error! Status ${response.status}</h1>`;
    console.error(`Error status ${response.status}`);
  }
}

async function searchUsers(inputValue, sort, order, perPage, page) {
  usersListContainer.innerHTML = PRELOADER;
  loadingError = false;
  isRandomFetch = false;
  titleRandomResults.style.display = 'none';
  titleSearchResults.style.display = 'block';

  const response = await fetch(
    `${GITHUB_URL}?q=${inputValue}&sort=${sort}&order=${order}&per_page=${perPage}&page=${page}`, AUTH_HEADERS
  );

  if (response.ok) {
    const users = await response.json();
    titleSearchResults.textContent = `${TITLE_OF_USER_SEARCH_RESULTS} (${users.total_count}):`;

    totalNumberOfPages = Math.ceil(users.total_count / perPage);
    document.getElementById('allPagesText').textContent = `Total pages: ${totalNumberOfPages}`;

    return users.items;
  } else {
    loadingError = true;
    usersListContainer.innerHTML = `<h1 class="error">Data loading error! Status ${response.status}</h1>`;
    console.error(`Error status ${response.status}`);
  }
}

async function onSearchProcess() {
  if (searchInput.value !== '') {
    sortSelect.disabled = false;
    orderSelect.disabled = false;
    perPageInput.disabled = false;
    pageSearchFetch = 1;
    currentPage.value = 1;
    const users = await searchUsers(searchInput.value, sortSelect.value, orderSelect.value, perPageInput.value, 1);
    renderCards(users, usersListContainer, 'main');
  } else if (searchInput.value === '') {
    sortSelect.disabled = true;
    orderSelect.disabled = true;
    perPageInput.disabled = true;
  }
}

async function onUserInfoPage(user) {
  userInfoPreloaderArea.style.display = 'block';
  userInfoTitle.style.display = 'none';
  userReposTitle.style.display = 'none';
  mainPage.style.display = 'none';
  favoritesPage.style.display = 'none';
  document.querySelector('#searchBtnLink').classList.remove('activeNavLink');
  document.querySelector('#favoritesBtnLink').classList.remove('activeNavLink');
  userInfoPage.style.display = 'block';
  userInfoBlock.innerHTML = '';
  userReposBlock.innerHTML = '';

  const userData = {
    id: user.id,
    login: user.login,
    html_url: user.html_url,
    avatar_url: user.avatar_url,
    repos_url: user.repos_url,
  };

  const response = await fetch(user.repos_url);

  if (response.ok) {
    const repos = await response.json();
    userInfoPreloaderArea.style.display = 'none';
    userInfoTitle.style.display = 'block';
    userReposTitle.style.display = 'block';
    renderUserInfoPageContent(userData);

    const storage = JSON.parse(localStorage.getItem('favUsers'));
    const starBtn = document.getElementById(userData.id + userData.login + 'user');

    if (storage.filter(user => user.id === userData.id).length > 0) {
      starBtn.classList.add('btnStarSelected');
    }

    starBtn.addEventListener('click', () => addInFavorites(userData, 'userInfo'));

    if (repos.length > 0) {
      repos.forEach(rep => renderUserReposCard(rep, userReposBlock));
    }
  } else {
    console.error(`Error status ${response.status}`);
  }
}

function renderUserInfoPageContent(userData) {
  createUserCard(userData, userInfoBlock, 'userInfo');
}

function renderUserReposCard(reposData, container) {
  const reposCard = createElement('div', 'userCard');
  reposCard.innerHTML = `
    <div><p class="reposName">${reposData.name}</p></div>
    <div class="userRepBtnArea">
      <button class="btnShowRep"><a href="${reposData.html_url}" target="_blank">Go to Github</a></button>
    </div>
  `;
  container.append(reposCard);
}

function renderCards(users, container, page) {
  if (users.length !== 0) {
    usersListContainer.innerHTML = '';
    document.querySelector('.paginationArea').style.display = 'block';
    const favorites = compareStorageAndResponseArrays(users, JSON.parse(localStorage.getItem('favUsers')));

    users.forEach(user => {
      createUserCard(user, container, page);

      const starBtn = document.getElementById(user.id);
      starBtn.addEventListener('click', () => addInFavorites(user, 'main'));

      const btnShowRep = document.getElementById(user.login);
      btnShowRep.addEventListener('click', () => onUserInfoPage(user));

      favorites.forEach(favUser => {
        if (favUser.id === user.id) {
          starBtn.classList.add('btnStarSelected');
        }
      });
    });

    checkPaginationBtn();
  } else {
    usersListContainer.innerHTML = `<h3 class="noResults">No results</h3>`;
    document.querySelector('.paginationArea').style.display = 'none';
  }

  if (loadingError) {
    usersListContainer.innerHTML = `<h1 class="error">Data loading error!</h1>`;
  }
}

function createElement(elementTag, elementClass) {
  const element = document.createElement(elementTag);

  if (elementClass) {
    element.classList.add(elementClass);
  }

  return element;
}

function createUserCard(userData, container, page) {
  const userElement = createElement('div', 'userCard');

  if (page === 'main') {
    userElement.innerHTML = `
                  <div class="userImgArea"><img src="${userData.avatar_url}" alt="${userData.login}"></div>
                  <div class="flexColumn userNameBox">
                      <span>${userData.login}</span>
                      <span>
                        <a href="${userData.html_url}" class="linkToGithub" target="_blank">link to github</a>
                      </span>
                  </div>
                  <div class="flexColumn userCardBtns">
                      <button type="button" class="btnStar" id="${userData.id}">
                         <i class="fa fa-star"></i>
                      </button>
                      <button class="btnShowRep" id="${userData.login}"><a href="#">Show repositories</a></button>
                  </div> 
                  `;

  } else if (page === 'favorites') {
    userElement.innerHTML = `
                  <div class="userImgArea"><img src="${userData.avatar_url}" alt="${userData.login}"></div>
                  <div class="flexColumn userNameBox">
                      <span>${userData.login}</span>
                      <span>
                        <a href="${userData.html_url}" class="linkToGithub" target="_blank">link to github</a>
                      </span>
                  </div>
                  <div class="flexColumn userCardBtns">
                      <button type="button" class="btnStar" id="${userData.id + userData.login}">
                         <i class="fa fa-star"></i>
                      </button>
                      <button class="btnShowRep" id="${userData.login + userData.id}">
                         <a href="#">Show repositories</a>
                      </button>
                  </div> 
                  `;
  } else if (page === 'userInfo') {
    userElement.innerHTML = `
                  <div class="userImgArea"><img src="${userData.avatar_url}" alt="${userData.login}"></div>
                  <div class="flexColumn userNameBox">
                      <span>${userData.login}</span>
                      <span>
                        <a href="${userData.html_url}" class="linkToGithub" target="_blank">link to github</a>
                      </span>
                  </div>
                  <div class="flexColumn userCardBtns">
                      <button type="button" class="btnStarUserInfo" id="${userData.id + userData.login + 'user'}">
                         <i class="fa fa-star"></i>
                      </button>
                  </div> 
                  `;
  }
  container.append(userElement);
}

async function onPreviousPage() {
  usersListContainer.innerHTML = '';
  let prevUsers = '';

  if (isRandomFetch) {
    pageRandomFetch--;
    currentPage.value = pageRandomFetch;
    prevUsers = await fetchRandomUsers(pageRandomFetch);
    currentPage.value = pageRandomFetch;
  } else {
    pageSearchFetch--;
    currentPage.value = pageSearchFetch;
    prevUsers = await searchUsers
    (searchInput.value, sortSelect.value, orderSelect.value, perPageInput.value, pageSearchFetch);
    currentPage.value = pageSearchFetch;
  }

  renderCards(prevUsers, usersListContainer, 'main');
  window.scrollTo(0, 0);
}

async function onNextPage() {
  usersListContainer.innerHTML = '';
  let nextUsers = '';

  if (isRandomFetch) {
    pageRandomFetch++;
    currentPage.value = pageRandomFetch;
    nextUsers = await fetchRandomUsers(pageRandomFetch);
  } else {
    pageSearchFetch++;
    currentPage.value = pageSearchFetch;
    nextUsers = await searchUsers
    (searchInput.value, sortSelect.value, orderSelect.value, perPageInput.value, pageSearchFetch);
  }

  renderCards(nextUsers, usersListContainer, 'main');
  window.scrollTo(0, 0);
}

function checkPaginationBtn() {
  const prevBtn = document.querySelector('#prevBtn');
  const nextBtn = document.querySelector('#nextBtn');

  onStylePaginationBtn(prevBtn);
  onStylePaginationBtn(nextBtn);

  if (parseInt(currentPage.value) === 1) {
    prevBtn.style.pointerEvents = 'none';
    prevBtn.style.backgroundColor = '#f5f5f5';
  } else {
    prevBtn.style.pointerEvents = 'auto';
    prevBtn.style.backgroundColor = '#5b595b';
  }

  if (parseInt(currentPage.value) === totalNumberOfPages) {
    nextBtn.style.pointerEvents = 'none';
    nextBtn.style.backgroundColor = '#f5f5f5';
  } else {
    nextBtn.style.pointerEvents = 'auto';
    nextBtn.style.backgroundColor = '#5b595b';
  }
}

function onStylePaginationBtn(btn) {
  btn.className = 'pagBtn';
  return btn;
}

function compareStorageAndResponseArrays(arr1, arr2) {
  const favUsers = [];

  arr1.forEach(userData1 => arr2.forEach(userData2 => {
    if (userData1.id === userData2.id) {
      favUsers.push({
        id: userData1.id,
        login: userData1.login,
      });
    }
  }));

  return favUsers;
}

function addInFavorites(userData, page) {
  const data = {
    id: userData.id,
    login: userData.login,
    avatar_url: userData.avatar_url,
    html_url: userData.html_url,
    repos_url: userData.repos_url,
  };

  const starBtnOnMainPage = document.getElementById(userData.id);
  const starBtnOnFavPage = document.getElementById(userData.id + userData.login);
  const starBtnOnUserInfoPage = document.getElementById(userData.id + userData.login + 'user');

  let favUsers = [];

  if (localStorage.getItem('favUsers')) {
    favUsers = JSON.parse(localStorage.getItem('favUsers'));
  }

  if (!(favUsers.find(user => user.id === userData.id))) {
    favUsers.push(data);
    localStorage.setItem("favUsers", JSON.stringify(favUsers));

    if (page === 'main') {
      starBtnOnMainPage.classList.add('btnStarSelected');
    } else if (page === 'favorites') {
      starBtnOnFavPage.classList.add('btnStarSelected');
      if (starBtnOnMainPage) starBtnOnMainPage.classList.add('btnStarSelected');
      if (starBtnOnUserInfoPage) starBtnOnUserInfoPage.classList.add('btnStarSelected');
    } else if (page === 'userInfo') {
      starBtnOnUserInfoPage.classList.add('btnStarSelected');
      if (starBtnOnMainPage) starBtnOnMainPage.classList.add('btnStarSelected');
    }

  } else {
    const users = favUsers.filter(user => user.id !== userData.id);
    localStorage.setItem("favUsers", JSON.stringify(users));
    if (page === 'main') {
      starBtnOnMainPage.classList.remove('btnStarSelected')
    } else if (page === 'favorites') {
      starBtnOnFavPage.closest('.userCard').style.display = 'none';
      if (starBtnOnMainPage) starBtnOnMainPage.classList.remove('btnStarSelected');
      if (starBtnOnUserInfoPage) starBtnOnUserInfoPage.classList.remove('btnStarSelected');
    } else if (page === 'userInfo') {
      starBtnOnUserInfoPage.classList.remove('btnStarSelected');
      if (starBtnOnMainPage) starBtnOnMainPage.classList.remove('btnStarSelected');
    }
  }
}

document.getElementById('menuBtn').addEventListener('click', () => {
  const menu = document.getElementById('menuList');
  menu.style.display === 'block' ? menu.style.display = 'none' : menu.style.display = 'block';
});

window.addEventListener('resize', function (event) {
  if (window.innerWidth > 749) {
    document.getElementById('menuList').style.display = 'block';
  } else {
    document.getElementById('menuList').style.display = 'none'
  }
});
