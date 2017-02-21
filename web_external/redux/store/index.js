import { createStore } from 'redux';

import { reducer } from '~reslab/redux/reducer';

const store = createStore(reducer);

// Taken from https://github.com/reactjs/redux/issues/303#issuecomment-125184409
//
// This function implements an observer pattern on the store.
//
// To observe, call this function with an optional selector function and a
// change handler. Whenever the store dispatches an action, the selector is used
// to extract some part of the new state, compare it to the last state, and, if
// they are known to not be the same object, the change handler is invoked on
// both the new state and the old one.
const observe = (store, onChange, selector) => {
  let lastState;

  const handler = () => {
    let nextState = store.getState();
    if (!lastState || selector(nextState) !== selector(lastState)) {
      onChange(nextState, lastState);
      lastState = nextState;
    }
  };

  let unsubscribe = store.subscribe(handler);
  handler();

  return unsubscribe;
};

// A convenience function that points observe() at the application store.
const observeStore = (onChange, selector = v => v) => observe(store, onChange, selector);

export {
  store,
  observe,
  observeStore
};
