/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scss/index.scss":
/*!*****************************!*\
  !*** ./src/scss/index.scss ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scss_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scss/index.scss */ "./src/scss/index.scss");
/* harmony import */ var _keyboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./keyboard */ "./src/js/keyboard.js");



document.addEventListener('DOMContentLoaded', () => {
  const kbord = new _keyboard__WEBPACK_IMPORTED_MODULE_1__["default"]();
  kbord.create();
});


/***/ }),

/***/ "./src/js/keyboard.js":
/*!****************************!*\
  !*** ./src/js/keyboard.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _assets_en_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../assets/en.json */ "./src/assets/en.json");
/* harmony import */ var _assets_ru_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../assets/ru.json */ "./src/assets/ru.json");



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
    ru: _assets_ru_json__WEBPACK_IMPORTED_MODULE_1__,
    en: _assets_en_json__WEBPACK_IMPORTED_MODULE_0__,
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Keyboard);


/***/ }),

/***/ "./src/assets/en.json":
/*!****************************!*\
  !*** ./src/assets/en.json ***!
  \****************************/
/***/ ((module) => {

module.exports = JSON.parse('[{"key":"`","code":"Backquote","keyCode":192,"type":"symbol"},{"key":"1","code":"Digit1","keyCode":49,"type":"digit"},{"key":"2","code":"Digit2","keyCode":50,"type":"digit"},{"key":"3","code":"Digit3","keyCode":51,"type":"digit"},{"key":"4","code":"Digit4","keyCode":52,"type":"digit"},{"key":"5","code":"Digit5","keyCode":53,"type":"digit"},{"key":"6","code":"Digit6","keyCode":54,"type":"digit"},{"key":"7","code":"Digit7","keyCode":55,"type":"digit"},{"key":"8","code":"Digit8","keyCode":56,"type":"digit"},{"key":"9","code":"Digit9","keyCode":57,"type":"digit"},{"key":"0","code":"Digit0","keyCode":48,"type":"digit"},{"key":"←","code":"Backspace","keyCode":8},{"key":"tab ⇆","code":"Tab","keyCode":9},{"key":"q","keyCode":81,"code":"KeyQ","type":"letter"},{"key":"w","keyCode":87,"code":"KeyW","type":"letter"},{"key":"e","keyCode":69,"code":"KeyE","type":"letter"},{"key":"r","keyCode":82,"code":"KeyR","type":"letter"},{"key":"t","keyCode":84,"code":"KeyT","type":"letter"},{"key":"y","keyCode":89,"code":"KeyY","type":"letter"},{"key":"u","keyCode":85,"code":"KeyU","type":"letter"},{"key":"i","keyCode":73,"code":"KeyI","type":"letter"},{"key":"o","keyCode":79,"code":"KeyO","type":"letter"},{"key":"p","keyCode":80,"code":"KeyP","type":"letter"},{"key":"[","code":"BracketLeft","keyCode":160,"type":"letter"},{"key":"]","code":"BracketRight","keyCode":221,"type":"letter"},{"key":"\\\\","code":"Backslash","keyCode":220,"type":"symbol"},{"key":"del","code":"NumpadDecimal","keyCode":46},{"key":"caps lock","code":"CapsLock","keyCode":20},{"key":"a","keyCode":65,"code":"KeyA","type":"letter"},{"key":"s","keyCode":83,"code":"KeyS","type":"letter"},{"key":"d","keyCode":68,"code":"KeyD","type":"letter"},{"key":"f","keyCode":70,"code":"KeyF","type":"letter"},{"key":"g","keyCode":71,"code":"KeyG","type":"letter"},{"key":"h","keyCode":72,"code":"KeyH","type":"letter"},{"key":"j","keyCode":74,"code":"KeyJ","type":"letter"},{"key":"k","keyCode":75,"code":"KeyK","type":"letter"},{"key":"l","keyCode":76,"code":"KeyL","type":"letter"},{"key":";","code":"Semicolon","keyCode":186,"type":"letter"},{"key":"\'","code":"Quote","keyCode":222,"type":"letter"},{"key":"enter ↵","code":"Enter","keyCode":13},{"key":"shift","code":"ShiftLeft","keyCode":16},{"key":"z","keyCode":90,"code":"KeyZ","type":"letter"},{"key":"x","keyCode":88,"code":"KeyX","type":"letter"},{"key":"c","keyCode":67,"code":"KeyC","type":"letter"},{"key":"v","keyCode":86,"code":"KeyV","type":"letter"},{"key":"b","keyCode":66,"code":"KeyB","type":"letter"},{"key":"n","keyCode":78,"code":"KeyN","type":"letter"},{"key":"m","keyCode":77,"code":"KeyM","type":"letter"},{"key":",","code":"NumpadDecimal","keyCode":108,"type":"letter"},{"key":".","code":"Period","keyCode":190,"type":"letter"},{"key":"/","code":"Slash","keyCode":191,"type":"symbol"},{"key":"▲","code":"ArrowUp","keyCode":38,"type":"symbol"},{"key":"shift","code":"ShiftRight","keyCode":16},{"key":"ctrl","code":"ControlLeft","keyCode":17},{"key":"win","code":"MetaLeft","keyCode":91},{"key":"alt","code":"AltLeft","keyCode":18},{"key":" ","code":"Space","keyCode":32,"type":"symbol"},{"key":"alt","code":"AltRight","keyCode":18},{"key":"◄","code":"ArrowLeft","keyCode":37,"type":"symbol"},{"key":"▼","code":"ArrowDown","keyCode":40,"type":"symbol"},{"key":"►","code":"ArrowRight","keyCode":39,"type":"symbol"},{"key":"ctrl","code":"ControlRight","keyCode":17}]');

/***/ }),

