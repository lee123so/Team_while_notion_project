const API_BASE_URL = "https://kdt-api.fe.dev-cos.com/documents";
const HEADERS = {
  "Content-Type": "application/json",
  "x-username": "namedaf", // 고유한 사용자
};

const menuList = document.querySelector(".menu ul");

// 사이드바 렌더링 함수
const renderSidebar = async () => {
  menuList.innerHTML = ""; // 기존 아이템을 비운다

  try {
    const response = await fetch(API_BASE_URL, {
      method: "GET",
      headers: HEADERS,
    });

    if (!response.ok) {
      throw new Error("문서 목록 조회 실패");
    }

    const documents = await response.json();

    // 중복 추가를 방지하기 위해 ID 기반으로 이미 추가된 문서 목록을 추적
    const existingItems = new Set(
      [...menuList.querySelectorAll(".menu_box")].map((item) => item.dataset.id)
    );

    documents.forEach((doc) => {
      // 중복된 문서는 추가하지 않음
      if (!existingItems.has(doc.id.toString())) {
        const listItem = createMenuItem(doc);
        menuList.appendChild(listItem);
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

// 메뉴 아이템 생성 함수
const createMenuItem = (doc, parentId) => {
  const listItem = document.createElement("li");
  listItem.classList.add("menu-item");
  listItem.innerHTML = `
    <div class="menu_box" data-id="${doc.id}">
      <div class="icon"><i class="fa-duotone fa-solid fa-angle-right"></i></div>
      <div class="menu_text">${doc.title || "제목 없음"}</div>
      <div class="delete_icon"><i class="fa-solid fa-trash"></i></div>
      <div class="add_icon"><i class="fa-solid fa-plus"></i></div>
    </div>
    <ul class="sub-menu" style="display: none;"></ul>
  `;

  const subMenu = listItem.querySelector(".sub-menu");

  // 하위 문서가 있으면 추가
  if (doc.subDocuments && doc.subDocuments.length > 0) {
    doc.subDocuments.forEach((subDoc) => {
      const subItem = createMenuItem(subDoc, doc.id); // parentId를 전달
      subMenu.appendChild(subItem);
    });
  }

  // 문서 클릭 이벤트
  const menuBox = listItem.querySelector(".menu_box");
  menuBox.addEventListener("click", async () => {
    await displayDocumentContent(doc.id);
  });

  // 삭제 아이콘 클릭 이벤트
  const deleteIcon = listItem.querySelector(".delete_icon");
  deleteIcon.addEventListener("click", async (e) => {
    e.stopPropagation();
    const confirmDelete = confirm("정말로 이 문서를 삭제하시겠습니까?");
    if (confirmDelete) {
      await deleteDocument(doc.id);
    }
  });

  // 하위 페이지 추가 버튼 클릭 이벤트
  const addIcon = listItem.querySelector(".add_icon");

  // 이벤트 리스너를 한 번만 등록하도록 처리
  addIcon.addEventListener(
    "click",
    async (e) => {
      e.stopPropagation();
      const defaultTitle = "제목 없음";
      await createNewPage(doc.id, defaultTitle);
    },
    { once: true }
  );

  // 하위 메뉴가 없으면 `sub-menu`를 숨기지 않도록 처리
  if (subMenu && subMenu.children.length > 0) {
    subMenu.style.display = "block";
  }

  return listItem;
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
    await renderSidebar();

    // 삭제된 문서가 현재 열려있는 문서라면 기본 화면으로 전환
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

export const updateSidebarTitle = (docId, newTitle) => {
  const sidebarItem = document.querySelector(`.menu_box[data-id="${docId}"]`);
  if (sidebarItem) {
    const titleElement = sidebarItem.querySelector(".menu_text");
    if (titleElement) {
      titleElement.textContent = newTitle;
    }
  } else {
    console.error("사이드바에서 문서를 찾을 수 없습니다.");
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
        parentId: parentId || null,
      }),
    });

    if (!response.ok) {
      throw new Error("새 페이지 생성 실패");
    }

    const newDoc = await response.json();
    console.log("새 페이지 생성 성공:", newDoc);

    // 새 페이지가 추가된 후 사이드바를 다시 렌더링
    await renderSidebar(); // 중복된 페이지를 추가하지 않도록 처리
  } catch (error) {
    console.error("새 페이지 생성 중 오류 발생:", error);
  }
};

// 문서 내용 표시 함수
const displayDocumentContent = async (docId) => {
  const contentArea = document.querySelector(".main");
  try {
    const response = await fetch(`${API_BASE_URL}/${docId}`, {
      method: "GET",
      headers: HEADERS,
    });

    if (!response.ok) {
      throw new Error(`문서 내용 조회 실패 (ID: ${docId})`);
    }

    const doc = await response.json();
    contentArea.innerHTML = `
      <h2 data-id="${doc.id}">
        <input type="text" value="${doc.title}" class="doc-title-input" />
      </h2>
    `;

    // 제목 입력 필드에서 변경이 있을 때 사이드바 제목도 바로 업데이트
    const titleInput = contentArea.querySelector(".doc-title-input");
    titleInput.addEventListener("blur", async () => {
      const newTitle = titleInput.value;
      try {
        // 제목 수정 요청을 서버에 보내고 성공하면 사이드바도 업데이트
        await updateDocumentTitle(doc.id, newTitle);
        updateSidebarTitle(doc.id, newTitle); // 사이드바 제목 바로 업데이트
      } catch (error) {
        console.error("제목 수정 중 오류 발생:", error);
      }
    });

  } catch (error) {
    console.error("문서 내용 표시 중 오류 발생:", error);
  }
};

// 제목 수정 함수
const updateDocumentTitle = async (docId, newTitle) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${docId}`, {
      method: "PUT",
      headers: HEADERS,
      body: JSON.stringify({ title: newTitle }),
    });

    if (!response.ok) {
      throw new Error(`제목 수정 실패 (ID: ${docId})`);
    }

    console.log("제목 수정 성공");
  } catch (error) {
    console.error("제목 수정 중 오류 발생:", error);
  }
};


// 초기화
renderSidebar();

export { renderSidebar, deleteDocument, createNewPage, displayDocumentContent };
