import { select } from 'd3-selection';
import Papa from 'papaparse';

import { restRequest } from 'girder/rest';

import html from './index.jade';

import { closeIcon,
         libraryIcon } from '~reslab/image/icon';
import { store,
         action,
         appMode } from '~reslab/redux';
import { setItemMetadata } from '~reslab/util';

class SelectDatasetDialog {
  initialize (selector) {
    this.el = select(selector);
    this.el.html(html({
      closeIcon
    }));

    this.el.select('.close-overlay')
      .on('click', () => store.dispatch(action.lastMode()));
  }

  render (datasetList) {
    const sel = this.el.select('.dataset-list');

    sel.selectAll('*')
      .remove();

    const icon = sel.selectAll('.circle-button')
      .data(datasetList)
      .enter()
      .append('div')
      .classed('circle-button', true)
      .on('click', d => {
        // Set the dataset metadata on the appropriate project.
        const state = store.getState();
        const projectId = state.getIn(['project', 'id']);
        const metadataProm = setItemMetadata(projectId, {
          dataset: d.id
        }).then(() => {
          store.dispatch(action.setPanelTitle('dataset', d.name));
        });

        // Download the data.
        store.dispatch(action.datasetLoading(true));
        const dataProm = restRequest({
          type: 'GET',
          path: `/item/${d.id}/download`,
          dataType: 'text'
        }).then(data => {
          const results = Papa.parse(data, {
            dynamicTyping: true,
            skipEmptyLines: true
          });

          store.dispatch(action.datasetLoading(false));
          store.dispatch(action.setData(results.data));
        });

        Promise.all([dataProm, metadataProm])
          .then(() => store.dispatch(action.switchMode(appMode.project)));
      });

    icon.append('img')
      .classed('project-glyph', true)
      .attr('src', libraryIcon);

    icon.append('span')
      .text(d => d.name);
  }
}

const selectDatasetDialog = new SelectDatasetDialog();

export {
  selectDatasetDialog
};
