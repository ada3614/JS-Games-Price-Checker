const gameName = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");
const API_KEY = `https://www.cheapshark.com/api/1.0/games?title=`;
const API_LOOKUP = `https://www.cheapshark.com/api/1.0/games?id=`;
const API_STORES = `https://www.cheapshark.com/api/1.0/stores`;
let storesFromApi = [];

// console.log(API_STORES);

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
  // console.log(gameItem);
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
  // console.log(game);
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
          <button class="go-to btn-violet" data-storeid="${storeId}">Go to Store</button>
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

const checkStoreId = (storeId) => {
  switch (storeId) {
    case "1":
      console.log("Steam");
      window.open("https://store.steampowered.com/");
      break;
    case "2":
      console.log("GamersGate");
      window.open("https://www.gamersgate.com/");
      break;
    case "3":
      console.log("GreenManGaming");
      window.open("https://www.greenmangaming.com/");
      break;
    case "4":
      console.log("Amazon");
      window.open("https://www.amazon.com/");
      break;
    case "5":
      console.log("GameStop");
      window.open("https://www.gamestop.com/");
      break;
    case "6":
      console.log("Direct2Drive");
      window.open("https://m.direct2drive.com/");
      break;
    case "7":
      console.log("GOG");
      window.open("https://www.gog.com/en/");
      break;
    case "8":
      console.log("Origin");
      window.open("https://www.ea.com/en-gb/ea-app?setLocale=en-gb");
      break;
    case "9":
      console.log("Get Games");
      window.open("https://getgames.app/");
      break;
    case "10":
      console.log("Shiny Loot");
      window.open("");
      break;
    case "11":
      console.log("Humble Store");
      window.open("https://www.humblebundle.com/store");
      break;
    case "12":
      console.log("Desura");
      window.open("https://www.desura.com/pl");
      break;
    case "13":
      console.log("Uplay");
      window.open("https://www.ubisoft.com/en-gb/ubisoft-connect");
      break;
    case "14":
      console.log("IndieGameStand");
      window.open("https://indiegamestand.com/");
      break;
    case "15":
      console.log("Fanatical");
      window.open("https://www.fanatical.com/en/");
      break;
    case "16":
      console.log("Gamesrocket");
      window.open(
        "https://www.strictlylimitedgames.com/collections/partner-store",
      );
      break;
    case "17":
      console.log("Games Republic");
      window.open("https://gamesrepublic.com/");
      break;
    case "18":
      console.log("SilaGames");
      window.open("https://silagames.com/");
      break;
    case "19":
      console.log("Playfield");
      window.open(
        "https://www.roblox.com/pl/communities/11828622/Playfield-Games#!/about",
      );
      break;
    case "20":
      console.log("ImperialGames");
      window.open("https://imperialgames.co.uk/");
      break;
    case "21":
      console.log("WinGameStore");
      window.open("https://www.wingamestore.com/");
      break;
    case "22":
      console.log("FunStockDigital");
      window.open(
        "https://funstock.eu/?shpxid=a460950b-683c-4e78-9d3b-f93460755cd1",
      );
      break;
    case "23":
      console.log("GameBillet");
      window.open("https://www.gamebillet.com/");
      break;
    case "24":
      console.log("Voidu");
      window.open("https://www.voidu.com/en/");
      break;
    case "25":
      console.log("Epic Games Store");
      window.open("https://store.epicgames.com/");
      break;
    case "26":
      console.log("Razer Game Store");
      window.open("https://gold.razer.com/eu/en");
      break;
    case "27":
      console.log("Gamesplanet");
      window.open("https://us.gamesplanet.com/");
      break;
    case "28":
      console.log("Gamesload");
      window.open("https://www.gamesload.com/");
      break;
    case "29":
      console.log("2Game");
      window.open("https://www.2game.com/");
      break;
    case "30":
      console.log("IndieGala");
      window.open("https://www.indiegala.com/");
      break;
    case "31":
      console.log("Blizzard Shop");
      window.open("https://eu.shop.battle.net/en-us#optLogin=true");
      break;
    case "32":
      console.log("AllYouPlay");
      window.open("https://allyouplay.com/");
      break;
    case "33":
      console.log("DLGamer");
      window.open("https://www.dlgamer.com/en");
      break;
    case "34":
      console.log("Noctre");
      window.open("https://www.noctre.com/");
      break;
    case "35":
      console.log("DreamGame");
      window.open("https://www.dreamgame.com/en/");
      break;
    default:
      console.log("błąd");
  }
};

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
    // window.open("https://store.steampowered.com/");
    console.log(event.target.dataset.storeid);
    const storeId = event.target.dataset.storeid;
    checkStoreId(storeId);
  }
});
