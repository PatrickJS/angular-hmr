// Hot Module Replacement
export function bootloader(main: any) {
  switch (document.readyState) {
    case 'loading':
      document.addEventListener('DOMContentLoaded', () => main());
      break;
    case 'interactive':
    case 'complete':
    default:
      main();
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

/**
 * get input values
 * 
 * Extended by: Gabriel Schuster <github.com@actra.de>
 * Now gets values of inputs (including "checked" status radios, checkboxes), textareas and selects (including multiselects)
 * Tries to identify the elements as exact as possible, falls back to numeric index when identification fails
 */
export function getInputValues() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    return Array.prototype.slice.call(inputs).map((input: any) => {
        let store:
            {
                tag:     string,
                'type':  string,
                id:      string,
                name:    string,
                value:   string,
                checked: boolean,
                options: {value: string, selected: boolean}[]
            }
            =
            {
                tag:     input.tagName.toLowerCase(),
                'type':  null,
                id:      'string' === typeof input.id && input.id.length ? input.id : null,
                name:    'string' === typeof input.name && input.name.length ? input.name : null,
                value:   '',
                checked: false,
                options: []
            };
        
        if('input' === input.tagName.toLowerCase() || 'textarea' === input.tagName.toLowerCase()) {
            Object.assign(store, {'type': input.type});
            
            if('input' === input.tagName.toLowerCase() && ('checkbox' === input.type || 'radio' === input.type)) {
                return Object.assign(store, {value: input.value, checked: !!input.checked});
            }
            else if('input' === input.tagName.toLowerCase() && ('image' === input.type || 'button' === input.type || 'submit' === input.type || 'reset' === input.type)) {
                // These types don't need any config and won't be set later but they match "input"
                
                return store;
            }
            else {
                return Object.assign(store, {value: input.value});
            }
        }
        else if('select' === input.tagName.toLowerCase()) {
            let options: {value: string, selected: boolean}[] = [];
            
            input.childNodes.forEach((option: any, i: number) => {
                options.push({
                    value:    'string' === typeof option['value'] && option['value'].length ? option['value'] : null,
                    selected: !!option['selected']
                });
            });
            
            return Object.assign(store, {options: options});
        }
        
        return store;
    });
}

/**
 * set input values
 * 
 * Extended by: Gabriel Schuster <github.com@actra.de>
 */
export function setInputValues($inputs: any) {
    const inputs = document.querySelectorAll('input, textarea');
    
    $inputs.forEach((store: any, i: number) => {
        if('input' === store.tag || 'textarea' === store.tag) {
            if('input' === store.tag && ('checkbox' === store.type || 'radio' === store.type)) {
                let selector = 'input' + (null !== store.id ? '#' + store.id : '') + '[type="' + store.type + '"]' + (null !== store.name ? '[name="' + store.name + '"]' : '') +
                               '[value="' + store.value + '"]';
                let element  = document.body.querySelector(selector);
                
                if(element && !!store.checked) {
                    element['checked'] = 'checked';
                    
                    element.dispatchEvent(new CustomEvent('input', {detail: element['checked']}));
                }
            }
            else if('input' === store.tagName.toLowerCase() && ('image' === store.type || 'button' === store.type || 'submit' === store.type || 'reset' === store.type)) {
                // These types don't need any config and thus need no update, they only were stored because they match "input"
            }
            else {
                if(null === store.id && null === store.name) {
                    if(store.value.length && inputs[i] && inputs[i].tagName.toLowerCase() === store.tag && ('textarea' === store.tag || inputs[i].getAttribute('type') === store.type) &&
                       ('string' !== typeof inputs[i].id || !inputs[i].id.length) && ('string' !== typeof inputs[i].getAttribute('name') || !inputs[i].getAttribute('name').length)) {
                        inputs[i]['value'] = store.value;
                        
                        inputs[i].dispatchEvent(new CustomEvent('input', {detail: inputs[i]['value']}));
                    }
                }
                else {
                    let selector = 'input' + (null !== store.id ? '#' + store.id : '') + ('input' === store.tag ? '[type="' + store.type + '"]' : '') +
                                   (null !== store.name ? '[name="' + store.name + '"]' : '');
                    let element  = document.body.querySelector(selector);
                    
                    if(element && store.value.length) {
                        element['value'] = store.value;
                        
                        element.dispatchEvent(new CustomEvent('input', {detail: element['value']}));
                    }
                }
            }
        }
        else if('select' === store.tag) {
            let select: any = null;
            
            if(null === store.id && null === store.name) {
                if(inputs[i] && inputs[i].tagName.toLowerCase() === store.tag && ('string' !== typeof inputs[i].id || !inputs[i].id.length) &&
                   ('string' !== typeof inputs[i].getAttribute('name') || !inputs[i].getAttribute('name').length)) {
                    select = inputs[i];
                }
            }
            else {
                let selector = 'select' + (null !== store.id ? '#' + store.id : '') + (null !== store.name ? '[name="' + store.name + '"]' : '');
                let element  = document.body.querySelector(selector);
                if(element) {
                    select = element;
                }
            }
            
            if(select) {
                store.options.forEach((storedOption: any, j: number) => {
                    let option: any = select.querySelector('option[value="' + storedOption.value + '"]');
                    
                    if(!option && select.childNodes[j] && ('string' !== typeof select.childNodes[j]['value'] || !select.childNodes[j]['value'].length)) {
                        option = select.childNodes[j];
                    }
                    if(option && !!storedOption.selected) {
                        option['selected'] = 'selected';
                        
                        option.dispatchEvent(new CustomEvent('input', {detail: option['selected']}));
                    }
                });
            }
        }
    });
}

// get/set input values
export function createInputTransfer() {
    const $inputs = getInputValues();
    return function restoreInputValues() {
        setInputValues($inputs);
    }
}
