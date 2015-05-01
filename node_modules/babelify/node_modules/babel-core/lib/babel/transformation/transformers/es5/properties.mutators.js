"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.check = check;
exports.ObjectExpression = ObjectExpression;
exports.__esModule = true;

var defineMap = _interopRequireWildcard(require("../../helpers/define-map"));

var t = _interopRequireWildcard(require("../../../types"));

function check(node) {
  return t.isProperty(node) && (node.kind === "get" || node.kind === "set");
}

function ObjectExpression(node, parent, scope, file) {
  var mutatorMap = {};
  var hasAny = false;

  node.properties = node.properties.filter(function (prop) {
    if (prop.kind === "get" || prop.kind === "set") {
      hasAny = true;
      defineMap.push(mutatorMap, prop, prop.kind, file);
      return false;
    } else {
      return true;
    }
  });

  if (!hasAny) return;

  return t.callExpression(t.memberExpression(t.identifier("Object"), t.identifier("defineProperties")), [node, defineMap.toDefineObject(mutatorMap)]);
}