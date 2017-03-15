import { event } from 'd3-selection';

import html from './index.jade';
import './index.styl';

import { scatterplotIcon,
         shareIcon,
         swapIcon,
         infoIcon,
         warningIcon } from '~reslab/image/icon';
import { noVis } from '~reslab/image/message';

import { action,
         store,
         appMode } from '~reslab/redux';

import { Panel } from '..';

class VisPanel extends Panel {
  initialize (selector) {
    super.initialize(selector);

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

    // Change out visualization.
    this.el.select('img.swap').on('click', () => {
      store.dispatch(action.switchMode(appMode.selectVis));
      event.stopPropagation();
    });
  }

  instantiate (VisComponent, data, matchings) {
    const visEl = this.el.select('.visualization')
      .append('div')
      .node();

    const headers = data[0];
    const shaped = data.slice(1).map(d => {
      let rec = {};
      headers.forEach((h, i) => {
        rec[h] = d[i];
      });

      return rec;
    });

    const options = Object.assign({}, matchings, {
      data: shaped
    });
    this.vis = new VisComponent(visEl, options);

    this.vis.render();
  }

  remove () {
    this.el.select('.visualization')
      .select('div')
      .remove();
  }
}

const visPanel = new VisPanel();

export {
  visPanel
};
