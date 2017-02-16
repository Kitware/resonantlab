import html from './index.jade';
import './index.styl';

import { action } from '../../../redux/action';
import { store } from '../../../redux/store';

const initialize = (sel) => {
  sel.html(html());

  sel.select('a#close-login').on('click', () => {
    store.dispatch(action.lastMode());
  });
}

export {
  initialize
};
