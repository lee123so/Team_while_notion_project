import styles from '/style.css';

export default class App extends Component {
    constructor($element) {
        $element.innerHTML = '';
        super($element);
        this.render();
  }

  template() {
    return `
      <header></header>
      <main class = "${styles.appMain}"></main>
      <footer></footer>
    `;
  }
    setTemplate() {
      
    }
}