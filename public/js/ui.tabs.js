(function () {
  'use strict';

  const $tabs = document.querySelectorAll('.tabs');

  $tabs.forEach(($element) => {
    $element.addEventListener('click', tabsClickHandler);
    $element.addEventListener('keyup', tabsKeyupHandler);
  });

  function tabsBarAnimation($tabs, index) {
    const $tabsButtonActive = $tabs.querySelectorAll('[role="tab"]')[index];
    const $bar = $tabs.querySelector('.tabs__header-bar');
    const { offsetLeft: elementOffsetLeft, clientWidth: elementWidth } = $tabsButtonActive;
    const barWidth = $bar.clientWidth;
    const taretLeft = elementOffsetLeft + (elementWidth - barWidth) / 2;

    $bar.style.left = `${taretLeft}px`;
  }

  function tabsClickHandler(e) {
    const $target = e.target;

    if ($target.getAttribute('role') === 'tab') {
      const $tabs = getParentElement($target, element => element.classList.contains('tabs'));
      const $sibglins = $tabs.querySelectorAll('[role="tab"]');
      const $panels = $tabs.querySelectorAll('[role="tabpanel"]');

      $sibglins.forEach(($element, index) => {
        if ($target === $element) {
          $element.setAttribute('aria-selected', true);
          $element.removeAttribute('tabindex');
          $panels[index].setAttribute('aria-hidden', false);
          $panels[index].removeAttribute('hidden');
          tabsBarAnimation($tabs, index);
          return;
        }

        $element.setAttribute('aria-selected', false);
        $element.setAttribute('tabindex', '-1');
        $panels[index].setAttribute('aria-hidden', true);
        $panels[index].setAttribute('hidden', true);
      });
    }
  }

  function tabsKeyupHandler(e) {
    const $target = e.target;

    if ($target.getAttribute('role') === 'tab') {
      switch (e.keyCode) {
        case 37 : // 방향키 좌측
          const $previous = $target.previousElementSibling;

          if ($previous) {
            $previous.focus();
            $previous.click();
          }
          break;
        case 39 : // 방향키 우측
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