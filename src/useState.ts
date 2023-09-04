import React from "react";
import { setter, store } from "./store";

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

function updateSetter(
  id: string,
  stateParams: { stateId: string; setterFn: Function }
) {
  const { stateId, setterFn } = stateParams;

  if (!setter[id]) setter[id] = {};
  if (!setter[id][stateId]) {
    Object.assign(setter[id], { [stateId]: setterFn });
  }
}

export function useState<T>(value: T, params?: StateParams) {
  // params
  const { stateName } = params || {};

  // state
  const [_, setState] = React.useState<T>(value);
  const [__, forceRender] = React.useState<boolean>(false);

  const stateId = React.useMemo(() => {
    const stateId = stateName || generateId();
    store[stateId] = value;
    return stateId;
  }, [stateName]);

  // refs
  const globalStateIds = React.useRef<Set<string>>(new Set());

  // actions
  const updateGlobalState = React.useCallback(
    (value: any) => {
      if (!store[stateId]) {
        Object.defineProperty(store, stateId, {
          set(newValue) {
            this._value = newValue;

            if (setter[stateId]) {
              for (let id of Object.keys(setter[stateId])) {
                setter[stateId][id]?.();
              }
            }
          },
          get() {
            return this._value;
          },
        });
      } else {
        store[stateId] = value;
      }
    },
    [stateId]
  );

  const getGlobalState = React.useCallback(
    (id: string) => {
      updateSetter(id, {
        stateId,
        setterFn: () => forceRender((state) => !state),
      });
      globalStateIds.current.add(id);
      return store[id];
    },
    [stateId]
  );

  const getState = React.useCallback(() => {
    return store[stateId];
  }, [stateId]);

  const updateState = React.useCallback(
    (value: T | ((value: T) => T)) => {
      if (value instanceof Function) {
        setState((state) => {
          const finalState = value(state);
          updateGlobalState(finalState);
          return finalState;
        });
      } else {
        store[stateId] = value;
        setState(value);
      }
    },
    [stateId, updateGlobalState]
  );

  // effects
  React.useEffect(() => {
    return () => {
      for (let id of globalStateIds.current) {
        if (setter[id][stateId]) delete setter[id][stateId];
      }
    };
  }, [stateId]);

  return [getState, updateState, getGlobalState];
}
