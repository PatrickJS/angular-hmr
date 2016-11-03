// Hot Module Replacement
export function bootloader(main: any) {
  if (document.readyState === 'complete') {
    main()
  } else {
    document.addEventListener('DOMContentLoaded', main);
  }
}


// create new elements
export function createNewHosts(cmps: any) {
  const components = cmps.map((componentNode: any) => {
    const newNode = document.createElement(componentNode.tagName);
    // display none
    const currentDisplay = newNode.style.display;
    newNode.style.display = 'none';
    const parentNode = componentNode.parentNode;
    parentNode.insertBefore(newNode, componentNode);
    return { currentDisplay, newNode };
  });
  return () => {
    components.forEach((cmp:any) => {
      cmp.newNode.style.display = cmp.currentDisplay;
      cmp.newNode = null;
      cmp.currentDisplay = null;
    });
  }
}


// remove old styles
export function removeNgStyles() {
  Array.prototype.slice.call(document.head.querySelectorAll('style'), 0)
    .filter((style:any) => style.innerText.indexOf('_ng') !== -1)
    .map((el:any) => el.remove());
}

// get input values
export function getInputValues() {
  const inputs = document.querySelectorAll('input');
  return Array.prototype.slice.call(inputs).map((input: any) => input.value);
}

// set input values
export function setInputValues($inputs: any) {
  const inputs = document.querySelectorAll('input');
  if ($inputs && inputs.length === $inputs.length) {
    $inputs.forEach((value: any, i: number) => {
      const el: any = inputs[i];
      el.value = value;
      el.dispatchEvent(new CustomEvent('input', {detail: el.value}));
    });
  }
}

// get/set input values
export function createInputTransfer() {
  const $inputs = getInputValues();
  return function restoreInputValues() {
    setInputValues($inputs);
  }
}
