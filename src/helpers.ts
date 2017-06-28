// Hot Module Replacement
function identity(val?: any) {
  return val;
}

export function bootloader(main: any, before?: any, after?: any): void {
  if (typeof main === 'object') {
    const _main = main.main;
    before = main.before;
    after = main.after;
    main = _main;
  }
  before = before || identity;
  after  = after  || identity;
  const readyState = document.readyState;
  function __domReadyHandler() {
    document.removeEventListener('DOMContentLoaded', __domReadyHandler);
    after(main(before(readyState)));
  }
  switch (readyState) {
    case 'loading':
      document.addEventListener('DOMContentLoaded', __domReadyHandler);
      break;
    case 'interactive':
    case 'complete':
    default:
      after(main(before(readyState)));
  }
}

// create new host elements and remove the old elements
export function createNewHosts(cmps: any) {
  const components = Array.prototype.map.call(cmps, function(componentNode: any) {
    const newNode = document.createElement(componentNode.tagName);
    const parentNode = componentNode.parentNode;
    const currentDisplay = newNode.style.display;

    newNode.style.display = 'none';
    parentNode.insertBefore(newNode, componentNode);

    function removeOldHost() {
      newNode.style.display = currentDisplay;
      try {
        parentNode.removeChild(componentNode);
      } catch (e) {}
    }

    return removeOldHost;
  });
  return function removeOldHosts() {
    components.forEach((removeOldHost: any) => removeOldHost());
  };
}

// remove old styles
export function removeNgStyles() {
    const docHead = document.head;
    const _styles = docHead.querySelectorAll('style');
    const styles = Array.prototype.slice.call(_styles);
    styles
      .filter((style: any) => style.innerText.indexOf('_ng') !== -1)
      .map((el: any) => docHead.removeChild(el));
}

// get input values
export function getInputValues() {
  const _inputs = document.querySelectorAll('input');
  const inputs = Array.prototype.slice.call(_inputs);
  return inputs.map((input: any) => input.value);
}

// set input values
export function setInputValues(_inputs: any) {
  const inputs = document.querySelectorAll('input');
  if (_inputs && inputs.length === _inputs.length) {
    _inputs.forEach((value: any, i: number) => {
      const el: any = inputs[i];
      el.value = value;
      el.dispatchEvent(new CustomEvent('input', {detail: el.value}));
    });
    // clear array
    _inputs.length = 0;
  }
}

// get/set input values
export function createInputTransfer() {
  const _inputs = getInputValues();
  return function restoreInputValues() {
    return setInputValues(_inputs);
  };
}
