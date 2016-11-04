'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (target) {
  target.prototype.isCapture = function (currentTarget) {
    var dataIsCapture = currentTarget.getAttribute('data-iscapture');
    return dataIsCapture && dataIsCapture === 'true' || this.props.isCapture || false;
  };
};