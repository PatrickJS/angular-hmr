export interface HotModuleReplacementOptions {
  LOCALSTORAGE_KEY?: string;
  localStorage?: boolean;
  storeToken?: any;
  globalDispose?: string;
  saveState?: Function;
  assignState?: Function;
  data?: any;
}

export interface Store {
  getState(): any;
  importState(state: any): void;
}
