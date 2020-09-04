import AbstractClass from "./abstract.js";

const getLoadButtonTemplate = () => {
  return (
    `<button class="load-more" type="button">
      load more
    </button>`
  );
};

export default class LoadButton extends AbstractClass {
  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return getLoadButtonTemplate();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener(`click`, this._clickHandler);
  }
}
