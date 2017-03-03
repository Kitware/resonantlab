import { select } from 'd3-selection';

import html from './index.jade';
import './index.styl';

import { scatterplotIcon,
         shareIcon,
         swapIcon,
         infoIcon,
         warningIcon } from '~reslab/image/icon';
import { noVis } from '~reslab/image/message';

import { action } from '~reslab/redux/action';
import { store } from '~reslab/redux/store';

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
}

const visPanel = new VisPanel();

export {
  visPanel
};
