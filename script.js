//You can edit ALL of the code here

//const { createElement } = require("react");

const rootElem = document.querySelector("#root");
console.log(rootElem);

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

const episodeCard = document.createElement("div");
episodeCard.classList.add("episode_card");
rootElem.appendChild(episodeCard);
console.log(episodeCard);

const episode = getOneEpisode();

createEpisodeCardElement(episodeCard, "h2", episode.name);
console.log("h2");

createEpisodeCardElement(
  episodeCard,
  "p",
  `Episode code:  S${episode.season
    .toString()
    .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`
);
console.log("p");

const imageEpisode = document.createElement("img");
imageEpisode.src = episode.image.medium;
imageEpisode.alt = episode.name;
episodeCard.appendChild(imageEpisode);

createEpisodeCardElement(episodeCard, "p", `Summary: ${episode.summary}`, true);
console.log("p");

function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(listEpisodes) {
  const rootElem = document.getElementById("root");
  listEpisodes.forEach(episode, () => {});
}

window.onload = setup;
