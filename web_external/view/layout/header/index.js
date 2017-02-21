import { event,
         select } from 'd3-selection';

import { action } from '~reslab/redux/action';
import { appMode } from '~reslab/redux/reducer';
import { store } from '~reslab/redux/store';

import './index.styl';
import html from './index.jade';
import hamburgerIcon from './hamburger.svg';
import infoIcon from './info.svg';
import publicIcon from './public.svg';
import reslabIcon from '~reslab/image/Resonant_Lab_cropped.svg';

const initialize = (sel) => {
  sel.html(html({
    hamburgerIcon,
    infoIcon,
    reslabIcon,
    privacyIcon: publicIcon,
    filename: 'Untitled'
  }));

  select('#aboutResLabHeaderButton').on('click', () => {
    store.dispatch(action.switchMode(appMode.startScreen));
  });

  select('#hamburgerButton').on('click', () => {
    console.log('click #hamburgerButton');
  });

  select('#helpButton').on('click', () => {
    console.log('click #helpButton');
  });

  select('#projectVisibilityButton').on('click', () => {
    console.log('click #projectVisibilityButton');
  });

  select('#projectName').on('blur', () => {
    // Whenever the project name field blurs (that is, loses focus), we have to
    // check whether we need to update the project name on the server.
    //
    // Grab the new name from the text field, and the original name from
    // application state.
    const textField = select('#projectName')
    const newName = textField.text();
    const oldName = store.getState().getIn(['project', 'name']);

    if (newName === '') {
      // If the user did something crazy like delete the name, then restore it
      // to what it was before the editing began.
      textField.text(oldName);
    } else if (newName !== oldName) {
      // Otherwise, as long as the name has changed, initiate a change to the
      // project item's name as well.
      console.log('TODO: change project name');
    }
  });

  select('#projectName').on('keydown', () => {
    // We need to treat two keystrokes specially - the enter key normally
    // inserts a linebreak in a content-editable span element, but we want it to
    // "save" the filename. By contract, the escape key normally blurs the
    // element, but we also want to "cancel" the editing operation first.
    switch (event.keyCode) {
    case 13: // Enter key
      select('#projectName').node().blur();
      event.preventDefault();
      break;

    case 27: // Escape key.
      select('#projectName')
        .text(store.getState().getIn(['project', 'name']));
      break;
    }
  });
};

const render = () => {

};

export {
  initialize,
  render
};
