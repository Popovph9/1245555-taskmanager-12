import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createSiteFilterTemplate} from "./view/site-filter.js";
import {createBoardElement} from "./view/board-element.js";
import {createBoardFiltersTemplate} from "./view/board-filters.js";
import {editCardTemplate} from "./view/edit-card";
import {createCardTemplate} from "./view/create-card";
import {createloadButtonTemplate} from "./view/load-button";

const CARDS_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const mainElement = document.querySelector(`.main`);
const siteHeader = mainElement.querySelector(`.main__control`);

render(siteHeader, createSiteMenuTemplate(), `beforeend`);

render(mainElement, createSiteFilterTemplate(), `beforeend`);
render(mainElement, createBoardElement(), `beforeend`);

const boardElement = mainElement.querySelector(`.board`);
const filtersContainer = boardElement.querySelector(`.board__filter-list`);
const cardsContainer = boardElement.querySelector(`.board__tasks`);

render(filtersContainer, createBoardFiltersTemplate(), `beforeend`);
render(cardsContainer, editCardTemplate(), `beforeend`);

for (let i = 0; i < CARDS_COUNT; i++) {
  render(cardsContainer, createCardTemplate(), `beforeend`);
}

render(boardElement, createloadButtonTemplate(), `beforeend`);
