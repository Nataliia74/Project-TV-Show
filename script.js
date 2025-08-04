//You can edit ALL of the code here

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

const episode = getOneEpisode();

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

const allEpisodes = getAllEpisodes();
const total = allEpisodes.length;

function setup() {
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(allEpisodes) {
  allEpisodes.forEach((episode) => {
    const episodeCard = document.createElement("div");
    episodeCard.classList.add("episode_card");
    rootElem.appendChild(episodeCard);
    createEpisodeCardElement(
      episodeCard,
      "h2",
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
  });
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
  let selectedEpisodes = [];
  if (selectOptionDom.value === "Select All Episodes") {
    modifyEpisodesQuantityDom(allEpisodes.length, total);
    rootElem.innerHTML = "";
    // recreate card for single selected
    makePageForEpisodes(allEpisodes);
  } else {
    // function makePageForEpisodes needs an array as argument
    // even if it is single element ( maybe refactor this in future)
    for (const episode of allEpisodes) {
      if (episode.name == selectEpisodeName) {
        selectedEpisodes[0] = episode;
      }
    }

    const selected = selectedEpisodes.length;
    modifyEpisodesQuantityDom(selected, total);
    // clear all episodes
    rootElem.innerHTML = "";
    // recreate card for single selected
    makePageForEpisodes(selectedEpisodes);
  }
});

const searchInputDom = document.getElementById("episode_input");
navBar.appendChild(searchInputDom);
searchInputDom.addEventListener("input", function () {
  const search = searchInputDom.value.toLowerCase();
  let selectedEpisodes = [];
  for (const episode of allEpisodes) {
    if (
      episode.name.toLowerCase().includes(search) ||
      episode.summary.toLowerCase().includes(search)
    ) {
      selectedEpisodes.push(episode);
    }
  }
  const selected = selectedEpisodes.length;
  modifyEpisodesQuantityDom(selected, total);

  rootElem.innerHTML = "";
  makePageForEpisodes(selectedEpisodes);
});

const episodesQuantityDom = document.getElementById("display_quantity_dom");
navBar.appendChild(episodesQuantityDom);

function modifyEpisodesQuantityDom(selected, total) {
  episodesQuantityDom.textContent = `Displaying ${selected}/${total} episodes.`;
}

modifyEpisodesQuantityDom(allEpisodes.length, total);

window.onload = setup;
