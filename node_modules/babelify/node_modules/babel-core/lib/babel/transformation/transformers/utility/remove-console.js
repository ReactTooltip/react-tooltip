"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.CallExpression = CallExpression;
exports.__esModule = true;

var t = _interopRequireWildcard(require("../../../types"));

var metadata = {
  optional: true
};

exports.metadata = metadata;

function CallExpression(node, parent) {
  if (this.get("callee").matchesPattern("console", true)) {
    if (t.isExpressionStatement(parent)) {
      this.parentPath.remove();
    } else {
      this.remove();
    }
  }
}