//You can edit ALL of the code here

//const { createElement } = require("react");

const navBar = document.createElement("nav");
navBar.id = "header";
document.body.insertBefore(navBar, document.body.firstChild);
//console.log(navBar);

const currentDate = new Date().getFullYear();
const footBar = document.createElement("div");
footBar.id = "footer";
footBar.textContent = `@${currentDate} TV Show Project|Nataliia Volkova(Nataliia74). All rights reserved.`;
document.body.appendChild(footBar);
//console.log(footBar);

const linkDataSource = document.createElement("a");
linkDataSource.id = "linkfooter";
linkDataSource.href = "https://tvmaze.com/";
linkDataSource.textContent = "Data source";
footBar.appendChild(linkDataSource);
//console.log(linkDataSource);

const rootElem = document.querySelector("#root");
//console.log(rootElem);

const episode = getOneEpisode();

// const episodeCard = document.createElement("div");
// episodeCard.classList.add("episode_card");
// rootElem.appendChild(episodeCard);

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

// createEpisodeCardElement(episodeCard, "h2", episode.name);
// //console.log("h2");

// createEpisodeCardElement(
//   episodeCard,
//   "p",
//   `Episode code:  S${episode.season
//     .toString()
//     .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`
// );
// //console.log("p");

// const imageEpisode = document.createElement("img");
// imageEpisode.src = episode.image.medium;
// imageEpisode.alt = episode.name;
// episodeCard.appendChild(imageEpisode);

// createEpisodeCardElement(episodeCard, "p", `Summary: ${episode.summary}`, true);
// //console.log("p");

function setup() {
  const allEpisodes = getAllEpisodes();
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
    //console.log("h2");

    // createEpisodeCardElement(
    //   episodeCard,
    //   "p",
    //   `Episode code:  S${episode.season
    //     .toString()
    //     .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`
    // );
    //console.log("p");

    const imageEpisode = document.createElement("img");
    imageEpisode.src = episode.image.medium;
    imageEpisode.alt = episode.name;
    episodeCard.appendChild(imageEpisode);

    createEpisodeCardElement(episodeCard, "p", episode.summary, true);
    //console.log("p");
  });
}

window.onload = setup;
