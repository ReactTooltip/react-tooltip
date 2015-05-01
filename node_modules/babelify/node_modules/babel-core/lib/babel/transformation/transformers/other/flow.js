"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.Flow = Flow;
exports.ClassProperty = ClassProperty;
exports.Class = Class;
exports.TypeCastExpression = TypeCastExpression;
exports.ImportDeclaration = ImportDeclaration;
exports.ExportDeclaration = ExportDeclaration;
exports.__esModule = true;

var t = _interopRequireWildcard(require("../../../types"));

function Flow(node) {
  this.remove();
}

function ClassProperty(node) {
  node.typeAnnotation = null;
  if (!node.value) this.remove();
}

function Class(node) {
  node["implements"] = null;
}

exports.Function = function (node) {
  for (var i = 0; i < node.params.length; i++) {
    var param = node.params[i];
    param.optional = false;
  }
};

function TypeCastExpression(node) {
  return node.expression;
}

function ImportDeclaration(node) {
  if (node.isType) this.remove();
}

function ExportDeclaration(node) {
  if (this.get("declaration").isTypeAlias()) this.remove();
}