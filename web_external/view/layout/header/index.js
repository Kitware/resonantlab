import { select } from 'd3-selection';

import './index.styl';
import html from './index.jade';
import hamburgerIcon from './hamburger.svg';
import infoIcon from './info.svg';
import publicIcon from './public.svg';
import reslabIcon from '../../../image/Resonant_Lab_cropped.svg';

const initialize = (sel) => {
  sel.html(html({
    hamburgerIcon,
    infoIcon,
    reslabIcon,
    privacyIcon: publicIcon,
    filename: 'Untitled'
  }));

  select('#aboutResLabHeaderButton').on('click', () => {
    console.log('click #aboutResLabHeaderButton');
  });
  select('#hamburgerButton').on('click', () => {
    console.log('click #hamburgerButton');
  });
  select('#helpButton').on('click', () => {
    console.log('click #helpButton');
  });
  select('#aboutResLabHeaderButton').on('click', () => {
    console.log('click #aboutResLabHeaderButton');
  });
  select('#projectVisibilityButton').on('click', () => {
    console.log('click #projectVisibilityButton');
  });
  select('#projectName').on('focus', () => {
    console.log('focus #projectName');
  });
  select('#projectName').on('blur', () => {
    console.log('blur #projectName');
  });
  select('#projectName').on('keydown', () => {
    console.log('keydown #projectName');
  });
};

const render = () => {

};

export {
  initialize,
  render
};
