import { event,
         select } from 'd3-selection';

import html from './index.jade';
import './index.styl';

import { action,
         store } from '~reslab/redux';
import { userInformation } from '~reslab/util';

import { login } from 'girder/auth';

class LoginDialog {
  initialize (selector) {
    this.el = select(selector);

    this.el.html(html());

    this.el.select('a.close-login').on('click', () => {
      this.clear();
      store.dispatch(action.lastMode());
    });

    // NOTE: need to use an arrow function for the callback to preserve "this"
    // context.
    this.el.select('a.submit-login').on('click', () => this.submit());

    // Also submit the form when "enter" is pressed on either text field.
    const enter = () => {
      if (event.keyCode === 13) {
        this.submit();
      }
    };
    this.el.select('#loginfield').on('keydown', enter);
    this.el.select('#passwordfield').on('keydown', enter);
  }

  focusUsername () {
    this.el.select('#loginfield')
      .node()
      .focus();
  }

  submit () {
    const username = this.el.select('#loginfield').property('value');
    const password = this.el.select('#passwordfield').property('value');

    login(username, password).then(userInformation, xhr =>
      this.el.select('.validation-failed-message')
      .text(xhr.responseJSON.message)
    ).then(info => {
      this.clear();
      store.dispatch(action.login(info.login, info.private, info.public));
      store.dispatch(action.lastMode());
    });
  }

  clear () {
    this.el.select('#loginfield')
      .property('value', '');
    this.el.select('#passwordfield')
      .property('value', '');
    this.el.select('.validation-failed-message')
      .text('');
  }
}

const loginDialog = new LoginDialog();

export {
  loginDialog
};
