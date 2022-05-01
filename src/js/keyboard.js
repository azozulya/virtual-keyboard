import keyCodes from "../assets/keys.json";

const keyButton = ({key, keyCode, code, type}) => {
  const div = document.createElement("div");
  div.classList.add("keyboard__btn", code && code.toLowerCase());
  div.innerText = key;
  div.code = code;
  type && (div.type = type);
  div.dataset.id = keyCode;
  div.dataset.code = code;
  return div;
};

const createContainer = (tag, style) => {
  const div = document.createElement(tag);
  div.classList.add(style);

  return div;  
};

class Keyboard {
  element;
  textarea;
  kboard;
  constructor() {
    this.lang = localStorage.getItem("lang") || "eng";
    this.btns = [];
    this.create();
  }

 
  create() {
    const div = createContainer("div", "container");
    this.kboard = createContainer("div", "keyboard");
    this.textarea = createContainer("textarea", "textarea");
    
    
    keyCodes.map(keyCode => {
      const btn = keyButton(keyCode);

      this.btns.push(btn);
      this.kboard.append(btn);
      
      // {
      //   "key": "Shift",
      //   "keyCode": 16,
      //   "which": 16,
      //   "code": "ShiftLeft",
      //   "location": 1,
      //   "description": "shift",
      //   "unicode": "⇧"
      // }      
      
    });
    div.insertAdjacentElement("afterbegin", this.textarea);
    div.insertAdjacentElement("beforeEnd", this.kboard);
    div.insertAdjacentHTML("beforeEnd", "<p class='message'>Клавиатура создана в операционной системе Windows.<br> Для переключения языка комбинация: левыe <span>ctrl</span> + <span>alt</span></p>");

    this.textarea.focus();
    this.kboard.addEventListener("click", this.onClickBtn);
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
    document.body.insertAdjacentElement("afterbegin", div);
  }

  changeLanguage = () => {
    
  };

  setUppercase = () => {
    const letters = this.btns.filter(item => item.type === "letter");
    letters && letters.map(item => item.classList.toggle("keyboard__btn--uppercase"));
  };

  onClickBtn = (event) => {
    const el = event.target;
    const currentBtn = this.btns.find(btn => btn === el);

    this.textarea.focus();

    if(currentBtn && currentBtn.code === "CapsLock") {
      return this.setUppercase();
    }

    if(currentBtn && currentBtn.code === "Backspace") {
      const caret = this.textarea.selectionStart;
      const val = this.textarea.value;
      this.textarea.value = val.slice(0, caret - 1) + val.slice(caret);
      this.textarea.selectionStart = caret - 1;
      this.textarea.selectionEnd = caret - 1;
      return;
    }

    if(currentBtn && currentBtn.code === "Enter") {
      const caret = this.textarea.selectionStart;
      const val = this.textarea.value;
      this.textarea.value = val.slice(0, caret) + "\n" + val.slice(caret);
      this.textarea.selectionStart = caret + 1;
      this.textarea.selectionEnd = caret + 1;
      return;
    }

    console.log(event);
    console.log("currentBtn: ", currentBtn);
    if(currentBtn)
      this.textarea.value += el.innerText;
  };

  onKeyDown = (event) => {
    const {code} = event;

    if(event.altKey && event.ctrlKey) {
      this.changeLanguage();
    }

    if(event.code === "CapsLock") {
      this.setUppercase();
    }

    //console.log("keyDown: ", code, event.altKey, event.ctrlKey);
    const el = this.btns.find(item => item.dataset.code === code);
    el && el.classList.add("keyboard__btn--active");

    //console.log("textarea: ", this.textarea.value);
    
  };

  onKeyUp = (event) => {
    //console.log("keyup: ", event);
    if(event.keyCode) {
      const currentBtn = this.btns.find(item => item.dataset.code === event.code);
      currentBtn && currentBtn.classList.remove("keyboard__btn--active");
    }
  };
}

export default Keyboard;
