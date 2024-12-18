const API_BASE_URL = 'https://kdt-api.fe.dev-cos.com/documents';
const HEADERS = {
  'Content-Type': 'application/json',
  'x-username': 'fsfsrname', // 고유한 사용자?
};

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

  // API 요청 함수
  const fetchDocumentById = async (documentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${documentId}`, {
        method: 'GET',
        headers: HEADERS,
      });

      if (!response.ok) {
        throw new Error(`문서 조회 실패 (ID: ${documentId})`);
      }

      return await response.json();
    } catch (error) {
      console.error('문서 조회 중 오류 발생:', error);
      return null;
    }
  };

  const saveDocument = async (documentId, updatedDoc) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${documentId}`, {
        method: 'PUT',
        headers: HEADERS,
        body: JSON.stringify(updatedDoc),
      });

      if (!response.ok) {
        throw new Error(`문서 저장 실패 (ID: ${documentId})`);
      }

      console.log('자동 저장 완료:', await response.json());
    } catch (error) {
      console.error('문서 저장 중 오류 발생:', error);
    }
  };

  const createDocument = async (title) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ title, parent: null }),
      });

      if (!response.ok) {
        throw new Error('문서 생성 실패');
      }

      return await response.json();
    } catch (error) {
      console.error('문서 생성 중 오류 발생:', error);
      return null;
    }
  };

      // Document 삭제
      const deleteDocument = async (id) => {
        try {
          const response = await axios.delete(`${ENDPOINT_URL}/${id}`, {
            headers
          });
          console.log(`Document ${id} deleted`);
        } catch (error) {
          console.error(`Error deleting document ${id}:`, error.message);
          throw error;
        }
      }



  // 문서 내용 렌더링
  const renderEditor = async (docId) => {
    const currentDoc = await fetchDocumentById(docId);

    if (!currentDoc) {
      titleBox.textContent = '문서를 찾을 수 없습니다.';
      contentArea.innerHTML = '<p>내용 없음</p>';
      return;
    }

    // 제목 및 내용 렌더링
    titleBox.contentEditable = true;
    titleBox.textContent = currentDoc.title || '제목 없음';
    contentArea.innerHTML = `
      <textarea>${currentDoc.content || ''}</textarea>
    `;

    const textarea = contentArea.querySelector('textarea');
    let saveTimeout;

    const autoSave = () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(async () => {
        const updatedDoc = {
          title: titleBox.textContent.trim(),
          content: textarea.value.trim(),
        };
        await saveDocument(docId, updatedDoc);
        updateSidebarTitle(docId, titleBox.textContent.trim());
      }, 5000); // 일단 5초뒤? 저장..
    };

    // 제목 및 내용 변경 이벤트 추가
    titleBox.addEventListener('input', autoSave);
    textarea.addEventListener('input', autoSave);
  };

  // 사이드바 제목 업데이트
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

  // 새 문서 생성 버튼 처리
  addPageButton.addEventListener('click', async () => {
    const newDoc = await createDocument('새 페이지');
    if (newDoc) {
      console.log('새 문서 생성:', newDoc);
      renderSidebar();
      renderEditor(newDoc.id);
    }
  });



  // 초기화 실행
  await renderSidebar();

  // 첫 번째 문서를 기본 문서로 렌더링
  const response = await fetch(`${API_BASE_URL}`, { headers: HEADERS });
  const documents = await response.json();
  if (documents.length > 0) {
    renderEditor(documents[0].id);
  }
});
