import { renderSidebar, updateSidebarTitle } from "./sidebar.js";

const API_BASE_URL = "https://kdt-api.fe.dev-cos.com/documents";
const HEADERS = {
  "Content-Type": "application/json",
  "x-username": "namedaf", // 고유한 사용자
};

// DOM 요소 가져오기
document.addEventListener("DOMContentLoaded", async () => {
  const titleBox = document.querySelector(".title_box h2");
  const contentArea = document.querySelector(".main");
  const addPageButton = document.querySelector(".add_box");
  const welcomeBox = document.querySelector(".welcome_box");

  console.log(titleBox, contentArea, addPageButton, welcomeBox); // 확인용 로그

  if (!titleBox || !contentArea || !addPageButton || !welcomeBox) {
    console.error("필수 DOM 요소를 찾을 수 없습니다.");
    return;
  }

  // 문서 삭제 함수
  const deleteDocument = async (docId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${docId}`, {
        method: "DELETE",
        headers: HEADERS,
      });

      if (!response.ok) {
        throw new Error(`문서 삭제 실패 (ID: ${docId})`);
      }

      console.log("문서 삭제 성공");
      // 사이드바 갱신
      await renderSidebar(); 

      // 삭제된 문서가 현재 문서라면, 다른 문서를 불러오거나 기본 화면을 보여줌
      if (titleBox.dataset.id === docId) {
        titleBox.textContent = "문서를 찾을 수 없습니다.";
        contentArea.innerHTML = "<p>내용 없음</p>";
      }
    } catch (error) {
      console.error("문서 삭제 중 오류 발생:", error);
    }
  };

  // 문서 내용 렌더링
  const renderEditor = async (docId) => {
    const currentDoc = await fetchDocumentById(docId);

    if (!currentDoc) {
      titleBox.textContent = "문서를 찾을 수 없습니다.";
      contentArea.innerHTML = "<p>내용 없음</p>";
      return;
    }

    // 제목 및 내용 렌더링
    titleBox.contentEditable = true;
    titleBox.textContent = currentDoc.title || "제목 없음";
    contentArea.innerHTML = ` 
      <textarea>${currentDoc.content || ""}</textarea>
    `;

    const textarea = contentArea.querySelector("textarea");
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
      }, 5000); // 5초 뒤 저장
    };

    // 제목 및 내용 변경 이벤트 추가
    titleBox.addEventListener("input", autoSave);
    textarea.addEventListener("input", autoSave);
  };

  // 트래시 아이콘 클릭 시 문서 삭제
  document.querySelector(".side_icon").addEventListener("click", async () => {
    const docId = titleBox.dataset.id; // 제목 박스에 저장된 문서 ID
    if (docId) {
      const confirmDelete = confirm("정말로 이 문서를 삭제하시겠습니까?");
      if (confirmDelete) {
        await deleteDocument(docId);
      }
    }
  });

  // 새 문서 생성 버튼 처리
  addPageButton.addEventListener("click", async () => {
    const newDoc = await createDocument("새 페이지");
    if (newDoc) {
      console.log("새 문서 생성:", newDoc);
      renderSidebar();
      renderEditor(newDoc.id);
    }
  });

  // 사이드바 클릭 시 해당 문서 내용 렌더링
  document.querySelector('.menu ul').addEventListener('click', (event) => {
    const menuBox = event.target.closest('.menu_box');
    if (menuBox) {
      const docId = menuBox.dataset.id;
      if (docId) {
        renderEditor(docId);
      } else {
        console.error("문서 ID가 없습니다.");
      }
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

// 새 문서 생성 함수
const createDocument = async (title) => {
  try {
    const newDoc = {
      title: title || "새 문서",
      content: "",
    };

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(newDoc),
    });

    if (!response.ok) {
      throw new Error("새 문서 생성 실패");
    }

    const createdDoc = await response.json();
    console.log("새 문서 생성 완료:", createdDoc);
    return createdDoc;
  } catch (error) {
    console.error("새 문서 생성 중 오류 발생:", error);
  }
};

// 문서 저장 함수
const saveDocument = async (docId, updatedDoc) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${docId}`, {
      method: "PUT",
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

// 문서 조회 함수
const fetchDocumentById = async (docId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${docId}`, {
      method: "GET",
      headers: HEADERS,
    });

    if (!response.ok) {
      throw new Error(`문서 조회 실패 (ID: ${docId})`);
    }

    return await response.json();
  } catch (error) {
    console.error("문서 조회 중 오류 발생:", error);
  }
};
