/**
 * @module  lib/THREEx/FullScreen
 */
/**
* This helper makes it easy to handle the fullscreen API:
* 
* - it hides the prefix for each browser
* - it hides the little discrepencies of the various vendor API
* - at the time of this writing (nov 2011) it is available in 
* 
*   [firefox nightly](http://blog.pearce.org.nz/2011/11/firefoxs-html-full-screen-api-enabled.html),
*   [webkit nightly](http://peter.sh/2011/01/javascript-full-screen-api-navigation-timing-and-repeating-css-gradients/) and
*   [chrome stable](http://updates.html5rocks.com/2011/10/Let-Your-Content-Do-the-Talking-Fullscreen-API).
* 
* @namespace
*/
var fullScreen = {};
/**
 * test if it is possible to have fullscreen
 * @returns {boolean} true if fullscreen API is available, false otherwise
 */
fullScreen.available = function () {
  return this._hasWebkitFullScreen || this._hasMozFullScreen;
};
/**
 * Test if fullscreen is currently activated
 * @returns {boolean} true if fullscreen is currently activated, false otherwise
 */
fullScreen.activated = function () {
  if (this._hasWebkitFullScreen) {
    return document.webkitIsFullScreen;
  } else if (this._hasMozFullScreen) {
    return document.mozFullScreen;
  } else {
    console.assert(false);
  }
};
/**
 * Request fullscreen on a given element
 * @param {DomElement} element to make fullscreen. optional. default to document.body
 */
fullScreen.request = function (element) {
  element = element || document.body;
  if (this._hasWebkitFullScreen) {
    element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
  } else if (this._hasMozFullScreen) {
    element.mozRequestFullScreen();
  } else {
    console.assert(false);
  }
};
/**
 * Cancel fullscreen
 */
fullScreen.cancel = function () {
  if (this._hasWebkitFullScreen) {
    document.webkitCancelFullScreen();
  } else if (this._hasMozFullScreen) {
    document.mozCancelFullScreen();
  } else {
    console.assert(false);
  }
};
// internal functions to know which fullscreen API implementation is available
fullScreen._hasWebkitFullScreen = 'webkitCancelFullScreen' in document ? true : false;
fullScreen._hasMozFullScreen = 'mozCancelFullScreen' in document ? true : false;
/**
 * Bind a key to renderer screenshot
 * @param {Object} opts
 * @param {Object} [opts.charcode=f]
 * @param {Object} [opts.dblClick=false] True to make it go
 * fullscreen on double click
 */
fullScreen.bindKey = function (opts) {
  opts = opts || {};
  var charCode = opts.charCode || 'f'.charCodeAt(0);
  var dblclick = opts.dblclick !== undefined ? opts.dblclick : false;
  var element = opts.element;
  var toggle = function () {
    if (fullScreen.activated()) {
      fullScreen.cancel();
    } else {
      fullScreen.request(element);
    }
  };
  // callback to handle keypress
  var __bind = function (fn, me) {
    return function () {
      return fn.apply(me, arguments);
    };
  };
  var onKeyPress = __bind(function (event) {
    // return now if the KeyPress isnt for the proper charCode
    if (event.which !== charCode) { return; }
    // toggle fullscreen
    toggle();
  }, this);
  // listen to keypress
  // NOTE: for firefox it seems mandatory to listen to document directly
  document.addEventListener('keypress', onKeyPress, false);
  // listen to dblclick
  dblclick && document.addEventListener('dblclick', toggle, false);
  return {
    unbind: function () {
      document.removeEventListener('keypress', onKeyPress, false);
      dblclick && document.removeEventListener('dblclick', toggle, false);
    }
  };
};
module.exports = fullScreen;