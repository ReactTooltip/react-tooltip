"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.BlockStatement = BlockStatement;
exports.SwitchCase = SwitchCase;
exports.__esModule = true;

var t = _interopRequireWildcard(require("../../../types"));

function statementList(key, node, file) {
  for (var i = 0; i < node[key].length; i++) {
    var func = node[key][i];
    if (!t.isFunctionDeclaration(func)) continue;

    var declar = t.variableDeclaration("let", [t.variableDeclarator(func.id, t.toExpression(func))]);

    // hoist it up above everything else
    declar._blockHoist = 2;

    // todo: name this
    func.id = null;

    node[key][i] = declar;

    file.checkNode(declar);
  }
}

function BlockStatement(node, parent, scope, file) {
  if (t.isFunction(parent) && parent.body === node || t.isExportDeclaration(parent)) {
    return;
  }

  statementList("body", node, file);
}

function SwitchCase(node, parent, scope, file) {
  statementList("consequent", node, file);
}