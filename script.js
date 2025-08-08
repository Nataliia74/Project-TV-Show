//You can edit ALL of the code here

const state = {
  allEpisodes: [],

  searchTerm: "",
};

let total = 0;

async function fetchData() {
  const cached = localStorage.getItem("tvmazeEpisodes");
  if (cached) {
    return JSON.parse(cached);
  }
  try {
    const response = await fetch("https://api.tvmaze.com/shows/82/episodes");
    if (!response.ok) {
      throw new Error("Could not fetch resource");
    } else {
      const data = await response.json();
      localStorage.setItem("tvmazeEpisodes", JSON.stringify(data));
      return data;
    }
  } catch (error) {
    alert("Failed to load data. Please check your network." + error);
    console.log(error);
    return [];
  }
}

const navBar = document.createElement("div");
navBar.id = "header";
document.body.insertBefore(navBar, document.body.firstChild);

const currentDate = new Date().getFullYear();
const footBar = document.createElement("div");
footBar.id = "footer";
footBar.textContent = `@${currentDate} TV Show Project|Nataliia Volkova(Nataliia74). All rights reserved.`;
document.body.appendChild(footBar);

const linkDataSource = document.createElement("a");
linkDataSource.id = "linkfooter";
linkDataSource.href = "https://tvmaze.com/";
linkDataSource.textContent = "Data source";
footBar.appendChild(linkDataSource);

const rootElem = document.querySelector("#root");

function createEpisodeCardElement(
  parentElement,
  tagName,
  content,
  innerHTML = false
) {
  const element = document.createElement(tagName);
  if (innerHTML) {
    element.innerHTML = content;
  } else {
    element.textContent = content;
  }
  parentElement.appendChild(element);
  return element;
}

//const allEpisodes = getAllEpisodes();
//const total = allEpisodes.length;

async function setup() {
  try {
    state.allEpisodes = await fetchData();
    total = state.allEpisodes.length;
    makePageForEpisodes(state.allEpisodes);
    modifyEpisodesQuantityDom(total, total);
  } catch (error) {
    console.log(`Error:`, error);
  }
}
setup();

function createEpisodeCard(episode) {
  const episodeCard = document.createElement("div");
  episodeCard.classList.add("episode_card");
  createEpisodeCardElement(
    episodeCard,
    "h3",
    `${episode.name}  -  S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`
  );

  const imageEpisode = document.createElement("img");
  imageEpisode.src = episode.image.medium;
  imageEpisode.alt = episode.name;
  episodeCard.appendChild(imageEpisode);

  createEpisodeCardElement(episodeCard, "p", episode.summary, true);
  addSelectEntry(episode);
  return episodeCard;
}

function makePageForEpisodes(episodes) {
  rootElem.innerHTML = "";
  const episodeCards = episodes.map(createEpisodeCard);
  rootElem.append(...episodeCards);
}

// search bar part
const episodeSelectDom = document.getElementById("episodes_selection");
navBar.appendChild(episodeSelectDom);
const selectPlaceholderOptionDom = document.createElement("option");
selectPlaceholderOptionDom.value = "";
selectPlaceholderOptionDom.textContent = "Select an episode";
selectPlaceholderOptionDom.disabled = true;
selectPlaceholderOptionDom.selected = true;
selectPlaceholderOptionDom.hidden = false;
episodeSelectDom.appendChild(selectPlaceholderOptionDom);
// this first select option to select all episodes
// so it created here manually
const selectAllOptionDom = document.createElement("option");
selectAllOptionDom.value = "Select All Episodes";
selectAllOptionDom.textContent = "Select All Episodes";
episodeSelectDom.appendChild(selectAllOptionDom);

function addSelectEntry(episode) {
  const optionDom = document.createElement("option");
  optionDom.value =
    `S${episode.season.toString().padStart(2, "0")}E${episode.number
      .toString()
      .padStart(2, "0")}` +
    " - " +
    episode.name;
  optionDom.textContent = optionDom.value;
  episodeSelectDom.appendChild(optionDom);
}

const selectOptionDom = document.getElementById("episodes_selection");
selectOptionDom.addEventListener("change", function () {
  let selectEpisodeName = selectOptionDom.value.substring(
    selectOptionDom.value.indexOf("- ") + 2
  );
  let selectedEpisodes;
  if (selectOptionDom.value === "Select All Episodes") {
    selectedEpisodes = state.allEpisodes;
    modifyEpisodesQuantityDom(total, total);
    rootElem.innerHTML = "";
    makePageForEpisodes(state.allEpisodes);
  } else {
    selectedEpisodes = state.allEpisodes.filter(
      (episode) => episode.name === selectEpisodeName
    );
  }
  modifyEpisodesQuantityDom(selectedEpisodes.length, total);
  rootElem.innerHTML = "";
  // recreate card for single selected
  const filteredEpisodes = selectedEpisodes.map(createEpisodeCard);
  rootElem.append(...filteredEpisodes);
});

const searchInputDom = document.getElementById("episode_input");
navBar.appendChild(searchInputDom);
searchInputDom.addEventListener("input", function () {
  const search = searchInputDom.value.toLowerCase();
  let selectedEpisodes = state.allEpisodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(search) ||
      episode.summary.toLowerCase().includes(search)
  );

  modifyEpisodesQuantityDom(selectedEpisodes.length, total);

  rootElem.innerHTML = "";
  filteredEpisodes = selectedEpisodes.map(createEpisodeCard);
  rootElem.append(...filteredEpisodes);
});

const episodesQuantityDom = document.getElementById("display_quantity_dom");
navBar.appendChild(episodesQuantityDom);

function modifyEpisodesQuantityDom(selected, total) {
  episodesQuantityDom.textContent = `Displaying ${selected}/${total} episodes.`;
}

window.onload = setup;
