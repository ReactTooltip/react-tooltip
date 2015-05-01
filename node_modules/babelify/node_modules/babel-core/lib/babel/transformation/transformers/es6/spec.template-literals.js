"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.TemplateLiteral = TemplateLiteral;
exports.__esModule = true;

var t = _interopRequireWildcard(require("../../../types"));

var metadata = {
  optional: true
};

exports.metadata = metadata;

function TemplateLiteral(node, parent, scope, file) {
  if (t.isTaggedTemplateExpression(parent)) return;

  for (var i = 0; i < node.expressions.length; i++) {
    node.expressions[i] = t.callExpression(t.identifier("String"), [node.expressions[i]]);
  }
}