/***/ "./src/assets/ru.json":
/*!****************************!*\
  !*** ./src/assets/ru.json ***!
  \****************************/
/***/ ((module) => {

module.exports = JSON.parse('[{"key":"`","code":"Backquote","keyCode":192,"type":"symbol"},{"key":"1","code":"Digit1","keyCode":49,"type":"digit"},{"key":"2","code":"Digit2","keyCode":50,"type":"digit"},{"key":"3","code":"Digit3","keyCode":51,"type":"digit"},{"key":"4","code":"Digit4","keyCode":52,"type":"digit"},{"key":"5","code":"Digit5","keyCode":53,"type":"digit"},{"key":"6","code":"Digit6","keyCode":54,"type":"digit"},{"key":"7","code":"Digit7","keyCode":55,"type":"digit"},{"key":"8","code":"Digit8","keyCode":56,"type":"digit"},{"key":"9","code":"Digit9","keyCode":57,"type":"digit"},{"key":"0","code":"Digit0","keyCode":48,"type":"digit"},{"key":"←","code":"Backspace","keyCode":8},{"key":"tab ⇆","code":"Tab","keyCode":9},{"key":"й","keyCode":81,"code":"KeyQ","type":"letter"},{"key":"ц","keyCode":87,"code":"KeyW","type":"letter"},{"key":"у","keyCode":69,"code":"KeyE","type":"letter"},{"key":"к","keyCode":82,"code":"KeyR","type":"letter"},{"key":"е","keyCode":84,"code":"KeyT","type":"letter"},{"key":"н","keyCode":89,"code":"KeyY","type":"letter"},{"key":"г","keyCode":85,"code":"KeyU","type":"letter"},{"key":"ш","keyCode":73,"code":"KeyI","type":"letter"},{"key":"щ","keyCode":79,"code":"KeyO","type":"letter"},{"key":"з","keyCode":80,"code":"KeyP","type":"letter"},{"key":"х","code":"BracketLeft","keyCode":160,"type":"letter"},{"key":"ъ","code":"BracketRight","keyCode":221,"type":"letter"},{"key":"\\\\","code":"Backslash","keyCode":220,"type":"symbol"},{"key":"del","code":"NumpadDecimal","keyCode":46},{"key":"caps lock","code":"CapsLock","keyCode":20},{"key":"ф","keyCode":65,"code":"KeyA","type":"letter"},{"key":"ы","keyCode":83,"code":"KeyS","type":"letter"},{"key":"в","keyCode":68,"code":"KeyD","type":"letter"},{"key":"а","keyCode":70,"code":"KeyF","type":"letter"},{"key":"п","keyCode":71,"code":"KeyG","type":"letter"},{"key":"р","keyCode":72,"code":"KeyH","type":"letter"},{"key":"о","keyCode":74,"code":"KeyJ","type":"letter"},{"key":"л","keyCode":75,"code":"KeyK","type":"letter"},{"key":"д","keyCode":76,"code":"KeyL","type":"letter"},{"key":"ж","code":"Semicolon","keyCode":186,"type":"letter"},{"key":"э","code":"Quote","keyCode":222,"type":"letter"},{"key":"enter ↵","code":"Enter","keyCode":13},{"key":"shift","code":"ShiftLeft","keyCode":16},{"key":"я","keyCode":90,"code":"KeyZ","type":"letter"},{"key":"ч","keyCode":88,"code":"KeyX","type":"letter"},{"key":"с","keyCode":67,"code":"KeyC","type":"letter"},{"key":"м","keyCode":86,"code":"KeyV","type":"letter"},{"key":"и","keyCode":66,"code":"KeyB","type":"letter"},{"key":"т","keyCode":78,"code":"KeyN","type":"letter"},{"key":"ь","keyCode":77,"code":"KeyM","type":"letter"},{"key":"б","code":"NumpadDecimal","keyCode":108,"type":"letter"},{"key":"ю","code":"Period","keyCode":190,"type":"letter"},{"key":"/","code":"Slash","keyCode":191,"type":"symbol"},{"key":"▲","code":"ArrowUp","keyCode":38,"type":"symbol"},{"key":"shift","code":"ShiftRight","keyCode":16},{"key":"ctrl","code":"ControlLeft","keyCode":17},{"key":"win","code":"MetaLeft","keyCode":91},{"key":"alt","code":"AltLeft","keyCode":18},{"key":" ","code":"Space","keyCode":32,"type":"symbol"},{"key":"alt","code":"AltRight","keyCode":18},{"key":"◄","code":"ArrowLeft","keyCode":37,"type":"symbol"},{"key":"▼","code":"ArrowDown","keyCode":40,"type":"symbol"},{"key":"►","code":"ArrowRight","keyCode":39,"type":"symbol"},{"key":"ctrl","code":"ControlRight","keyCode":17}]');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__("./src/js/index.js");
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/scss/index.scss");
/******/ 	
/******/ })()
;
//# sourceMappingURL=entry.bundle.js.map