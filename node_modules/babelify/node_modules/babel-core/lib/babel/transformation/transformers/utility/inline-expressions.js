"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.Expression = Expression;
exports.Identifier = Identifier;
exports.__esModule = true;

var t = _interopRequireWildcard(require("../../../types"));

var metadata = {
  optional: true
};

exports.metadata = metadata;

function Expression(node, parent, scope) {
  var res = this.evaluate();
  if (res.confident) return t.valueToNode(res.value);
}

function Identifier() {}

// override Expression