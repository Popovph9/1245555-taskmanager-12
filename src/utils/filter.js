import {FilterType} from "../const.js";
import {isExpired, isTaskRepeating, isTaskExpireToday} from "../utils/task.js";

export const filter = {
  [FilterType.ALL]: (tasks) => tasks.filter((task) => !task.isArchive),
  [FilterType.OVERDUE]: (tasks) => tasks.filter((task) => isExpired(task.dueDate)),
  [FilterType.TODAY]: (tasks) => tasks.filter((task) => isTaskExpireToday(task.dueDate)),
  [FilterType.FAVORITES]: (tasks) => tasks.filter((task) => task.isFavorite),
  [FilterType.REPEATING]: (tasks) => tasks.filter((task) => isTaskRepeating(task.repeating)),
  [FilterType.ARCHIVE]: (tasks) => tasks.filter((task) => task.isArchive)
};
