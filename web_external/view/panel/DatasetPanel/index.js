import { select } from 'd3-selection';

import html from './index.jade';
import './index.styl';

import { noDataset } from '~reslab/image/message';
import { datasetIcon,
         swapIcon,
         gearIcon,
         infoIcon,
         throbberIcon,
         warningIcon } from '~reslab/image/icon';

import { action,
         store } from '~reslab/redux';

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

  setTitle (title) {
    this.el.select('h2.title')
      .text(title);
  }

  showThrobber (loading) {
    this.el.select('img.status')
      .classed('warning', !loading)
      .classed('show-color', loading)
      .attr('src', loading ? throbberIcon : warningIcon);
  }
}

const datasetPanel = new DatasetPanel();

export {
  datasetPanel
};
