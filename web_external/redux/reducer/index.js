import candelaComponents from 'candela/components';
import Immutable from 'immutable';

import { actionType } from '~reslab/redux/action';
import { appMode } from '~reslab/redux/appMode';

const initial = Immutable.fromJS({
  mode: appMode.startScreen,
  lastMode: appMode.startScreen,
  user: {
    login: null,
    private: null,
    public: null
  },
  project: {
    id: null,
    name: null,
    visibility: null
  },
  dataset: {
    loading: false,
    data: null
  },
  vis: {
    component: null
  },
  matchings: {},
  libPaths: {
    data: null,
    projects: null,
    publicScratchSpace: null
  },
  panel: {
    dataset: {
      open: false,
      title: 'No Dataset Loaded'
    },
    matching: {
      open: false,
      title: 'Matching -/-'
    },
    vis: {
      open: false,
      title: 'No Visualization Selected'
    }
  }
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
        s.setIn(['user', 'login'], action.username)
          .setIn(['user', 'public'], action.public)
          .setIn(['user', 'private'], action.private);
      });
      break;

    case actionType.logout:
      newState = newState.withMutations(s => {
        s.setIn(['user', 'login'], null)
          .setIn(['user', 'public'], null)
          .setIn(['user', 'private'], null);
      });
      break;

    case actionType.openProject:
      newState = newState.withMutations(s => {
        s.setIn(['project', 'id'], action.id)
          .setIn(['project', 'name'], action.name)
          .setIn(['project', 'visibility'], action.visibility);
      });
      break;

    case actionType.closeProject:
      newState = newState.withMutations(s => {
        s.setIn(['project', 'id'], null)
          .setIn(['project', 'name'], null)
          .setIn(['project', 'visibility'], null)
          .setIn(['dataset', 'data'], null)
          .setIn(['vis', 'component'], null)
          .setIn(['panel', 'dataset', 'title'], null)
          .setIn(['panel', 'matching', 'title'], null)
          .setIn(['panel', 'vis', 'title'], null);
      });
      break;

    case actionType.updateProjectName:
      newState = newState.setIn(['project', 'name'], action.name);
      break;

    case actionType.datasetLoading:
      newState = newState.setIn(['dataset', 'loading'], action.loading);
      break;

    case actionType.setData:
      newState = newState.setIn(['dataset', 'data'], action.data);
      break;

    case actionType.setVis:
      newState = newState.setIn(['vis', 'component'], candelaComponents[action.vis]);
      break;

    case actionType.setMatchings:
      newState = newState.set('matchings', Immutable.fromJS(action.matchings));
      break;

    case actionType.setPanelTitle:
      newState = newState.setIn(['panel', action.panel, 'title'], action.title);
      break;

    case actionType.setLibraryPaths:
      newState = newState.withMutations(s => {
        s.setIn(['libPaths', 'data'], action.data)
          .setIn(['libPaths', 'projects'], action.projects)
          .setIn(['libPaths', 'publicScratchSpace'], action.publicScratchSpace);
      });
      break;

    case actionType.togglePanel:
      const seq = ['panel', action.panel, 'open'];
      newState = newState.setIn(seq, !newState.getIn(seq));
      break;
  }

  return newState;
};

export {
  reducer
};
