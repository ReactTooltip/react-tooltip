"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.CallExpression = CallExpression;
exports.ModuleDeclaration = ModuleDeclaration;
exports.__esModule = true;

var messages = _interopRequireWildcard(require("../../../messages"));

var t = _interopRequireWildcard(require("../../../types"));

// check if the input Literal `source` is an alternate casing of "react"
function check(source, file) {
  if (t.isLiteral(source)) {
    var name = source.value;
    var lower = name.toLowerCase();

    if (lower === "react" && name !== lower) {
      throw file.errorWithNode(source, messages.get("didYouMean", "react"));
    }
  }
}

function CallExpression(node, parent, scope, file) {
  if (this.get("callee").isIdentifier({ name: "require" }) && node.arguments.length === 1) {
    check(node.arguments[0], file);
  }
}

function ModuleDeclaration(node, parent, scope, file) {
  check(node.source, file);
}