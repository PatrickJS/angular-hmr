import {Provider, OpaqueToken, Optional, Inject} from 'angular2/core';
import {Store} from './interfaces';

export const WEBPACK_HMR = new OpaqueToken('$$AppState');

export class WebpackState implements Store {
  private _state = {};
  private _noop = Function.prototype;
  private _states = [];

  constructor(@Optional() @Inject(WEBPACK_HMR) state?: any) {
    this.importState(state);
  }

  set(prop, value) {
    this._state[prop] = value;
    return this._state[prop];
  }

  get(prop) {
    return this._state[prop];
  }

  select(name, getState) {
    this._states.push({ name, getState });
    return this.set(name, this.get(name) || getState());
  }

  dispose() {
    this._states = [];
  }

  getState() {
    let initialState = (<any>Object).assign({}, this._state);
    return this._states
      .reduce((memo, item) => {
        memo[item.name] = item.getState();
        return memo;
      }, initialState);
  }

  importState(state?: any) {
    if (state) {
      console.log('WebpackState initial data', state)
    }

    this._state = state || this._state;
  }

  toJSON() {
    return this.getState();
  }
}

export function provideInitialState(initialState = {}): Array<Provider> {
  return [
    new Provider(WEBPACK_HMR, {useValue: initialState }),
    new Provider(WebpackState, {useClass: WebpackState})
  ];
}
