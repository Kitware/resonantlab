import { select } from 'd3-selection';

import html from './index.jade';
import './index.styl';

import { closeIcon,
         libraryIcon } from '~reslab/image/icon';

import { store,
         action } from '~reslab/redux';

class SelectVisDialog {
  initialize (selector) {
    this.el = select(selector);
    this.el.html(html({
      closeIcon
    }));

    this.el.select('.close-overlay')
      .on('click', () => store.dispatch(action.lastMode()));
  }

  render (visList) {
    const sel = this.el.select('.vis-list');

    sel.selectAll('*')
      .remove();

    const icon = sel.selectAll('.circle-button')
      .data(visList)
      .enter()
      .append('div')
      .classed('circle-button', true)
      .on('click', d => {
        console.log(d);
      });

    icon.append('img')
      .classed('project-glyph', true)
      .attr('src', libraryIcon);

    icon.append('span')
      .text(d => d.name);

    icon.append('span')
      .html(d => `<a target="_blank" href="https://candela.readthedocs.io/en/latest/components/${d.name.toLowerCase()}.html">docs</a>`);
  }
}

const selectVisDialog = new SelectVisDialog();

export {
  selectVisDialog
};
