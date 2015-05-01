"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.TaggedTemplateExpression = TaggedTemplateExpression;
exports.TemplateElement = TemplateElement;
exports.TemplateLiteral = TemplateLiteral;
exports.__esModule = true;

var each = _interopRequire(require("lodash/collection/each"));

function TaggedTemplateExpression(node, print) {
  print(node.tag);
  print(node.quasi);
}

function TemplateElement(node) {
  this._push(node.value.raw);
}

function TemplateLiteral(node, print) {
  var _this = this;

  this.push("`");

  var quasis = node.quasis;
  var len = quasis.length;

  each(quasis, function (quasi, i) {
    print(quasi);

    if (i + 1 < len) {
      _this.push("${ ");
      print(node.expressions[i]);
      _this.push(" }");
    }
  });

  this._push("`");
}