import {render, renderPosition} from "./utils/render.js";
import SiteMenu from "./view/site-menu.js";
import SiteFilters from "./view/site-filter.js";

import {generateTask} from "./view/task.js";
import {generateFilter} from "./view/filters.js";
import BoardPresenter from "./boardPresenter.js";

const CARDS_COUNT = 22;

const tasks = new Array(CARDS_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const mainElement = document.querySelector(`.main`);
const siteHeader = mainElement.querySelector(`.main__control`);

render(siteHeader, new SiteMenu(), renderPosition.BEFOREEND);
render(mainElement, new SiteFilters(filters), renderPosition.BEFOREEND);

const boardPresenter = new BoardPresenter(mainElement);
boardPresenter.init(tasks);
