(function () {
  'use strict';

  /*
   * Drag & Drop Upload 지원 여부
​   */
  const isSupportAdvancedUpload = (() => {
    const div = document.createElement('div');
    return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
  })();

  if (isSupportAdvancedUpload) {
    const $uploadbox = document.querySelector('.uploadbox');

    /*
     * File Upload
  ​   */
    function fileUpload(files) {
      $uploadbox.classList.add('is-uploading');

      const formData = new FormData($uploadbox);

      if (files) {
        for (const file of files) {
          formData.append($uploadbox.querySelector('.uploadbox__input-file').getAttribute('name'), file);
        }
      }

      axios.post('/upload', formData)
        .then(res => {
          console.log(res);
        });
    }

    /*
     * Drag & Drop 이벤트
  ​   */
    function dragHandler(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    function dragEnterHandler(e) {
      e.preventDefault();
      e.stopPropagation();
      $uploadbox.classList.add('is-draging');
      document.documentElement.addEventListener('mouseleave', dragLeaveHandler);
    }

    function dragLeaveHandler(e) {
      e.preventDefault();
      e.stopPropagation();
      $uploadbox.classList.remove('is-draging');
      document.documentElement.removeEventListener('mouseleave', dragLeaveHandler);
    }

    function dragDropHandler(e) {
      e.preventDefault();
      e.stopPropagation();
      $uploadbox.classList.remove('is-draging');
      fileUpload(e.dataTransfer.files);
    }

    $uploadbox.addEventListener('drag', dragHandler);
    $uploadbox.addEventListener('dragstart', dragHandler);
    $uploadbox.addEventListener('dragover', dragEnterHandler);
    $uploadbox.addEventListener('dragenter', dragEnterHandler);
    $uploadbox.addEventListener('drop', dragDropHandler);
  }
})();
