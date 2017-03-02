import { select } from 'd3-selection';

import html from './index.jade';
import '../accordion.styl';
import '../index.styl';
import './index.styl';

import noDataset from '~reslab/image/noDataset.svg';
import datasetIcon from '~reslab/image/dataset.svg';
import swapIcon from '~reslab/image/swap.svg';
import gearIcon from '~reslab/image/gear.svg';
import infoIcon from '~reslab/image/info.svg';
import warningIcon from '~reslab/image/warning.svg';

class DatasetPanel {
  initialize (selector) {
    this.sel = select(selector);
    this.sel.html(html({
      noDataset,
      datasetIcon,
      swapIcon,
      gearIcon,
      infoIcon,
      warningIcon
    }));
  }

  render () {
    console.log(this.sel);
  }
}

const datasetPanel = new DatasetPanel();

export {
  datasetPanel
};
