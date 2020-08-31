import AbstractClass from "./abstract.js";

const createBoardTemplate = () => {
  return (
    `<section class="board container">

    </section>`
  );
};

export default class Board extends AbstractClass {
  getTemplate() {
    return createBoardTemplate();
  }
}
