import AbstractClass from "./abstract.js";
import {MenuItem} from "../const.js";

const createSiteMenuTemplate = () => {
  return (
    `<section class="control__btn-wrap">
      <input
        type="radio"
        name="control"
        id="control__new-task"
        value="${MenuItem.ADD_NEW_TASK}"
        class="control__input visually-hidden"
      />

      <label for="control__new-task" class="control__label control__label--new-task">
        + ADD NEW TASK
      </label>

      <input
        type="radio"
        name="control"
        id="control__task"
        value="${MenuItem.TASKS}"
        class="control__input visually-hidden"
        checked
      />

      <label for="control__task" class="control__label">
        TASKS
      </label>

      <input
        type="radio"
        name="control"
        id="control__statistic"
        value="${MenuItem.STATISTICS}"
        class="control__input visually-hidden"
      />

      <label for="control__statistic" class="control__label">
        STATISTICS
      </label>
    </section>`
  );
};

export default class SiteMenu extends AbstractClass {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.value);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`change`, this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[value=${menuItem}]`);

    if (item !== null) {
      item.checked = true;
    }
  }
}
