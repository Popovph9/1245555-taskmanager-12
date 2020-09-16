import {render, renderPosition, replace, remove} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";
import {isDatesEqual, isTaskRepeating} from "../utils/task.js";
import CardEdit from "../view/edit-card.js";
import CardCreate from "../view/create-card.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class TaskPresenter {
  constructor(taskListContainer, changeData, changeMode) {
    this._taskListContainer = taskListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._cardComponent = null;
    this._cardEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._escKeydownHandler = this._escKeydownHandler.bind(this);
    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleArchiveClick = this._handleArchiveClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(task) {
    this._task = task;

    const prevCardComponent = this._cardComponent;
    const prevCardEditComponent = this._cardEditComponent;

    this._cardComponent = new CardCreate(task);
    this._cardEditComponent = new CardEdit(task);

    this._cardComponent.setEditButtonClickHandler(this._handleEditClick);
    this._cardComponent.setFavoriteButtonClickHandler(this._handleFavoriteClick);
    this._cardComponent.setArchiveButtonClickHandler(this._handleArchiveClick);
    this._cardEditComponent.setCardEditFormSubmitHandler(this._handleFormSubmit);
    this._cardEditComponent.setDeleteButtonClickHandler(this._handleDeleteClick);

    if (prevCardComponent === null || prevCardEditComponent === null) {
      render(this._taskListContainer, this._cardComponent, renderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._cardComponent, prevCardComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._cardEditComponent, prevCardEditComponent);
    }

    remove(prevCardComponent);
    remove(prevCardEditComponent);
  }

  destroy() {
    remove(this._cardComponent);
    remove(this._cardEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  _replaceCardToForm() {
    replace(this._cardEditComponent, this._cardComponent);
    document.addEventListener(`keydown`, this._escKeydownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToCard() {
    replace(this._cardComponent, this._cardEditComponent);
    document.removeEventListener(`keydown`, this._escKeydownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeydownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._cardEditComponent.reset(this._task);
      this._replaceFormToCard();
    }
  }

  _handleEditClick() {
    this._replaceCardToForm();
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_TASK,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._task,
            {
              isFavorite: !this._task.isFavorite
            }
        )
    );
  }

  _handleArchiveClick() {
    this._changeData(
        UserAction.UPDATE_TASK,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._task,
            {
              isArchive: !this._task.isArchive
            }
        )
    );
  }

  _handleFormSubmit(update) {
    const isMinorUpdate =
    !isDatesEqual(this._task.dueDate, update.dueDate) ||
    isTaskRepeating(this._task.repeating) !== isTaskRepeating(update.repeating);

    this._changeData(
        UserAction.UPDATE_TASK,
        isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
        update
    );

    this._replaceFormToCard();
  }

  _handleDeleteClick(task) {
    this._changeData(
        UserAction.DELETE_TASK,
        UpdateType.MINOR,
        task
    );
  }
}
