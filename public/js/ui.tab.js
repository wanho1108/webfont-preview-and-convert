(function () {
  'use strict';

  const $tabs = document.querySelectorAll('.tabs');

  $tabs.forEach(($element) => {
    $element.addEventListener('click', tabsClickHandler);
    $element.addEventListener('keyup', tabsKeyupHandler);
  });

  function tabsClickHandler(e) {
    const $target = e.target;

    if ($target.classList.contains('tabs__navigation-button')) {
      const $sibglins = Array.prototype.filter.call($target.parentNode.childNodes, node => node.nodeName !== '#text');
      const $panels = $target.parentNode.parentNode.querySelectorAll('[role="tabpanel"]');
      $sibglins.forEach(($element, index) => {
        if ($target === $element) {
          $element.setAttribute('aria-selected', true);
          $element.removeAttribute('tabindex');
          $panels[index].removeAttribute('hidden');
          return;
        }
        $element.setAttribute('aria-selected', false);
        $element.setAttribute('tabindex', '-1');
        $panels[index].setAttribute('hidden', true);
      });
    }
  }

  function tabsKeyupHandler(e) {
    const $target = e.target;

    if ($target.classList.contains('tabs__navigation-button')) {
      switch (e.keyCode) {
        case 37 : // 방향키 좌측
          const $previous = $target.previousElementSibling;

          if ($previous) {
            $previous.focus();
            $previous.click();
          }
          break;
        case 39 : // 방향키 우측측
          const $next = $target.nextElementSibling;

          if ($next) {
            $next.focus();
            $next.click();
          }
          break;
      }
    }
  }
})();