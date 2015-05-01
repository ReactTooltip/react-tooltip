"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.check = check;
exports.ExportNamedDeclaration = ExportNamedDeclaration;
exports.__esModule = true;
// https://github.com/leebyron/ecmascript-more-export-from

var t = _interopRequireWildcard(require("../../../types"));

var metadata = {
  stage: 1
};

exports.metadata = metadata;

function check(node) {
  return t.isExportDefaultSpecifier(node) || t.isExportNamespaceSpecifier(node);
}

function build(node, nodes, scope) {
  var first = node.specifiers[0];
  if (!t.isExportNamespaceSpecifier(first) && !t.isExportDefaultSpecifier(first)) return;

  var specifier = node.specifiers.shift();
  var uid = scope.generateUidIdentifier(specifier.exported.name);

  var newSpecifier;
  if (t.isExportNamespaceSpecifier(specifier)) {
    newSpecifier = t.importNamespaceSpecifier(uid);
  } else {
    newSpecifier = t.importDefaultSpecifier(uid);
  }

  nodes.push(t.importDeclaration([newSpecifier], node.source));
  nodes.push(t.exportNamedDeclaration(null, [t.exportSpecifier(uid, specifier.exported)]));

  build(node, nodes, scope);
}

function ExportNamedDeclaration(node, parent, scope) {
  var nodes = [];
  build(node, nodes, scope);
  if (!nodes.length) return;

  if (node.specifiers.length >= 1) {
    nodes.push(node);
  }

  return nodes;
}