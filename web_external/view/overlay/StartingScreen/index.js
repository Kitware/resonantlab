import { select } from 'd3-selection';

import html from './index.jade';
import './index.styl';

import folderIcon from '~reslab/image/light/folder.svg';
import fileIcon from '~reslab/image/light/file.svg';
import scatterplotIcon from '~reslab/image/light/scatterplot.svg';
import datasetIcon from '~reslab/image/light/dataset.svg';
import reslabBanner from '~reslab/image/Resonant_Lab_cropped.svg';
import reslabLogo from '~reslab/image/Resonant_Lab_Mark.svg';
import resonantLogo from '~reslab/image/Resonant_Mark.svg';
import kitwareLogo from '~reslab/image/Kitware_Mark.svg';
import githubLogo from '~reslab/image/Github_Mark.svg';
import contactIcon from '~reslab/image/contact.svg';
import closeIcon from '~reslab/image/close.svg';

import { action } from '~reslab/redux/action';
import { store } from '~reslab/redux/store';
import { appMode } from '~reslab/redux/reducer';
import { initializeNewProject } from '~reslab/util';

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

  sel.select('#close-overlay').on('click', () => store.dispatch(action.lastMode()));
};

const render = () => {
  const state = store.getState();
  const loggedIn = !!state.get('user');

  let el = select('.overlay.starting-screen');
  el.select('span.logout-link')
    .style('display', loggedIn ? null : 'none');
  el.select('span.login-link')
    .style('display', loggedIn ? 'none' : null);

  // Only display the "close" button if the starting screen was invoked from a
  // different part of the app.
  const showClose = state.get('mode') !== state.get('lastMode');
  el.select('#close-overlay')
    .style('display', showClose ? null : 'none');
};

export {
  initialize,
  render
};
