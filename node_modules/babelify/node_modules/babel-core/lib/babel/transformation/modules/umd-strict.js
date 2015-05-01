"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var UMDFormatter = _interopRequire(require("./umd"));

var buildStrict = _interopRequire(require("./_strict"));

module.exports = buildStrict(UMDFormatter);