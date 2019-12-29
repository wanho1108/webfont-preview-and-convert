(function () {
  'use strict';

  function getTestTemplateDOM() {
    // window.history.pushState({ document }, null, name);
    console.log('getTestTemplateDOM');
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/template');
    xhr.send();
    xhr.onreadystatechange = (e) => {
      console.log('onreadystatechange', xhr.readyState);
      console.log(xhr.responseText);
    };
  }

  window.addEventListener('popstate', (e) => {
    console.log('popstate');
  });

  getTestTemplateDOM();

  document.documentElement.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('download')) {
      const fileDownloadURL = `/download/${target.getAttribute('data-path') + target.getAttribute('data-name')}`;
      axios.get(fileDownloadURL)
        .then((res) => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', target.getAttribute('data-name'));
          document.body.appendChild(link);
          link.click();
        });
    }
  });
})();