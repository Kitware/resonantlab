import { select } from 'd3-selection';

import html from './index.jade';
import './index.styl';

import matchingIcon from '~reslab/image/matching.svg';
import infoIcon from '~reslab/image/info.svg';
import warningIcon from '~reslab/image/warning.svg';
import matchingNoDataset from '~reslab/image/matchingNoDataset.svg';
import matchingNoVis from '~reslab/image/matchingNoVis.svg';

import { action } from '~reslab/redux/action';
import { store } from '~reslab/redux/store';

class MatchingPanel {
  initialize (selector) {
    this.el = select(selector);
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
