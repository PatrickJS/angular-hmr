import {HmrStore} from './hmr-store';

// noop in parentNode
// TODO: find a better way to noop
const _env = typeof process !== 'undefined' &&
  process &&
  process.env &&
  (process.env.ENV ||
  process.env.NODE_ENV);

let _dev: boolean = ((
    _env &&
    typeof _env === 'string' &&
    (_env.indexOf('dev') > -1)
  ) || // default true
    _env === undefined);

export function setDev(newDev: string | boolean): boolean | void {
  if (typeof newDev === 'string') {
    return _dev = (newDev.indexOf('dev') > -1);
  } else if (typeof newDev === 'boolean') {
    return _dev = newDev;
  }
  throw new Error('Please provide a string or boolean');
}

export function HmrState(namespaceOrConfig?: string | any, config?: any): Function {

  function decoratorFactory(target: any, decoratedPropertyName?: string, descriptor?: any): void {
    if (!_dev) { return descriptor; }

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
