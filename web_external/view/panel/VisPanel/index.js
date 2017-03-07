import { select } from 'd3-selection';

import html from './index.jade';
import './index.styl';

import { scatterplotIcon,
         shareIcon,
         swapIcon,
         infoIcon,
         warningIcon } from '~reslab/image/icon';
import { noVis } from '~reslab/image/message';

import { action,
         store } from '~reslab/redux';

class VisPanel {
  initialize (selector) {
    this.el = select(selector);
    this.el.html(html({
      noVis,
      scatterplotIcon,
      shareIcon,
      swapIcon,
      infoIcon,
      warningIcon
    }));

    // Toggle "targeted" class on section element.
    this.el.select('.section-header').on('click', () => {
      this.el.classed('targeted', !this.el.classed('targeted'));
      store.dispatch(action.togglePanel('vis'));
    });
  }

  setTitle (title) {
    this.el.select('h2.title')
      .text(title);
  }
}

const visPanel = new VisPanel();

export {
  visPanel
};
