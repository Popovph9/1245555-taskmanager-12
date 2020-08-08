const createFilterItemTemplate = (filter, isChecked) => {
  const {name, count} = filter;

  return (
    `<input
      type="radio"
      id="filter__${name}"
      class="filter__input visually-hidden"
      name="filter"
      ${isChecked ? `checked` : `disabled`}
    />
    <label for="filter__${name}" class="filter__label">
    ${name} <span class="filter__${name}-count">${count}</span></label
    >`
  );
};

export const createSiteFilterTemplate = (filterItems) => {
  const filterItemTemplate = filterItems.map((filter, index) => createFilterItemTemplate(filter, index)).join(``);

  return (`<section class="main__filter filter container">
  ${filterItemTemplate}
</section>`);
};
