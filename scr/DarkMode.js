export function initializeDarkMode() {
  //  Dark 버튼 생성
  const toggleDarkModeButton = document.createElement("button");
  // 버튼위치 조정
  toggleDarkModeButton.textContent = "Dark";
  toggleDarkModeButton.style.position = "absolute";
  toggleDarkModeButton.style.top = "4.5%";
  toggleDarkModeButton.style.right = "45px";
  toggleDarkModeButton.style.transform = "translateY(-50%)";
  toggleDarkModeButton.style.padding = "10px 15px";
  toggleDarkModeButton.style.border = "none";
  toggleDarkModeButton.style.backgroundColor = "#444";
  toggleDarkModeButton.style.color = "#fff";
  toggleDarkModeButton.style.cursor = "pointer";
  document.body.appendChild(toggleDarkModeButton);

  // 다크 모드 토글 
  toggleDarkModeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      toggleDarkModeButton.textContent = "White";
    } else {
      toggleDarkModeButton.textContent = "Dark ";
    }
  });

  // Dakr  스타일 
  const style = document.createElement("style");
  style.textContent = `
    .dark-mode {
      background-color: #121212;
      color: #ffffff;
      transition: background-color 0.3s, color 0.3s;
    }
    .dark-mode .side_bar {
      background-color: #1e1e1e;
      color: #ffffff;
    }
    .dark-mode .content {
      background-color: #1e1e1e;
      color: #ffffff;
    }
    .dark-mode .header {
      background-color: #2a2a2a;
      color: #ffffff;
    }
    .dark-mode textarea {
      background-color: #2a2a2a;
      color: #ffffff;
      border: 1px solid #444;
    }
    .dark-mode h2 {
      color: #ffffff;
    }
    .dark-mode .menu ul li {
      background-color: transparent;
      color: #ccc;
    }
    .dark-mode .menu ul li:hover {
      background-color: #333;
    }
    .dark-mode .menu_text {
      color: #ffffff;
    }
    .dark-mode .welcome_box h2, .dark-mode .welcome_box p {
      color: #bbbbbb;
    }
    .dark-mode button {
      background-color: #444;
      color: #ffffff;
    }
    .dark-mode button:hover {
      background-color: #555;
    }
  `;
  document.head.appendChild(style);

  // 디버깅
  console.log("다크 모드 디버깅");
}
