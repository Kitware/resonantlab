import html from './index.jade';
import './index.styl';

const initialize = (sel) => {
  sel.html(html());
}

export {
  initialize
};
