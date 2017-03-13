import html from './index.jade';
import './index.styl';

import { matchingIcon,
         infoIcon,
         warningIcon } from '~reslab/image/icon';
import { matchingNoDataset,
         matchingNoVis } from '~reslab/image/message';

import { action,
         store } from '~reslab/redux';

import { Panel } from '..';

class MatchingPanel extends Panel {
  initialize (selector) {
    super.initialize(selector);

    this.el.html(html({
      matchingIcon,
      infoIcon,
      warningIcon,
      matchingNoDataset,
      matchingNoVis
    }));

    // Toggle "targeted" class on section element.
    this.el.select('.section-header').on('click', () => {
      this.el.classed('targeted', !this.el.classed('targeted'));
      store.dispatch(action.togglePanel('matching'));
    });
  }
}

const matchingPanel = new MatchingPanel();

export {
  matchingPanel
};
