import {HmrStore} from './hmr-store';

export function HmrState(namespaceOrConfig?: string | any, config?: any): Function {
  function decoratorFactory(target: any, decoratedPropertyName?: string, descriptor?: any): void {
    let key = namespaceOrConfig || target.constructor.name + '#' + decoratedPropertyName;
    HmrStore.select(key, () => HmrStore.get(key));

    Object.defineProperty(target, decoratedPropertyName, {
      get: () => HmrStore.get(key),
      set: (newValue?: any) => {

        let currentValue = HmrStore.get(key);
        if (!currentValue) {
          HmrStore._initialValues[key] = newValue;
        } else {
          newValue = Object.assign(newValue, currentValue);
        }
        return HmrStore.set(key, newValue);

      },
      enumerable: true,
      configurable: true
    });
    return descriptor;
  }

  return decoratorFactory;
}
