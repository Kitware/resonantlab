import { select } from 'd3-selection';
import { observeStore } from './redux/store';
import { appMode } from './redux/reducer';
import { switchOverlay } from './util';

import html from './index.jade';
import svgFilters from './style/svgFilters.jade';
import { initialize as initHeader } from './view/layout/header';
import { initialize as initStartingScreen,
         render as renderStartingScreen } from './view/overlay/StartingScreen';
import { initialize as initLoginDialog } from './view/overlay/LoginDialog';

import './view/overlay/index.styl';
import './index.styl';
import './style/forms/index.css';

import colors from './style/colors.json';

// Instantiate the main application template.
select('#app').html(html);

// Instantiate the header.
initHeader(select('#header'));

// Instantiate the overlays.
const overlays = [
  ['starting-screen', initStartingScreen],
  ['login-dialog', initLoginDialog]
];

overlays.forEach(spec => spec[1](select('#overlay')
  .append('div')
  .classed('overlay', true)
  .classed(spec[0], true)));

// Render color defs.
select('#svg-filters').html(svgFilters({colors}));

// Log state changes.
observeStore(next => {
  console.log(next.toJS());
});

// Render state changes.
//
// Change "application mode".
observeStore(next => {
  const mode = next.get('mode');
  switch (mode) {
    case appMode.project:
      switchOverlay(null);
      break;

    case appMode.loginDialog:
      switchOverlay('login-dialog');
      break;

    case appMode.startScreen:
      renderStartingScreen();
      switchOverlay('starting-screen');
      break;
  }
}, s => s.get('mode'));

// Update start screen with login/logout changes.
observeStore(
  next => renderStartingScreen(),
  s => s.get('user')
);

// Open a project.
observeStore(next => {
  const project = next.get('project');

  if (project) {
    select('#projectName')
      .text(project.get('name'));
  }
}, s => s.get('project'));
