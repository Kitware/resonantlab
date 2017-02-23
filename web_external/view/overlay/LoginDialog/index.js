import html from './index.jade';
import './index.styl';

import { action } from '~reslab/redux/action';
import { store } from '~reslab/redux/store';
import { userInformation } from '~reslab/util';

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

    login(username, password).then(userInformation, xhr =>
      sel.select('.g-validation-failed-message')
        .text(xhr.responseJSON.message)
    ).then(info => {
      clear();
      store.dispatch(action.login(info.login, info.private, info.public));
      store.dispatch(action.lastMode());
    });
  });
};

export {
  initialize
};
