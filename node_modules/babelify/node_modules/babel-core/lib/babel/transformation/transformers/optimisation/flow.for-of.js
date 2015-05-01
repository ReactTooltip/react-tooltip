"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.ForOfStatement = ForOfStatement;
exports.__esModule = true;

var _ForOfStatementArray = require("../es6/for-of")._ForOfStatementArray;

var t = _interopRequireWildcard(require("../../../types"));

var check = t.isForOfStatement;
exports.check = check;
var optional = true;

exports.optional = optional;

function ForOfStatement(node, parent, scope, file) {
  if (this.get("right").isTypeGeneric("Array")) {
    return _ForOfStatementArray.call(this, node, scope, file);
  }
}