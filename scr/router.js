const no_content = `
<div class="welcome_box">
<div>
<div class="welcome_img_box"><img src="./assets/undraw_posts_kv5v.svg" alt=""></div>
<div class="welcome_text_box">
    <h2>Welcome to Notion!</h2>
    <p>처음오셨다면 첫 게시물을 작성해주세요:) </p>
</div>
</div>
</div>
`
const path_name = window.location.pathname

const path = {
    "/": () => "<h1>Home Page</h1><p>Welcome to the Home Page!</p>",
  "/about": () => "<h1>About Page</h1><p>This is the About Page.</p>",
  "/contact": () => "<h1>Contact Page</h1><p>Get in touch with us here.</p>",
}
//초기웰컴 페이지 랜더링
const WelcomePageRender = async () => {
    if(path_name === '/'){
        document.querySelector('main').innerHTML = no_content
    }
}
document.addEventListener("DOMContentLoaded", () => WelcomePageRender());

const router = () =>{
    
    const route = path["/about"];
    console.log(route)
    const content = document.getElementsByClassName('.main');
    content.innerHTML = route ? route() : "<h1>404 Not Found</h1><p>Page not found.</p>";
   
}
router();