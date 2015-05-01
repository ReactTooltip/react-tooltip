"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.transformerList = transformerList;
exports.number = number;
exports.boolean = boolean;
exports.booleanString = booleanString;
exports.list = list;
exports.__esModule = true;

var transform = _interopRequire(require("./../index"));

var util = _interopRequireWildcard(require("../../util"));

function transformerList(key, val) {
  val = util.arrayify(val);

  if (val.indexOf("all") >= 0 || val.indexOf(true) >= 0) {
    val = Object.keys(transform.transformers);
  }

  return transform._ensureTransformerNames(key, val);
}

function number(key, val) {
  return +val;
}

function boolean(key, val) {
  return !!val;
}

function booleanString(key, val) {
  return util.booleanify(val);
}

function list(key, val) {
  return util.list(val);
}