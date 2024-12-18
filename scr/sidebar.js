const API_BASE_URL = "https://kdt-api.fe.dev-cos.com/documents";
const HEADERS = {
  "Content-Type": "application/json",
  "x-username": "namedaf", // 고유한 사용자
};

const menuList = document.querySelector(".menu ul");

// 사이드바 렌더링
const renderSidebar = async () => {
  menuList.innerHTML = "";

  try {
    const response = await fetch(API_BASE_URL, {
      method: "GET",
      headers: HEADERS,
    });

    if (!response.ok) {
      throw new Error("문서 목록 조회 실패");
    }

    const documents = await response.json();

    documents.forEach((doc) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        <div class="menu_box" data-id="${doc.id}">
          <div class="icon"><i class="fa-duotone fa-solid fa-angle-right"></i></div>
          <div class="menu_text">${doc.title || "제목 없음"}</div>
          <div class="delete_icon"><i class="fa-solid fa-trash"></i></div>
        </div>
      `;

      // 삭제 아이콘 클릭 시 문서 삭제
      const deleteIcon = listItem.querySelector(".delete_icon");
      deleteIcon.addEventListener("click", async (e) => {
        e.stopPropagation(); // 클릭 이벤트 전파 막기
        const confirmDelete = confirm("정말로 이 문서를 삭제하시겠습니까?");
        if (confirmDelete) {
          await deleteDocument(doc.id); // 문서 삭제
        }
      });

      menuList.appendChild(listItem);
    });
  } catch (error) {
    console.error("사이드바 렌더링 중 오류 발생:", error);
  }
};

// 사이드바 항목 클릭 이벤트 (전역 리스너)
menuList.addEventListener("click", (event) => {
  const menuBox = event.target.closest(".menu_box");
  if (menuBox) {
    const docId = menuBox.dataset.id;
    if (docId) {
      renderEditor(docId);
    } else {
      console.error("문서 ID가 없습니다.");
    }
  }
});

// 문서 제목 업데이트
const updateSidebarTitle = (docId, newTitle) => {
  const sidebarItem = menuList.querySelector(
    `.menu_box[data-id="${docId}"] .menu_text`
  );
  if (sidebarItem) {
    sidebarItem.textContent = newTitle || "제목 없음";
  }
};

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
    await renderSidebar(); // 사이드바 갱신

    // 삭제된 문서가 현재 열려있는 문서라면, 기본 화면으로 전환
    const titleBox = document.querySelector(".main h2");
    if (titleBox && titleBox.dataset.id === String(docId)) {
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

export { renderSidebar, updateSidebarTitle };
