"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.is = is;
exports.pullFlag = pullFlag;
exports.__esModule = true;

var pull = _interopRequire(require("lodash/array/pull"));

var t = _interopRequireWildcard(require("../../types"));

function is(node, flag) {
  return t.isLiteral(node) && node.regex && node.regex.flags.indexOf(flag) >= 0;
}

function pullFlag(node, flag) {
  var flags = node.regex.flags.split("");
  if (node.regex.flags.indexOf(flag) < 0) return;
  pull(flags, flag);
  node.regex.flags = flags.join("");
}