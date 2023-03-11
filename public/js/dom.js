"use strict";

const dom = {
  create({
    content = "",
    type = "div",
    parent = false,
    classes = [],
    attr = {},
    listeners = {},
    styles = {},
    toEnd = true,
  } = {}) {
    let newEl = document.createElement(type);
    if (content) newEl.innerHTML = content;
    if (classes.length) newEl.className = classes.join(" ");

    Object.entries(attr).forEach((el) => newEl.setAttribute(...el));
    Object.entries(listeners).forEach((el) => newEl.addEventListener(...el));
    Object.entries(styles).forEach((style) => (newEl.style[style[0]] = style[1]));

    if (parent) {
      !toEnd ? parent.prepend(newEl): parent.append(newEl);
    }

    return newEl;
  },
  $(selector) { return document.querySelector(selector); },
  $$(selector) { return [...document.querySelectorAll(selector)]; },
};

export default dom;
