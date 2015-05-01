"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.UnaryExpression = UnaryExpression;
exports.DoExpression = DoExpression;
exports.UpdateExpression = UpdateExpression;
exports.ConditionalExpression = ConditionalExpression;
exports.NewExpression = NewExpression;
exports.SequenceExpression = SequenceExpression;
exports.ThisExpression = ThisExpression;
exports.Super = Super;
exports.Decorator = Decorator;
exports.CallExpression = CallExpression;
exports.EmptyStatement = EmptyStatement;
exports.ExpressionStatement = ExpressionStatement;
exports.AssignmentExpression = AssignmentExpression;
exports.MemberExpression = MemberExpression;
exports.MetaProperty = MetaProperty;
exports.__esModule = true;

var isInteger = _interopRequire(require("is-integer"));

var isNumber = _interopRequire(require("lodash/lang/isNumber"));

var t = _interopRequireWildcard(require("../../types"));

function UnaryExpression(node, print) {
  var hasSpace = /[a-z]$/.test(node.operator);
  var arg = node.argument;

  if (t.isUpdateExpression(arg) || t.isUnaryExpression(arg)) {
    hasSpace = true;
  }

  if (t.isUnaryExpression(arg) && arg.operator === "!") {
    hasSpace = false;
  }

  this.push(node.operator);
  if (hasSpace) this.push(" ");
  print(node.argument);
}

function DoExpression(node, print) {
  this.push("do");
  this.space();
  print(node.body);
}

function UpdateExpression(node, print) {
  if (node.prefix) {
    this.push(node.operator);
    print(node.argument);
  } else {
    print(node.argument);
    this.push(node.operator);
  }
}

function ConditionalExpression(node, print) {
  print(node.test);
  this.space();
  this.push("?");
  this.space();
  print(node.consequent);
  this.space();
  this.push(":");
  this.space();
  print(node.alternate);
}

function NewExpression(node, print) {
  this.push("new ");
  print(node.callee);
  this.push("(");
  print.list(node.arguments);
  this.push(")");
}

function SequenceExpression(node, print) {
  print.list(node.expressions);
}

function ThisExpression() {
  this.push("this");
}

function Super() {
  this.push("super");
}

function Decorator(node, print) {
  this.push("@");
  print(node.expression);
}

function CallExpression(node, print) {
  print(node.callee);

  this.push("(");

  var separator = ",";

  if (node._prettyCall) {
    separator += "\n";
    this.newline();
    this.indent();
  } else {
    separator += " ";
  }

  print.list(node.arguments, { separator: separator });

  if (node._prettyCall) {
    this.newline();
    this.dedent();
  }

  this.push(")");
}

var buildYieldAwait = function buildYieldAwait(keyword) {
  return function (node, print) {
    this.push(keyword);

    if (node.delegate || node.all) {
      this.push("*");
    }

    if (node.argument) {
      this.space();
      print(node.argument);
    }
  };
};

var YieldExpression = buildYieldAwait("yield");
exports.YieldExpression = YieldExpression;
var AwaitExpression = buildYieldAwait("await");

exports.AwaitExpression = AwaitExpression;

function EmptyStatement() {
  this.semicolon();
}

function ExpressionStatement(node, print) {
  print(node.expression);
  this.semicolon();
}

function AssignmentExpression(node, print) {
  // todo: add cases where the spaces can be dropped when in compact mode
  print(node.left);
  this.push(" ");
  this.push(node.operator);
  this.push(" ");
  print(node.right);
}

exports.BinaryExpression = AssignmentExpression;
exports.LogicalExpression = AssignmentExpression;
exports.AssignmentPattern = AssignmentExpression;

var SCIENTIFIC_NOTATION = /e/i;

function MemberExpression(node, print) {
  var obj = node.object;
  print(obj);

  if (!node.computed && t.isMemberExpression(node.property)) {
    throw new TypeError("Got a MemberExpression for MemberExpression property");
  }

  var computed = node.computed;
  if (t.isLiteral(node.property) && isNumber(node.property.value)) {
    computed = true;
  }

  if (computed) {
    this.push("[");
    print(node.property);
    this.push("]");
  } else {
    // 5..toFixed(2);
    if (t.isLiteral(obj) && isInteger(obj.value) && !SCIENTIFIC_NOTATION.test(obj.value.toString())) {
      this.push(".");
    }

    this.push(".");
    print(node.property);
  }
}

function MetaProperty(node, print) {
  print(node.meta);
  this.push(".");
  print(node.property);
}