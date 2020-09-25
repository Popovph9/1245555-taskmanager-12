import CardEdit from "../view/edit-card.js";
import {render, renderPosition, remove} from "../utils/render.js";
import {UpdateType, UserAction} from "../const.js";

export default class NewTaskPresenter {
  constructor(taskListContainer, changeData) {

    this._taskListContainer = taskListContainer;
    this._changeData = changeData;

    this._cardEditComponent = null;
    this._destroyCallback = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback) {
    if (this._cardEditComponent !== null) {
      return;
    }

    this._destroyCallback = callback;

    this._cardEditComponent = new CardEdit();
    this._cardEditComponent.setCardEditFormSubmitHandler(this._handleFormSubmit);
    this._cardEditComponent.setDeleteButtonClickHandler(this._handleDeleteClick);

    render(this._taskListContainer, this._cardEditComponent, renderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  setSaving() {
    this._cardEditComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._cardEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this._cardEditComponent.shake(resetFormState);
  }


  destroy() {
    if (this._cardEditComponent === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._cardEditComponent);
    this._cardEditComponent = null;
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFormSubmit(task) {
    this._changeData(
        UserAction.ADD_TASK,
        UpdateType.MINOR,
        task
    );
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
