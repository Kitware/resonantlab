import { select } from 'd3-selection';
import { store,
         observeStore } from './redux/store';
import { appMode } from './redux/reducer';
import { switchOverlay } from './util';

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

// Instantiate the overlays.
//
// Starting screen.
let target = select('#overlay')
  .append('div')
  .classed('overlay', true)
  .classed('starting-screen', true);
initStartingScreen(target);

// Login dialog.
target = select('#overlay')
  .append('div')
  .classed('overlay', true)
  .classed('login-dialog', true);
initLoginDialog(target);

// Log state changes.
observeStore(next => {
  console.log(next.toJS());
});

// Render state changes.
//
// Change "application mode".
observeStore(next => {
  const mode = next.get('mode');
  select('#overlay').style('display', mode === appMode.project ? 'none' : null);

  switch (mode) {
    case appMode.project:
      console.log('project mode');
      break;

    case appMode.loginDialog:
      switchOverlay('login-dialog');
      break;

    case appMode.startScreen:
      switchOverlay('starting-screen');
      break;
  }
}, s => s.get('mode'));
