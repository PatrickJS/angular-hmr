<p align="center">
  <a href="http://courses.angularclass.com/courses/angular-2-fundamentals" target="_blank">
    <img width="438" alt="Angular 2 Fundamentals" src="https://cloud.githubusercontent.com/assets/1016365/17200649/085798c6-543c-11e6-8ad0-2484f0641624.png">
  </a>
</p>

---

<p align="center">
  <a href="http://angularclass.com" target="_blank">
    <img src="https://cloud.githubusercontent.com/assets/1016365/26220655/77e69902-3be1-11e7-8305-87471affe598.png" alt="Angular HMR" width="500" height="320"/>
  </a>
</p>


# Angular Hot Module Replacement
> Angular-HMR
Hot Module Reloading for Webpack 2 and Angular 4. All versions of Angular will work with this module

`npm install @angularclass/hmr @angularclass/hmr-loader`

Please see repository [AngularClass/angular-seed](https://github.com/AngularClass/angular-seed) for a working example.  
Also download [AngularClass/angular-hmr-loader](https://github.com/AngularClass/angular-hmr-loader)

![hmr-state-dom](https://cloud.githubusercontent.com/assets/1016365/18380378/e573320e-762b-11e6-99e0-cc110ffacc6a.gif)

`main.browser.ts`
```typescript
import { removeNgStyles, createNewHosts, bootloader } from '@angularclass/hmr';

@NgModule({
  bootstrap: [ App ],
  declarations: [ App ],
  imports: [
    // Angular 2
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([], {
      useHash: true
    }),
    // app
    appModule
    // vendors
  ],
  providers: []
})
class MainModule {
  constructor(public appRef: ApplicationRef) {}
  hmrOnInit(store) {
    if (!store || !store.state) return;
    console.log('HMR store', store);
    console.log('store.state.data:', store.state.data)
    // inject AppStore here and update it
    // this.AppStore.update(store.state)
    if ('restoreInputValues' in store) {
      store.restoreInputValues();
    }
    // change detection
    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }
  hmrOnDestroy(store) {
    var cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation)
    // inject your AppStore and grab state then set it on store
    // var appState = this.AppStore.get()
    store.state = {data: 'yolo'};
    // store.state = Object.assign({}, appState)
    // save input values
    store.restoreInputValues  = createInputTransfer();
    // remove styles
    removeNgStyles();
  }
  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts()
    delete store.disposeOldHosts;
    // anything you need done the component is removed
  }
}

export function main() {
  return platformBrowserDynamic().bootstrapModule(MainModule)
    // use `hmrModule` or the "@angularclass/hmr-loader"
    .then((ngModuleRef: any) => {
      // `module` global ref for webpackhmr
      // Don't run this in Prod
      return hmrModule(ngModuleRef, module);
    });
}

// boot on document ready
bootloader(main);

```
`bootloader` is only needed to detect that the dom is ready before bootstraping otherwise bootstrap. This is needed because that dom is already ready during reloading.

## Important Helpers
* **removeNgStyles**: remove angular styles
* **createNewHosts and disposeOldHosts**: recreate root elements for bootstrapping
* **bootloader**: boot on document ready or boot if it's already ready
* **createInputTransfer** and **restoreInputValues**: transfer input DOM state during replacement

## Production
In production you only need bootloader which just does this:
```typescript
export function bootloader(main) {
  if (document.readyState === 'complete') {
    main()
  } else {
    document.addEventListener('DOMContentLoaded', main);
  }
}
```
You would bootstrap your app the normal way, in production, after dom is ready. Also, in production, you should remove the loader:
```es6
        {
          test: /\.ts$/,
          loaders: [
            'awesome-typescript-loader',
          ].concat(prod ? [] : '@angularclass/hmr-loader')
        },
```

___

## @NGRX/platform (NGRX 4.x.x)
To hook into NGRX 4 you simply need to supply a reducer to set the state, and include it in your development metaReducers.
```typescript
function stateSetter(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state: any, action: any) {
    if (action.type === 'SET_ROOT_STATE') {
      return action.payload;
    }
    return reducer(state, action);
  };
}
```
In your root reducer you can do something like this to include it in your `metaReducers`.
You should access your environment here and only include this in development.
```typescript
/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
export const metaReducers: ActionReducer<any, any>[] = [stateSetter]
```
Simply supply the metaReducer to the `StoreModule` and your're hmr is hooked in.
```typescript
 StoreModule.forRoot(reducers, { metaReducers }),
```



enjoy — **AngularClass**

<br><br>

[![AngularClass](https://cloud.githubusercontent.com/assets/1016365/9863770/cb0620fc-5af7-11e5-89df-d4b0b2cdfc43.png  "Angular Class")](https://angularclass.com)
##[AngularClass](https://angularclass.com)
> Learn AngularJS, Angular 2, and Modern Web Development from the best.
> Looking for corporate Angular training, want to host us, or Angular consulting? patrick@angularclass.com
