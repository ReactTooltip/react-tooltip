"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.manipulateOptions = manipulateOptions;
exports.__esModule = true;

var react = _interopRequireWildcard(require("../../helpers/react"));

var t = _interopRequireWildcard(require("../../../types"));

function manipulateOptions(opts) {
  opts.blacklist.push("react");
}

var metadata = {
  optional: true
};

exports.metadata = metadata;
require("../../helpers/build-react-transformer")(exports, {
  pre: function pre(state) {
    state.callee = state.tagExpr;
  },

  post: function post(state) {
    if (react.isCompatTag(state.tagName)) {
      state.call = t.callExpression(t.memberExpression(t.memberExpression(t.identifier("React"), t.identifier("DOM")), state.tagExpr, t.isLiteral(state.tagExpr)), state.args);
    }
  }
});