import Immutable from 'immutable';

import { makeEnum } from '../../util';
import { actionType } from '../action';

const appMode = makeEnum('appMode', [
  'startScreen',
  'loginDialog',
  'project'
]);

const initial = Immutable.Map({
  mode: appMode.startScreen,
  lastMode: appMode.startScreen,
  user: null,
  project: null
});

const reducer = (state = initial, action = {}) => {
  let newState = state;

  if (action.type === undefined) {
    throw new Error('fatal: undefined action type');
  }

  switch (action.type) {
    case actionType.switchMode:
      newState = newState.withMutations(s => {
        s.set('lastMode', s.get('mode'))
          .set('mode', action.mode);
      });
      break;

    case actionType.lastMode:
      newState = newState.withMutations(s => {
        let lastMode = s.get('lastMode');
        s.set('lastMode', s.get('mode'))
          .set('mode', lastMode);
      });
      break;

    case actionType.login:
      newState = newState.withMutations(s => {
        s.delete('user')
          .setIn(['user', 'login'], action.username);
      });
      break;

    case actionType.logout:
      newState = newState.set('user', null);
      break;

    case actionType.openProject:
      newState = newState.withMutations(s => {
        s.delete('project')
          .setIn(['project', 'name'], action.name);
      });
      break;
  }

  return newState;
};

export {
  appMode,
  reducer
};
