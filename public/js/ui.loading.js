{
  'use strict';

  function createLoading() {
    return `
      <div class="loading">
        Loading...
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