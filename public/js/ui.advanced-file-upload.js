{
  'use strict';

  const $region = document.querySelector('.intro');
  const $form = $region.querySelector('form');
  const $input = $region.querySelector('input[type="file"');

  /*
    * 고급 업로드 지원 여부
​   */
  const isSupport = () => {
    const div = document.createElement('div');
    return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
  }

  if (isSupport === false) throw new Error('advanced file upload를 지원하지 않습니다.');

  /*
    * 파일 업로드
​   */
  const fileUpload = (files) => {
    const formData = new FormData($form);
    const formAction = $form.action;
    const extensionSupportArray = ['ttf', 'woff2', 'woff', 'svg', 'eot'];

    $region.classList.add('is-uploading');

    if (files) {
      for (const file of files) {
        const nameSplit = file.name.split('.');
        const extension = nameSplit[nameSplit.length - 1].toLowerCase();

        if (extensionSupportArray.indexOf(extension) === -1) {
          throw new Error('지원하지 않는 폰트 파일 확장자입니다.');
        }

        formData.append($input.getAttribute('name'), file);
      }
    }

    axios.post(formAction, formData)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  /*
    * 이벤트 핸들러
​   */
  const dragHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const dragEnterHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    $region.classList.add('is-draging');
    document.documentElement.addEventListener('mouseleave', dragLeaveHandler);
  }

  const dragLeaveHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    $region.classList.remove('is-draging');
    document.documentElement.removeEventListener('mouseleave', dragLeaveHandler);
  }

  const dragDropHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    $region.classList.remove('is-draging');
    fileUpload(e.dataTransfer.files);
  }

  /*
   * 이벤트 바인드
​   */
  $region.addEventListener('drag', dragHandler);
  $region.addEventListener('dragstart', dragHandler);
  $region.addEventListener('dragover', dragEnterHandler);
  $region.addEventListener('dragenter', dragEnterHandler);
  $region.addEventListener('drop', dragDropHandler);
}