const gameName = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");
const API_KEY = `https://www.cheapshark.com/api/1.0/games?title=`;
const API_LOOKUP = `https://www.cheapshark.com/api/1.0/games?id=`;
const API_STORES = `https://www.cheapshark.com/api/1.0/stores`;
let storesFromApi = [];

console.log(API_STORES);

// SEARCH RESULT ITEMS
const searchListContainer = document.querySelector(".search-result-container");
const thumb = document.querySelector(".game-cover-thumb");
const listGameTitle = document.querySelector(".search-title");
const listGamePrice = document.querySelector(".search-price-value");
// const listGameBtn = document.querySelector(".search-list-btn");

const welcomeScreen = document.querySelector(".welcome-screen-container");
const welcomeTxt = document.querySelector(".welcome-screen-container h1");

// LOOKUP

const lookupBtn = document.querySelector(".search-list-btn");
const searchItemsContainer = document.querySelector(".search-result-container");
const dealsContainer = document.querySelector(".deals-container");
const dealsWrapper = document.querySelector(".deals-wrapper");
const dealsHeaderContainer = document.querySelector(".deals-main-txt");
const dealsHeader = document.querySelector(".deals-header");

// SEARCH SECTION

async function getGameList(gameTitle) {
  const response = await fetch(API_KEY + gameTitle);
  const data = await response.json();
  return data;
}

function showSearchError() {
  welcomeScreen.style.display = "block";
  welcomeTxt.textContent = "Enter a correct game title 🫣";
  searchListContainer.innerHTML = "";
  dealsHeader.innerHTML = "";
  dealsWrapper.innerHTML = "";
  dealsContainer.style.display = "none";
  gameName.value = "";
}

async function handleSearch() {
  const searchTitle = gameName.value.trim();

  if (!searchTitle) {
    showSearchError();
    return;
  }

  try {
    const getGame = await getGameList(searchTitle);

    // API nie znalazło żadnej gry
    if (getGame.length === 0) {
      showSearchError();
      return;
    }

    welcomeScreen.style.display = "none";
    welcomeTxt.textContent = "Find the game you want to buy! 🎮";
    searchListContainer.innerHTML = "";

    getGame.forEach((game) => {
      updateSearchedItem(game);
    });

    gameName.value = "";
  } catch (error) {
    console.error("Search error:", error);
    showSearchError();
  }
  showSearchView();
}

function updateSearchedItem(gameItem) {
  const {
    cheapest: price,
    external: title,
    thumb: thumbnail,
    gameID: id,
  } = gameItem;
  console.log(gameItem);
  const gameItemHtml = `
  <div class="search-item">
          <div class="game-info-container">
            <img
              src="${thumbnail}"
              alt=""
              class="game-cover-thumb"
            />
            <h3 class="search-title">${title}</h3>
            <div class="search-price">
              <h5 class="search-price-name">Cheapest:</h5>
              <h4 class="search-price-value">${price}$</h4>
            </div>
          </div>
          <button class="search-list-btn btn-violet" data-id="${id}">Game Info</button>
        </div>
  `;

  searchListContainer.insertAdjacentHTML("beforeend", gameItemHtml);
}

// DEALS SECTION

async function getGameLookup(gameID) {
  const response = await fetch(API_LOOKUP + gameID);
  const data = await response.json();
  return data;
}

async function handleGameClick(event) {
  const gameID = await event;
  const game = await getGameLookup(gameID);
  console.log(game);
  renderDealsPage(game);
  showDealsView();
}

function renderDealsPage(game) {
  const {
    deals: dealsList,
    cheapestPriceEver: { price: cheapestPrice },
    info: { thumb: thumbnail, title: gameTitle },
  } = game;

  const dealsHeaderHtml = `
  <div class="deals-header">
    <img src="${thumbnail}" alt="" class="game-cover-thumb">
    
      <h2>${gameTitle}</h2>
      <div class="deal-cheapest-ever">
        <h4 class="price-name">Cheapest Price Ever:</h4>
              <h3 class="price-value">${cheapestPrice}$</h3>
      
    </div>
    
  </div>
  `;
  dealsHeader.insertAdjacentHTML("afterbegin", dealsHeaderHtml);
  renderDealsList(dealsList);
}

function renderDealsList(dealsList) {
  dealsList.forEach((deal) => {
    renderDeal(deal);
  });
}

function renderDeal(deal) {
  const {
    storeID: storeId,
    price: lowPrice,
    retailPrice: retailPrice,
    savings: savings,
  } = deal;
  const savingRound = Math.floor(savings);
  const result = storesFromApi.find((store) => {
    return store.storeID === storeId;
  });
  const savingClass = savingRound === 0 ? "saving-zero" : "saving-discount";
  const discountClass =
    lowPrice === retailPrice ? "price-standard" : "price-discount";
  const dealHtml = `
  <div class="line"></div>
    <div class="deal-item">
        <div class="store">
          <img src="https://www.cheapshark.com/img/stores/logos/${storeId - 1}.png" alt="store-logo" class="store-logo">
          <h4>${result.storeName}</h4>
         </div>
         <div class="prices">
            <div class="deals-price-info">
              
        <h4 class="list-deals-price ${discountClass}">${lowPrice}$</h4>
        <h5>Price</h5>
            </div>
            <div class="deals-price-info">
              <h4 class="list-deals-price">${retailPrice}$</h4>
              <h5>Retail Price</h5>
                          </div>
            <div class="saving">
                            <h3 class="saving-value ${savingClass}">-${savingRound}%</h4>
            </div>
          </div>
          <button class="go-to btn-violet">Go to Store</button>
      </div>
      `;

  dealsWrapper.insertAdjacentHTML("beforeend", dealHtml);
}

// STORES INFO

async function getStoresInfo() {
  const response = await fetch(API_STORES);
  const data = await response.json();
  return data;
}

async function list() {
  storesFromApi = await getStoresInfo();
}

// SHOW CONTAINERS

function showSearchView() {
  dealsContainer.style.display = "none";
  searchListContainer.style.display = "flex";
  dealsHeader.innerHTML = "";
  dealsWrapper.innerHTML = "";
}
function showDealsView() {
  searchListContainer.style.display = "none";
  searchListContainer.innerHTML = "";
  dealsContainer.style.display = "flex";
}

list();

// EVENT LISTENERS

searchBtn.addEventListener("click", () => {
  handleSearch();
});

gameName.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    handleSearch();
  }
});

searchListContainer.addEventListener("click", (event) => {
  if (event.target.matches(".search-list-btn")) {
    handleGameClick(event.target.dataset.id);
  }
});

dealsWrapper.addEventListener("click", (event) => {
  if (event.target.matches(".go-to")) {
    window.open("https://store.steampowered.com/");
  }
});
