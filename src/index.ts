import {WebpackState} from './webpack-state';
export * from './webpack-state';


export function hotModuleReplacement(bootloader, module, LOCAL?: boolean, LOCALSTORAGE_KEY: string = '@@WEBPACK_INITIAL_DATA') {
  let COMPONENT_REF = null;
  let DATA = module.hot.data;


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

  function saveState(appState) {
    const json = appState.toJSON();

    if (LOCAL) {
      console.time('localStorage');
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(appState));
      console.timeEnd('localStorage');
    }
    return json;
  }

  function beforeunload(event) {
    const appState = COMPONENT_REF.injector.get(WebpackState);
    return saveState(appState);
  }
  (<any>window).WEBPACK_HMR_beforeunload = () => {
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

    const appState = COMPONENT_REF.injector.get(WebpackState);
    const json = saveState(appState);

    (<any>Object).assign(data, json);

    COMPONENT_REF.dispose();

    newNode.style.display = currentDisplay;

    window.removeEventListener('beforeunload', beforeunload);
    console.timeEnd('dispose');
  });
}
