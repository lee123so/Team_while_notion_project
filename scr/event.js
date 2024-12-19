
import { navigateTo } from "./router.js";
import { renderSidebar, updateSidebarTitle } from "./sidebar.js";
import { initializeDarkMode } from "./DarkMode.js";

document.addEventListener("DOMContentLoaded", async () => {
  initializeDarkMode(); // 다크 모드 초기화
  // 기존 로직 유지
});


const API_BASE_URL = "https://kdt-api.fe.dev-cos.com/documents";
const HEADERS = {
  "Content-Type": "application/json",
  "x-username": "namedaf", // 고유한 사용자
};

// DOM 요소 가져오기
document.addEventListener("DOMContentLoaded", async () => {
  const contentArea = document.querySelector(".main");
  const addPageButton = document.querySelector(".add_box");

  if (!contentArea || !addPageButton ) {
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
      await renderSidebar();

      // 문서가 삭제 될때 main textarea 도 같이 삭제 되게
      const titleBox = document.querySelector(".main h2");
      if (titleBox && titleBox.dataset.id === docId) {
        const contentArea = document.querySelector(".main");
        contentArea.innerHTML = `
          <div class="welcome_box">
            <p>문서를 선택하거나 새 문서를 생성하세요.</p>
          </div>
        `;
      }
    } catch (error) {
      console.error("문서 삭제 중 오류 발생:", error);
    }
  };

  // 문서 내용 렌더링
  const renderEditor = async (docId) => {
    
    const currentDoc = await fetchDocumentById(docId);
   
    if (!currentDoc) {
      contentArea.innerHTML = "<p>문서를 찾을 수 없습니다.</p>";
      return;
    }

    // 새 제목 박스를 만들어서 문서 ID를 데이터로 추가
    const titleBox = document.createElement("h2");
    titleBox.contentEditable = true;
    titleBox.textContent = currentDoc.title || "제목 없음";
    titleBox.dataset.id = docId;

    // 새 텍스트 영역을 만들어서 문서 내용 넣기
    const textarea = document.createElement("textarea");
    textarea.textContent = currentDoc.content || "";

    contentArea.innerHTML = "";
    contentArea.appendChild(titleBox);
    contentArea.appendChild(textarea);

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
      }, 3000); // 3초 뒤 저장
    };

    // 제목 및 내용 변경 이벤트 추가
    titleBox.addEventListener("input", autoSave);
    textarea.addEventListener("input", autoSave);
  };

  // 트래시 아이콘 클릭 시 문서 삭제
  document.querySelector(".side_icon").addEventListener("click", async () => {
    const docId = document.querySelector(".main h2")?.dataset.id;
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


  document.querySelector(".menu ul").addEventListener("click",async (event) => {
    const menuBox = event.target.closest(".menu_box");
    if (menuBox) {
      const docId = menuBox.dataset.id;
      if (docId) {
        await navigateTo(docId,`/post/${docId}`)
      } else {
        console.error("문서 ID가 없습니다.");
      }
    }
  });

  // 초기화 실행
  await renderSidebar();

  // 첫 번째 문서를 기본 문서로 렌더링
  // const response = await fetch(`${API_BASE_URL}`, { headers: HEADERS });
  // const documents = await response.json();
  // if (documents.length > 0) {
  //   renderEditor(documents[0].id);
  // }
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
      throw new Error(`문서 저장 실패 (ID: ${documentId})`);
    }
    return response.json();
  } catch (error) {
    console.error("문서 저장 중 오류 발생:", error);
  }
};
// 오토세이브
export const autoSave = (docId) => {
const contentArea = document.querySelector(".main");
const textarea = contentArea.querySelector("textarea");
const titlearea = contentArea.querySelector("h2")
let saveTimeout;
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    const updatedDoc = {
      title:titlearea.textContent.trim(),
      content: textarea.value.trim(),
    };
    const data = await saveDocument(docId,updatedDoc);
  }, 5000); 
  // 5초 뒤 저장
}

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