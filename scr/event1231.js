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



  // 사이드바 렌더링
  const renderSidebar = async () => {
    menuList.innerHTML = '';

    try {
      const documents = await api.getRootDocuments();

      documents.forEach((doc) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <div class="menu_box" data-id="${doc.id}">
            <div class="icon"><i class="fa-duotone fa-solid fa-angle-right"></i></div>
            <div class="menu_text">${doc.title || '제목 없음'}</div>
          </div>
        `;

        listItem.addEventListener('click', () => renderEditor(doc.id));
        menuList.appendChild(listItem);
      });
    } catch (error) {
      console.error('사이드바 렌더링 중 오류 발생:', error);
    }
  };

  // 새 문서 생성 버튼 처리
  addPageButton.addEventListener('click', async () => {
    const newDoc = await api.createDocument('새 페이지');
    if (newDoc) {
      console.log('새 문서 생성:', newDoc);
      renderSidebar();
      renderEditor(newDoc.id);
    }
  });

  // 초기화 실행
  await renderSidebar();

  // 첫 번째 문서를 기본 문서로 렌더링
  const documents = await api.getRootDocuments();
  if (documents.length > 0) {
    renderEditor(documents[0].id);
  }
});
