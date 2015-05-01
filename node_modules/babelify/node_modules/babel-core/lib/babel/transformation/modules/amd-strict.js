"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var AMDFormatter = _interopRequire(require("./amd"));

var buildStrict = _interopRequire(require("./_strict"));

module.exports = buildStrict(AMDFormatter);