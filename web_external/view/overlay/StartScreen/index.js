import { select } from 'd3-selection';

import html from './index.jade';

import '~reslab/view/overlay/index.styl';
import './index.styl';

import folderIcon from '~reslab/image/light/folder.svg';
import fileIcon from '~reslab/image/light/file.svg';
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
import { openProjectDialog } from '~reslab/view/overlay/OpenProjectDialog';
import { initializeNewProject,
         currentUser,
         getProjects } from '~reslab/util';

import { logout } from 'girder/auth';

const initialize = (sel) => {
  const loggedIn = !!currentUser();

  sel.html(html({
    folderIcon,
    fileIcon,
    reslabBanner,
    reslabLogo,
    resonantLogo,
    kitwareLogo,
    githubLogo,
    contactIcon,
    closeIcon,
    loggedIn
  }));

  sel.select('.new-project')
    .on('click', () => {
      if (currentUser()) {
        initializeNewProject().then(project => {
          store.dispatch(action.switchMode(appMode.project));
          store.dispatch(action.openProject(project.id, project.name, project.visibility));
        });
      }
    });

  sel.select('.open-project').on('click', () => {
    if (currentUser()) {
      const state = store.getState();
      const publicProj = getProjects(state.getIn(['user', 'public']));
      const privateProj = getProjects(state.getIn(['user', 'private']));

      Promise.all([publicProj, privateProj]).then(proms => {
        openProjectDialog.render(...proms);
        store.dispatch(action.switchMode(appMode.openProjectDialog));
      });
    }
  });

  sel.select('.log-in').on('click', () => {
    store.dispatch(action.switchMode(appMode.loginDialog));
  });

  sel.select('.log-out').on('click', () => {
    logout().then(() => store.dispatch(action.logout()));
  });

  sel.select('.close-overlay').on('click', () => store.dispatch(action.lastMode()));
};

const render = () => {
  const state = store.getState();
  const loggedIn = !!currentUser();
  const username = state.getIn(['user', 'login']);

  const el = select('.overlay.start-screen');

  // Display "logout" or "login/register" depending on login state.
  el.select('.log-out')
    .style('display', loggedIn ? null : 'none')
    .text(() => {
      if (username) {
        return `Log out (${username})`;
      } else {
        return 'Log out';
      }
    });
  el.selectAll('.log-in, .register')
    .style('display', loggedIn ? 'none' : null);

  // Gray out the new project / open project options if not logged in.
  el.selectAll('.new-project, .open-project')
    .classed('disabled', !loggedIn)
    .classed('clickable', loggedIn);

  // Only display the "close" button if the start screen was invoked from a
  // different part of the app.
  const showClose = state.get('mode') !== state.get('lastMode');
  el.select('.close-overlay')
    .style('display', showClose ? null : 'none');
};

export {
  initialize,
  render
};
