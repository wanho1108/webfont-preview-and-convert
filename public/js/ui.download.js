(function () {

  'use strict';

  const $downloadButton = document.querySelectorAll('.download');
  const $downloadAllButton = document.querySelector('.download-all');

  $downloadButton.forEach(($element) => {
    $element.addEventListener('click', downloadHandler);
  });

  async function downloadHandler(e) {
    const $target = e.target;
    const filename = $target.getAttribute('data-filename');
    console.log(filename);
    const characters = getCharacters();
    console.log(characters);
    await axios.post('/subset', [{ filename, characters }]);
    await axios({
      url: '/download',
      method: 'GET',
      responseType: 'blob'
    })
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'subset.zip');
        document.body.appendChild(link);
        link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    //     const fileURL = window.URL.createObjectURL(new Blob([res.data, { type: res.headers['content-type'] }]));
    //   const fileLink = document.createElement('a');
    //   console.log(res.headers['content-type'], res.data);

    //   fileLink.href = fileURL;
    //   fileLink.setAttribute('download', 'subset.zip');
    //   document.body.appendChild(fileLink);

    //   fileLink.click();
    //   document.body.removeChild(fileLink);
    // window.URL.revokeObjectURL(fileURL);

        // console.log();
        // const filename = res.headers['content-disposition'].split('=')[1];
        // console.log(filename);
        // console.log(window.URL.createObjectURL(res));
        // var fileName = xhr.getResponseHeader('Content-Disposition').split("=")[1]
    // console.log(fileName)
    // var a = document.createElement('a');
    // var url = window.URL.createObjectURL(response);
            // a.href = url;
            // a.download = fileName;
            // a.click();
            // window.URL.revokeObjectURL(url);
        // console.log('download');
      });
    console.log('end');
  }

  $downloadAllButton.addEventListener('click', downloadAllHandler);

  function downloadAllHandler() {

  }

  function getCharacters() {
    const $characters = Array.prototype.filter.call(document.querySelectorAll('.characters'), $element => {
      const elementComputedStyle = window.getComputedStyle($element);
      return elementComputedStyle.display !== 'none' && elementComputedStyle.visibility !== 'hidden';
    });
    return [...new Set($characters[0].value)].join('');
  }
})();