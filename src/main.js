import {render, renderPosition} from "./utils/render.js";
import SiteMenu from "./view/site-menu.js";
import TaskModel from "./model/taskModel.js";
import FilterModel from "./model/filterModel.js";
import {generateTask} from "./view/task.js";
import FiltersPresenter from "./presenter/filterPresenter.js";
import BoardPresenter from "./boardPresenter.js";

const CARDS_COUNT = 22;

const tasks = new Array(CARDS_COUNT).fill().map(generateTask);

const taskModel = new TaskModel();
taskModel.setTasks(tasks);

const filterModel = new FilterModel();

const mainElement = document.querySelector(`.main`);
const siteHeader = mainElement.querySelector(`.main__control`);

const boardPresenter = new BoardPresenter(mainElement, taskModel, filterModel);
const filterPresenter = new FiltersPresenter(mainElement, filterModel, taskModel);

render(siteHeader, new SiteMenu(), renderPosition.BEFOREEND);
filterPresenter.init();
boardPresenter.init();

document.querySelector(`#control__new-task`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  boardPresenter.createCard();
});
