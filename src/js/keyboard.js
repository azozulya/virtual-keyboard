import enKeys from '../assets/en.json';
import ruKeys from '../assets/ru.json';

const keyButton = ({
  key, keyCode, code, type,
}) => {
  const div = document.createElement('button');
  div.classList.add('keyboard__btn', code && code.toLowerCase());
  div.innerText = key;
  div.code = code;
  div.type = 'button';
  div.variation = type || '';
  div.id = keyCode;
  return div;
};

const createContainer = (tag, ...style) => {
  const div = document.createElement(tag);
  div.classList.add(...style);
  return div;
};

class Keyboard {
  textarea;

  kboard;

  langContainer;

  languages = {
    ru: ruKeys,
    en: enKeys,
  };

  constructor() {
    this.lang = localStorage.getItem('lang') || 'en';
    this.btns = [];
    // this.create();
  }

  create() {
    const div = createContainer('div', 'container');
    const textareaWrapper = createContainer('div', 'textarea__wrapper');
    this.textarea = createContainer('textarea', 'textarea');
    this.textarea.cols = 100;
    this.textarea.rows = 30;
    textareaWrapper.append(this.textarea);

    this.langContainer = createContainer('button', 'keyboard__btn', 'lang');
    this.drawLanguageBtn();

    this.kboard = createContainer('div', 'keyboard');
    this.kboard.insertAdjacentElement('afterbegin', this.langContainer);

    const currentLanguageKeys = this.languages[this.lang];

    if (currentLanguageKeys) {
      currentLanguageKeys.map((keyCode) => {
        const btn = keyButton(keyCode);

        this.btns.push(btn);
        return this.kboard.append(btn);
      });
    }

    div.insertAdjacentElement('afterbegin', textareaWrapper);
    div.insertAdjacentElement('beforeEnd', this.kboard);
    div.insertAdjacentHTML(
      'beforeEnd',
      '<p class="message">Клавиатура создана в операционной системе Windows.<br> Для переключения языка комбинация: левыe <span>ctrl</span> + <span>alt</span></p>',
    );

    this.textarea.focus();
    this.langContainer.addEventListener('click', this.changeLanguage);
    this.kboard.addEventListener('click', this.onClickBtn);
    this.kboard.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
    document.body.insertAdjacentElement('afterbegin', div);
  }

  drawLanguageBtn = () => {
    this.langContainer.innerText = this.lang;
    const styles = this.langContainer.classList;
    const match = styles.value.match(/lang--\w{2}/);

    if (match) {
      styles.remove(match[0]);
    }
    styles.add(`lang--${this.lang}`);
  };

  changeLanguage = () => {
    this.lang = this.lang === 'ru' ? 'en' : 'ru';
    localStorage.setItem('lang', this.lang);

    this.drawLanguageBtn();

    const keyCodes = this.languages[this.lang];

    if (!keyCodes) return;

    const letters = this.btns.filter((btn) => btn.variation === 'letter');

    if (letters) {
      letters.map((item) => {
        const letterBtn = item;
        const currentKey = keyCodes.find((key) => key.keyCode === parseInt(item.id, 10));
        letterBtn.innerText = currentKey.key;
        return letterBtn;
      });
    }
  };

  setUppercase = () => {
    const letters = this.btns.filter((item) => item.variation === 'letter');

    if (letters) {
      letters.map((item) => item.classList.toggle('keyboard__btn--uppercase'));
    }
  };

  addLetter = (letter) => {
    const caretStart = this.textarea.selectionStart;
    const val = this.textarea.value;
    this.textarea.value = val.slice(0, caretStart) + letter + val.slice(caretStart);
    this.textarea.selectionStart = caretStart + 1;
    this.textarea.selectionEnd = caretStart + 1;
  };

  tabClick = () => {
    const caret = this.textarea.selectionStart;
    const val = this.textarea.value;
    this.textarea.value = `${val.slice(0, caret)}\t${val.slice(caret)}`;
    this.textarea.selectionStart = caret + 1;
    this.textarea.selectionEnd = caret + 1;
  };

  toggleActiveClass = (code, active) => {
    const currentBtn = this.btns.find((item) => item.code === code);

    if (!currentBtn) {
      return false;
    }

    if (active === 'toggle') {
      return currentBtn.classList.toggle('keyboard__btn--active');
    }

    if (active) {
      return currentBtn.classList.add('keyboard__btn--active');
    }
    return currentBtn.classList.remove('keyboard__btn--active');
  };

  onClickBtn = (event) => {
    const currentBtn = event.target;

    this.textarea.focus();

    if (!currentBtn) {
      return false;
    }
    const caretStart = this.textarea.selectionStart;
    const caretEnd = this.textarea.selectionEnd;
    const val = this.textarea.value;

    switch (currentBtn.code) {
      case 'Space': {
        this.textarea.value = `${val.slice(0, caretStart)} ${val.slice(caretStart + 1)}`;
        this.textarea.selectionStart = caretStart + 1;
        this.textarea.selectionEnd = caretStart + 1;
        break;
      }
      case 'CapsLock': {
        this.toggleActiveClass(currentBtn.code, 'toggle');
        this.setUppercase();
        break;
      }
      case 'NumpadDecimal': {
        this.textarea.value = val.slice(0, caretStart) + val.slice(caretEnd + 1);
        this.textarea.selectionStart = caretStart;
        this.textarea.selectionEnd = caretStart;
        break;
      }
      case 'Backspace': {
        this.textarea.value = val.slice(0, caretStart - 1) + val.slice(caretStart);
        this.textarea.selectionStart = caretStart - 1;
        this.textarea.selectionEnd = caretStart - 1;
        break;
      }
      case 'Enter': {
        this.textarea.value = `${val.slice(0, caretStart)}\n${val.slice(caretStart)}`;
        this.textarea.selectionStart = caretStart + 1;
        this.textarea.selectionEnd = caretStart + 1;
        break;
      }
      case 'Tab': {
        event.preventDefault();
        this.tabClick();
        break;
      }
      default:
        break;
    }

    if (['letter', 'digit', 'symbol'].includes(currentBtn.variation)) {
      this.addLetter(currentBtn.innerText);
    }
    return true;
  };

  onKeyDown = (event) => {
    const {
      code, altKey, ctrlKey, key, repeat,
    } = event;

    if (repeat) {
      event.preventDefault();
      return false;
    }

    this.textarea.focus();

    if (code === 'CapsLock') {
      this.toggleActiveClass(code, 'toggle');
      return this.setUppercase();
    }

    if (code === 'Tab') {
      event.preventDefault();
      this.tabClick();
      return this.toggleActiveClass(code, true);
    }

    if (altKey && ctrlKey) {
      this.changeLanguage();
      return this.toggleActiveClass(code, true);
    }

    if (key === 'Shift') {
      this.setUppercase();
      return this.toggleActiveClass(code, true);
    }

    const currentBtn = this.btns.find((btn) => btn.code === code);

    if (currentBtn && ['letter', 'digit', 'symbol'].includes(currentBtn.variation)) {
      event.preventDefault();
      this.addLetter(currentBtn.innerText);
      return this.toggleActiveClass(code, true);
    }
    return this.toggleActiveClass(code, true);
  };

  onKeyUp = (event) => {
    const { code, key } = event;

    if (key === 'Shift') {
      this.toggleActiveClass(code, false);
      return this.setUppercase();
    }

    if (code && code !== 'CapsLock') {
      return this.toggleActiveClass(code, false);
    }
    return false;
  };
}

export default Keyboard;
