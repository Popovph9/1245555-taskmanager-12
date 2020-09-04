import AbstractClass from "./abstract.js";


const createTaskListTemplate = () => {
  return (
    `<div class="board__tasks">

    </div>`
  );
};

export default class TaskList extends AbstractClass {
  getTemplate() {
    return createTaskListTemplate();
  }
}
