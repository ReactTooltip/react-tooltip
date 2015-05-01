"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.check = check;
exports.Literal = Literal;
exports.__esModule = true;

var rewritePattern = _interopRequire(require("regexpu/rewrite-pattern"));

var regex = _interopRequireWildcard(require("../../helpers/regex"));

function check(node) {
  return regex.is(node, "u");
}

function Literal(node) {
  if (!regex.is(node, "u")) return;
  node.regex.pattern = rewritePattern(node.regex.pattern, node.regex.flags);
  regex.pullFlag(node, "u");
}