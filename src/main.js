import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createSiteFilterTemplate} from "./view/site-filter.js";
import {createBoardElement} from "./view/board-element.js";
import {createBoardFiltersTemplate} from "./view/board-filters.js";
import {editCardTemplate} from "./view/edit-card.js";
import {createCardTemplate} from "./view/create-card.js";
import {createloadButtonTemplate} from "./view/load-button.js";
import {generateTask} from "./view/task.js";
import {generateFilter} from "./view/filters.js";

const CARDS_COUNT = 22;
const CARDS_COUNT_PER_STEP = 8;

const tasks = new Array(CARDS_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const mainElement = document.querySelector(`.main`);
const siteHeader = mainElement.querySelector(`.main__control`);

render(siteHeader, createSiteMenuTemplate(), `beforeend`);

render(mainElement, createSiteFilterTemplate(filters), `beforeend`);
render(mainElement, createBoardElement(), `beforeend`);

const boardElement = mainElement.querySelector(`.board`);
const filtersContainer = boardElement.querySelector(`.board__filter-list`);
const cardsContainer = boardElement.querySelector(`.board__tasks`);

render(filtersContainer, createBoardFiltersTemplate(), `beforeend`);
render(cardsContainer, editCardTemplate(tasks[0]), `beforeend`);

for (let i = 1; i < Math.min(tasks.length, CARDS_COUNT_PER_STEP); i++) {
  render(cardsContainer, createCardTemplate(tasks[i]), `beforeend`);
}

if (tasks.length >= CARDS_COUNT_PER_STEP) {
  let renderedCardsCount = CARDS_COUNT_PER_STEP;

  render(boardElement, createloadButtonTemplate(), `beforeend`);

  const loadMoreButton = boardElement.querySelector(`.load-more`);

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();

    tasks.
      slice(renderedCardsCount, renderedCardsCount + CARDS_COUNT_PER_STEP).
      forEach((task) => render(cardsContainer, createCardTemplate(task), `beforeend`));
  });

  renderedCardsCount += CARDS_COUNT_PER_STEP;

  if (renderedCardsCount >= tasks.length) {
    loadMoreButton.remove();
  }
}
