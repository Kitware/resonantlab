import { makeEnum } from '../../util';
import actionSpec from './actionspec.json';

const buildActionConstructor = (type, argSpec) => {
  if (argSpec.some(v => v === 'type')) {
    throw new Error('fatal: action constructor for "${type}" has an argument named "type"');
  }

  return (...args) => {
    let action = {
      type
    };
    for (let i = 0; i < argSpec.length; i++) {
      action[argSpec[i]] = args[i];
    }
    return action;
  }
};

const buildActions = () => {
  let action = {};
  let actionType = makeEnum('actionType', Object.keys(actionSpec));

  for(let key in actionSpec) {
    if (actionSpec.hasOwnProperty(key)) {
      action[key] = buildActionConstructor(actionType[key], actionSpec[key]);
    }
  }

  return {
    actionType,
    action
  };
};

const {
  actionType,
  action
} = buildActions();

export {
  actionType,
  action
};
