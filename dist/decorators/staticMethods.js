'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (target) {
  /**
   * Hide all tooltip
   * @trigger ReactTooltip.hide()
   */
  target.hide = function () {
    dispatchGlobalEvent(_constant2.default.GLOBAL.HIDE);
  };

  /**
   * Rebuild all tooltip
   * @trigger ReactTooltip.rebuild()
   */
  target.rebuild = function () {
    dispatchGlobalEvent(_constant2.default.GLOBAL.REBUILD);
  };

  target.prototype.globalRebuild = function () {
    if (this.mount) {
      this.unbindListener();
      this.bindListener();
    }
  };
};

var _constant = require('../constant');

var _constant2 = _interopRequireDefault(_constant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dispatchGlobalEvent = function dispatchGlobalEvent(eventName) {
  // Compatibale with IE
  // @see http://stackoverflow.com/questions/26596123/internet-explorer-9-10-11-event-constructor-doesnt-work
  var event = void 0;

  if (typeof window.Event === 'function') {
    event = new window.Event(eventName);
  } else {
    event = document.createEvent('Event');
    event.initEvent(eventName, false, true);
  }

  window.dispatchEvent(event);
}; /**
    * Static methods for react-tooltip
    */