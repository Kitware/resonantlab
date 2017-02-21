import { select } from 'd3-selection';

import html from './index.jade';
import './index.styl';

import folderIcon from '../../../image/light/folder.svg';
import fileIcon from '../../../image/light/file.svg';
import scatterplotIcon from '../../../image/light/scatterplot.svg';
import datasetIcon from '../../../image/light/dataset.svg';
import reslabBanner from '../../../image/Resonant_Lab_cropped.svg';
import reslabLogo from '../../../image/Resonant_Lab_Mark.svg';
import resonantLogo from '../../../image/Resonant_Mark.svg';
import kitwareLogo from '../../../image/Kitware_Mark.svg';
import githubLogo from '../../../image/Github_Mark.svg';
import contactIcon from '../../../image/contact.svg';
import closeIcon from '../../../image/close.svg';

import { action } from '../../../redux/action';
import { store } from '../../../redux/store';
import { appMode } from '../../../redux/reducer';
import { initializeNewProject } from '../../../util';

import { logout } from 'girder/auth';

const initialize = (sel) => {
  const loggedIn = !!store.getState().get('user');

  sel.html(html({
    folderIcon,
    fileIcon,
    scatterplotIcon,
    datasetIcon,
    reslabBanner,
    reslabLogo,
    resonantLogo,
    kitwareLogo,
    githubLogo,
    contactIcon,
    closeIcon,
    loggedIn
  }));

  sel.select('#empty-project-button')
    .on('click', () => {
      initializeNewProject().then(project => {
        store.dispatch(action.switchMode(appMode.project));
        store.dispatch(action.openProject(project.name));
      });
    });

  sel.select('span.login-link').on('click', () => {
    store.dispatch(action.switchMode(appMode.loginDialog));
  });

  sel.select('span.logout-link').on('click', () => {
    logout().then(() => store.dispatch(action.logout()));
  });
};

const render = () => {
  const loggedIn = !!store.getState().get('user');

  let el = select('.overlay.starting-screen');
  el.select('span.logout-link')
    .style('display', loggedIn ? null : 'none');
  el.select('span.login-link')
    .style('display', loggedIn ? 'none' : null);
};

export {
  initialize,
  render
};
