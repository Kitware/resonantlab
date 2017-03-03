import { makeEnum } from '~reslab/util/makeEnum';

const appMode = makeEnum('appMode', [
  'startScreen',
  'loginDialog',
  'openProjectDialog',
  'project'
]);

export {
  appMode
};
