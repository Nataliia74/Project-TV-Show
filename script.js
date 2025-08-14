//You can edit ALL of the code here

const state = {
  allEpisodes: [],
  allShows: [],

  searchTerm: "",
};
// first time page rendered - first show selected
let selectedShowId = 1;
let total = 0;

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

async function fetchShowEpisodesData(apiEpisodesUrl, showId) {
  //each show has different place in cache according to show id
  const cached = localStorage.getItem("tvmazeEpisodes" + "_" + showId);
  if (cached) {
    return JSON.parse(cached);
  }
  try {
    const response = await fetch(apiEpisodesUrl);
    if (!response.ok) {
      throw new Error("Could not fetch resource");
    } else {
      const data = await response.json();
      //each show has different place in cache according to show id
      localStorage.setItem(
        "tvmazeEpisodes" + "_" + showId,
        JSON.stringify(data)
      );
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

async function setup() {
  try {
    state.allShows = await fetchAllShows(`https://api.tvmaze.com/shows`);
    state.allShows.sort((a, b) => {
      const A = a.name.toLowerCase();
      const B = b.name.toLowerCase();
      if (A > B) return 1;
      if (A < B) return -1;
      return 0;
    });
    for (const show of state.allShows) {
      addSelectEntry(show, "show");
    }

    // read query from index.html page
    const query = new URLSearchParams(window.location.search);
    const selectedUrl = query.get("showId") || 1;
    selectedShowId = selectedUrl;

    state.allEpisodes = await fetchShowEpisodesData(
      `https://api.tvmaze.com/shows/${selectedShowId}/episodes`,
      selectedShowId
    );

    const selectedShow = state.allShows.find(
      (show) => show.id == selectedShowId
    );

    //check if the show name refers to the episode page refers to the clicked show name on the index.html page
    if (selectedShow) showSelectDom.value = selectedShow.name;

    // populate dropdown
    episodeSelectDom.innerHTML = "";
    createFirstOptionDom();
    state.allEpisodes.forEach((episode) => addSelectEntry(episode, "episode"));

    //render episodes
    total = state.allEpisodes.length;
    makePageForEpisodes(state.allEpisodes);
    modifyEpisodesQuantityDom(total, total);
  } catch (error) {
    console.log(`Error:`, error);
    rootElem.innerHTML = "Failed to fetch data";
  }
}

createSelectDom("shows");
createSelectDom("episodes");
// search bar part
const episodeSelectDom = document.getElementById("episodes_selection");
const showSelectDom = document.getElementById("shows_selection");
createFirstOptionDom();
setup();

function createEpisodeCode(episode) {
  return `S${episode.season.toString().padStart(2, "0")}E${episode.number
    .toString()
    .padStart(2, "0")}`;
}

function createEpisodeCard(episode) {
  const episodeCard = document.createElement("div");
  episodeCard.classList.add("episode_card");
  createEpisodeCardElement(
    episodeCard,
    "h3",
    `${episode.name}  -  ` + createEpisodeCode(episode)
  );

  const imageEpisode = document.createElement("img");
  imageEpisode.id = "img_epi";
  imageEpisode.src = episode.image
    ? episode.image.medium
    : "https://static.tvmaze.com/images/tvm-header-logo.png";
  imageEpisode.alt = episode.name || "No title";
  episodeCard.appendChild(imageEpisode);

  createEpisodeCardElement(
    episodeCard,
    "p",
    episode.summary || "No summary available",
    true
  );
  //addSelectEntry(episode, "episode");
  return episodeCard;
}

function makePageForEpisodes(episodes) {
  rootElem.innerHTML = "";
  const episodeCards = episodes.map(createEpisodeCard);
  rootElem.append(...episodeCards);
}

function createSelectDom(type) {
  const itemSelectDom = document.createElement("select");
  itemSelectDom.id = type + "_selection";
  selectorsDom.appendChild(itemSelectDom);
}

// this function return correct article
// depending on first character of word
function wordArticle(word) {
  return "aeiouAEIOU".indexOf(word[0]) != -1 ? "an" : "a";
}

// this function returns correct select dom for option type(string parameter)
function domElementForSelectType(type) {
  if (type == "episode") {
    return (typeDom = episodeSelectDom);
  } else if (type == "show") {
    return (typeDom = showSelectDom);
  }
  return "";
}

// this function for creation of episodes first select option and placeholder
function createFirstOptionDom() {
  const selectPlaceholderOptionDom = document.createElement("option");
  selectPlaceholderOptionDom.value = "";
  selectPlaceholderOptionDom.textContent = "Select an episode";
  selectPlaceholderOptionDom.disabled = true;
  selectPlaceholderOptionDom.selected = true;
  selectPlaceholderOptionDom.hidden = false;
  episodeSelectDom.appendChild(selectPlaceholderOptionDom);
  const selectAllOptionDom = document.createElement("option");
  selectAllOptionDom.value = "Select all episodes";
  selectAllOptionDom.textContent = selectAllOptionDom.value;
  episodeSelectDom.appendChild(selectAllOptionDom);
}

// select entry function now also universal for shows and episodes options
function addSelectEntry(item, type) {
  // this statement defines to witch dom we attach created option
  const typeDom = domElementForSelectType(type);

  const optionDom = document.createElement("option");
  // show selection does not need code
  if (type == "episode") {
    optionDom.value = createEpisodeCode(item) + " - " + item.name;
  } else {
    optionDom.value = item.name;
  }
  optionDom.textContent = optionDom.value;
  typeDom.appendChild(optionDom);
}

const selectEpisodeOptionDom = document.getElementById("episodes_selection");
selectEpisodeOptionDom.addEventListener("change", function () {
  let selectEpisodeName = selectEpisodeOptionDom.value.substring(
    selectEpisodeOptionDom.value.indexOf("- ") + 2
  );
  let selectedEpisodes;
  if (selectEpisodeOptionDom.value === "Select all episodes") {
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

const selectShowOptionDom = document.getElementById("shows_selection");
selectShowOptionDom.addEventListener("change", async function () {
  let selectShowName = selectShowOptionDom.value;
  let selectedShow = state.allShows.filter(
    (show) => show.name === selectShowName
  );

  //here we use selected show id to get episodes
  selectedShowId = selectedShow[0].id;
  state.allEpisodes = await fetchShowEpisodesData(
    "https://api.tvmaze.com/shows/" + selectedShowId + "/episodes",
    selectedShowId
  );

  total = state.allEpisodes.length;

  // add filtered episodes dropdown options list
  episodeSelectDom.innerHTML = "";
  createFirstOptionDom();

  for (const episode of state.allEpisodes) {
    addSelectEntry(episode, "episode");
  }
  rootElem.innerHTML = "";
  makePageForEpisodes(state.allEpisodes);

  modifyEpisodesQuantityDom(total, total);
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
  episodesQuantityDom.textContent = `Displaying ${selected}/${total} episodes`;
}

const linkToShowListing = document.createElement("a");
linkToShowListing.id = "crossing";
linkToShowListing.href = "index.html";
linkToShowListing.textContent = "Back to Show Listing";
navBar.appendChild(linkToShowListing);

window.onload = setup;
