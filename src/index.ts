import {Provider} from 'angular2/core';
import {HMR_STATE, HmrStore} from './hmr-store';

export * from './webpack-hmr';
export * from './hmr-decorator';
export * from './hmr-store';


export function provideHmrState(initialState = {}): Array<Provider> {
  return [
    new Provider(HMR_STATE, {useValue: initialState }),
    new Provider(HmrStore, {useValue: HmrStore})
  ];
}
