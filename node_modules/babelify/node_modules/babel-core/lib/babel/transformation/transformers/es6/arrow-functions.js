"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.ArrowFunctionExpression = ArrowFunctionExpression;
exports.__esModule = true;

var t = _interopRequireWildcard(require("../../../types"));

var check = t.isArrowFunctionExpression;

exports.check = check;

function ArrowFunctionExpression(node) {
  t.ensureBlock(node);

  node.expression = false;
  node.type = "FunctionExpression";
  node.shadow = true;

  return node;
}