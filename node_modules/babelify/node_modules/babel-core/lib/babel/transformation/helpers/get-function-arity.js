"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var t = _interopRequireWildcard(require("../../types"));

module.exports = function (node) {
  var lastNonDefault = 0;
  for (var i = 0; i < node.params.length; i++) {
    if (!t.isAssignmentPattern(node.params[i])) lastNonDefault = i + 1;
  }
  return lastNonDefault;
};