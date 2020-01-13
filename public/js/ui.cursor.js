{
  'use strict';

  window.addEventListener('mousemove', cursorHandler);

  function cursorHandler(e) {
    const cursorDots = document.querySelectorAll('.cursor__dot');
    const clientPositionX = e.clientX;
    const clientPositionY = e.clientY;
    const baseCursorSize = 20;
    const dotsNumber = 5;
    cursorDots.forEach(function (t, s) {
      TweenLite.to(t, (s + 1) / dotsNumber / 7.5, {
        ease: Power1.easeOut,
        x: clientPositionX - baseCursorSize / 2,
        y: clientPositionY - baseCursorSize / 2
      })
    });
  }
}