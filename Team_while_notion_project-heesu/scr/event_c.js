import api from './api.js'; // api.js의 함수 가져오기

// DOM 요소 가져오기
document.addEventListener('DOMContentLoaded', async () => {
  const titleBox = document.querySelector('.title_box h2');
  const contentArea = document.querySelector('.main');
  const menuList = document.querySelector('.menu ul');
  const addPageButton = document.querySelector('.add_box');

  // DOM 요소 확인
  if (!titleBox || !contentArea || !menuList || !addPageButton) {
    console.error('필수 DOM 요소를 찾을 수 없습니다.');
    return;
  }

})