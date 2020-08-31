import {render, renderPosition, remove, replace} from "./utils/render.js";
import Board from "./view/board-element.js";
import BoardFilters from "./view/board-filters.js";
import TaskList from "./view/task-list.js";
import CardEdit from "./view/edit-card.js";
import CardCreate from "./view/create-card.js";
import LoadButton from "./view/load-button.js";
import NoTasks from "./view/no-tasks";

const CARDS_COUNT_PER_STEP = 8;

export default class Presenter {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;

    this._renderedCardsCount = CARDS_COUNT_PER_STEP;

    this._boardComponent = new Board();
    this._filtersComponent = new BoardFilters();
    this._taskListComponent = new TaskList();
    this._noTaskComponent = new NoTasks();
    this._loadButtonComponent = new LoadButton();
    this.__handleLoadMoreButtonClick = this.__handleLoadMoreButtonClick.bind(this);
  }

  init(boardTasks) {
    this._boardTasks = boardTasks.slice();

    render(this._boardContainer, this._boardComponent, renderPosition.BEFOREEND);
    render(this._boardComponent, this._taskListComponent, renderPosition.BEFOREEND);

    this._renderBoard();
  }

  _renderSort() {
    render(this._boardComponent, this._filtersComponent, renderPosition.AFTERBEGIN);
  }

  _renderTask(task) {
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

    render(this._taskListComponent, cardComponent, renderPosition.BEFOREEND);
  }

  _renderTasks(from, to) {
    this._boardTasks.slice(from, to).forEach((boardTask) => {
      this._renderTask(boardTask);
    });
  }

  _renderNoTasks() {
    render(this._boardComponent, this._noTaskComponent, renderPosition.AFTERBEGIN);
  }

  __handleLoadMoreButtonClick() {
    this._renderTasks(this._renderedCardsCount, this._renderedCardsCount + CARDS_COUNT_PER_STEP);
    this._renderedCardsCount += CARDS_COUNT_PER_STEP;

    if (this._renderedCardsCount >= this._boardTasks.length) {
      remove(this._loadButtonComponent);
    }
  }

  _renderloadMoreButtton() {
    render(this._boardComponent, this._loadButtonComponent, renderPosition.BEFOREEND);

    this._loadButtonComponent.setClickHandler(this.__handleLoadMoreButtonClick);
  }

  _renderTaskList() {
    this._renderTasks(0, Math.min(this._boardTasks.length, CARDS_COUNT_PER_STEP));

    if (this._boardTasks.length > CARDS_COUNT_PER_STEP) {
      this._renderloadMoreButtton();
    }
  }

  _renderBoard() {
    if (this._boardTasks.every((task) => task.isArchive)) {
      this._renderNoTasks();
      return;
    }

    this._renderSort();
    this._renderTaskList();
  }
}
