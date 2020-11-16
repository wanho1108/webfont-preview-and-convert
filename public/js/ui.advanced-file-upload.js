{
  'use strict';

  const $intro = document.querySelector('.intro');
  const $input = $intro.querySelector('.intro__form-input-file');
  const $button = $intro.querySelector('.intro__button');

  /*
   * 고급 업로드 지원 여부
   */
  const isSupport = () => {
    const div = document.createElement('div');
    return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
  }

  if (isSupport === false) throw new Error('advanced file upload를 지원하지 않습니다.');

  /*
   * 파일 업로드
   */
  const fileUpload = (files = false) => {
    const $form = $intro.querySelector('.intro__form');
    const formData = new FormData($form);
    const formAction = $form.action;
    const extensionSupportArray = ['ttf'];

    $intro.classList.add('is-uploading');
    showLoading();

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
      .then(res => {
        $input.value = '';
        $intro.classList.remove('is-uploading');
        hideLoading();
        location.href ='/glyphs';
      })
      .catch(error => {
        throw new Error(error);
      });
  }

  /*
   * 이벤트 핸들러
   */
  const dragHandler = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  const dragEnterHandler = e => {
    e.preventDefault();
    e.stopPropagation();
    $intro.classList.add('is-draging');
    document.documentElement.addEventListener('mouseleave', dragLeaveHandler);
  };

  const dragLeaveHandler = e => {
    e.preventDefault();
    e.stopPropagation();
    $intro.classList.remove('is-draging');
    document.documentElement.removeEventListener('mouseleave', dragLeaveHandler);
  };

  const dragDropHandler = e => {
    e.preventDefault();
    e.stopPropagation();
    $intro.classList.remove('is-draging');
    fileUpload(e.dataTransfer.files);
  };

  const inputChangeHandler = e => {
    if (e.target.files.length) {
      fileUpload();
    }
  };

  const buttonClickHandler = e => {
    e.preventDefault();
    $input.click();
  };

  /*
   * 이벤트 바인드
   */
  $intro.addEventListener('drag', dragHandler);
  $intro.addEventListener('dragstart', dragHandler);
  $intro.addEventListener('dragover', dragEnterHandler);
  $intro.addEventListener('dragenter', dragEnterHandler);
  $intro.addEventListener('drop', dragDropHandler);
  $input.addEventListener('change', inputChangeHandler);
  $button.addEventListener('click', buttonClickHandler);
}