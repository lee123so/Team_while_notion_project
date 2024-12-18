const API_BASE_URL = 'https://kdt-api.fe.dev-cos.com/documents';
const HEADERS = {
  'Content-Type': 'application/json',
  'x-username': 'namedaf',
};

// DOM 요소 가져오기
const menuList = document.querySelector('.menu ul');

const updateSidebarTitle = (docId, newTitle) => {
  const sidebarItem = menuList.querySelector(`.menu_box[data-id="${docId}"] .menu_text`);
  if (sidebarItem) {
    sidebarItem.textContent = newTitle || '제목 없음';
  }
};

// 사이드바 렌더링
const renderSidebar = async () => {
  menuList.innerHTML = '';

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: HEADERS,
    });

    if (!response.ok) {
      throw new Error('문서 목록 조회 실패');
    }

    const documents = await response.json();

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

// 사이드바 함수 내보내기
export { renderSidebar, updateSidebarTitle };
