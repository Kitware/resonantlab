import { select } from 'd3-selection';

import { store,
         observeStore } from './redux/store';

import { appMode } from './redux/reducer';

import html from './index.jade';
import { initialize as initHeader } from './view/layout/header';
import { initialize as initStartingScreen } from './view/overlay/StartingScreen';
import { initialize as initLoginDialog } from './view/overlay/LoginDialog';

import './view/overlay/index.styl';
import './index.styl';
import './style/forms/index.css';

// Instantiate the main application template.
select('#app').html(html);

// Instantiate the header.
initHeader(select('#header'));

// Log state changes.
observeStore(next => {
  console.log(next.toJS());
});

// Render state changes.
observeStore(next => {
  switch (next.get('mode')) {
    case 'project':
      console.log('project mode');
      break;

    case appMode.loginDialog:
      initLoginDialog(select('#overlay'));
      break;

    case appMode.startScreen:
      initStartingScreen(select('#overlay'));
      break;
  }
}, s => s.get('mode'));
