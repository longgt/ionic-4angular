import { Slides } from '../slides';
import { Platform } from '../../../platform/platform';
import { CLS, isHorizontal, offset } from './swiper-utils';
import { slideNext, slidePrev } from './swiper';


/*=========================
  Keyboard Control
  ===========================*/
function handleKeyboard(s: Slides, plt: Platform, e: KeyboardEvent) {
  let win = plt.win();

  let kc = e.keyCode || e.charCode;
  // Directions locks
  if (!s._allowSwipeToNext && (isHorizontal(s) && kc === 39 || !isHorizontal(s) && kc === 40)) {
    return false;
  }

  if (!s._allowSwipeToPrev && (isHorizontal(s) && kc === 37 || !isHorizontal(s) && kc === 38)) {
    return false;
  }

  if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
    return;
  }

  let activeEle = plt.getActiveElement();
  if (activeEle && activeEle.nodeName && (activeEle.nodeName.toLowerCase() === 'input' || activeEle.nodeName.toLowerCase() === 'textarea')) {
    return;
  }

  if (kc === 37 || kc === 39 || kc === 38 || kc === 40) {
    let inView = false;
    // Check that swiper should be inside of visible area of window
    if (s.container.closest('.' + CLS.slide) && !s.container.closest('.' + CLS.slideActive)) {
      return;
    }
    let windowScroll = {
      left: win.pageXOffset,
      top: win.pageYOffset
    };
    let windowWidth = plt.width();
    let windowHeight = plt.height();
    let swiperOffset = offset(s.container, plt);

    if (s._rtl) {
      swiperOffset.left = swiperOffset.left - s.container.scrollLeft;
    }

    let swiperCoord = [
      [swiperOffset.left, swiperOffset.top],
      [swiperOffset.left + s.renderedWidth, swiperOffset.top],
      [swiperOffset.left, swiperOffset.top + s.renderedHeight],
      [swiperOffset.left + s.renderedWidth, swiperOffset.top + s.renderedHeight]
    ];

    for (let i = 0; i < swiperCoord.length; i++) {
      let point = swiperCoord[i];
      if (
        point[0] >= windowScroll.left && point[0] <= windowScroll.left + windowWidth &&
        point[1] >= windowScroll.top && point[1] <= windowScroll.top + windowHeight
      ) {
        inView = true;
      }

    }
    if (!inView) return;
  }

  if (isHorizontal(s)) {
    if (kc === 37 || kc === 39) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    }

    if ((kc === 39 && !s._rtl) || (kc === 37 && s._rtl)) {
      slideNext(s, plt);
    }

    if ((kc === 37 && !s._rtl) || (kc === 39 && s._rtl)) {
      slidePrev(s, plt);
    }

  } else {
    if (kc === 38 || kc === 40) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
    }

    if (kc === 40) {
      slideNext(s, plt);
    }

    if (kc === 38) {
      slidePrev(s, plt);
    }
  }
}

export function enableKeyboardControl(s: Slides, plt: Platform, shouldEnable: boolean) {
  if (shouldEnable && !s._keyboardUnReg) {
    s._keyboardUnReg = plt.registerListener(plt.doc(), 'keydown', (ev: KeyboardEvent) => {
      handleKeyboard(s, plt, ev);
    }, { zone: false });

  } else if (!shouldEnable && s._keyboardUnReg) {
    s._keyboardUnReg();
  }
}
