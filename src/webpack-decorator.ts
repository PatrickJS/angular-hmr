import {WebpackStore} from './webpack-store';

export function WebpackState(namespaceOrConfig?: string | any, config?: any): Function {
  function decoratorFactory(target: Object, decoratedPropertyName?: string, descriptor?: any): void {
    WebpackStore.select(target, () => this[decoratedPropertyName]);
    return descriptor;
  }

  return decoratorFactory;
}
