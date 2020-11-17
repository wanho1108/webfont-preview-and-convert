{
  'use strict';

  // Todo loading 마크업 개선하기
  function createLoading() {
    return `
      <div class="loading" aria-label="Loading">
        <svg class="loading__spinner" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
           <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
        </svg>
      </div>
    `;
  }

  function showLoading() {
    if (!document.querySelector('.loading')) {
      document.querySelector('.wrapper').insertAdjacentHTML('beforeend', createLoading());
    }
  }

  function hideLoading() {
    if (document.querySelector('.loading')) {
      document.querySelector('.loading').remove();
    }
  }

  window.showLoading = showLoading;
  window.hideLoading = hideLoading;
}