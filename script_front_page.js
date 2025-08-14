const allShows = [];

const state = {
  allShows,
  searchTerm: "",
};

async function fetchAllShows(apiShowsUrl) {
  const cached = localStorage.getItem("tvmazeShows");
  if (cached) {
    return JSON.parse(cached);
  }
  try {
    const response = await fetch(apiShowsUrl);
    if (!response.ok) {
      throw new Error("Could not fetch resource");
    } else {
      const data = await response.json();
      localStorage.setItem("tvmazeShows", JSON.stringify(data));
      return data;
    }
  } catch (error) {
    alert("Failed to load data. Please check your network." + error);
    console.log(error);
    return [];
  }
}
const navBar = document.createElement("div");
navBar.classList.add("header");
document.body.insertBefore(navBar, document.body.firstChild);

const selectorsDom = document.createElement("div");
selectorsDom.classList.add("selectors");
navBar.appendChild(selectorsDom);

const currentDate = new Date().getFullYear();
const footBar = document.createElement("div");
footBar.classList.add("footer");
footBar.textContent = `@${currentDate} TV Show Project|Nataliia Volkova(Nataliia74). All rights reserved.`;
document.body.appendChild(footBar);

const linkDataSource = document.createElement("a");
linkDataSource.classList.add("linkfooter");
linkDataSource.href = "https://tvmaze.com/";
linkDataSource.textContent = "Data source";
footBar.appendChild(linkDataSource);

const showCardsPage = document.getElementById("front_page_root");

function createShowCardElement(
  parentElement,
  tagName,
  id,
  content,
  innerHTML = false
) {
  const element = document.createElement(tagName, id);
  if (innerHTML) {
    element.innerHTML = content;
  } else {
    element.textContent = content;
  }
  parentElement.appendChild(element);
  return element;
}

function getGenre(show) {
  return show.genres.join(" | ");
}

function createShowCard(show) {
  const showCard = document.createElement("div");
  showCard.classList.add("show_card");
  const showTitle = createShowCardElement(showCard, "div");
  showTitle.id = "title";
  const linkToEpisodes = document.createElement("a");
  linkToEpisodes.href = `episodes_page.html?showId=${show.id}`;
  linkToEpisodes.textContent = show.name;
  showTitle.appendChild(linkToEpisodes);

  const showCardContent = document.createElement("div");
  showCardContent.classList.add("content");
  showCard.appendChild(showCardContent);
  const imageShowCard = document.createElement("img");
  imageShowCard.id = "img_front";
  imageShowCard.src = show.image
    ? show.image.medium
    : "https://static.tvmaze.com/images/tvm-header-logo.png";
  imageShowCard.alt = show.name || "No title";
  showCardContent.appendChild(imageShowCard);
  const containerForText = document.createElement("div");
  containerForText.classList.add("summary");
  showCardContent.appendChild(containerForText);

  createShowCardElement(
    containerForText,
    "p",
    "summary_text",
    show.summary || "No summary available",
    true
  );
  const sideShowCard = document.createElement("div");
  sideShowCard.classList.add("sideShowCard");
  createShowCardElement(
    sideShowCard,
    "p",
    "rated",
    `Rated: ${show.rating.average}`
  );
  createShowCardElement(
    sideShowCard,
    "p",
    "genre",
    `Genres: ${getGenre(show)}`
  );
  createShowCardElement(sideShowCard, "p", "status", `Status: ${show.status}`);
  createShowCardElement(
    sideShowCard,
    "p",
    "runtime",
    `Runtime: ${show.runtime}`
  );
  showCardContent.appendChild(sideShowCard);

  return showCard;
}

async function setup() {
  try {
    state.allShows = await fetchAllShows("https://api.tvmaze.com/shows");
    const total = state.allShows.length;
    makePageShows(state.allShows);
    modifyShowsQuantityDom(total);
    populateSelect(state.allShows);
  } catch (error) {
    console.log(`Error:`, error);
  }
}

function makePageShows(shows) {
  showCardsPage.innerHTML = "";
  const showCards = shows.map(createShowCard);
  showCardsPage.append(...showCards);
}

let selectedShows = [];

const searchInputDom = document.getElementById("show_input");
navBar.appendChild(searchInputDom);

const showsQuantityDom = document.getElementById("display_quantityShows_dom");
navBar.appendChild(showsQuantityDom);

const label = document.createElement("label");
label.textContent = "Select a show";
label.setAttribute("for", "filtered_show_box");
const selectFilteredShowOptionDom = document.createElement("select");
selectFilteredShowOptionDom.id = "filtered_show_box";
navBar.appendChild(label);
navBar.appendChild(selectFilteredShowOptionDom);
const selectAllShowsOptionDom = document.createElement("option");
selectAllShowsOptionDom.value = "All shows";
selectAllShowsOptionDom.textContent = selectAllShowsOptionDom.value;
selectFilteredShowOptionDom.appendChild(selectAllShowsOptionDom);

function populateSelect(shows) {
  selectFilteredShowOptionDom.innerHTML = "";

  const selectAllShowsOptionDom = document.createElement("option");
  selectAllShowsOptionDom.value = "All shows";
  selectAllShowsOptionDom.textContent = "All shows";
  selectFilteredShowOptionDom.appendChild(selectAllShowsOptionDom);

  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.name;
    option.textContent = show.name;
    selectFilteredShowOptionDom.appendChild(option);
  });
}

searchInputDom.addEventListener("input", function () {
  const search = searchInputDom.value.toLowerCase();
  if (search === "") {
    selectedShows = state.allShows;
  } else {
    selectedShows = state.allShows.filter(
      (show) =>
        show.name.toLowerCase().includes(search) ||
        show.summary.toLowerCase().includes(search) ||
        show.genres.some((genre) => genre.toLowerCase().includes(search))
    );
  }

  modifyShowsQuantityDom(selectedShows.length);
  makePageShows(selectedShows);
  populateSelect(selectedShows);
});

// Filter shows according to the dropdown list of the whole
// shows list or the selected shows, referring to the search input
selectFilteredShowOptionDom.addEventListener("change", async function () {
  let selectShowName = selectFilteredShowOptionDom.value;
  if (selectShowName === "All shows") {
    modifyShowsQuantityDom(state.allShows.length);
    makePageShows(state.allShows);
  } else {
    const searchList = selectedShows.length ? selectedShows : state.allShows;
    let picked = searchList.filter((show) => show.name === selectShowName);
    modifyShowsQuantityDom(picked.length);
    makePageShows(picked);
  }
});

function modifyShowsQuantityDom(selected) {
  showsQuantityDom.textContent = `Found ${selected} shows`;
}

// Cross-referencing to the page with episodes
const linkToEpisodesListing = document.createElement("a");
linkToEpisodesListing.id = "crossing";
linkToEpisodesListing.href = "episodes_page.html";
linkToEpisodesListing.textContent = "Episodes Listing";
navBar.appendChild(linkToEpisodesListing);

window.onload = setup;
