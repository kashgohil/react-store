import React from "react";
import { store } from "./store";

export interface StateParams {
  stateName: string;
}

export function generateId() {
  const randomString1 = Math.random().toString(36).slice(2);
  const randomString2 = Math.random().toString(36).slice(2);
  const randomString3 = Math.random().toString(36).slice(2);

  return (randomString1 + randomString2 + randomString3).slice(0, 24);
}

/**
 * custom use state hook
 * @param value initial value for state
 * @param params parameters pertaining global state
 * @returns 3 function, getter, setter and getter for global state
 */

export function useState<T>(value: T, params?: StateParams) {
  // params
  const { stateName } = params || {};

  // state
  const [_, setState] = React.useState<T>(value);

  const stateId = React.useMemo(() => {
    const stateId = stateName || generateId();
    store[stateId] = value;
    return stateId;
  }, [stateName]);

  // actions
  const getGlobalState = React.useCallback(() => {
    return store;
  }, []);

  const getState = React.useCallback(() => {
    return store[stateId];
  }, [stateId]);

  const updateState = React.useCallback(
    (value: T | ((value: T) => T)) => {
      if (value instanceof Function) {
        setState((state) => {
          const finalState = value(state);
          store[stateId] = finalState;
          return finalState;
        });
      } else {
        store[stateId] = value;
        setState(value);
      }
    },
    [stateId]
  );

  return [getState, updateState, getGlobalState];
}
