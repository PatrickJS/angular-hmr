import { ComponentRef } from 'angular2/core';
import {WebpackState} from './webpack-state';
import {HotModuleReplacementOptions, Store} from './interfaces';

export * from './webpack-state';

export function hotModuleReplacement(bootloader: Function, module: any, options: HotModuleReplacementOptions = {}) {
  const LOCALSTORAGE_KEY = options.LOCALSTORAGE_KEY || '@@WEBPACK_INITIAL_DATA';
  const LOCAL = options.localStorage || false;
  const TOKEN = options.storeToken || WebpackState;
  const DISPOSE = options.globalDispose || 'WEBPACK_HMR_beforeunload';
  const SAVE_STATE = options.saveState || saveState;
  const ASSIGN = options.assignState || (<any>Object).assign;
  let DATA = options.data || module.hot.data;


  let COMPONENT_REF: ComponentRef = null;

  function saveState(store: Store) {
    const state = store.getState();

    if (LOCAL) {
      console.time('localStorage');
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(state));
      console.timeEnd('localStorage');
    }
    return state;
  }

  function importState(store: Store, state: any) {
    store.importState(DATA);
  }

  console.log('DATA', DATA);
  if (!DATA && LOCAL) {
    try {
      console.time('start localStorage');
      DATA = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || DATA;
      console.timeEnd('start localStorage');
    } catch (e) {
      console.log('JSON.parse Error', e);
    }
  }


  function bootstrap() {
    bootloader()
      .then((cmpRef: ComponentRef) => {
        COMPONENT_REF = cmpRef;
        importState(cmpRef.injector.get(TOKEN), DATA);
      })
      .then((cmpRef => (console.timeEnd('bootstrap'), cmpRef)));
  }


  console.time('bootstrap');
  if (document.readyState === 'complete') {
    bootstrap();
  } else {
    document.addEventListener('DOMContentLoaded', bootstrap);
  }



  function beforeunload(event) {
    const appState = COMPONENT_REF.injector.get(TOKEN);
    return SAVE_STATE(appState);
  }
  (<any>window)[DISPOSE] = () => {
    window.removeEventListener('beforeunload', beforeunload);
    if (LOCAL) {
      localStorage.removeItem(LOCALSTORAGE_KEY);
    }
  };

  module.hot.accept();

  window.addEventListener('beforeunload', beforeunload);

  module.hot.dispose(data => {
    console.time('dispose');
    const componentNode = COMPONENT_REF.location.nativeElement;
    const newNode = document.createElement(componentNode.tagName);
    // display none
    const currentDisplay = newNode.style.display;
    newNode.style.display = 'none';
    const parentNode = componentNode.parentNode;
    parentNode.insertBefore(newNode, componentNode);

    const appState = COMPONENT_REF.injector.get(TOKEN);
    const json = SAVE_STATE(appState);

    ASSIGN(data, json);

    COMPONENT_REF.dispose();

    newNode.style.display = currentDisplay;

    window.removeEventListener('beforeunload', beforeunload);
    console.timeEnd('dispose');
  });
}
