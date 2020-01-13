{
  'use strict';

  window.addEventListener('mousemove', cursorHandler);

  function cursorHandler(e) {
    const $cursor = document.querySelector('.cursor');
    const $dots = document.querySelectorAll('.cursor__dot');

    const { clientX, clientY } = e;
    const { innerWidth: windowWidth, innerHeight: windowHeight} = window;
    const margin = 30;

    if ($cursor.classList.contains('is-active') === false) {
      $cursor.classList.add('is-active');
    }

    if (clientX < margin || clientX > windowWidth - margin || clientY < margin || clientY > windowHeight - margin) {
      $cursor.classList.remove('is-active');
    }

    $dots.forEach((element, index) => {
      const time = (index + 1) / $dots.length / 7.5;
      const dotWidth = element.clientWidth;
      const dotHeight = element.clientHeight
      const x = clientX - (dotWidth / 2);
      const y = clientY - (dotHeight / 2);

      TweenLite.to(element, time, { ease: Power1.easeOut, x, y });
    });
  }
}