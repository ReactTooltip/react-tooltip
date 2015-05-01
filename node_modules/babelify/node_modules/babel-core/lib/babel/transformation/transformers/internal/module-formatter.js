"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.Program = Program;
exports.__esModule = true;

var strict = _interopRequireWildcard(require("../../helpers/strict"));

function Program(program, parent, scope, file) {
  strict.wrap(program, function () {
    program.body = file.dynamicImports.concat(program.body);
  });

  if (!file.transformers["es6.modules"].canTransform()) return;

  if (file.moduleFormatter.transform) {
    file.moduleFormatter.transform(program);
  }
}