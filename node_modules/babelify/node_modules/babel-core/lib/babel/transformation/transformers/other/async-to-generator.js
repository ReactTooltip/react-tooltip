"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.__esModule = true;

var remapAsyncToGenerator = _interopRequire(require("../../helpers/remap-async-to-generator"));

exports.manipulateOptions = require("./bluebird-coroutines").manipulateOptions;
var metadata = {
  optional: true
};

exports.metadata = metadata;
exports.Function = function (node, parent, scope, file) {
  if (!node.async || node.generator) return;

  return remapAsyncToGenerator(node, file.addHelper("async-to-generator"), scope);
};