import { select,
         selectAll } from 'd3-selection';

import { restRequest } from 'girder/rest';

import { action } from './redux/action';
import { store,
         observeStore } from './redux/store';
import { appMode } from './redux/reducer';
import { switchOverlay,
         userInformation } from './util';

import { publicIcon,
         privateIcon } from './image/icon';

import html from './index.jade';
import svgFilters from './style/svgFilters.jade';
import { header } from './view/layout/Header';
import { startScreen } from './view/overlay/StartScreen';
import { loginDialog } from './view/overlay/LoginDialog';
import { openProjectDialog } from './view/overlay/OpenProjectDialog';
import { datasetPanel } from './view/panel/DatasetPanel';
import { matchingPanel } from './view/panel/MatchingPanel';
import { visPanel } from './view/panel/VisPanel';

import './view/overlay/index.styl';
import './index.styl';
import './view/panel/index.styl';
import './style/accordion.styl';
import './style/forms/index.css';

import colors from './style/colors.json';

// Instantiate the main application template.
select('#app').html(html);

// Instantiate the header.
header.initialize('#header');

// Instantiate the overlays.
const overlays = [
  ['start-screen', startScreen.initialize, startScreen],
  ['login-dialog', loginDialog.initialize, loginDialog],
  ['open-project-dialog', openProjectDialog.initialize, openProjectDialog]
];

overlays.forEach(spec => spec[1].bind(spec[2])(select('#overlay')
  .append('div')
  .classed('overlay', true)
  .classed(spec[0], true)
  .node()));

// Render color defs.
select('#svg-filters').html(svgFilters({colors}));

// Initialize the dataset panel.
datasetPanel.initialize('#dataset-panel');
matchingPanel.initialize('#matching-panel');
visPanel.initialize('#vis-panel');

// Check to see if a user is already logged in.
restRequest({
  type: 'GET',
  path: '/user/me'
}).then(userInformation)
  .then(info => {
    store.dispatch(action.login(info.login, info.private, info.public));
  });

// Find the library folder locations.
let promises = ['Data', 'Projects', 'Public Scratch Space'].map(p => restRequest({
  type: 'GET',
  path: '/resource/lookup',
  data: {
    path: `/collection/Resonant Lab Library/${p}`
  }
}));

Promise.all(promises).then(
  resps => store.dispatch(action.setLibraryPaths(...resps.map(r => r._id))),
  xhr => {
    throw new Error('fatal: Resonant Lab Library collection doesn\'t exist, or Data, Projects, or Public Scratch Space folder is missing; contact your site administrator');
  }
);

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
      startScreen.render();
      switchOverlay('start-screen');
      break;

    case appMode.openProjectDialog:
      switchOverlay('open-project-dialog');
      break;
  }
}, s => s.get('mode'));

// Update start screen with login/logout changes.
observeStore(
  next => startScreen.render(),
  s => s.get('user')
);

// Open a project.
observeStore(next => {
  const project = next.get('project');

  if (project) {
    select('#projectName')
      .text(project.get('name'));

    select('#header')
      .select('.project-visibility')
      .attr('src', project.get('visibility') === 'public' ? publicIcon : privateIcon);
  }
}, s => s.get('project'));

// Resize the panels.
observeStore(next => {
  const panels = next.get('panel').toJS();

  const numOpen = Object.values(panels).filter(p => p.open).length;
  const numClosed = Object.keys(panels).length - numOpen;

  const style = `calc((100% - (0.5em + 2.5*${numClosed}em + 0.5*${numOpen}em)) / ${numOpen})`;

  selectAll('section')
    .style('width', null);

  selectAll('section.targeted')
    .style('width', style);
}, s => s.get('panel'));
