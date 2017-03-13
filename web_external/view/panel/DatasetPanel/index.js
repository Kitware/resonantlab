import $ from 'jquery';
import 'datatables-all';

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

import { Panel } from '..';

class DatasetPanel extends Panel {
  initialize (selector) {
    super.initialize(selector);

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

  showThrobber (loading) {
    this.el.select('img.status')
      .classed('warning', !loading)
      .classed('show-color', loading)
      .attr('src', loading ? throbberIcon : warningIcon);
  }

  removeData () {
    const table = this.el.select('table.data-table');
    table.select('thead tr')
      .selectAll('th')
      .remove();

    table.select('tbody')
      .selectAll('tr')
      .remove();
  }

  updateData (header, data) {
    const table = this.el.select('table.data-table');

    // Update the header row.
    const headerRow = table.select('thead tr')
      .selectAll('th')
      .data(header)
      .enter()
      .append('th');
    headerRow.exit()
      .remove();
    headerRow.text(d => d);

    // Update the data rows.
    const dataRows = table.select('tbody')
      .selectAll('tr')
      .data(data)
      .enter()
      .append('tr');
    dataRows.exit()
      .remove();

    const dataCells = dataRows.selectAll('td')
      .data(d => d)
      .enter()
      .append('td');
    dataCells.exit()
      .remove();
    dataCells.text(d => d);

    $(table.node()).DataTable();
  }

  showDataTable (show) {
    this.el.select('.table-preview')
      .style('display', show ? null : 'none');
  }
}

const datasetPanel = new DatasetPanel();

export {
  datasetPanel
};
