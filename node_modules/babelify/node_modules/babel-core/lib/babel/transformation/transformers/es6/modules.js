"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.ImportDeclaration = ImportDeclaration;
exports.ExportAllDeclaration = ExportAllDeclaration;
exports.ExportDefaultDeclaration = ExportDefaultDeclaration;
exports.ExportNamedDeclaration = ExportNamedDeclaration;
exports.__esModule = true;

var t = _interopRequireWildcard(require("../../../types"));

exports.check = require("../internal/modules").check;

function keepBlockHoist(node, nodes) {
  if (node._blockHoist) {
    for (var i = 0; i < nodes.length; i++) {
      nodes[i]._blockHoist = node._blockHoist;
    }
  }
}

function ImportDeclaration(node, parent, scope, file) {
  // flow type
  if (node.isType) return;

  var nodes = [];

  if (node.specifiers.length) {
    for (var i = 0; i < node.specifiers.length; i++) {
      file.moduleFormatter.importSpecifier(node.specifiers[i], node, nodes, parent);
    }
  } else {
    file.moduleFormatter.importDeclaration(node, nodes, parent);
  }

  if (nodes.length === 1) {
    // inherit `_blockHoist` - this is for `_blockHoist` in File.prototype.addImport
    nodes[0]._blockHoist = node._blockHoist;
  }

  return nodes;
}

function ExportAllDeclaration(node, parent, scope, file) {
  var nodes = [];
  file.moduleFormatter.exportAllDeclaration(node, nodes, parent);
  keepBlockHoist(node, nodes);
  return nodes;
}

function ExportDefaultDeclaration(node, parent, scope, file) {
  var nodes = [];
  file.moduleFormatter.exportDeclaration(node, nodes, parent);
  keepBlockHoist(node, nodes);
  return nodes;
}

function ExportNamedDeclaration(node, parent, scope, file) {
  // flow type
  if (this.get("declaration").isTypeAlias()) return;

  var nodes = [];

  if (node.declaration) {
    // make sure variable exports have an initializer
    // this is done here to avoid duplicating it in the module formatters
    if (t.isVariableDeclaration(node.declaration)) {
      var declar = node.declaration.declarations[0];
      declar.init = declar.init || t.identifier("undefined");
    }

    file.moduleFormatter.exportDeclaration(node, nodes, parent);
  } else if (node.specifiers) {
    for (var i = 0; i < node.specifiers.length; i++) {
      file.moduleFormatter.exportSpecifier(node.specifiers[i], node, nodes, parent);
    }
  }

  keepBlockHoist(node, nodes);

  return nodes;
}