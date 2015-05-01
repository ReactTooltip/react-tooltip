"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.MemberExpression = MemberExpression;
exports.__esModule = true;

var t = _interopRequireWildcard(require("../../../types"));

var metadata = {
  optional: true
};

exports.metadata = metadata;
var match = t.buildMatchMemberExpression("process.env");

function MemberExpression(node) {
  if (match(node.object)) {
    var key = this.toComputedKey();
    if (t.isLiteral(key)) {
      return t.valueToNode(process.env[key.value]);
    }
  }
}