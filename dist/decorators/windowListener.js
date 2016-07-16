'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (target) {
  target.prototype.bindWindowEvents = function () {
    // ReactTooltip.hide
    window.removeEventListener(_constant2.default.GLOBAL.HIDE, this.hideTooltip);
    window.addEventListener(_constant2.default.GLOBAL.HIDE, this.hideTooltip.bind(this), false);

    // ReactTooltip.rebuild
    window.removeEventListener(_constant2.default.GLOBAL.REBUILD, this.globalRebuild);
    window.addEventListener(_constant2.default.GLOBAL.REBUILD, this.globalRebuild.bind(this), false);

    // Resize
    window.removeEventListener('resize', this.onWindowResize);
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  };

  target.prototype.unbindWindowEvents = function () {
    window.removeEventListener(_constant2.default.GLOBAL.HIDE, this.hideTooltip);
    window.removeEventListener(_constant2.default.GLOBAL.REBUILD, this.globalRebuild);
    window.removeEventListener(_constant2.default.GLOBAL.REBUILD, this.globalShow);
    window.removeEventListener('resize', this.onWindowResize);
  };

  /**
   * invoked by resize event of window
   */
  target.prototype.onWindowResize = function () {
    if (!this.mount) return;
    this.hideTooltip();
  };
};

var _constant = require('../constant');

var _constant2 = _interopRequireDefault(_constant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }