const no_content = `
<div class="welcome_box">
<div>
<div class="welcome_img_box"><img src="./assets/undraw_posts_kv5v.svg" alt=""></div>
<div class="welcome_text_box">
    <h2>Welcome to Notion!</h2>
    <p>팀 While(true)노션 홈페이지에 오신것을 환영합니다.:) </p>
</div>
</div>
</div>
`;
const API_BASE_URL = "https://kdt-api.fe.dev-cos.com/documents";
const HEADERS = {
  "Content-Type": "application/json",
  "x-username": "namedaf", // 고유한 사용자?
};
let path_name = window.location.pathname;

const routes = {
  "/": () => no_content,
  "/contact": () => "<h1>Contact Page</h1><p>Get in touch with us here.</p>",
  "/post/:id": async (params) => {
    const currentDoc = await fetchDocumentById(params.id);
    const titleBox = document.querySelector(".title_box h2");
    titleBox.innerHTML = currentDoc.title
    
    return `<textarea>${currentDoc.content || ""}</textarea>`;
  },
};

// URL 경로에서 동적 매개변수 추출 함수
const parseRoute = (path) => {
  const keys = Object.keys(routes);
  for (let route of keys) {
    const paramRegex = new RegExp(
      `^${route.replace(/:\w+/g, "([^/]+)")}$`
    ); // :id와 같은 동적 경로를 추출하는 정규식
    const match = path.match(paramRegex);
    if (match) {
      const params = {};
      const paramNames = (route.match(/:\w+/g) || []).map((key) =>
        key.substring(1)
      ); // :id에서 id만 추출
      paramNames.forEach((name, index) => {
        params[name] = match[index + 1]; // 매칭된 동적 매개변수 값 할당
      });
      return { route, params };
    }
  }
  return null;
};

// 라우터 함수
const router = async () => {
    console.log(path_name)
  const { route, params } = parseRoute(path_name) || {};
  const content = document.querySelector("main");
  if (route && routes[route]) {
    const renderContent = await routes[route](params || {});
    content.innerHTML = renderContent;
  } else {
    content.innerHTML =
      "<h1>404 Not Found</h1><p>Page not found.</p>";
  }
};

// 네비게이션 함수
export const navigateTo = async (state, pathname = "/") => {
  history.pushState(state, null, pathname);
  path_name = pathname;
  router();
};

// 뒤로가기/앞으로가기 이벤트 처리
window.addEventListener("popstate", () => {
  path_name = window.location.pathname;
  router();
});
const fetchDocumentById = async (documentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${documentId}`, {
        method: "GET",
        headers: HEADERS,
      });

      if (!response.ok) {
        throw new Error(`문서 조회 실패 (ID: ${documentId})`);
      }

      return await response.json();
    } catch (error) {
      console.error("문서 조회 중 오류 발생:", error);
      return null;
    }
  };
// 라우터 초기화
router();
