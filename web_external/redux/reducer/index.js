import Immutable from 'immutable';

import { makeEnum } from '../../util';
import { actionType } from '../action';

const appMode = makeEnum('appMode', [
  'startScreen',
  'loginDialog'
]);

const initial = Immutable.Map({
  mode: appMode.startScreen,
  lastMode: appMode.startScreen
});

const reducer = (state = initial, action = {}) => {
  let newState = state;

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
  }

  return newState;
};

export {
  appMode,
  reducer
};
