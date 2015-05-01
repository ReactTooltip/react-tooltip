"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.Program = Program;
exports.__esModule = true;

var t = _interopRequireWildcard(require("../../../types"));

function Program(program, parent, scope, file) {
  if (file.transformers.strict.canTransform()) {
    var directive = file.get("existingStrictDirective");

    if (!directive) {
      directive = t.expressionStatement(t.literal("use strict"));
      var first = program.body[0];
      if (first) {
        directive.leadingComments = first.leadingComments;
        first.leadingComments = [];
      }
    }

    program.body.unshift(directive);
  }
}