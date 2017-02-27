import html from './index.jade';
import './index.styl';

import closeIcon from '~reslab/image/close.svg';

import { store } from '~reslab/redux/store';
import { action } from '~reslab/redux/action';

const initialize = (sel) => {
  sel.html(html({
    closeIcon
  }));

  sel.select('.close-overlay')
    .on('click', () => store.dispatch(action.lastMode()));
};

const render = () => {
  console.log('OpenProjectDialog.render');
};

export {
  initialize,
  render
};
