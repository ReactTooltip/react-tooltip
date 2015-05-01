"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.JSXAttribute = JSXAttribute;
exports.JSXIdentifier = JSXIdentifier;
exports.JSXNamespacedName = JSXNamespacedName;
exports.JSXMemberExpression = JSXMemberExpression;
exports.JSXSpreadAttribute = JSXSpreadAttribute;
exports.JSXExpressionContainer = JSXExpressionContainer;
exports.JSXElement = JSXElement;
exports.JSXOpeningElement = JSXOpeningElement;
exports.JSXClosingElement = JSXClosingElement;
exports.JSXEmptyExpression = JSXEmptyExpression;
exports.__esModule = true;

var each = _interopRequire(require("lodash/collection/each"));

var t = _interopRequireWildcard(require("../../types"));

function JSXAttribute(node, print) {
  print(node.name);
  if (node.value) {
    this.push("=");
    print(node.value);
  }
}

function JSXIdentifier(node) {
  this.push(node.name);
}

function JSXNamespacedName(node, print) {
  print(node.namespace);
  this.push(":");
  print(node.name);
}

function JSXMemberExpression(node, print) {
  print(node.object);
  this.push(".");
  print(node.property);
}

function JSXSpreadAttribute(node, print) {
  this.push("{...");
  print(node.argument);
  this.push("}");
}

function JSXExpressionContainer(node, print) {
  this.push("{");
  print(node.expression);
  this.push("}");
}

function JSXElement(node, print) {
  var _this = this;

  var open = node.openingElement;
  print(open);
  if (open.selfClosing) return;

  this.indent();
  each(node.children, function (child) {
    if (t.isLiteral(child)) {
      _this.push(child.value);
    } else {
      print(child);
    }
  });
  this.dedent();

  print(node.closingElement);
}

function JSXOpeningElement(node, print) {
  this.push("<");
  print(node.name);
  if (node.attributes.length > 0) {
    this.push(" ");
    print.join(node.attributes, { separator: " " });
  }
  this.push(node.selfClosing ? " />" : ">");
}

function JSXClosingElement(node, print) {
  this.push("</");
  print(node.name);
  this.push(">");
}

function JSXEmptyExpression() {}