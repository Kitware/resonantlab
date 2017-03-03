import { select } from 'd3-selection';

import html from './index.jade';
import './index.styl';

import { noDataset } from '~reslab/image/message';
import { datasetIcon,
         swapIcon,
         gearIcon,
         infoIcon,
         warningIcon } from '~reslab/image/icon';

import { action } from '~reslab/redux/action';
import { store } from '~reslab/redux/store';

class DatasetPanel {
  initialize (selector) {
    this.el = select(selector);
    this.el.html(html({
      noDataset,
      datasetIcon,
      swapIcon,
      gearIcon,
      infoIcon,
      warningIcon
    }));

    // Toggle "targeted" class on section element.
    this.el.select('.section-header').on('click', () => {
      this.el.classed('targeted', !this.el.classed('targeted'));
      store.dispatch(action.togglePanel('dataset'));
    });
  }
}

const datasetPanel = new DatasetPanel();

export {
  datasetPanel
};
