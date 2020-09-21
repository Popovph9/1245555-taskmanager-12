import {render, renderPosition, remove} from "./utils/render.js";
import {filter} from "./utils/filter.js";
import {sortTaskDown, sortTaskUp} from "./utils/task.js";
import {SortType, UpdateType, UserAction, FilterType} from "./const.js";
import Board from "./view/board-element.js";
import BoardFilters from "./view/board-filters.js";
import TaskList from "./view/task-list.js";
import TaskPresenter from "./presenter/taskPresenter.js";
import NewTaskPresenter from "./presenter/newTaskPresenter.js";
import LoadButton from "./view/load-button.js";
import NoTasks from "./view/no-tasks";
import Loading from "./view/loading.js";


const CARDS_COUNT_PER_STEP = 8;

export default class BoardPresenter {
  constructor(boardContainer, tasksModel, filterModel, api) {
    this._boardContainer = boardContainer;
    this._filterModel = filterModel;
    this._tasksModel = tasksModel;
    this._api = api;

    this._sortComponent = null;
    this._loadButtonComponent = null;

    this._renderedCardsCount = CARDS_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;

    this._boardComponent = new Board();
    this._taskListComponent = new TaskList();
    this._noTaskComponent = new NoTasks();
    this._loadingComponent = new Loading();
    this._taskPresenter = {};

    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._newCardPresenter = new NewTaskPresenter(this._taskListComponent, this._handleViewAction);
  }

  init() {
    render(this._boardContainer, this._boardComponent, renderPosition.BEFOREEND);
    render(this._boardComponent, this._taskListComponent, renderPosition.BEFOREEND);

    this._tasksModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderBoard();
  }

  destroy() {
    this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});

    remove(this._taskListComponent);
    remove(this._boardComponent);

    this._tasksModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createCard(callback) {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
    this._newCardPresenter.init(callback);
  }

  _getTasks() {
    const filterType = this._filterModel.getFilter();
    const tasks = this._tasksModel.getTasks();
    const filtredTasks = filter[filterType](tasks);

    switch (this._currentSortType) {
      case SortType.DATE_UP:
        return filtredTasks.sort(sortTaskUp);
      case SortType.DATE_DOWN:
        return filtredTasks.sort(sortTaskDown);
    }

    return filtredTasks;
  }

  _handleModeChange() {
    this._newCardPresenter.destroy();

    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this._api.updateTask(update).then((response) => {
          this._tasksModel.updateTask(updateType, response);
        });
        break;
      case UserAction.ADD_TASK:
        this._tasksModel.addTask(updateType, update);
        break;
      case UserAction.DELETE_TASK:
        this._tasksModel.deleteTask(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._taskPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderBoard();
        break;
    }
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

    this._currentSortType = sortType;
    this._clearBoard({resetRenderedTaskCount: true});
    this._renderBoard();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }
    this._sortComponent = new BoardFilters(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._boardComponent, this._sortComponent, renderPosition.AFTERBEGIN);
  }

  _renderTask(task) {
    const taskPresenter = new TaskPresenter(this._taskListComponent, this._handleViewAction, this._handleModeChange);
    taskPresenter.init(task);
    this._taskPresenter[task.id] = taskPresenter;
  }

  _renderTasks(tasks) {
    tasks.forEach((task) => this._renderTask(task));
  }

  _renderNoTasks() {
    render(this._boardComponent, this._noTaskComponent, renderPosition.AFTERBEGIN);
  }

  _handleLoadMoreButtonClick() {
    const taskCount = this._getTasks().length;
    const newRenderedCardsCount = Math.min(taskCount, this._renderedCardsCount + CARDS_COUNT_PER_STEP);
    const tasks = this._getTasks().slice(this._renderedCardsCount, newRenderedCardsCount);

    this._renderTasks(tasks);
    this._renderedCardsCount = newRenderedCardsCount;

    if (this._renderedCardsCount >= taskCount) {
      remove(this._loadButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    if (this._loadButtonComponent !== null) {
      this._loadButtonComponent = null;
    }
    this._loadButtonComponent = new LoadButton();

    this._loadButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
    render(this._boardComponent, this._loadButtonComponent, renderPosition.BEFOREEND);
  }

  _clearBoard({resetRenderedTaskCount = false, resetSortType = false} = {}) {
    const taskCount = this._getTasks().length;

    this._newCardPresenter.destroy();

    Object.values(this._taskPresenter).forEach((presenter) => presenter.destroy());
    this._taskPresenter = {};

    remove(this._sortComponent);
    remove(this._noTaskComponent);
    remove(this._loadButtonComponent);

    if (resetRenderedTaskCount) {
      this._renderedTaskCount = CARDS_COUNT_PER_STEP;
    } else {
      this._renderedTaskCount = Math.min(taskCount, this._renderedTaskCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const tasks = this._getTasks();
    const taskCount = tasks.length;

    if (taskCount === 0) {
      this._renderNoTasks();
      return;
    }

    this._renderSort();

    this._renderTasks(tasks.slice(0, Math.min(taskCount, this._renderedCardsCount)));

    if (taskCount > this._renderedCardsCount) {
      this._renderLoadMoreButton();
    }
  }

  _renderLoading() {
    render(this._boardComponent, this._loadingComponent, renderPosition.AFTERBEGIN);
  }
}
