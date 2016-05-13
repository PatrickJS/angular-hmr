
export class OpaqueToken {
  constructor(private _desc: string) {}

  toString(): string { return `Token ${this._desc}`; }
}

export const HMR_STATE = new OpaqueToken('hmrState');

export class HmrStore {
  static dev = false;
  static _state = {};
  static _initialValues = {};
  static _states = [];

  static set(prop, value) {
    HmrStore._state[prop] = value;
    return HmrStore._state[prop];
  }

  static get(prop) {
    return HmrStore._state[prop];
  }

  static select(name, getState) {
    HmrStore._states.push({ name, getState });
    let defaultData = getState();
    let currentData = HmrStore.get(name);

    if (defaultData && !currentData) {
      return HmrStore.set(name, defaultData);
    } else if (defaultData && currentData) {
      return HmrStore.set(name, (<any>Object).assign({}, defaultData, currentData));
    } else {
      return HmrStore.set(name, currentData || defaultData);
    }
  }

  static dispose() {
    HmrStore._states = [];
    HmrStore._state = {};
    HmrStore._initialValues = {};
  }

  static getState() {
    let initialState = (<any>Object).assign({}, HmrStore._state);
    return HmrStore._states
      .reduce((memo, item) => {
        memo[item.name] = item.getState();
        return memo;
      }, initialState);
  }
  static toJSON() {
    return HmrStore.getState();
  }
}
