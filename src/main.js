import {render, renderPosition, remove} from "./utils/render.js";
import SiteMenu from "./view/site-menu.js";
import TaskModel from "./model/taskModel.js";
import FilterModel from "./model/filterModel.js";
import FiltersPresenter from "./presenter/filterPresenter.js";
import BoardPresenter from "./boardPresenter.js";
import {MenuItem, FilterType, UpdateType} from "./const.js";
import Statistics from "./view/statistics.js";
import Api from "./api.js";

const AUTHORIZATION = `Basic hS2sd3dfSwcl1sa2j`;
const END_POINT = `https://12.ecmascript.pages.academy/task-manager`;

const mainElement = document.querySelector(`.main`);
const siteHeader = mainElement.querySelector(`.main__control`);

const api = new Api(END_POINT, AUTHORIZATION);

const taskModel = new TaskModel();

const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter(mainElement, taskModel, filterModel, api);
const filterPresenter = new FiltersPresenter(mainElement, filterModel, taskModel);
const siteMenuComponent = new SiteMenu();

const handleTaskNewFormClose = () => {
  siteMenuComponent.getElement().querySelector(`[value=${MenuItem.TASKS}]`).disabled = false;
  siteMenuComponent.setMenuItem(MenuItem.TASKS);
};

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_TASK:
      remove(statisticsComponent);
      boardPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
      boardPresenter.init();
      boardPresenter.createCard(handleTaskNewFormClose);
      const tasksItem = siteMenuComponent.getElement().querySelector(`[value=${MenuItem.TASKS}]`);
      if (tasksItem) {
        tasksItem.disabled = true;
      }
      break;
    case MenuItem.TASKS:
      boardPresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      boardPresenter.destroy();
      statisticsComponent = new Statistics(taskModel.getTasks());
      render(mainElement, statisticsComponent, renderPosition.BEFOREEND);
      break;
  }
};

filterPresenter.init();
boardPresenter.init();

api.getTasks().then((tasks) => {
  taskModel.setTasks(UpdateType.INIT, tasks);
  render(siteHeader, siteMenuComponent, renderPosition.BEFOREEND);
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
})
  .catch(() => {
    taskModel.setTasks(UpdateType.INIT, []);
    render(siteHeader, siteMenuComponent, renderPosition.BEFOREEND);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  });
