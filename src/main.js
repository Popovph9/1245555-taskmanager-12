import {render, renderPosition} from "./util.js";
import SiteMenu from "./view/site-menu.js";
import SiteFilters from "./view/site-filter.js";
import Board from "./view/board-element.js";
import BoardFilters from "./view/board-filters.js";
import TaskList from "./view/task-list.js";
import CardEdit from "./view/edit-card.js";
import CardCreate from "./view/create-card.js";
import LoadButton from "./view/load-button.js";
import {generateTask} from "./view/task.js";
import {generateFilter} from "./view/filters.js";

const CARDS_COUNT = 22;
const CARDS_COUNT_PER_STEP = 8;

const tasks = new Array(CARDS_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const mainElement = document.querySelector(`.main`);
const siteHeader = mainElement.querySelector(`.main__control`);

render(siteHeader, new SiteMenu().getElement(), renderPosition.BEFOREEND);
render(mainElement, new SiteFilters(filters).getElement(), renderPosition.BEFOREEND);

const boardElement = new Board();

render(mainElement, boardElement.getElement(), renderPosition.BEFOREEND);
render(boardElement.getElement(), new BoardFilters().getElement(), renderPosition.AFTERBEGIN);

const cardsContainer = new TaskList();

render(boardElement.getElement(), cardsContainer.getElement(), renderPosition.BEFOREEND);

const renderCard = (taskListElement, task) => {
  const cardComponent = new CardCreate(task);
  const cardEditComponent = new CardEdit(task);

  const replaceCardToForm = () => {
    taskListElement.replaceChild(cardEditComponent.getElement(), cardComponent.getElement());
  };

  const replaceFormToCard = () => {
    taskListElement.replaceChild(cardComponent.getElement(), cardEditComponent.getElement());
  };

  cardComponent.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
    replaceCardToForm();
  });

  cardEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToCard();
  });

  render(taskListElement, cardComponent.getElement(), renderPosition.BEFOREEND);
};

for (let i = 0; i < Math.min(tasks.length, CARDS_COUNT_PER_STEP); i++) {
  renderCard(cardsContainer.getElement(), tasks[i]);
}

if (tasks.length > CARDS_COUNT_PER_STEP) {
  let renderedCardsCount = CARDS_COUNT_PER_STEP;

  const loadButtonComponent = new LoadButton();

  render(boardElement.getElement(), loadButtonComponent.getElement(), renderPosition.BEFOREEND);

  loadButtonComponent.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();

    tasks.
      slice(renderedCardsCount, renderedCardsCount + CARDS_COUNT_PER_STEP).
      forEach((task) => renderCard(cardsContainer.getElement(), task));
  });

  renderedCardsCount += CARDS_COUNT_PER_STEP;

  if (renderedCardsCount >= tasks.length) {
    loadButtonComponent.getElement().remove();
    loadButtonComponent.removeElement();
  }
}
