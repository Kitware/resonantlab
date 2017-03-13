import { select } from 'd3-selection';

import html from './index.jade';

import { closeIcon,
         libraryIcon } from '~reslab/image/icon';
import { store,
         action,
         appMode } from '~reslab/redux';
import { setItemMetadata } from '~reslab/util';

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
        // Set the vis metadata on the appropriate project.
        const state = store.getState();
        const projectId = state.getIn(['project', 'id']);
        setItemMetadata(projectId, {
          vis: d.name
        }).then(() => {
          store.dispatch(action.setVis(d.name));
          store.dispatch(action.setPanelTitle('vis', d.name));
          store.dispatch(action.switchMode(appMode.project));
        });
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
