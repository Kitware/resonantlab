import { select } from 'd3-selection';

class Panel {
  initialize (selector) {
    this.el = select(selector);
  }

  setTitle (title) {
    this.el.select('h2.title')
      .text(title);
  }
};

export {
  Panel
};
