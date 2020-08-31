import {render, renderPosition} from "./utils/render.js";
import SiteMenu from "./view/site-menu.js";
import SiteFilters from "./view/site-filter.js";
/* import Board from "./view/board-element.js";
import BoardFilters from "./view/board-filters.js";
import TaskList from "./view/task-list.js";
import CardEdit from "./view/edit-card.js";
import CardCreate from "./view/create-card.js";
import LoadButton from "./view/load-button.js";
import NoTasks from "./view/no-tasks"; */
import {generateTask} from "./view/task.js";
import {generateFilter} from "./view/filters.js";
import Presenter from "./presenter.js";

const CARDS_COUNT = 22;
// const CARDS_COUNT_PER_STEP = 8;

const tasks = new Array(CARDS_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const mainElement = document.querySelector(`.main`);
const siteHeader = mainElement.querySelector(`.main__control`);

render(siteHeader, new SiteMenu(), renderPosition.BEFOREEND);
render(mainElement, new SiteFilters(filters), renderPosition.BEFOREEND);

/* const boardElement = new Board();

render(mainElement, boardElement, renderPosition.BEFOREEND);

if (tasks.every((task) => task.isArchive)) {
  render(boardElement, new NoTasks(), renderPosition.BEFOREEND);
} else {
  render(boardElement, new BoardFilters(), renderPosition.AFTERBEGIN);
}

const cardsContainer = new TaskList();

render(boardElement.getElement(), cardsContainer.getElement(), renderPosition.BEFOREEND);

const renderCard = (taskListElement, task) => {
  const cardComponent = new CardCreate(task);
  const cardEditComponent = new CardEdit(task);

  const replaceCardToForm = () => {
    replace(cardEditComponent, cardComponent);
  };

  const replaceFormToCard = () => {
    replace(cardComponent, cardEditComponent);
  };

  const escKeydownHandler = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToCard();

      document.removeEventListener(`keydown`, escKeydownHandler);
    }
  };

  cardComponent.setEditButtonClickHandler(() => {
    replaceCardToForm();
    document.addEventListener(`keydown`, escKeydownHandler);
  });

  cardEditComponent.setCardEditKeyDownHandler(() => {
    replaceFormToCard();
    document.removeEventListener(`keydown`, escKeydownHandler);
  });

  render(taskListElement, cardComponent, renderPosition.BEFOREEND);
};

for (let i = 0; i < Math.min(tasks.length, CARDS_COUNT_PER_STEP); i++) {
  renderCard(cardsContainer.getElement(), tasks[i]);
}

if (tasks.length > CARDS_COUNT_PER_STEP) {
  let renderedCardsCount = CARDS_COUNT_PER_STEP;

  const loadButtonComponent = new LoadButton();

  render(boardElement.getElement(), loadButtonComponent.getElement(), renderPosition.BEFOREEND);

  loadButtonComponent.setClickHandler(() => {
    tasks.
      slice(renderedCardsCount, renderedCardsCount + CARDS_COUNT_PER_STEP).
      forEach((task) => renderCard(cardsContainer.getElement(), task));
  });
  renderedCardsCount += CARDS_COUNT_PER_STEP;

  if (renderedCardsCount >= tasks.length) {
    remove(loadButtonComponent);
  }
} */

const boardPresenter = new Presenter(mainElement);

boardPresenter.init(tasks);
