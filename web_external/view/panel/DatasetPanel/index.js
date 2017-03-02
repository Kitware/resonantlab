import { select } from 'd3-selection';

import html from './index.jade';
import './index.styl';

import noDataset from '~reslab/image/noDataset.svg';
import datasetIcon from '~reslab/image/dataset.svg';
import swapIcon from '~reslab/image/swap.svg';
import gearIcon from '~reslab/image/gear.svg';
import infoIcon from '~reslab/image/info.svg';
import warningIcon from '~reslab/image/warning.svg';

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
