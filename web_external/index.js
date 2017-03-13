import { select,
         selectAll } from 'd3-selection';

import { restRequest } from 'girder/rest';

import candelaComponents from 'candela/components';

import { action,
         store,
         observeStore,
         appMode } from './redux';
import { initializeOverlays,
         switchOverlay,
         userInformation } from './util';

import { publicIcon,
         privateIcon } from './image/icon';

import html from './index.jade';
import svgFilters from './style/svgFilters.jade';
import { header } from './view/layout/Header';
import { startScreen } from './view/overlay/StartScreen';
import { loginDialog } from './view/overlay/LoginDialog';
import { selectVisDialog } from './view/overlay/SelectVisDialog';
import { openProjectDialog } from './view/overlay/OpenProjectDialog';
import { datasetPanel } from './view/panel/DatasetPanel';
import { matchingPanel } from './view/panel/MatchingPanel';
import { visPanel } from './view/panel/VisPanel';

import './view/overlay/index.styl';
import './index.styl';
import './view/panel/index.styl';
import './style/accordion.styl';
import './style/dialog.styl';
import './style/forms/index.css';
import 'datatables-all/media/css/jquery.dataTables.css';

import colors from './style/colors.json';

// Instantiate the main application template.
select('#app').html(html);

// Instantiate the header.
header.initialize('#header');

// Instantiate the overlays.
initializeOverlays(select('#overlay'), [
  ['start-screen', startScreen.initialize, startScreen],
  ['login-dialog', loginDialog.initialize, loginDialog],
  ['open-project-dialog', openProjectDialog.initialize, openProjectDialog],
  ['select-vis-dialog', selectVisDialog.initialize, selectVisDialog]
]);

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

// Compute a data sheet for all the available Candela components.
const candelaData = Object.keys(candelaComponents).map(key => {
  const component = candelaComponents[key];

  if (component.options) {
    return {
      name: key
    };
  } else {
    return null;
  }
}).filter(x => !!x);

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
      loginDialog.focusUsername();
      break;

    case appMode.startScreen:
      startScreen.render({
        username: next.getIn(['user', 'login']),
        openProject: !!next.getIn(['project', 'id'])
      });
      switchOverlay('start-screen');
      break;

    case appMode.openProjectDialog:
      switchOverlay('open-project-dialog');
      break;

    case appMode.selectVis:
      switchOverlay('select-vis-dialog');
      selectVisDialog.render(candelaData);
      break;
  }
}, s => s.get('mode'));

// Update start screen with login/logout/project changes.
const updateStartScreen = state => startScreen.render({
  username: state.getIn(['user', 'login']),
  openProject: !!state.getIn(['project', 'id'])
});
observeStore(updateStartScreen, s => s.get('user'));
observeStore(updateStartScreen, s => s.getIn(['project', 'id']));

// Open a project.
observeStore(next => {
  const project = next.get('project');

  const header = select('#header');
  const name = header.select('.project-name');
  const visibility = header.select('.project-visibility');

  if (project.get('id')) {
    // Make the project data elements visible and fill in the appropriate
    // values.
    name.style('display', null)
      .text(project.get('name'));

    visibility.style('display', null)
      .attr('src', project.get('visibility') === 'public' ? publicIcon : privateIcon);
  } else {
    // If there's no open project, hide the project data elements.
    name.style('display', 'none');
    visibility.style('display', 'none');
  }
}, s => s.get('project'));

// Show "data loading" throbber.
observeStore(next => {
  const loading = next.getIn(['dataset', 'loading']);
  datasetPanel.showThrobber(loading);
}, s => s.getIn(['dataset', 'loading']));

// Display changed data.
observeStore(next => {
  const data = next.getIn(['dataset', 'data']);
  const vis = next.getIn(['vis', 'component']);
  const matchings = next.get('matchings').toJS();

  if (data) {
    datasetPanel.updateData(data[0], data.slice(1));
    datasetPanel.showDataTable(true);

    if (vis) {
      visPanel.instantiate(vis, data, matchings);
    }
  } else {
    datasetPanel.removeData();
    datasetPanel.showDataTable(false);

    if (vis) {
      visPanel.remove();
    }
  }
}, s => s.getIn(['dataset', 'data']));

// Display changed vis.
observeStore(next => {
  visPanel.remove();

  const vis = next.getIn(['vis', 'component']);
  const data = next.getIn(['dataset', 'data']);
  const matchings = next.get('matchings').toJS();
  if (vis) {
    visPanel.instantiate(vis, data || [], matchings);
  }
}, s => s.getIn(['vis', 'component']));

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

// Retitle the panels.
observeStore(next => {
  const panels = next.get('panel');

  datasetPanel.setTitle(panels.getIn(['dataset', 'title']) || 'No Dataset Loaded');
  matchingPanel.setTitle(panels.getIn(['matching', 'title']) || 'Matching -/-');
  visPanel.setTitle(panels.getIn(['vis', 'title']) || 'No Visualization Loaded');
}, s => s.get('panel'));
