"use strict";

exports.__esModule = true;
var SequenceExpression = {
  exit: function exit(node) {
    if (node.expressions.length === 1) {
      return node.expressions[0];
    } else if (!node.expressions.length) {
      this.remove();
    }
  }
};

exports.SequenceExpression = SequenceExpression;
var ExpressionStatement = {
  exit: function exit(node) {
    if (!node.expression) this.remove();
  }
};

exports.ExpressionStatement = ExpressionStatement;
var Binary = {
  exit: function exit(node) {
    var right = node.right;
    var left = node.left;

    if (!left && !right) {
      this.remove();
    } else if (!left) {
      return right;
    } else if (!right) {
      return left;
    }
  }
};
exports.Binary = Binary;