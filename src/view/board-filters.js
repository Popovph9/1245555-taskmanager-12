import AbstractClass from "./abstract.js";

const getBordFiltersTemplate = () => {
  return (
    `<div class="board__filter-list">
      <a href="#" class="board__filter">SORT BY DEFAULT</a>

      <a href="#" class="board__filter">SORT BY DATE up</a>

      <a href="#" class="board__filter">SORT BY DATE down</a>
    </div>`
  );
};

export default class BoardFilters extends AbstractClass {
  getTemplate() {
    return getBordFiltersTemplate();
  }
}
