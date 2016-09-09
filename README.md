<p align="center">
  <a href="http://courses.angularclass.com/courses/angular-2-fundamentals" target="_blank">
    <img width="438" alt="Angular 2 Fundamentals" src="https://cloud.githubusercontent.com/assets/1016365/17200649/085798c6-543c-11e6-8ad0-2484f0641624.png">
  </a>
</p>

---


# Angular 2 Hot Module Replacement
> Angular2-HMR

`npm install @angularclass/hmr @angularclass/hmr-loader`

This module requires Angular 2.0.0-rc.5 or higher. Please see repository [Angular 2 Seed](https://github.com/angularclass/angular2-seed) for a working example. 

also download https://github.com/AngularClass/angular2-hmr-loader
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
    if (!store) return;
    console.log('HMR store', store);
    console.log('store.OHHAI:', store.OHHAI)
    // inject AppStore here and update it
    // this.AppStore.update(store)
  }
  hmrOnDestroy(store) {
    var cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation)
    // inject your AppStore and grab state then set it on store
    // var appState = this.AppStore.get()
    store.OHHAI = 'yolo'
    // Object.assign(store, appState)
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
  return platformBrowserDynamic().bootstrapModule(MainModule);
}

// boot on document ready
bootloader(main);

```
`bootloader` is only needed to detech that the dom is ready before bootstraping otherwise bootstrap. This is needed because that dom is already ready during reloading

## Important Helpers
* removeNgStyles
* createNewHosts and disposeOldHosts
* bootloader

## Production
In production you only need bootloader which just does this
```typescript
export function bootloader(main) {
  if (document.readyState === 'complete') {
    main()
  } else {
    document.addEventListener('DOMContentLoaded', main);
  }
}
```
you would bootstrap your app the normal way, in production, afer dom is ready. Also, in production, you should remove the loader
```es6
        {
          test: /\.ts$/,
          loaders: [
            'awesome-typescript-loader',
          ].concat(prod ? [] : '@angularclass/hmr-loader')
        },
```

___

enjoy — **AngularClass**

<br><br>

[![AngularClass](https://cloud.githubusercontent.com/assets/1016365/9863770/cb0620fc-5af7-11e5-89df-d4b0b2cdfc43.png  "Angular Class")](https://angularclass.com)
##[AngularClass](https://angularclass.com)
> Learn AngularJS, Angular 2, and Modern Web Development from the best.
> Looking for corporate Angular training, want to host us, or Angular consulting? patrick@angularclass.com
