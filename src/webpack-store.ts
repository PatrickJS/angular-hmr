import {OpaqueToken, Optional, Inject, Injectable} from 'angular2/core';

export const WEBPACK_HMR = new OpaqueToken('$$AppState');

@Injectable()
export class WebpackStore {
  static _state = {};
  static _states = [];

  constructor(@Optional() @Inject(WEBPACK_HMR) state?: any) {
    if (state) {
      console.log('WebpackState initial data', state);
    }
    WebpackStore._state = state || WebpackStore._state;
  }

  static set(prop, value) {
    WebpackStore._state[prop] = value;
    return WebpackStore._state[prop];
  }

  static get(prop) {
    return WebpackStore._state[prop];
  }

  static select(name, getState) {
    WebpackStore._states.push({ name, getState });
    let defaultData = getState();
    let currentData = WebpackStore.get(name);

    if (defaultData && !currentData) {
      return WebpackStore.set(name, defaultData);
    } else if (defaultData && currentData) {
      return WebpackStore.set(name, (<any>Object).assign({}, defaultData, currentData));
    } else {
      return WebpackStore.set(name, currentData || defaultData);
    }
  }

  static dispose() {
    WebpackStore._states = [];
    WebpackStore._state = {};
  }

  get(prop) {
    return WebpackStore.get(prop);
  }

  set(prop, value) {
    return WebpackStore.set(prop, value);
  }

  select(name, getState) {
    return WebpackStore.select(name, getState);
  }

  dispose() {
    return WebpackStore.dispose();
  }

  getState() {
    let initialState = (<any>Object).assign({}, WebpackStore._state);
    return WebpackStore._states
      .reduce((memo, item) => {
        memo[item.name] = item.getState();
        return memo;
      }, initialState);
  }

  toJSON() {
    return this.getState();
  }
}
