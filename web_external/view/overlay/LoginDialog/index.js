import html from './index.jade';
import './index.styl';

import { action } from '../../../redux/action';
import { store } from '../../../redux/store';

import { login } from 'girder/auth';

const initialize = (sel) => {
  sel.html(html());

  const clear = () => {
    sel.select('#g-login')
      .property('value', '');
    sel.select('#g-password')
      .property('value', '');
    sel.select('.g-validation-failed-message')
      .text('');
  };

  sel.select('a#close-login').on('click', () => {
    clear();
    store.dispatch(action.lastMode());
  });

  sel.select('a#submit-login').on('click', () => {
    const username = sel.select('#g-login').property('value');
    const password = sel.select('#g-password').property('value');

    let promise = login(username, password);
    promise.then(
      resp => {
        clear();
        store.dispatch(action.login(resp.login));
        store.dispatch(action.lastMode());
      },
      xhr => sel.select('.g-validation-failed-message')
        .text(xhr.responseJSON.message)
    );
  });
};

export {
  initialize
};
