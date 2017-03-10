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
