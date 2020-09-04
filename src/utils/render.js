import AbstractClass from "../view/abstract.js";

export const renderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const renderTemplate = (container, template, place) => {
  if (container instanceof AbstractClass) {
    container = container.getElement();
  }

  container.insertAdjacentHTML(place, template);
};

export const render = (container, child, place) => {
  if (container instanceof AbstractClass) {
    container = container.getElement();
  }

  if (child instanceof AbstractClass) {
    child = child.getElement();
  }

  switch (place) {
    case renderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case renderPosition.BEFOREEND:
      container.append(child);
      break;
  }
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof AbstractClass) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof AbstractClass) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error(`Can't replace unexisting elements`);
  }

  parent.replaceChild(newChild, oldChild);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};


export const remove = (component) => {
  if (component instanceof AbstractClass) {
    component = component.getElement();
  }

  component.getElement().remove();
  component.removeElement();
};
