'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (target) {
  target.prototype.isCapture = function (currentTarget) {
    return currentTarget && currentTarget.getAttribute('data-iscapture') === 'true' || this.props.isCapture || false;
  };
};