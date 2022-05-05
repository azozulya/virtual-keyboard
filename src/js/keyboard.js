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
  if (type) {
    div.variation = type;
  }
  div.id = keyCode;
  div.dataset.code = code;
  return div;
};

const createContainer = (tag, style) => {
  const div = document.createElement(tag);
  div.classList.add(style);

  return div;
};

const languages = {
  ru: ruKeys,
  en: enKeys,
};

class Keyboard {
  element;

  textarea;

  kboard;

  constructor() {
    this.lang = localStorage.getItem('lang') || 'en';
    this.btns = [];
    this.create();
  }

  create() {
    const currentLanguageKeys = languages[this.lang];
    const div = createContainer('div', 'container');
    const textareaWrapper = createContainer('div', 'textarea__wrapper');

    this.kboard = createContainer('div', 'keyboard');
    this.textarea = createContainer('textarea', 'textarea');
    this.textarea.cols = 100;
    this.textarea.rows = 30;

    if (currentLanguageKeys) {
      currentLanguageKeys.map((keyCode) => {
        const btn = keyButton(keyCode);

        this.btns.push(btn);
        return this.kboard.append(btn);
      });
    }
    const langInfo = createContainer('div', 'keyboard__key');
    langInfo.innerText = this.lang;
    this.kboard.insertAdjacentElement('afterbegin', langInfo);

    textareaWrapper.append(this.textarea);
    div.insertAdjacentElement('afterbegin', textareaWrapper);
    div.insertAdjacentElement('beforeEnd', this.kboard);
    div.insertAdjacentHTML(
      'beforeEnd',
      '<p class="message">Клавиатура создана в операционной системе Windows.<br> Для переключения языка комбинация: левыe <span>ctrl</span> + <span>alt</span></p>',
    );

    this.textarea.focus();
    this.kboard.addEventListener('click', this.onClickBtn);
    this.kboard.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
    document.body.insertAdjacentElement('afterbegin', div);
  }

  changeLanguage = () => {
    this.lang = this.lang === 'ru' ? 'en' : 'ru';
    localStorage.setItem('lang', this.lang);

    const keyCodes = languages[this.lang];
    // eslint-disable-next-line no-console
    // console.log('keyCodes: ', keyCodes);
    if (!keyCodes) return;

    const letters = this.btns.filter((btn) => btn.variation === 'letter');
    // eslint-disable-next-line no-console
    // console.log('letters: ', letters);
    if (letters) {
      letters.map((item) => {
        const letterBtn = item;
        const currentKey = keyCodes.find((key) => key.keyCode === parseInt(item.id, 10));
        // eslint-disable-next-line no-console
        // console.log(currentKey, item.id);
        letterBtn.innerText = currentKey.key;
        return letterBtn;
      });
    }
  };

  setUppercase = () => {
    const letters = this.btns.filter((item) => item.variation === 'letter');
    // eslint-disable-next-line no-console
    console.log('letters: ', letters, this.btns);
    if (letters) {
      letters.map((item) => item.classList.toggle('keyboard__btn--uppercase'));
    }
  };

  tabClick = () => {
    const caret = this.textarea.selectionStart;
    const val = this.textarea.value;
    this.textarea.value = `${val.slice(0, caret)}\t${val.slice(caret)}`;
    this.textarea.selectionStart = caret + 1;
    this.textarea.selectionEnd = caret + 1;
  };

  toggleActiveClass = (code, active) => {
    const currentBtn = this.btns.find((item) => item.dataset.code === code);

    if (!currentBtn) {
      return false;
    }
    // eslint-disable-next-line no-console
    console.log(active);
    if (active === undefined) {
      return currentBtn.classList.toggle('keyboard__btn--active');
    }
    if (active) {
      return currentBtn.classList.add('keyboard__btn--active');
    }
    return currentBtn.classList.remove('keyboard__btn--active');
  };

  onMouseUp = (event) => {
    // eslint-disable-next-line no-console
    // console.log(event);
    //const activeBtns = this.btns.filter((item) => item.classList.contains('keyboard__btn--active'));
    // eslint-disable-next-line no-console
   // console.log('aCTIVE BTN: ', activeBtns);
    // if (activeBtns.length > 0) {
    //   activeBtns.map((item) => item.classList.remove('keyboard__btn--active'));
    // }
  };

  onClickBtn = (event) => {
    // eslint-disable-next-line no-console
    console.log('click', event);
    const el = event.target;
    const currentBtn = el && this.btns.find((btn) => btn === el);
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
        this.toggleActiveClass(currentBtn.code);
        this.setUppercase();
        break;
      }
      case 'Del': {
        this.textarea.value = val.slice(0, caretStart) + val.slice(caretEnd);
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
    // eslint-disable-next-line no-console
    console.log(event);
    // eslint-disable-next-line no-console
    console.log('currentBtn: ', currentBtn, currentBtn.variation);
    if (['letter', 'digit', 'symbol'].includes(currentBtn.variation)) {
      // eslint-disable-next-line no-console
      console.log('currentBtn value: ', currentBtn.innerText);
      this.textarea.value = val.slice(0, caretStart) + currentBtn.innerText + val.slice(caretStart);
      this.textarea.selectionStart = caretStart + 1;
      this.textarea.selectionEnd = caretStart + 1;
      // return true;
    }
    return false;
  };

  onKeyDown = (event) => {
    const { code } = event;
    // eslint-disable-next-line no-console
    console.log(event.altKey, event.ctrlKey);

    if (event.altKey && event.ctrlKey && event.repeat) {
      return true;
    }
    if (event.altKey && event.ctrlKey) {
      // eslint-disable-next-line no-console
      console.log(event);
      this.changeLanguage();
    }

    if (event.code === 'CapsLock') {
      this.setUppercase();
    }
    if (event.code === 'Tab') {
      event.preventDefault();
      this.tabClick();
    }

    return this.toggleActiveClass(code, true);
  };

  onKeyUp = (event) => {
    const { code } = event;
    if (code) {
      this.toggleActiveClass(code, false);
    }
  };
}

export default Keyboard;
