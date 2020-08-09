import {getCreateSiteMenuTemplate} from "./view/site-menu.js";
import {getCreateSiteFilterTemplate} from "./view/site-filter.js";
import {getCreateBoardElement} from "./view/board-element.js";
import {getCreateBoardFiltersTemplate} from "./view/board-filters.js";
import {getEditCardTemplate} from "./view/edit-card.js";
import {getCreateCardTemplate} from "./view/create-card.js";
import {getLoadButtonTemplate} from "./view/load-button.js";
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

render(siteHeader, getCreateSiteMenuTemplate(), `beforeend`);

render(mainElement, getCreateSiteFilterTemplate(filters), `beforeend`);
render(mainElement, getCreateBoardElement(), `beforeend`);

const boardElement = mainElement.querySelector(`.board`);
const filtersContainer = boardElement.querySelector(`.board__filter-list`);
const cardsContainer = boardElement.querySelector(`.board__tasks`);

render(filtersContainer, getCreateBoardFiltersTemplate(), `beforeend`);
render(cardsContainer, getEditCardTemplate(tasks[0]), `beforeend`);

for (let i = 1; i < Math.min(tasks.length, CARDS_COUNT_PER_STEP); i++) {
  render(cardsContainer, getCreateCardTemplate(tasks[i]), `beforeend`);
}

if (tasks.length > CARDS_COUNT_PER_STEP) {
  let renderedCardsCount = CARDS_COUNT_PER_STEP;

  render(boardElement, getLoadButtonTemplate(), `beforeend`);

  const loadMoreButton = boardElement.querySelector(`.load-more`);

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();

    tasks.
      slice(renderedCardsCount, renderedCardsCount + CARDS_COUNT_PER_STEP).
      forEach((task) => render(cardsContainer, getCreateCardTemplate(task), `beforeend`));
  });

  renderedCardsCount += CARDS_COUNT_PER_STEP;

  if (renderedCardsCount >= tasks.length) {
    loadMoreButton.remove();
  }
}
