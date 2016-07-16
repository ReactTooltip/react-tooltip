'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (tip, children, multiline) {
  if (children) return children;

  var regexp = /<br\s*\/?>/;
  if (!multiline || multiline === 'false' || !regexp.test(tip)) {
    return tip;
  }

  // Multiline tooltip content
  return tip.split(regexp).map(function (d, i) {
    return _react2.default.createElement(
      'span',
      { key: i, className: 'multi-line' },
      d
    );
  });
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }