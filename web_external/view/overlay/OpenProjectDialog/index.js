import { select } from 'd3-selection';

import html from './index.jade';
import './index.styl';

import closeIcon from '~reslab/image/close.svg';
import publicFileIcon from '~reslab/image/publicFile.svg';
import privateFileIcon from '~reslab/image/privateFile.svg';

import { store } from '~reslab/redux/store';
import { action } from '~reslab/redux/action';
import { appMode } from '~reslab/redux/reducer';
import { gatherProjectInfo } from '~reslab/util';

class OpenProjectDialog {
  initialize (selector) {
    this.el = select(selector);
    this.el.html(html({
      closeIcon
    }));

    this.el.select('.close-overlay')
      .on('click', () => store.dispatch(action.lastMode()));
  }

  render (publicProj, privateProj) {
    this.showProjects('.public-projects', publicProj, publicFileIcon);
    this.showProjects('.private-projects', privateProj, privateFileIcon);
  }

  showProjects (selector, projects, fileIcon) {
    const sel = this.el.select(selector)
      .style('display', projects.length > 0 ? null : 'none')
      .select('.project-list');

    sel.selectAll('*')
      .remove();

    const icon = sel.selectAll('.circle-button')
      .data(projects)
      .enter()
      .append('div')
      .on('click', d => {
        store.dispatch(action.switchMode(appMode.project));

        const project = gatherProjectInfo(d);
        store.dispatch(action.openProject(project.id, project.name, project.visibility));
      })
      .classed('circle-button', true);

    icon.append('img')
      .classed('project-glyph', true)
      .attr('src', fileIcon);

    icon.append('span')
      .text(d => d.name);
  }
}

const openProjectDialog = new OpenProjectDialog();

export {
  openProjectDialog
};
