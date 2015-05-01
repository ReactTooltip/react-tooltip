"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.MemberExpression = MemberExpression;
exports.__esModule = true;

var t = _interopRequireWildcard(require("../../../types"));

function MemberExpression(node) {
  var prop = node.property;
  if (node.computed && t.isLiteral(prop) && t.isValidIdentifier(prop.value)) {
    // foo["bar"] => foo.bar
    node.property = t.identifier(prop.value);
    node.computed = false;
  } else if (!node.computed && t.isIdentifier(prop) && !t.isValidIdentifier(prop.name)) {
    // foo.default -> foo["default"]
    node.property = t.literal(prop.name);
    node.computed = true;
  }
}