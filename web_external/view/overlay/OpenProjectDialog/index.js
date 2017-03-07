import { select } from 'd3-selection';
import Papa from 'papaparse';

import { restRequest } from 'girder/rest';

import html from './index.jade';
import './index.styl';

import { closeIcon,
         publicFileIcon,
         privateFileIcon } from '~reslab/image/icon';

import { store,
         action,
         appMode } from '~reslab/redux';
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

        if (project.dataset) {
          store.dispatch(action.datasetLoading(true));

          restRequest({
            type: 'GET',
            path: `/item/${project.dataset}/download`,
            dataType: 'text'
          }).then(data => {
            const results = Papa.parse(data, {
              header: true,
              dynamicTyping: true
            });

            store.dispatch(action.datasetLoading(false));
            store.dispatch(action.setData(results.data));
          });
        }
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
