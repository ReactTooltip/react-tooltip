"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.__esModule = true;
// https://github.com/rwaldron/exponentiation-operator

var build = _interopRequire(require("../../helpers/build-binary-assignment-operator-transformer"));

var t = _interopRequireWildcard(require("../../../types"));

var metadata = {
  stage: 2
};

exports.metadata = metadata;
var MATH_POW = t.memberExpression(t.identifier("Math"), t.identifier("pow"));

build(exports, {
  operator: "**",

  build: function build(left, right) {
    return t.callExpression(MATH_POW, [left, right]);
  }
});