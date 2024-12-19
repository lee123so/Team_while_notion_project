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
      listItem.classList.add("menu-item");
      listItem.innerHTML = `
        <div class="menu_box" data-id="${doc.id}">
          <div class="icon"><i class="fa-duotone fa-solid fa-angle-right"></i></div>
          <div class="menu_text">${doc.title || "제목 없음"}</div>
          <div class="delete_icon"><i class="fa-solid fa-trash"></i></div>
        </div>
        <ul class="sub-menu" style="display: none;"></ul> <!-- 하위 페이지 영역 -->
      `;

      const subMenu = listItem.querySelector(".sub-menu");

      // 하위 문서가 있으면 추가
      if (doc.subDocuments && doc.subDocuments.length > 0) {
        doc.subDocuments.forEach((subDoc) => {
          const subItem = document.createElement("li");
          subItem.innerHTML = `
            <div class="menu_box" data-id="${subDoc.id}">
              <div class="icon"><i class="fa-duotone fa-solid fa-angle-right"></i></div>
              <div class="menu_text">${subDoc.title || "제목 없음"}</div>
              <div class="delete_icon"><i class="fa-solid fa-trash"></i></div>
            </div>
          `;
          subMenu.appendChild(subItem);
        });
      }

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

      // 메뉴 클릭 시 하위 메뉴 토글
      const menuBox = listItem.querySelector(".menu_box");
      menuBox.addEventListener("click", () => {
        const icon = menuBox.querySelector(".icon");
        const isOpen = subMenu.style.display === "block";

        // 하위 메뉴 토글
        subMenu.style.display = isOpen ? "none" : "block";
        icon.innerHTML = isOpen
          ? '<i class="fa-duotone fa-solid fa-angle-right"></i>' // 화살표가 오른쪽으로 표시
          : '<i class="fa-duotone fa-solid fa-angle-down"></i>'; // 화살표가 아래로 표시
      });
    });
  } catch (error) {
    console.error("사이드바 렌더링 중 오류 발생:", error);
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

// 새 페이지 생성 함수
const createNewPage = async (parentId, title) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({
        title: title,
        parentId: parentId || null, // 상위 페이지가 있으면 부모 ID 전달
      }),
    });

    if (!response.ok) {
      throw new Error("새 페이지 생성 실패");
    }

    const newDoc = await response.json();
    console.log("새 페이지 생성 성공:", newDoc);
    await renderSidebar(); // 사이드바 갱신
  } catch (error) {
    console.error("새 페이지 생성 중 오류 발생:", error);
  }
};

// 문서 제목 업데이트 함수
const updateSidebarTitle = async (docId, newTitle) => {
  const sidebarItem = menuList.querySelector(
    `.menu_box[data-id="${docId}"] .menu_text`
  );
  if (sidebarItem) {
    const updatedTitle = newTitle.trim() || "제목 없음"; // 제목이 비어 있으면 기본값 설정
    sidebarItem.textContent = updatedTitle;

    try {
      const response = await fetch(`${API_BASE_URL}/${docId}`, {
        method: "PUT", // PATCH 대신 PUT 사용
        headers: HEADERS,
        body: JSON.stringify({ title: updatedTitle }),
      });

      if (!response.ok) {
        throw new Error(`문서 제목 업데이트 실패 (ID: ${docId})`);
      }

      console.log("문서 제목 업데이트 성공:", updatedTitle);
    } catch (error) {
      console.error("문서 제목 업데이트 중 오류 발생:", error);
    }
  }
};

export { renderSidebar, deleteDocument, createNewPage, updateSidebarTitle };
