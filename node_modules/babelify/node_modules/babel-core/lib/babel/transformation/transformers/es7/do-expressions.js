"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.DoExpression = DoExpression;
exports.__esModule = true;

var t = _interopRequireWildcard(require("../../../types"));

var metadata = {
  optional: true,
  stage: 0
};

exports.metadata = metadata;
var check = t.isDoExpression;

exports.check = check;

function DoExpression(node) {
  var body = node.body.body;
  if (body.length) {
    return body;
  } else {
    return t.identifier("undefined");
  }
}