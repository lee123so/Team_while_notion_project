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

      // 클릭하면 바로 제목 수정 가능하게 함
      const menuText = listItem.querySelector('.menu_text');
      menuText.addEventListener('click', () => {
        // 텍스트를 바로 수정할 수 있도록 contenteditable 속성 사용
        menuText.contentEditable = true;
        menuText.focus();

        // 텍스트 수정 후 blur(포커스 아웃) 시 저장
        menuText.addEventListener('blur', async () => {
          menuText.contentEditable = false;
          const newTitle = menuText.textContent.trim();
          if (newTitle) {
            const updatedDoc = { title: newTitle };
            await saveDocument(doc.id, updatedDoc);
            updateSidebarTitle(doc.id, newTitle);
          }
        });

        // Enter 키를 누르면 수정된 제목을 저장
        menuText.addEventListener('keydown', async (e) => {
          if (e.key === 'Enter') {
            menuText.contentEditable = false;
            const newTitle = menuText.textContent.trim();
            if (newTitle) {
              const updatedDoc = { title: newTitle };
              await saveDocument(doc.id, updatedDoc);
              updateSidebarTitle(doc.id, newTitle);
            }
          }
        });
      });

      // 기존 클릭 이벤트 유지
      // listItem.addEventListener('click', () => renderEditor(doc.id));
      menuList.appendChild(listItem);
    });
  } catch (error) {
    console.error('사이드바 렌더링 중 오류 발생:', error);
  }
};

// 문서 저장 함수
const saveDocument = async (docId, updatedDoc) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${docId}`, {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify(updatedDoc),
    });

    if (!response.ok) {
      throw new Error(`문서 저장 실패 (ID: ${docId})`);
    }

    console.log("자동 저장 완료:", await response.json());
  } catch (error) {
    console.error("문서 저장 중 오류 발생:", error);
  }
};

// 사이드바 함수 내보내기
export { renderSidebar, updateSidebarTitle };
