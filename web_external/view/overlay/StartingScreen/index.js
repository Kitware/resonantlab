import html from './index.jade';
import './index.styl';

import folderIcon from '../../../image/light/folder.svg';
import fileIcon from '../../../image/light/file.svg';
import scatterplotIcon from '../../../image/light/scatterplot.svg';
import datasetIcon from '../../../image/light/dataset.svg';
import reslabBanner from '../../../image/Resonant_Lab_cropped.svg';
import reslabLogo from '../../../image/Resonant_Lab_Mark.svg';
import resonantLogo from '../../../image/Resonant_Mark.svg';
import kitwareLogo from '../../../image/Kitware_Mark.svg';
import githubLogo from '../../../image/Github_Mark.svg';
import contactIcon from '../../../image/contact.svg';
import closeIcon from '../../../image/close.svg';

import { action } from '../../../redux/action';
import { store } from '../../../redux/store';
import { appMode } from '../../../redux/reducer';

const loggedIn = false;

const initialize = (sel) => {
  sel.html(html({
    folderIcon,
    fileIcon,
    scatterplotIcon,
    datasetIcon,
    reslabBanner,
    reslabLogo,
    resonantLogo,
    kitwareLogo,
    githubLogo,
    contactIcon,
    closeIcon,
    loggedIn
	}));

  sel.select('#login-link').on('click', () => {
    store.dispatch(action.switchMode(appMode.loginDialog));
  });
}

const render = () => {

};

export {
  initialize,
  render
};

/*
let StartingScreen = Backbone.View.extend({
  initialize: function () {
    this.listenTo(window.mainPage.currentUser, 'rl:login', this.render);
    this.listenTo(window.mainPage.currentUser, 'rl:logout', this.render);
    this.listenTo(window.mainPage, 'rl:changeProject', this.render);
  },
  render: function () {
    if (!this.addedTemplate) {
      this.$el.html(myTemplate);

      this.$el.find('#startWithVisButton').on('click', () => {
        // TODO: load the stock library project
        // from the vis library instead of the vis itthis
        window.mainPage.overlay.render('VisualizationLibrary');
      });

      this.$el.find('#startWithDataButton').on('click', () => {
        // TODO: load the stock library project
        // from the dataset library instead of the dataset itthis
        window.mainPage.overlay.render('DatasetLibrary');
      });

      this.$el.find('#emptyProjectButton').on('click', () => {
        window.mainPage.newProject()
          .then(() => {
            window.mainPage.widgetPanels.closeWidgets();
            window.mainPage.overlay.closeOverlay();
          });
      });

      this.$el.find('#openProjectButton').on('click', () => {
        window.mainPage.overlay.render('ProjectLibrary');
      });

      this.$el.find('a#loginLink').on('click', () => {
        window.mainPage.overlay.render('LoginView');
      });

      this.$el.find('a#registerLink').on('click', () => {
        window.mainPage.overlay.render('RegisterView');
      });

      this.$el.find('a#logoutLink').on('click', () => {
        window.mainPage.currentUser.authenticate(false);
      });

      this.addedTemplate = true;
    }

    if (window.mainPage.project) {
      this.$el.find('#closeOverlay').show();
      window.mainPage.overlay.addCloseListeners();
    } else {
      this.$el.find('#closeOverlay').hide();
      window.mainPage.overlay.removeCloseListeners();
    }

    if (window.mainPage.currentUser.isLoggedIn()) {
      this.$el.find('#loginLinks').hide();
      this.$el.find('#logoutLinks').show();
    } else {
      this.$el.find('#loginLinks').show();
      this.$el.find('#logoutLinks').hide();
    }
  }
});

export default StartingScreen;
*/
