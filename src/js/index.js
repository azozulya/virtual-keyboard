import '../scss/index.scss';
import Keyboard from './keyboard';

document.addEventListener('DOMContentLoaded', () => {
  const kbord = new Keyboard();
  kbord.create();
});
