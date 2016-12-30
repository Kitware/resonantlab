import { select } from 'girder_plugins/resonantlab/node/d3-selection';

import { store } from './redux/store';
console.log(store.getState());

import html from './index.jade';
import { initialize as initHeader } from './view/layout/header';
import { initialize as initStartingScreen } from './view/overlay/StartingScreen';

import './view/overlay/index.styl';
import './index.styl';

// Instantiate the main application template.
select('#app').html(html);

// Instantiate the header.
initHeader(select('#header'));

// Instantiate the starting screen.
initStartingScreen(select('#overlay'));
