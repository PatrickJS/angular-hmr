import {Provider} from 'angular2/core';
import {WEBPACK_HMR, WebpackStore} from './webpack-store';

export * from './hmr';
export * from './webpack-decorator';
export * from './webpack-store';


export function provideInitialState(initialState = {}): Array<Provider> {
  return [
    new Provider(WEBPACK_HMR, {useValue: initialState }),
    new Provider(WebpackStore, {useClass: WebpackStore})
  ];
}
