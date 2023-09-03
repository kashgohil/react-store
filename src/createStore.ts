import { store } from "./store";

export function createStore(initialValues: Record<string, unknown>) {
  Object.assign(store, initialValues);
  return initialValues;
}
