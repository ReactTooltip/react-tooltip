"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

exports.manipulateOptions = manipulateOptions;
exports.ObjectExpression = ObjectExpression;
exports.__esModule = true;
// https://github.com/sebmarkbage/ecmascript-rest-spread

var t = _interopRequireWildcard(require("../../../types"));

var metadata = {
  stage: 1
};

exports.metadata = metadata;

function manipulateOptions(opts) {
  if (opts.whitelist) opts.whitelist.push("es6.destructuring");
}

var hasSpread = function hasSpread(node) {
  for (var i = 0; i < node.properties.length; i++) {
    if (t.isSpreadProperty(node.properties[i])) {
      return true;
    }
  }
  return false;
};

function ObjectExpression(node, parent, scope, file) {
  if (!hasSpread(node)) return;

  var args = [];
  var props = [];

  var push = function push() {
    if (!props.length) return;
    args.push(t.objectExpression(props));
    props = [];
  };

  for (var i = 0; i < node.properties.length; i++) {
    var prop = node.properties[i];
    if (t.isSpreadProperty(prop)) {
      push();
      args.push(prop.argument);
    } else {
      props.push(prop);
    }
  }

  push();

  if (!t.isObjectExpression(args[0])) {
    args.unshift(t.objectExpression([]));
  }

  return t.callExpression(file.addHelper("extends"), args);
}