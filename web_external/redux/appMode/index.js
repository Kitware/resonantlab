import { makeEnum } from '~reslab/util/makeEnum';
import modes from './modes.yml';

const appMode = makeEnum('appMode', modes);

export {
  appMode
};
