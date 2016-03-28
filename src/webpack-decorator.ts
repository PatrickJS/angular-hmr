import {WebpackStore} from './webpack-store';

export function WebpackState(namespaceOrConfig?: string | any, config?: any): Function {
  function decoratorFactory(target: Object, decoratedPropertyName?: string, descriptor?: any): void {
    WebpackStore.select(target, () => this[decoratedPropertyName]);
    Object.defineProperty(target, decoratedPropertyName, {
      get: function () {
        return WebpackStore.get(target);
      },
      set: function (newValue) {
        return WebpackStore.set(target, newValue);
      },
      enumerable: true,
      configurable: true
    });
    return descriptor;
  }

  return decoratorFactory;
}
