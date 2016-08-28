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


function has(content, str) {
  return content.indexOf(str) !== -1;
}

export function hasNgId(content, id) {
  var ngHost    = '_nghost-'+ id;
  var ngContent = '_ngcontent-'+ id;
  return has(content, ngHost) && has(content, ngContent)
}

// remove old styles
export function removeNgStyles(appId, filter) {
  if (appId) {
    filter = filter || hasNgId(appId);
  }
  var $styles = Array.prototype.slice.call(document.head.querySelectorAll('style'));
    .filter((style) => filter(style.innerText, appId))
    .map(el => el.remove());
}
