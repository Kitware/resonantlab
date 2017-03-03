import { event,
         select } from 'd3-selection';

import { action } from '~reslab/redux/action';
import { appMode } from '~reslab/redux/reducer';
import { store } from '~reslab/redux/store';
import { updateProjectName } from '~reslab/util';

import './index.styl';
import html from './index.jade';
import hamburgerIcon from './hamburger.svg';
import infoIcon from './info.svg';
import publicIcon from './public.svg';
import reslabIcon from '~reslab/image/Resonant_Lab_cropped.svg';

class Header {
  initialize (selector) {
    this.el = select(selector);
    this.el.html(html({
      hamburgerIcon,
      infoIcon,
      reslabIcon,
      privacyIcon: publicIcon,
      filename: 'Untitled'
    }));

    this.el.select('#aboutResLabHeaderButton').on('click', () => {
      store.dispatch(action.switchMode(appMode.startScreen));
    });

    this.el.select('#hamburgerButton').on('click', () => {
      console.log('click #hamburgerButton');
    });

    this.el.select('#helpButton').on('click', () => {
      console.log('click #helpButton');
    });

    this.el.select('.project-visibility').on('click', () => {
      console.log('click .project-visibility');
    });

    this.el.select('#projectName').on('blur', () => {
      // Whenever the project name field blurs (that is, loses focus), we have to
      // check whether we need to update the project name on the server.
      //
      // Grab the new name from the text field, and the original name from
      // application state.
      const textField = this.el.select('#projectName');
      const newName = textField.text();
      const oldName = store.getState().getIn(['project', 'name']);

      if (newName === '') {
        // If the user did something crazy like delete the name, then restore it
        // to what it was before the editing began.
        textField.text(oldName);
      } else if (newName !== oldName) {
        // Otherwise, as long as the name has changed, initiate a change to the
        // project item's name as well.
        const state = store.getState();
        const projectId = state.getIn(['project', 'id']);
        updateProjectName(projectId, newName).then(
          item => store.dispatch(action.updateProjectName(item.name)),
          xhr => console.error(`could not update name of project with id ${projectId}`)
        );
      }
    });

    this.el.select('#projectName').on('keydown', () => {
      // We need to treat two keystrokes specially - the enter key normally
      // inserts a linebreak in a content-editable span element, but we want it to
      // "save" the filename. By contract, the escape key normally blurs the
      // element, but we also want to "cancel" the editing operation first.
      switch (event.keyCode) {
        case 13: // Enter key
          this.el.select('#projectName').node().blur();
          event.preventDefault();
          break;

        case 27: // Escape key.
          this.el.select('#projectName')
            .text(store.getState().getIn(['project', 'name']));
          break;
      }
    });
  }
}

const header = new Header();

export {
  header
};
