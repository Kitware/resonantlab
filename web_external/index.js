import { select } from 'girder_plugins/resonantlab/node/d3-selection';

import { store } from './redux/store';
console.log(store.getState());

import html from './index.jade';

// Instantiate the main application template.
select('#app').html(html);
