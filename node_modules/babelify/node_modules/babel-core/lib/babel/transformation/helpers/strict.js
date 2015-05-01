"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.has = has;
exports.wrap = wrap;
exports.__esModule = true;

var t = _interopRequireWildcard(require("../../types"));

function has(node) {
  var first = node.body[0];
  return t.isExpressionStatement(first) && t.isLiteral(first.expression, { value: "use strict" });
}

function wrap(node, callback) {
  var useStrictNode;
  if (has(node)) {
    useStrictNode = node.body.shift();
  }

  callback();

  if (useStrictNode) {
    node.body.unshift(useStrictNode);
  }
}