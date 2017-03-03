import { select } from 'd3-selection';

import html from './index.jade';
import './index.styl';

import { action } from '~reslab/redux/action';
import { store } from '~reslab/redux/store';
import { userInformation } from '~reslab/util';

import { login } from 'girder/auth';

class LoginDialog {
  initialize (selector) {
    this.el = select(selector);

    this.el.html(html());

    const clear = () => {
      this.el.select('#g-login')
        .property('value', '');
      this.el.select('#g-password')
        .property('value', '');
      this.el.select('.g-validation-failed-message')
        .text('');
    };

    this.el.select('a#close-login').on('click', () => {
      clear();
      store.dispatch(action.lastMode());
    });

    this.el.select('a#submit-login').on('click', () => {
      const username = this.el.select('#g-login').property('value');
      const password = this.el.select('#g-password').property('value');

      login(username, password).then(userInformation, xhr =>
        this.el.select('.g-validation-failed-message')
        .text(xhr.responseJSON.message)
      ).then(info => {
        clear();
        store.dispatch(action.login(info.login, info.private, info.public));
        store.dispatch(action.lastMode());
      });
    });
  }
}

const loginDialog = new LoginDialog();

export {
  loginDialog
};
