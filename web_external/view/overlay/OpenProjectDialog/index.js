import { select } from 'd3-selection';

import html from './index.jade';
import './index.styl';

import closeIcon from '~reslab/image/close.svg';
import publicFileIcon from '~reslab/image/publicFile.svg';

import { store } from '~reslab/redux/store';
import { action } from '~reslab/redux/action';
import { appMode } from '~reslab/redux/reducer';
import { gatherProjectInfo } from '~reslab/util';

const initialize = (sel) => {
  sel.html(html({
    closeIcon
  }));

  sel.select('.close-overlay')
    .on('click', () => store.dispatch(action.lastMode()));
};

const render = (publicProj, privateProj, scratchProj, libraryProj) => {
  const main = select('.overlay.open-project-dialog');
  let sel = main.select('.public-projects')
    .select('.project-list')
    .style('display', publicProj ? null : 'none');

  sel.selectAll('*')
    .remove();

  let icon = sel.selectAll('.circle-button')
    .data(publicProj)
    .enter()
    .append('div')
    .on('click', d => {
      store.dispatch(action.switchMode(appMode.project));

      const project = gatherProjectInfo(d);
      store.dispatch(action.openProject(project.id, project.name));
    })
    .classed('circle-button', true);

  icon.append('img')
    .classed('project-glyph', true)
    .attr('src', publicFileIcon);

  icon.append('span')
    .text(d => d.name);
};

export {
  initialize,
  render
};
