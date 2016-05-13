# Angular 2 Hot Module Replacement
> Angular2-HMR


This module requires Angular 2.0.0-rc.1 or higher. Please see repository [Angular 2 Webpack Starter](https://github.com/angularclass/angular2-webpack-starter) for a working example. 

`main.browser.ts`
```typescript
/*
 * Hot Module Reload
 * experimental version by @gdi2290
 */
if (isDevelopment) {
  // activate hot module reload
  let ngHmr = require('angular2-hmr');
  ngHmr.hotModuleReplacement(main, module);
} else {
  // bootstrap when document is ready
  document.addEventListener('DOMContentLoaded', () => main());
}
```
`app.service.ts`
```typescript
import {HmrState} from 'angular2-hmr';

export class AppState {
  // @HmrState() is used by HMR to track the state of any object during a hot module replacement
  @HmrState() _state = { };
}
```

`app.service.ts`
```typescript
import {HmrState} from 'angular2-hmr';
@Component({ /*... /* })
export class App {

  @HmrState() localState = {};
    
}
```
