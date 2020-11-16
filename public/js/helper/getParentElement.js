{
  'use strict';

  function getParentElement(currentElement, conditionFunction) {
    let element = currentElement;

    while (conditionFunction(element) === false) {
      element = element.parentElement;
      if (element === null) break;
    }

    return element;
  }

  window.getParentElement = getParentElement;

}