import {HMR_STATE, HmrStore} from './hmr-store';

export * from './webpack-hmr';
export * from './hmr-decorator';
export * from './hmr-store';


export function provideHmrState(initialState = {}): Array<any> {
  return [
    {provide: HMR_STATE, useValue: initialState },
    {provide: HmrStore, useValue: HmrStore}
  ];
}
