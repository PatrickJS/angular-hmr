import {HmrStore} from './hmr-store';

export interface HotModuleReplacementOptions {
  LOCALSTORAGE_KEY?: string;
  localStorage?: boolean;
  storeToken?: any;
  globalDispose?: string;

  getState?: Function;
  data?: any;
}

export function hotModuleReplacement(bootloader: Function, module: any, options: HotModuleReplacementOptions = {}) {
  if (!module.hot) {
    console.warn('Warning: please use webpack hot flag');
    return document.addEventListener('DOMContentLoaded', () => bootloader());
  }

  HmrStore.dev = true;
  const LOCALSTORAGE_KEY = options.LOCALSTORAGE_KEY || '@@WEBPACK_INITIAL_DATA';
  const LOCAL            = options.localStorage     || false;
  const TOKEN            = options.storeToken       || HmrStore;
  const DISPOSE          = options.globalDispose    || 'WEBPACK_HMR_beforeunload';
  const GET_STATE        = options.getState         || getState;
  let DATA               = options.data             || module.hot.data && module.hot.data.state;
  let COMPONENT_REF = null;
  let disposed = false;

  function getState(appState) {
    const json = appState.toJSON();

    if (LOCAL) {
      console.time('localStorage');
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(appState));
      console.timeEnd('localStorage');
    }
    return json;
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
  console.time('bootstrap');
  if (document.readyState === 'complete') {
    bootloader(DATA)
      .then((cmpRef: any) => COMPONENT_REF = cmpRef)
      .then((cmpRef => (console.timeEnd('bootstrap'), cmpRef)));
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      bootloader(DATA)
        .then((cmpRef: any) => COMPONENT_REF = cmpRef)
        .then((cmpRef => (console.timeEnd('bootstrap'), cmpRef)));
    });
  }



  function beforeunload(event) {
    const injector = COMPONENT_REF.injector;
    let appState;
    if ('getOptional' in injector) {
      appState = COMPONENT_REF.injector.getOptional(TOKEN) || TOKEN;
    } else {
      appState = COMPONENT_REF.injector.get(TOKEN, TOKEN);
    }
    return GET_STATE(appState);
  }
  (<any>window)[DISPOSE] = () => {
    disposed = true;
    window.removeEventListener('beforeunload', beforeunload);
    if (LOCAL) {
      localStorage.removeItem(LOCALSTORAGE_KEY);
    }
  };

  module.hot.accept();

  window.addEventListener('beforeunload', beforeunload);

  module.hot.dispose((data: any) => {
    console.time('dispose');
    const componentNode = COMPONENT_REF.location.nativeElement;
    const newNode = document.createElement(componentNode.tagName);
    // display none
    const currentDisplay = newNode.style.display;
    newNode.style.display = 'none';
    const parentNode = componentNode.parentNode;
    parentNode.insertBefore(newNode, componentNode);

    const injector = COMPONENT_REF.injector;
    let appState;
    if ('getOptional' in injector) {
      appState = COMPONENT_REF.injector.getOptional(TOKEN) || TOKEN;
    } else {
      appState = COMPONENT_REF.injector.get(TOKEN, TOKEN);
    }
    const json = GET_STATE(appState, COMPONENT_REF);

    data.state = json;

    if ('destroy' in COMPONENT_REF) {
      COMPONENT_REF.destroy();
    } else if ('dispose' in COMPONENT_REF) {
      COMPONENT_REF.dispose();
    }

    newNode.style.display = currentDisplay;

    if (!disposed) {
      window.removeEventListener('beforeunload', beforeunload);
    }
    disposed = true;
    console.timeEnd('dispose');
  });
}
