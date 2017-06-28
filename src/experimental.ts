// Experimental API below

/**
 * get input values
 *
 * Extended by: Gabriel Schuster <github.com@actra.de>
 * Now gets values of inputs (including "checked" status radios, checkboxes), textareas and selects (including multiselects)
 * Tries to identify the elements as exact as possible, falls back to numeric index when identification fails
 * WIP refactor by: PatrickJS
 */
export function __getInputValues() {
  const _inputs = document.querySelectorAll('input, textarea, select');
  const inputs = Array.prototype.slice.call(_inputs);

  return inputs.map(function(input: any) {
    const inputTagName = input.tagName.toLowerCase();
    const inputType = input.type;
    const inputId = (input.id && typeof input.id === 'string') ? input.id : null;
    const inputName = (input.name && typeof input.name === 'string') ? input.name : null;
    const inputValue = (input.value && typeof input.value === 'string') ? input.value : null;
    const inputChildNodes = input.childNodes;
    const inputSelected = Boolean(input.selected);

    type InputOption = {value: string, selected: boolean};
    type HmrStore = {
      tag: string;
      type: string;
      id: string;
      name: string;
      value: string;
      checked: boolean;
      options: Array<InputOption>;
    };

    let elementStore: HmrStore = {
      'tag': inputTagName,
      'type': null,
      'id': inputId,
      'name': inputName,
      'value': '',
      'checked': false,
      'options': []
    };

    if ('input' === inputTagName || 'textarea' === inputTagName) {
      elementStore['type'] = inputType;

      if ('input' !== inputTagName) {
        elementStore['value'] = inputValue;
        return elementStore;
      }
      switch (inputType) {
        case 'checkbox':
        case 'radio':
          elementStore['checked'] = inputSelected;
          elementStore['value'] = inputValue;
          return elementStore;
        case 'image':
        case 'button':
        case 'submit':
        case 'reset':
        default:
          // These types don't need any config and thus need no update, they only were stored because they match "input"
          return elementStore;
      }
    } else if ('select' === inputTagName) {
      const childNodes = Array.prototype.slice.call(inputChildNodes);

      const options: Array<InputOption> = childNodes.map((option: any, i: number) => {
        return { value: option['value'], selected: Boolean(option['selected']) };
      });

      elementStore['options'] = options;
      return elementStore;
    }

    return elementStore;
  });
}

/**
 * set input values
 *
 * Extended by: Gabriel Schuster <github.com@actra.de>
 * WIP refactor by: PatrickJS
 */
export function __setInputValues($inputs: any) {
  const inputs: any = document.querySelectorAll('input, textarea');

  $inputs.forEach((store: any, i: number) => {

    if ('input' === store.tag || 'textarea' === store.tag) {
      if ('input' === store.tag && ('checkbox' === store.type || 'radio' === store.type)) {
        let selector = 'input' + (
          null !== store.id ? '#' + store.id : ''
        ) + '[type="' + store.type + '"]' + (null !== store.name ? '[name="' + store.name + '"]' : '') +
                       '[value="' + store.value + '"]';
        let element: any  = document.body.querySelector(selector);

        if (element && Boolean(store['checked'])) {
          element['checked'] = 'checked';

          element.dispatchEvent(new CustomEvent('input', {detail: element['checked']}));
        }
      } else if ('input' === store.tagName.toLowerCase() &&
        ('image' === store.type || 'button' === store.type || 'submit' === store.type || 'reset' === store.type)) {
          // These types don't need any config and thus need no update, they only were stored because they match "input"
      } else {
        if (null === store.id && null === store.name) {
          if (store.value.length &&
            inputs[i] &&
            inputs[i].tagName.toLowerCase() === store.tag &&
            ('textarea' === store.tag || inputs[i].getAttribute('type') === store.type) &&
            ('string' !== typeof inputs[i].id || !inputs[i].id.length) &&
            ('string' !== typeof inputs[i].getAttribute('name') ||
            !inputs[i].getAttribute('name').length)) {

              inputs[i]['value'] = store.value;
              inputs[i].dispatchEvent(new CustomEvent('input', {detail: inputs[i]['value']}));
          }
        } else {
          let selector = 'input' +
            (null !== store.id ? '#' + store.id : '') + ('input' === store.tag ? '[type="' + store.type + '"]' : '') +
            (null !== store.name ? '[name="' + store.name + '"]' : '');
          let element: any  = document.body.querySelector(selector);

          if (element && store.value.length) {
            element['value'] = store.value;
            element.dispatchEvent(new CustomEvent('input', {detail: element['value']}));
          }
        }
      }
  } else if ('select' === store.tag) {
      let select: any = null;

      if (null === store.id && null === store.name) {
        if (inputs[i] && inputs[i].tagName.toLowerCase() === store.tag && ('string' !== typeof inputs[i].id || !inputs[i].id.length) &&
           ('string' !== typeof inputs[i].getAttribute('name') || !inputs[i].getAttribute('name').length)) {
            select = inputs[i];
        }
      } else {
        let selector = 'select' + (null !== store.id ? '#' + store.id : '') + (null !== store.name ? '[name="' + store.name + '"]' : '');
        let element: any  = document.body.querySelector(selector);
        if (element) {
          select = element;
        }
      }

      if (select) {
        store.options.forEach((storedOption: any, j: number) => {
          let option: any = select.querySelector('option[value="' + storedOption.value + '"]');

          if (
            !option &&
            select.childNodes[j] &&
            ('string' !== typeof select.childNodes[j]['value'] || !select.childNodes[j]['value'].length)
          ) {
            option = select.childNodes[j];
          }
          if (option && !!storedOption.selected) {
            option['selected'] = 'selected';

            option.dispatchEvent(new CustomEvent('input', {detail: option['selected']}));
          }
        });
      }
    }
  });
}

export function __createInputTransfer() {
  const $inputs = __getInputValues();
  return function restoreInputValues() {
    return __setInputValues($inputs);
  };
}
