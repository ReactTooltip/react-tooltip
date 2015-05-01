"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

exports.Identifier = Identifier;
exports.RestElement = RestElement;
exports.ObjectExpression = ObjectExpression;
exports.Property = Property;
exports.ArrayExpression = ArrayExpression;
exports.Literal = Literal;
exports._stringLiteral = _stringLiteral;
exports.__esModule = true;

var each = _interopRequire(require("lodash/collection/each"));

function Identifier(node) {
  this.push(node.name);
}

function RestElement(node, print) {
  this.push("...");
  print(node.argument);
}

exports.SpreadElement = RestElement;
exports.SpreadProperty = RestElement;

function ObjectExpression(node, print) {
  var props = node.properties;

  if (props.length) {
    this.push("{");
    this.space();

    print.list(props, { indent: true });

    this.space();
    this.push("}");
  } else {
    this.push("{}");
  }
}

exports.ObjectPattern = ObjectExpression;

function Property(node, print) {
  if (node.method || node.kind === "get" || node.kind === "set") {
    this._method(node, print);
  } else {
    if (node.computed) {
      this.push("[");
      print(node.key);
      this.push("]");
    } else {
      print(node.key);
      if (node.shorthand) return;
    }

    this.push(":");
    this.space();
    print(node.value);
  }
}

function ArrayExpression(node, print) {
  var _this = this;

  var elems = node.elements;
  var len = elems.length;

  this.push("[");

  each(elems, function (elem, i) {
    if (!elem) {
      // If the array expression ends with a hole, that hole
      // will be ignored by the interpreter, but if it ends with
      // two (or more) holes, we need to write out two (or more)
      // commas so that the resulting code is interpreted with
      // both (all) of the holes.
      _this.push(",");
    } else {
      if (i > 0) _this.push(" ");
      print(elem);
      if (i < len - 1) _this.push(",");
    }
  });

  this.push("]");
}

exports.ArrayPattern = ArrayExpression;

function Literal(node) {
  var val = node.value;
  var type = typeof val;

  if (type === "string") {
    this._stringLiteral(val);
  } else if (type === "number") {
    this.push(val + "");
  } else if (type === "boolean") {
    this.push(val ? "true" : "false");
  } else if (node.regex) {
    this.push("/" + node.regex.pattern + "/" + node.regex.flags);
  } else if (val === null) {
    this.push("null");
  }
}

function _stringLiteral(val) {
  val = JSON.stringify(val);

  // escape illegal js but valid json unicode characters
  val = val.replace(/[\u000A\u000D\u2028\u2029]/g, function (c) {
    return "\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4);
  });

  if (this.format.quotes === "single") {
    val = val.slice(1, -1);
    val = val.replace(/\\"/g, "\"");
    val = val.replace(/'/g, "\\'");
    val = "'" + val + "'";
  }

  this.push(val);
}