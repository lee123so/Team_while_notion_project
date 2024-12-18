const router = async () => {
  const { pathname } = window.location;
  root.innerHTML = "";

  if (pathname === "/") {
    const rootDocuments = await api.getRootDocuments();
    renderRootDocuments(rootDocuments);
  } else if (pathname.startsWith("/documents/")) {
    const documentId = pathname.split("/")[2];
    const document = await api.getDocument(documentId);
    renderDocument(document);
  } else {
    console.error("error!!!");
  }
}

export const navigateTo = (url) => {
  window.history.pushState(null, null, url);
  router();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", router);
