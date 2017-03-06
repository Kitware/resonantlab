import { select } from 'd3-selection';

import html from './index.jade';

import '~reslab/view/overlay/index.styl';
import './index.styl';

import { folderIcon,
         fileIcon,
         contactIcon,
         closeIcon } from '~reslab/image/icon';

import { reslabBanner,
         reslabLogo,
         resonantLogo,
         kitwareLogo,
         githubLogo } from '~reslab/image/logo';

import { action,
         store,
         appMode } from '~reslab/redux';
import { openProjectDialog } from '~reslab/view/overlay/OpenProjectDialog';
import { initializeNewProject,
         currentUser,
         getProjects } from '~reslab/util';

import { logout } from 'girder/auth';

class StartScreen {
  initialize (selector) {
    this.el = select(selector);

    const loggedIn = !!currentUser();

    this.el.html(html({
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

    this.el.select('.new-project')
      .on('click', () => {
        if (currentUser()) {
          initializeNewProject().then(project => {
            store.dispatch(action.switchMode(appMode.project));
            store.dispatch(action.openProject(project.id, project.name, project.visibility));
          });
        }
      });

    this.el.select('.open-project').on('click', () => {
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

    this.el.select('.log-in').on('click', () => {
      store.dispatch(action.switchMode(appMode.loginDialog));
    });

    this.el.select('.log-out').on('click', () => {
      logout().then(() => {
        // Close any open projects.
        store.dispatch(action.closeProject());

        // Change the logged-out state.
        store.dispatch(action.logout());
      });
    });

    this.el.select('.close-overlay').on('click', () => store.dispatch(action.switchMode(appMode.project)));
  }

  render ({username, openProject}) {
    const loggedIn = !!username;

    // Display "logout" or "login/register" depending on login state.
    this.el.select('.log-out')
      .style('display', loggedIn ? null : 'none')
      .text(() => {
        if (username) {
          return `Log out (${username})`;
        } else {
          return 'Log out';
        }
      });
    this.el.selectAll('.log-in, .register')
      .style('display', loggedIn ? 'none' : null);

    // Gray out the new project / open project options if not logged in.
    this.el.selectAll('.new-project, .open-project')
      .classed('disabled', !loggedIn)
      .classed('clickable', loggedIn);

    // Only display the "close" button if there's already a project open.
    this.el.select('.close-overlay')
      .style('display', openProject ? null : 'none');
  }
}

const startScreen = new StartScreen();

export {
  startScreen
};
