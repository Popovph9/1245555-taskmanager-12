import {render, renderPosition, remove} from "./utils/render.js";
import {updateItem} from "./utils/common.js";
import Board from "./view/board-element.js";
import BoardFilters from "./view/board-filters.js";
import TaskList from "./view/task-list.js";
import TaskPresenter from "./presenter/taskPresenter.js";
import LoadButton from "./view/load-button.js";
import NoTasks from "./view/no-tasks";
import {sortTaskDown, sortTaskUp} from "./utils/task.js";
import {SortType} from "./const.js";

const CARDS_COUNT_PER_STEP = 8;

export default class BoardPresenter {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;

    this._renderedCardsCount = CARDS_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._boardComponent = new Board();
    this._filtersComponent = new BoardFilters();
    this._taskListComponent = new TaskList();
    this._noTaskComponent = new NoTasks();
    this._loadButtonComponent = new LoadButton();
    this._taskPresenter = {};

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleTaskChange = this._handleTaskChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(boardTasks) {
    this._boardTasks = boardTasks.slice();
    this._sourcedBoardTasks = boardTasks.slice();

    render(this._boardContainer, this._boardComponent, renderPosition.BEFOREEND);
    render(this._boardComponent, this._taskListComponent, renderPosition.BEFOREEND);

    this._renderBoard();
  }

  _handleModeChange() {
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleTaskChange(updatedTask) {
    this._boardTasks = updateItem(this._boardTasks, updatedTask);
    this._sourcedBoardTasks = updateItem(this._boardTasks, updatedTask);
    this._taskPresenter[updatedTask.id].init(updatedTask);
  }

  _sortTasks(sortType) {
    switch (sortType) {
      case SortType.DATE_UP:
        this._boardTasks.sort(sortTaskUp);
        break;
      case SortType.DATE_DOWN:
        this._boardTasks.sort(sortTaskDown);
        break;
      default:
        this._boardTasks = this._sourcedBoardTasks.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortTasks(sortType);
    this._clearTaskList();
    this._renderTaskList();
  }

  _renderSort() {
    render(this._boardComponent, this._filtersComponent, renderPosition.AFTERBEGIN);
    this._filtersComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderTask(task) {
    const taskPresenter = new TaskPresenter(this._taskListComponent, this._handleTaskChange, this._handleModeChange);
    taskPresenter.init(task);
    this._taskPresenter[task.id] = taskPresenter;
  }

  _renderTasks(from, to) {
    this._boardTasks
      .slice(from, to)
      .forEach((boardTask) => this._renderTask(boardTask));
  }

  _renderNoTasks() {
    render(this._boardComponent, this._noTaskComponent, renderPosition.AFTERBEGIN);
  }

  _handleLoadMoreButtonClick() {
    this._renderTasks(this._renderedCardsCount, this._renderedCardsCount + CARDS_COUNT_PER_STEP);
    this._renderedCardsCount += CARDS_COUNT_PER_STEP;

    if (this._renderedCardsCount >= this._boardTasks.length) {
      remove(this._loadButtonComponent);
    }
  }

  _renderloadMoreButtton() {
    render(this._boardComponent, this._loadButtonComponent, renderPosition.BEFOREEND);

    this._loadButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _renderTaskList() {
    this._renderTasks(0, Math.min(this._boardTasks.length, CARDS_COUNT_PER_STEP));

    if (this._boardTasks.length > CARDS_COUNT_PER_STEP) {
      this._renderloadMoreButtton();
    }
  }

  _clearTaskList() {
    Object.values(this._taskPresenter).forEach((presenter) => presenter.destroy());
    this._taskPresenter = {};
    this._renderedCardsCount = CARDS_COUNT_PER_STEP;
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
