// Hot Module Replacement
export function bootloader(main) {
  if (document.readyState === 'complete') {
    main()
  } else {
    document.addEventListener('DOMContentLoaded', main);
  }
}


// create new elements
export function createNewHosts(cmps) {
  var components = cmps.map(componentNode => {
    const newNode = document.createElement(componentNode.tagName);
    // display none
    const currentDisplay = newNode.style.display;
    newNode.style.display = 'none';
    const parentNode = componentNode.parentNode;
    parentNode.insertBefore(newNode, componentNode);
    return { currentDisplay, newNode };
  });
  return () => {
    components.forEach(cmp => {
      cmp.newNode.style.display = cmp.currentDisplay;
      cmp.newNode = null;
      cmp.currentDisplay = null;
    });
    components = null;
  }
}


// remove old styles
export function removeNgStyles() {
  Array.prototype.slice.call(document.head.querySelectorAll('style'), 0)
    .filter((style) => style.innerText.indexOf('_ng') !== -1)
    .map(el => el.remove());
}

// get input values
export function getInputValues() {
  var inputs = document.querySelectorAll('input');
  return Array.prototype.slice.slice.call(inputs).map(input => input.value);
}

// set input values
export function setInputValues($inputs) {
  var inputs = document.querySelectorAll('input');
  if ($inputs && inputs.length === $inputs.length) {
    $inputs.forEach(function(value, i) {
      var el = inputs[i];
      el.value = value;
      el.dispatchEvent(new CustomEvent('input', {detail: el.value}));
    });
  }
}
